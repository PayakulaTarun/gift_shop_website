/**
 * middleware/auth.ts — JWT authentication middleware for Hono.
 *
 * requireAuth: validates Bearer token, attaches user payload to context.
 * requireAdmin: same as requireAuth + role === 'admin' check.
 *
 * Usage:
 *   router.get('/protected', requireAuth, (c) => { const user = c.get('user'); ... })
 *   router.get('/admin-only', requireAdmin, (c) => { ... })
 */
import type { MiddlewareHandler } from "hono";
import { verifyAccessToken, type JwtPayload } from "../lib/jwt.js";

// Extend Hono's context variable map
declare module "hono" {
    interface ContextVariableMap {
        user: JwtPayload;
    }
}

/** Validates JWT in Authorization: Bearer <token>. Returns 401 on failure. */
export const requireAuth: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ message: "Authentication required", code: "UNAUTHORIZED" }, 401);
    }

    const token = authHeader.slice(7);
    try {
        const payload = verifyAccessToken(token);
        c.set("user", payload);
        await next();
    } catch {
        return c.json({ message: "Invalid or expired token", code: "UNAUTHORIZED" }, 401);
    }
};

/** Validates JWT AND requires role === 'admin'. Returns 403 for insufficient role. */
export const requireAdmin: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ message: "Authentication required", code: "UNAUTHORIZED" }, 401);
    }

    const token = authHeader.slice(7);
    try {
        const payload = verifyAccessToken(token);
        if (payload.role !== "admin") {
            return c.json({ message: "Admin access required", code: "FORBIDDEN" }, 403);
        }
        c.set("user", payload);
        await next();
    } catch {
        return c.json({ message: "Invalid or expired token", code: "UNAUTHORIZED" }, 401);
    }
};
