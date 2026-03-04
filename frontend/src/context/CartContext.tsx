/**
 * CartContext.tsx — Dual-mode cart: localStorage (guest) ↔ server (auth'd).
 *
 * Strategy
 * ────────
 *  Guest  : cart lives in `giftstudio_cart` localStorage key. Unchanged UX.
 *  Auth'd : cart is fetched from GET /api/cart and all mutations go to the API.
 *           localStorage is cleared after a successful merge.
 *
 * Merge-on-login
 * ──────────────
 *  When the user logs in (AuthContext sets `user`), we detect the transition
 *  with a ref and call POST /api/cart/merge with the current guest items.
 *  The server de-duplicates and returns the merged cart.
 *
 * Public API is IDENTICAL to the original CartContext — all consumers are
 * zero-change (CartSheet, Product page, etc.).
 */
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
    useServerCart,
    useAddToServerCart,
    useUpdateServerCartItem,
    useRemoveServerCartItem,
    useClearServerCart,
    useMergeCart,
} from "@/hooks/useServerCart";

// ---------------------------------------------------------------------------
// Types (exported so CartSheet/Product.tsx don't need to change)
// ---------------------------------------------------------------------------
export interface CartItem {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    image: string;
    quantity: number;
    customization?: string;
    productId?: string;   // present in server-backed items
}

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    isSearchOpen: boolean;
    setIsSearchOpen: (open: boolean) => void;
    isSyncing: boolean;   // true while merge / server mutation is in flight
    addToCart: (item: Omit<CartItem, "id" | "quantity">) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LS_KEY = "giftstudio_cart";
const HAS_BACKEND = Boolean(import.meta.env.VITE_API_URL);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const isAuthed = Boolean(user) && HAS_BACKEND;

    // ── Local state (guest cart) ──────────────────────────────────────────
    const [localCart, setLocalCart] = useState<CartItem[]>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            return raw ? (JSON.parse(raw) as CartItem[]) : [];
        } catch {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Sync local cart → localStorage
    useEffect(() => {
        if (!isAuthed) {
            localStorage.setItem(LS_KEY, JSON.stringify(localCart));
        }
    }, [localCart, isAuthed]);

    // ── Server cart hooks ─────────────────────────────────────────────────
    const { data: serverCart, isFetching: isFetchingServer } = useServerCart(isAuthed);
    const addMut = useAddToServerCart();
    const updateMut = useUpdateServerCartItem();
    const removeMut = useRemoveServerCartItem();
    const clearMut = useClearServerCart();
    const mergeMut = useMergeCart();
    const qc = useQueryClient();

    const isSyncing =
        isFetchingServer ||
        addMut.isPending ||
        updateMut.isPending ||
        removeMut.isPending ||
        clearMut.isPending ||
        mergeMut.isPending;

    // ── Merge-on-login ────────────────────────────────────────────────────
    const prevUserRef = useRef<typeof user>(null);

    useEffect(() => {
        const prevUser = prevUserRef.current;
        prevUserRef.current = user;

        // Detect transition: null → user (login event)
        if (!prevUser && user && HAS_BACKEND) {
            const guestItems = localCart;

            if (guestItems.length > 0) {
                mergeMut.mutate(
                    {
                        items: guestItems.map((item) => ({
                            productId: item.productId ?? item.id,
                            quantity: item.quantity,
                            customization: item.customization ?? "",
                        })),
                    },
                    {
                        onSuccess: () => {
                            // Clear guest cart now that server has it
                            setLocalCart([]);
                            localStorage.removeItem(LS_KEY);
                        },
                    }
                );
            } else {
                // No guest items — just invalidate to load fresh server cart
                qc.invalidateQueries({ queryKey: ["server-cart"] });
            }
        }

        // Detect logout: user → null
        if (prevUser && !user) {
            // Restore from localStorage on logout
            try {
                const raw = localStorage.getItem(LS_KEY);
                setLocalCart(raw ? (JSON.parse(raw) as CartItem[]) : []);
            } catch {
                setLocalCart([]);
            }
        }
    }, [user]);     // eslint-disable-line react-hooks/exhaustive-deps

    // ── Unified cart array ────────────────────────────────────────────────
    const cart: CartItem[] = isAuthed
        ? (serverCart?.items ?? []).map((si) => ({
            id: si.id,
            name: si.name,
            price: si.price,
            displayPrice: si.displayPrice,
            image: si.image,
            quantity: si.quantity,
            customization: si.customization,
            productId: si.productId,
        }))
        : localCart;

    // ── Actions ───────────────────────────────────────────────────────────
    const addToCart = useCallback(
        (item: Omit<CartItem, "id" | "quantity">) => {
            if (isAuthed) {
                addMut.mutate({
                    productId: item.productId ?? item.name,  // fallback to name if no productId
                    quantity: 1,
                    customization: item.customization ?? "",
                });
            } else {
                setLocalCart((prev) => {
                    const existIdx = prev.findIndex(
                        (c) => c.name === item.name && c.customization === item.customization
                    );
                    if (existIdx >= 0) {
                        const next = [...prev];
                        next[existIdx] = { ...next[existIdx], quantity: next[existIdx].quantity + 1 };
                        return next;
                    }
                    return [...prev, { ...item, id: crypto.randomUUID(), quantity: 1 }];
                });
            }
            setIsCartOpen(true);
        },
        [isAuthed, addMut]
    );

    const removeFromCart = useCallback(
        (id: string) => {
            if (isAuthed) {
                removeMut.mutate(id);
            } else {
                setLocalCart((prev) => prev.filter((c) => c.id !== id));
            }
        },
        [isAuthed, removeMut]
    );

    const updateQuantity = useCallback(
        (id: string, quantity: number) => {
            if (quantity <= 0) {
                removeFromCart(id);
                return;
            }
            if (isAuthed) {
                updateMut.mutate({ id, quantity });
            } else {
                setLocalCart((prev) =>
                    prev.map((c) => (c.id === id ? { ...c, quantity } : c))
                );
            }
        },
        [isAuthed, updateMut, removeFromCart]
    );

    const clearCart = useCallback(() => {
        if (isAuthed) {
            clearMut.mutate();
        } else {
            setLocalCart([]);
        }
    }, [isAuthed, clearMut]);

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                isCartOpen,
                setIsCartOpen,
                isSearchOpen,
                setIsSearchOpen,
                isSyncing,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
};
