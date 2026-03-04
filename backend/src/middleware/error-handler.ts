/**
 * middleware/error-handler.ts
 *
 * Global error handler for the Hono app.
 * - ZodError → 422 with field-level detail
 * - Known HTTP errors → pass-through
 * - Unknown errors → 500, no stack trace in production
 */
import type { Context } from "hono";
import { ZodError } from "zod";
import { env } from "../lib/env.js";

export function handleError(err: Error, c: Context) {
    // Zod validation errors (from zValidator middleware)
    if (err instanceof ZodError) {
        const fieldErrors = err.flatten().fieldErrors;
        return c.json(
            {
                message: "Validation failed",
                code: "VALIDATION_ERROR",
                errors: fieldErrors,
            },
            422
        );
    }

    // Log all unexpected errors
    console.error(
        JSON.stringify({
            level: "error",
            msg: err.message,
            stack: env.NODE_ENV !== "production" ? err.stack : undefined,
            path: c.req.path,
            method: c.req.method,
        })
    );

    return c.json(
        {
            message:
                env.NODE_ENV === "production"
                    ? "An unexpected error occurred"
                    : err.message,
            code: "INTERNAL_SERVER_ERROR",
        },
        500
    );
}

export function handleNotFound(c: Context) {
    return c.json(
        {
            message: `Route ${c.req.method} ${c.req.path} not found`,
            code: "NOT_FOUND",
        },
        404
    );
}
