/**
 * index.ts — Hono application entry point.
 *
 * Middleware stack (in order):
 *   requestId → logger → CORS → secureHeaders → routes → 404 → errorHandler
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { env } from "./lib/env.js";
import { handleError, handleNotFound } from "./middleware/error-handler.js";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";
import paymentsRouter from "./routes/payments.js";

const app = new Hono();

// ── Global middleware ────────────────────────────────────────────────────────

// Structured request logging (outputs to stdout, compatible with log shippers)
app.use("*", logger());

// Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
app.use("*", secureHeaders());

// CORS — allowed origins come from env (comma-separated list)
app.use(
    "*",
    cors({
        origin: env.CORS_ORIGINS,
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        exposeHeaders: ["X-Request-Id"],
        credentials: true,
        maxAge: 86_400,
    })
);

// ── Routes ───────────────────────────────────────────────────────────────────
app.route("/api/health", healthRouter);
app.route("/api/auth", authRouter);
app.route("/api/cart", cartRouter);
app.route("/api/orders", ordersRouter);
app.route("/api/admin", adminRouter);
app.route("/api/payments", paymentsRouter);
app.route("/api/products", productsRouter);
app.route("/api/categories", categoriesRouter);

// ── Catch-alls ───────────────────────────────────────────────────────────────
app.notFound(handleNotFound);
app.onError(handleError);

// ── Server start ─────────────────────────────────────────────────────────────
const isServerless = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

if (!isServerless) {
    serve(
        {
            fetch: app.fetch,
            port: env.PORT,
        },
        (info) => {
            console.log(
                JSON.stringify({
                    level: "info",
                    msg: `🎁  GiftStudio API running`,
                    port: info.port,
                    env: env.NODE_ENV,
                    cors: env.CORS_ORIGINS,
                })
            );
        }
    );
}

export default app;
