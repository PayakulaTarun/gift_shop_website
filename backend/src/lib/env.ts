/**
 * env.ts — Validated environment variables with Zod.
 *
 * Throws at startup if any required var is missing.
 * This surfaces misconfigurations at boot, not deep in request handlers.
 */
import { z } from "zod";

const EnvSchema = z.object({
    // Database
    DATABASE_URL: z
        .string()
        .url()
        .default("postgresql://giftstudio:giftstudio@localhost:5433/giftstudio"),

    // Server
    PORT: z.coerce.number().int().positive().default(3001),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // CORS — comma-separated list of allowed origins
    CORS_ORIGINS: z
        .string()
        .default("http://localhost:8080,http://localhost:5173")
        .transform((s) => s.split(",").map((o) => o.trim())),

    // JWT — must be ≥ 32 chars in production
    JWT_SECRET: z
        .string()
        .min(32)
        .default("dev-secret-change-me-in-production-min-32-chars!!"),
    JWT_EXPIRES_IN: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(7),

    // Security
    BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
});

// Parse and freeze — will throw ZodError if invalid
const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌  Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
