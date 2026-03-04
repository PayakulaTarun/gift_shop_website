/**
 * routes/auth.ts — Authentication endpoints.
 *
 * POST /api/auth/register  — create account
 * POST /api/auth/login     — get access + refresh tokens
 * POST /api/auth/refresh   — rotate refresh token, issue new access token
 * POST /api/auth/logout    — revoke refresh token
 * GET  /api/auth/me        — get current user (requires auth)
 *
 * Token strategy:
 * - Access token: JWT Bearer, 15-minute TTL, in Authorization header
 * - Refresh token: opaque 256-bit hex, 7-day TTL, HttpOnly SameSite=Strict cookie
 */
import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, refreshTokens } from "../db/schema.js";
import { hashPassword, comparePassword } from "../lib/password.js";
import {
    signAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    refreshTokenExpiry,
    verifyAccessToken,
} from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import { env } from "../lib/env.js";

const router = new Hono();

// ---------------------------------------------------------------------------
// Shared Zod schemas
// ---------------------------------------------------------------------------
const RegisterBody = z.object({
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[0-9]/, "Must include a number"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number").optional(),
});

const LoginBody = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const COOKIE_NAME = "gs_refresh_token";
const COOKIE_MAX_AGE = env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60;

function setRefreshCookie(c: Parameters<typeof setCookie>[0], token: string) {
    setCookie(c, COOKIE_NAME, token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: COOKIE_MAX_AGE,
        path: "/api/auth",
    });
}

/** Shapes the user object we send back in responses (no password hash). */
function publicUser(u: typeof users.$inferSelect) {
    return {
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
    };
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
router.post("/register", zValidator("json", RegisterBody), async (c) => {
    const { email, password, name, phone } = c.req.valid("json");

    // Check uniqueness
    const existing = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
    });
    if (existing) {
        return c.json({ message: "Email already registered", code: "EMAIL_TAKEN" }, 409);
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
        .insert(users)
        .values({
            email: email.toLowerCase(),
            passwordHash,
            name: name ?? null,
            phone: phone ?? null,
        })
        .returning();

    // Issue tokens
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const rawRefresh = generateRefreshToken();
    const tokenHash = hashRefreshToken(rawRefresh);

    await db.insert(refreshTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt: refreshTokenExpiry(),
    });

    setRefreshCookie(c, rawRefresh);

    return c.json({ user: publicUser(user), accessToken }, 201);
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
router.post("/login", zValidator("json", LoginBody), async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
    });

    // Constant-time failure (always compare even if user not found, using dummy hash)
    const DUMMY_HASH = "$2a$12$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    const passwordHash = user?.passwordHash ?? DUMMY_HASH;
    const valid = await comparePassword(password, passwordHash);

    if (!user || !valid) {
        return c.json({ message: "Invalid email or password", code: "INVALID_CREDENTIALS" }, 401);
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const rawRefresh = generateRefreshToken();
    const tokenHash = hashRefreshToken(rawRefresh);

    await db.insert(refreshTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt: refreshTokenExpiry(),
    });

    setRefreshCookie(c, rawRefresh);

    return c.json({ user: publicUser(user), accessToken });
});

// ---------------------------------------------------------------------------
// POST /api/auth/refresh
// ---------------------------------------------------------------------------
router.post("/refresh", async (c) => {
    const rawRefresh = getCookie(c, COOKIE_NAME);
    if (!rawRefresh) {
        return c.json({ message: "Refresh token missing", code: "UNAUTHORIZED" }, 401);
    }

    const tokenHash = hashRefreshToken(rawRefresh);
    const stored = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.tokenHash, tokenHash),
        with: { user: true },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        deleteCookie(c, COOKIE_NAME, { path: "/api/auth" });
        return c.json({ message: "Invalid or expired refresh token", code: "UNAUTHORIZED" }, 401);
    }

    // Rotate: revoke old, issue new
    await db
        .update(refreshTokens)
        .set({ revoked: true })
        .where(eq(refreshTokens.id, stored.id));

    const newRawRefresh = generateRefreshToken();
    const newTokenHash = hashRefreshToken(newRawRefresh);

    await db.insert(refreshTokens).values({
        userId: stored.userId,
        tokenHash: newTokenHash,
        expiresAt: refreshTokenExpiry(),
    });

    const accessToken = signAccessToken({ sub: stored.user.id, role: stored.user.role });
    setRefreshCookie(c, newRawRefresh);

    return c.json({ accessToken });
});

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------
router.post("/logout", async (c) => {
    const rawRefresh = getCookie(c, COOKIE_NAME);
    if (rawRefresh) {
        const tokenHash = hashRefreshToken(rawRefresh);
        // Revoke silently (don't fail if token not found)
        await db
            .update(refreshTokens)
            .set({ revoked: true })
            .where(eq(refreshTokens.tokenHash, tokenHash));
    }

    deleteCookie(c, COOKIE_NAME, { path: "/api/auth" });
    return c.body(null, 204);
});

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------
router.get("/me", requireAuth, async (c) => {
    const { sub } = c.get("user");

    const user = await db.query.users.findFirst({
        where: eq(users.id, sub),
    });

    if (!user) {
        return c.json({ message: "User not found", code: "NOT_FOUND" }, 404);
    }

    // Also return a fresh access token to avoid round trips
    const accessToken = signAccessToken({ sub: user.id, role: user.role });

    return c.json({ user: publicUser(user), accessToken });
});

// ---------------------------------------------------------------------------
// GET /api/auth/verify — lightweight token check (no DB hit)
// ---------------------------------------------------------------------------
router.get("/verify", (c) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ valid: false }, 401);
    }
    try {
        const payload = verifyAccessToken(authHeader.slice(7));
        return c.json({ valid: true, sub: payload.sub, role: payload.role });
    } catch {
        return c.json({ valid: false }, 401);
    }
});

export default router;
