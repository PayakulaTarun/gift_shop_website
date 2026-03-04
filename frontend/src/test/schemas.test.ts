/**
 * Tests for Zod schemas (src/lib/schemas.ts).
 * These act as the "contract tests" between frontend and backend.
 *
 * Strategy: if a schema parse fails, the API contract has been broken.
 * CI will catch this before it reaches production.
 */
import { describe, it, expect } from "vitest";
import {
    ProductSchema,
    CartItemSchema,
    RegisterRequestSchema,
    LoginRequestSchema,
    OrderStatusSchema,
    VALID_STATUS_TRANSITIONS,
    type Product,
} from "@/lib/schemas";

// ---------------------------------------------------------------------------
// ProductSchema
// ---------------------------------------------------------------------------
describe("ProductSchema", () => {
    const validProduct: Product = {
        id: "photo-mug-custom",
        name: "Custom Photo Mug",
        price: 349,
        displayPrice: "₹349",
        image: "/products/photo_mug.jpg",
        images: [{ url: "/products/photo_mug.jpg", alt: "Custom Photo Mug", isPrimary: true }],
        category: "Photo Gifts",
        description: "A great mug.",
        features: ["Ceramic mug", "Dishwasher safe"],
        rating: 4.8,
        reviewsCount: 512,
        customizationPrompt: "Enter text:",
        badge: "Bestseller",
        inStock: true,
    };

    it("parses a valid product", () => {
        const result = ProductSchema.safeParse(validProduct);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.id).toBe("photo-mug-custom");
        }
    });

    it("defaults inStock to true when omitted", () => {
        const { inStock: _omitted, ...withoutInStock } = validProduct;
        const result = ProductSchema.safeParse(withoutInStock);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.inStock).toBe(true);
        }
    });

    it("accepts optional badge", () => {
        const { badge: _omitted, ...withoutBadge } = validProduct;
        const result = ProductSchema.safeParse(withoutBadge);
        expect(result.success).toBe(true);
    });

    it("rejects missing required id", () => {
        const { id: _omitted, ...withoutId } = validProduct;
        const result = ProductSchema.safeParse(withoutId);
        expect(result.success).toBe(false);
    });

    it("rejects negative price", () => {
        const result = ProductSchema.safeParse({ ...validProduct, price: -1 });
        expect(result.success).toBe(false);
    });

    it("rejects rating > 5", () => {
        const result = ProductSchema.safeParse({ ...validProduct, rating: 5.1 });
        expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
        const result = ProductSchema.safeParse({ ...validProduct, name: "" });
        expect(result.success).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// CartItemSchema
// ---------------------------------------------------------------------------
describe("CartItemSchema", () => {
    const validItem = {
        id: "cart-abc-123",
        name: "Custom Photo Mug",
        price: 349,
        displayPrice: "₹349",
        image: "/products/photo_mug.jpg",
        quantity: 2,
        customization: "Happy Birthday Ravi",
    };

    it("parses a valid cart item", () => {
        const result = CartItemSchema.safeParse(validItem);
        expect(result.success).toBe(true);
    });

    it("accepts item without customization", () => {
        const { customization: _omitted, ...withoutCustomization } = validItem;
        const result = CartItemSchema.safeParse(withoutCustomization);
        expect(result.success).toBe(true);
    });

    it("rejects quantity of 0", () => {
        const result = CartItemSchema.safeParse({ ...validItem, quantity: 0 });
        expect(result.success).toBe(false);
    });

    it("rejects negative price", () => {
        const result = CartItemSchema.safeParse({ ...validItem, price: -10 });
        expect(result.success).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------
describe("RegisterRequestSchema", () => {
    const validReq = {
        email: "test@giftstudio.in",
        password: "SecurePass1",
        name: "Test User",
    };

    it("parses a valid registration request", () => {
        expect(RegisterRequestSchema.safeParse(validReq).success).toBe(true);
    });

    it("rejects invalid email", () => {
        expect(RegisterRequestSchema.safeParse({ ...validReq, email: "not-an-email" }).success).toBe(false);
    });

    it("rejects password shorter than 8 chars", () => {
        expect(RegisterRequestSchema.safeParse({ ...validReq, password: "Ab1" }).success).toBe(false);
    });

    it("rejects password without uppercase", () => {
        expect(RegisterRequestSchema.safeParse({ ...validReq, password: "alllower1" }).success).toBe(false);
    });

    it("rejects password without number", () => {
        expect(RegisterRequestSchema.safeParse({ ...validReq, password: "AllUpper" }).success).toBe(false);
    });

    it("rejects name shorter than 2 chars", () => {
        expect(RegisterRequestSchema.safeParse({ ...validReq, name: "A" }).success).toBe(false);
    });
});

describe("LoginRequestSchema", () => {
    it("requires email and password", () => {
        expect(LoginRequestSchema.safeParse({ email: "a@b.com", password: "pass" }).success).toBe(true);
        expect(LoginRequestSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
        expect(LoginRequestSchema.safeParse({ password: "pass" }).success).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// Order status machine
// ---------------------------------------------------------------------------
describe("VALID_STATUS_TRANSITIONS", () => {
    it("pending can move to confirmed or cancelled", () => {
        expect(VALID_STATUS_TRANSITIONS.pending).toContain("confirmed");
        expect(VALID_STATUS_TRANSITIONS.pending).toContain("cancelled");
    });

    it("delivered has no further transitions", () => {
        expect(VALID_STATUS_TRANSITIONS.delivered).toHaveLength(0);
    });

    it("cancelled has no further transitions", () => {
        expect(VALID_STATUS_TRANSITIONS.cancelled).toHaveLength(0);
    });

    it("can't skip from pending directly to shipped", () => {
        expect(VALID_STATUS_TRANSITIONS.pending).not.toContain("shipped");
    });

    it("covers all valid statuses", () => {
        const statuses = OrderStatusSchema.options;
        statuses.forEach((s) => {
            expect(VALID_STATUS_TRANSITIONS).toHaveProperty(s);
        });
    });
});
