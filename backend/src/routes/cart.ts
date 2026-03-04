/**
 * routes/cart.ts — Server-backed cart for authenticated users.
 *
 * All routes require a valid JWT (requireAuth middleware).
 * Guest carts live in localStorage and are merged via POST /api/cart/merge.
 *
 * GET    /api/cart              → fetch user's cart (items + product snapshots)
 * POST   /api/cart/items        → add item (or increment if same productId+customization)
 * PATCH  /api/cart/items/:id    → update quantity
 * DELETE /api/cart/items/:id    → remove item
 * DELETE /api/cart              → clear entire cart
 * POST   /api/cart/merge        → merge guest cart on login
 */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { cartItems, products } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const router = new Hono();

// All cart routes require authentication
router.use("*", requireAuth);

// ---------------------------------------------------------------------------
// Helper — build the API cart response for a user
// ---------------------------------------------------------------------------
async function getUserCart(userId: string) {
    const rows = await db.query.cartItems.findMany({
        where: eq(cartItems.userId, userId),
        with: { product: true },
        orderBy: (ci, { asc }) => [asc(ci.createdAt)],
    });

    const items = rows.map((row) => {
        const imageList = row.product.images as Array<{ url: string; alt: string; isPrimary?: boolean }>;
        const primaryImage =
            imageList.find((img) => img.isPrimary)?.url ?? imageList[0]?.url ?? "";

        return {
            id: row.id,
            productId: row.productId,
            name: row.product.name,
            price: row.product.price,
            displayPrice: row.product.displayPrice,
            image: primaryImage,
            quantity: row.quantity,
            customization: row.customization ?? "",
        };
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, total };
}

// ---------------------------------------------------------------------------
// GET /api/cart
// ---------------------------------------------------------------------------
router.get("/", async (c) => {
    const { sub: userId } = c.get("user");
    return c.json(await getUserCart(userId));
});

// ---------------------------------------------------------------------------
// POST /api/cart/items — add item (idempotent via upsert-like logic)
// ---------------------------------------------------------------------------
const AddItemBody = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive().default(1),
    customization: z.string().default(""),
});

router.post("/items", zValidator("json", AddItemBody), async (c) => {
    const { sub: userId } = c.get("user");
    const { productId, quantity, customization } = c.req.valid("json");

    // Verify product exists
    const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
    });
    if (!product) {
        return c.json({ message: "Product not found", code: "NOT_FOUND" }, 404);
    }

    // Check if same (productId + customization) already in cart
    const existing = await db.query.cartItems.findFirst({
        where: and(
            eq(cartItems.userId, userId),
            eq(cartItems.productId, productId),
            eq(cartItems.customization, customization)
        ),
    });

    if (existing) {
        // Increment quantity
        const [updated] = await db
            .update(cartItems)
            .set({ quantity: existing.quantity + quantity, updatedAt: new Date() })
            .where(eq(cartItems.id, existing.id))
            .returning();
        return c.json(updated);
    }

    const [inserted] = await db
        .insert(cartItems)
        .values({ userId, productId, quantity, customization })
        .returning();

    return c.json(inserted, 201);
});

// ---------------------------------------------------------------------------
// PATCH /api/cart/items/:id — update quantity
// ---------------------------------------------------------------------------
router.patch("/items/:id", zValidator("json", z.object({ quantity: z.number().int().positive() })), async (c) => {
    const { sub: userId } = c.get("user");
    const id = c.req.param("id");
    const { quantity } = c.req.valid("json");

    const item = await db.query.cartItems.findFirst({
        where: and(eq(cartItems.id, id), eq(cartItems.userId, userId)),
    });
    if (!item) {
        return c.json({ message: "Cart item not found", code: "NOT_FOUND" }, 404);
    }

    const [updated] = await db
        .update(cartItems)
        .set({ quantity, updatedAt: new Date() })
        .where(eq(cartItems.id, id))
        .returning();

    return c.json(updated);
});

// ---------------------------------------------------------------------------
// DELETE /api/cart/items/:id — remove one item
// ---------------------------------------------------------------------------
router.delete("/items/:id", async (c) => {
    const { sub: userId } = c.get("user");
    const id = c.req.param("id");

    const item = await db.query.cartItems.findFirst({
        where: and(eq(cartItems.id, id), eq(cartItems.userId, userId)),
    });
    if (!item) {
        return c.json({ message: "Cart item not found", code: "NOT_FOUND" }, 404);
    }

    await db.delete(cartItems).where(eq(cartItems.id, id));
    return c.body(null, 204);
});

// ---------------------------------------------------------------------------
// DELETE /api/cart — clear entire cart
// ---------------------------------------------------------------------------
router.delete("/", async (c) => {
    const { sub: userId } = c.get("user");
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return c.body(null, 204);
});

// ---------------------------------------------------------------------------
// POST /api/cart/merge — merge localStorage guest cart on login
//
// Semantics:
//   For each guest item that ALREADY exists in the server cart (same productId
//   + customization), take the MAX quantity (don't double-count).
//   Items not in server cart are inserted fresh.
// ---------------------------------------------------------------------------
const MergeBody = z.object({
    items: z.array(
        z.object({
            productId: z.string().min(1),
            quantity: z.number().int().positive(),
            customization: z.string().default(""),
        })
    ),
});

router.post("/merge", zValidator("json", MergeBody), async (c) => {
    const { sub: userId } = c.get("user");
    const { items: guestItems } = c.req.valid("json");

    if (guestItems.length === 0) {
        return c.json(await getUserCart(userId));
    }

    // Verify all products exist in one query
    const productIds = [...new Set(guestItems.map((i) => i.productId))];
    const validProducts = await db.query.products.findMany({
        where: inArray(products.id, productIds),
        columns: { id: true },
    });
    const validIds = new Set(validProducts.map((p) => p.id));

    // Process each guest item
    for (const guestItem of guestItems) {
        if (!validIds.has(guestItem.productId)) continue; // skip invalid products

        const existing = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.userId, userId),
                eq(cartItems.productId, guestItem.productId),
                eq(cartItems.customization, guestItem.customization)
            ),
        });

        if (existing) {
            // Take the higher quantity (guest may have added more)
            const newQty = Math.max(existing.quantity, guestItem.quantity);
            if (newQty !== existing.quantity) {
                await db
                    .update(cartItems)
                    .set({ quantity: newQty, updatedAt: new Date() })
                    .where(eq(cartItems.id, existing.id));
            }
        } else {
            await db.insert(cartItems).values({
                userId,
                productId: guestItem.productId,
                quantity: guestItem.quantity,
                customization: guestItem.customization,
            });
        }
    }

    return c.json(await getUserCart(userId));
});

export default router;
