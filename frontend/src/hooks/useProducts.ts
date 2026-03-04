/**
 * useProducts — TanStack Query hook for the product catalog.
 *
 * Strategy:
 * - When `VITE_API_URL` is set → fetch from real backend.
 * - When `VITE_API_URL` is NOT set → serve static data from products.ts.
 *   This is the "transparent swap" pattern: Phase 0 and Phase 1 are
 *   completely backward-compatible since the hook always returns the same type.
 *
 * Usage:
 *   const { data: products, isLoading, error } = useProducts({ category: 'LED Gifts' })
 *   const { data: product, isLoading } = useProduct('photo-mug-custom')
 */
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ProductSchema, ProductFiltersSchema, PaginatedResponseSchema } from "@/lib/schemas";
import type { Product, ProductFilters, PaginatedResponse } from "@/lib/schemas";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { PRODUCTS, CATEGORIES } from "@/data/products";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const HAS_BACKEND = Boolean(API_BASE);

// ---------------------------------------------------------------------------
// Static data adapters (maps legacy shape → canonical Product schema)
// ---------------------------------------------------------------------------
function adaptStaticProduct(p: typeof PRODUCTS[number]): Product {
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        displayPrice: p.displayPrice,
        image: p.image,
        images: [{ url: p.image, alt: p.name, isPrimary: true }],
        category: p.category,
        categoryId: p.category ? p.category.toLowerCase().replace(/\s+/g, '-') : 'photo-frames',
        description: p.description,
        features: p.features,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        customizationPrompt: p.customizationPrompt,
        badge: p.badge,
        inStock: true,
        stockQty: 999,
    };
}

function filterStaticProducts(
    raw: typeof PRODUCTS,
    filters?: ProductFilters
): PaginatedResponse<Product> {
    let items = raw;

    if (filters?.category && filters.category !== "All") {
        items = items.filter((p) => p.category === filters.category);
    }

    if (filters?.q) {
        const q = filters.q.toLowerCase();
        items = items.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
        );
    }

    if (filters?.sort === "price_asc") {
        items = [...items].sort((a, b) => a.price - b.price);
    } else if (filters?.sort === "price_desc") {
        items = [...items].sort((a, b) => b.price - a.price);
    } else if (filters?.sort === "rating_desc") {
        items = [...items].sort((a, b) => b.rating - a.rating);
    }

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 24;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);

    return {
        data: paged.map(adaptStaticProduct),
        total: items.length,
        page,
        totalPages: Math.ceil(items.length / limit),
        limit,
    };
}

// ---------------------------------------------------------------------------
// API fetch functions
// ---------------------------------------------------------------------------
const ProductListSchema = PaginatedResponseSchema(ProductSchema);

async function fetchProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    if (!HAS_BACKEND) {
        // Static fallback — no network call
        return filterStaticProducts(PRODUCTS, filters);
    }

    const params = new URLSearchParams();
    if (filters?.category && filters.category !== "All") params.set("category", filters.category);
    if (filters?.q) params.set("q", filters.q);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.inStock !== undefined) params.set("inStock", String(filters.inStock));

    const qs = params.toString();
    return apiClient.get(`/api/products${qs ? `?${qs}` : ""}`, ProductListSchema);
}

async function fetchProduct(id: string): Promise<Product> {
    if (!HAS_BACKEND) {
        const raw = PRODUCTS.find((p) => p.id === id);
        if (!raw) throw new Error(`Product not found: ${id}`);
        return adaptStaticProduct(raw);
    }

    return apiClient.get(`/api/products/${id}`, ProductSchema);
}

async function fetchCategories(): Promise<string[]> {
    if (!HAS_BACKEND) {
        return CATEGORIES;
    }

    const CategoriesArraySchema = z.array(
        z.object({ id: z.string(), name: z.string() })
    );
    const cats = await apiClient.get(`/api/categories`, CategoriesArraySchema);
    return cats.map((c) => c.name);
}

// ---------------------------------------------------------------------------
// Public hooks
// ---------------------------------------------------------------------------
/**
 * useProducts — fetches a paginated, filtered product list.
 *
 * @example
 * const { data, isLoading, isError, error } = useProducts({ category: 'LED Gifts', limit: 12 })
 * data.data        // Product[]
 * data.total       // total count
 */
export function useProducts(filters?: ProductFilters) {
    const safeFilers = filters ? ProductFiltersSchema.parse(filters) : undefined;
    return useQuery({
        queryKey: queryKeys.products.all(safeFilers),
        queryFn: () => fetchProducts(safeFilers),
        staleTime: 5 * 60 * 1000,            // 5-minute cache
        placeholderData: (prev) => prev,      // keep previous data while refetching
    });
}

/**
 * useProduct — fetches a single product by ID.
 *
 * @example
 * const { data: product, isLoading, isError } = useProduct('photo-mug-custom')
 */
export function useProduct(id: string | undefined) {
    return useQuery({
        queryKey: queryKeys.products.detail(id ?? ""),
        queryFn: () => fetchProduct(id!),
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * useCategories — fetches the category list.
 * Returns a plain string[] matching the CATEGORIES legacy export shape.
 */
export function useCategories() {
    return useQuery({
        queryKey: queryKeys.categories.all(),
        queryFn: fetchCategories,
        staleTime: 30 * 60 * 1000,          // 30-minute cache (rarely changes)
    });
}
