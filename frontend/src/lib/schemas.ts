/**
 * Zod schemas — shared contracts between frontend and backend.
 * These define the canonical shape of all domain objects.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
export const ProductImageSchema = z.object({
    url: z.string().min(1),
    alt: z.string().min(1),
    isPrimary: z.boolean().optional().default(false),
});

export const ProductSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    price: z.number().int().positive(),
    displayPrice: z.string().min(1),
    image: z.string().optional(),                 // primary image url (legacy helper)
    images: z.array(ProductImageSchema).default([]),
    category: z.string().optional(),             // name
    categoryId: z.string().min(1),               // core reference
    description: z.string().min(1),
    features: z.array(z.string()).default([]),
    rating: z.number().min(0).max(5).default(5),
    reviewsCount: z.number().int().nonnegative().default(0),
    customizationPrompt: z.string().default("Add your customized text here"),
    badge: z.string().optional().nullable(),
    inStock: z.boolean().default(true),
    stockQty: z.number().int().default(999),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export const CategorySchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    sort: z.number().int().nonnegative().optional().default(0),
});

export type Category = z.infer<typeof CategorySchema>;

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------
export const CartItemSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    price: z.number().int().positive(),
    displayPrice: z.string().min(1),
    image: z.string().min(1),
    quantity: z.number().int().positive(),
    customization: z.string().optional(),
    productId: z.string().optional(),             // server-backed cart has this
});

export type CartItem = z.infer<typeof CartItemSchema>;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const RegisterRequestSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/[0-9]/, "Must include at least one number"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number").optional(),
});

export const LoginRequestSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const UserPublicSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    role: z.enum(["customer", "admin"]),
    createdAt: z.string().datetime().optional(),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export const OrderStatusSchema = z.enum([
    "pending",
    "confirmed",
    "in_production",
    "shipped",
    "delivered",
    "cancelled",
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_production: "In Production",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

// Valid status transitions (forward only; admin-controlled)
export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["in_production", "cancelled"],
    in_production: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
};

export const OrderItemSchema = z.object({
    id: z.string(),
    productId: z.string().nullable().optional(),
    productName: z.string(),
    price: z.number().int().positive(),
    quantity: z.number().int().positive(),
    customization: z.string().nullable().optional(),
});

export const OrderSchema = z.object({
    id: z.string(),
    userId: z.string().nullable().optional(),
    status: OrderStatusSchema,
    subtotal: z.number().int().nonnegative(),
    shipping: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    notes: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    items: z.array(OrderItemSchema).optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;

// ---------------------------------------------------------------------------
// API utilities
// ---------------------------------------------------------------------------
export const ApiErrorSchema = z.object({
    message: z.string(),
    code: z.string().optional(),
    field: z.string().optional(),      // for validation errors
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        data: z.array(itemSchema),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
        limit: z.number().int().positive(),
    });

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
};

// ---------------------------------------------------------------------------
// API filter params
// ---------------------------------------------------------------------------
export const ProductFiltersSchema = z.object({
    category: z.string().optional(),
    q: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(24),
    sort: z.enum(["price_asc", "price_desc", "rating_desc", "newest"]).optional(),
    inStock: z.coerce.boolean().optional(),
});

export type ProductFilters = z.infer<typeof ProductFiltersSchema>;
