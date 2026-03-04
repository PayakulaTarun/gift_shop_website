/**
 * admin.ts — Administrative API routes (Phase 5).
 *
 * Restricted to users with 'admin' role.
 */
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { orders, orderItems, products, users } from "../db/schema.js";
import { eq, desc, sql, count } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth.js";

const router = new Hono();

// All routes here require admin privileges
router.use("*", requireAdmin);

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
const UpdateOrderStatusSchema = z.object({
    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

const ProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().int(),
    displayPrice: z.string(),
    categoryId: z.string(),
    badge: z.string().optional().nullable(),
    inStock: z.boolean().default(true),
    stockQty: z.number().int().default(999),
    customizationPrompt: z.string().default(""),
    features: z.array(z.string()).default([]),
    images: z.array(z.object({
        url: z.string().url(),
        alt: z.string(),
        isPrimary: z.boolean().optional()
    })).default([]),
});

// ---------------------------------------------------------------------------
// Analytics & Stats
// ---------------------------------------------------------------------------

/**
 * GET /api/admin/stats
 * High-level overview of the platform performance.
 */
router.get("/stats", async (c) => {
    // 1. Total Revenue (sum of totalAmount)
    const [revenueResult] = await db
        .select({ total: sql<number>`sum(${orders.totalAmount})` })
        .from(orders);

    // 2. Total Orders
    const [ordersResult] = await db.select({ count: count() }).from(orders);

    // 3. Total Users
    const [usersResult] = await db.select({ count: count() }).from(users);

    // 4. Orders by Status
    const statusCounts = await db
        .select({
            status: orders.status,
            count: count(),
        })
        .from(orders)
        .groupBy(orders.status);

    return c.json({
        totalRevenue: Number(revenueResult?.total || 0),
        totalOrders: Number(ordersResult?.count || 0),
        totalUsers: Number(usersResult?.count || 0),
        statusBreakdown: statusCounts,
    });
});

// ---------------------------------------------------------------------------
// Order Management
// ---------------------------------------------------------------------------

/**
 * GET /api/admin/orders
 * List all orders from all users, most recent first.
 */
router.get("/orders", async (c) => {
    const allOrders = await db.query.orders.findMany({
        orderBy: [desc(orders.createdAt)],
        with: {
            items: true,
            user: {
                columns: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });

    return c.json(allOrders);
});

/**
 * PATCH /api/admin/orders/:id
 * Update any order's status.
 */
router.patch("/orders/:id", zValidator("json", UpdateOrderStatusSchema), async (c) => {
    const id = c.req.param("id");
    const { status } = c.req.valid("json");

    const [updated] = await db
        .update(orders)
        .set({ status, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();

    if (!updated) {
        return c.json({ error: "Order not found" }, 404);
    }

    return c.json(updated);
});

// ---------------------------------------------------------------------------
// Product Management (Admin CRUD)
// ---------------------------------------------------------------------------

/**
 * POST /api/admin/products
 */
router.post("/products", zValidator("json", ProductSchema), async (c) => {
    const payload = c.req.valid("json");

    // Generate an ID from name if not present or handle it
    const id = payload.name.toLowerCase().replace(/\s+/g, '-');

    try {
        const [newProduct] = await db.insert(products).values({
            id: `${id}-${Date.now().toString().slice(-4)}`,
            ...payload
        }).returning();

        return c.json(newProduct, 201);
    } catch (err) {
        console.error("Create product failed:", err);
        return c.json({ error: "Failed to create product" }, 500);
    }
});

/**
 * PATCH /api/admin/products/:id
 */
router.patch("/products/:id", zValidator("json", ProductSchema.partial()), async (c) => {
    const id = c.req.param("id");
    const payload = c.req.valid("json");

    try {
        const [updated] = await db
            .update(products)
            .set({ ...payload, updatedAt: new Date() })
            .where(eq(products.id, id))
            .returning();

        if (!updated) return c.json({ error: "Product not found" }, 404);
        return c.json(updated);
    } catch (err) {
        return c.json({ error: "Update failed" }, 500);
    }
});

/**
 * DELETE /api/admin/products/:id
 */
router.delete("/products/:id", async (c) => {
    const id = c.req.param("id");

    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();

    if (!deleted) return c.json({ error: "Product not found" }, 404);
    return c.body(null, 204);
});

export default router;
