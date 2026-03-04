/**
 * TanStack Query key factory.
 * Centralised key definitions avoid string duplication and enable
 * precise cache invalidation.
 *
 * Usage:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.detail('photo-mug-custom') })
 */

export const queryKeys = {
    products: {
        all: (filters?: Record<string, unknown>) =>
            filters ? (["products", "list", filters] as const) : (["products", "list"] as const),
        detail: (id: string) => ["products", "detail", id] as const,
    },
    categories: {
        all: () => ["categories"] as const,
    },
    cart: {
        all: () => ["cart"] as const,
    },
    orders: {
        all: () => ["orders"] as const,
        detail: (id: string) => ["orders", "detail", id] as const,
    },
    auth: {
        me: () => ["auth", "me"] as const,
    },
} as const;
