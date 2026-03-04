/**
 * schema.ts — Drizzle ORM table definitions.
 *
 * Phase 1: products + categories tables.
 * Phase 2: users + refresh_tokens tables.
 * Phase 3: cart_items table.
 * Phase 4: orders + order_items tables.
 *
 * Key decisions:
 * - prices stored as INTEGER (paise / smallest unit) to avoid float rounding.
 * - features & images stored as JSONB for flexibility without extra join tables.
 * - timestamps always TIMESTAMPTZ (timezone-aware).
 * - UUIDs use gen_random_uuid() for safe distributed generation.
 */
import {
    pgTable,
    pgEnum,
    text,
    integer,
    boolean,
    numeric,
    jsonb,
    timestamp,
    uuid,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);
export const orderStatusEnum = pgEnum("order_status", [
    "pending",     // Order created, waiting for WhatsApp confirmation / payment
    "confirmed",   // Payment verified / Chat confirmed
    "shipped",     // In transit
    "delivered",   // Completed
    "cancelled",   // Aborted
]);

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categories = pgTable("categories", {
    id: text("id").primaryKey(),              // slug, e.g. "photo-gifts"
    name: text("name").notNull(),
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .default(sql`now()`),
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const products = pgTable(
    "products",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        description: text("description").notNull(),

        // Price stored in ₹ value — display string kept alongside for zero-cost reads
        price: integer("price").notNull(),
        displayPrice: text("display_price").notNull(),

        categoryId: text("category_id")
            .notNull()
            .references(() => categories.id, { onDelete: "restrict" }),

        badge: text("badge"),
        rating: numeric("rating", { precision: 3, scale: 1 }),
        reviewsCount: integer("reviews_count").notNull().default(0),
        customizationPrompt: text("customization_prompt").notNull().default(""),

        // ["Ceramic mug, 325ml", "Dishwasher safe", ...]
        features: jsonb("features").$type<string[]>().notNull().default([]),

        // [{ url, alt, isPrimary }]
        images: jsonb("images")
            .$type<Array<{ url: string; alt: string; isPrimary?: boolean }>>()
            .notNull()
            .default([]),

        inStock: boolean("in_stock").notNull().default(true),
        stockQty: integer("stock_qty").notNull().default(999),

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
    },
    (table) => [
        index("idx_products_category").on(table.categoryId),
        index("idx_products_in_stock").on(table.inStock),
    ]
);

// ---------------------------------------------------------------------------
// Users (Phase 2)
// ---------------------------------------------------------------------------
export const users = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
        email: text("email").notNull(),
        name: text("name"),
        phone: text("phone"),
        passwordHash: text("password_hash").notNull(),
        role: userRoleEnum("role").notNull().default("customer"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
    },
    (table) => [
        uniqueIndex("idx_users_email").on(table.email),
    ]
);

// ---------------------------------------------------------------------------
// Refresh Tokens (Phase 2)
// - opaque token stored HASHED in DB (bcrypt or SHA-256)
// - 7-day TTL; rotated on each refresh
// ---------------------------------------------------------------------------
export const refreshTokens = pgTable(
    "refresh_tokens",
    {
        id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        tokenHash: text("token_hash").notNull(),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        revoked: boolean("revoked").notNull().default(false),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
    },
    (table) => [
        index("idx_refresh_tokens_user").on(table.userId),
        uniqueIndex("idx_refresh_tokens_hash").on(table.tokenHash),
    ]
);

// ---------------------------------------------------------------------------
// Cart Items (Phase 3)
// - One row per (user, product, customization) combination
// - Unique constraint prevents duplicates; merge-on-login upserts into this
// ---------------------------------------------------------------------------
export const cartItems = pgTable(
    "cart_items",
    {
        id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        productId: text("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        quantity: integer("quantity").notNull().default(1),
        // Free-form text from the customization dialog (e.g. "Name: Ravi, Date: 14 Feb")
        customization: text("customization").default(""),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
    },
    (table) => [
        index("idx_cart_user").on(table.userId),
    ]
);

// ---------------------------------------------------------------------------
// Orders (Phase 4)
// - Stores the high-level order metadata
// - orderNumber is a human-readable slug: GS-1001
// ---------------------------------------------------------------------------
export const orders = pgTable(
    "orders",
    {
        id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
        orderNumber: text("order_number").notNull().unique(), // GS-1234
        userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),

        status: orderStatusEnum("status").notNull().default("pending"),
        totalAmount: integer("total_amount").notNull(),

        // Snapshot of customer info at time of order
        customerName: text("customer_name").notNull(),
        customerEmail: text("customer_email").notNull(),
        customerPhone: text("customer_phone").notNull(),
        shippingAddress: text("shipping_address"),

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
    },
    (table) => [
        index("idx_orders_user").on(table.userId),
        index("idx_orders_number").on(table.orderNumber),
        index("idx_orders_status").on(table.status),
    ]
);

// ---------------------------------------------------------------------------
// Order Items (Phase 4)
// - Locks product price and name at the moment of purchase
// ---------------------------------------------------------------------------
export const orderItems = pgTable(
    "order_items",
    {
        id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        productId: text("product_id").references(() => products.id, { onDelete: "set null" }),

        // Denormalized snapshots to preserve history
        productName: text("product_name").notNull(),
        price: integer("price").notNull(),

        quantity: integer("quantity").notNull(),
        customization: text("customization").default(""),

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .default(sql`now()`),
    },
    (table) => [
        index("idx_order_items_order").on(table.orderId),
    ]
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------
export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    orderItems: many(orderItems),
}));

export const usersRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
    cartItems: many(cartItems),
    orders: many(orders),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    user: one(users, {
        fields: [cartItems.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [cartItems.productId],
        references: [products.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));

// ---------------------------------------------------------------------------
// Exported inferred types
// ---------------------------------------------------------------------------
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type ProductRow = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
