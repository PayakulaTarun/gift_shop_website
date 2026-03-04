/**
 * jwt.ts — JWT access token utilities.
 *
 * Access token: HS256, 15-minute TTL, payload = { sub, role, iat, exp }
 * Refresh token: random 256-bit hex string (opaque), stored hashed in DB
 */
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "./env.js";

export type JwtPayload = {
    sub: string;        // user UUID
    role: "customer" | "admin";
    iat?: number;
    exp?: number;
};

/** Sign a new access token. */
export function signAccessToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

/** Verify and decode an access token. Throws if invalid or expired. */
export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

/** Generate a cryptographically secure random refresh token (opaque). */
export function generateRefreshToken(): string {
    return crypto.randomBytes(32).toString("hex");  // 64-char hex
}

/** Hash a refresh token for DB storage (SHA-256, not bcrypt — fast lookup). */
export function hashRefreshToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

/** Calculate expiry date for a refresh token. */
export function refreshTokenExpiry(): Date {
    const d = new Date();
    d.setDate(d.getDate() + env.REFRESH_TOKEN_EXPIRES_DAYS);
    return d;
}
