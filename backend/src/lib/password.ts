/**
 * password.ts — bcrypt password hashing utilities.
 *
 * Uses bcryptjs (pure JS — no native addon required, works everywhere).
 * BCRYPT_ROUNDS from env (default 12): higher = slower = more secure.
 */
import bcrypt from "bcryptjs";
import { env } from "./env.js";

/** Hash a plain-text password. Async to avoid blocking the event loop. */
export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, env.BCRYPT_ROUNDS);
}

/** Compare a plain-text password against a stored hash. */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}
