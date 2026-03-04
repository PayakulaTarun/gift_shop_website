/**
 * AuthContext.tsx — Global authentication state.
 *
 * Provides:
 *   - user: UserPublic | null
 *   - accessToken: string | null
 *   - isLoading: boolean (initial session check)
 *   - login(email, password) → Promise<void>
 *   - register(email, password, name, phone?) → Promise<void>
 *   - logout() → Promise<void>
 *   - openLoginModal() / openRegisterModal()
 *   - isAuthModalOpen / authModalTab
 *
 * Token storage:
 *   - Access token: in-memory (React state). Clears on page refresh.
 *   - Refresh token: HttpOnly cookie managed by the server.
 *   On mount: calls /api/auth/refresh to restore session silently.
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { UserPublic } from "@/lib/schemas";
import { accessTokenStore } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type AuthModalTab = "login" | "register";

type AuthContextValue = {
    user: UserPublic | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthModalOpen: boolean;
    authModalTab: AuthModalTab;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
    logout: () => Promise<void>;
    openLoginModal: () => void;
    openRegisterModal: () => void;
    closeAuthModal: () => void;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        credentials: "include",   // send cookies (refresh token)
        headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(body.message ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
}

type AuthResponse = { user: UserPublic; accessToken: string };

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserPublic | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<AuthModalTab>("login");

    // Keep the api-client's token store in sync
    useEffect(() => {
        accessTokenStore.set(accessToken);
    }, [accessToken]);

    // Silently restore session on mount via refresh cookie
    useEffect(() => {
        if (!API_BASE) {
            setIsLoading(false);
            return;
        }

        apiFetch<{ accessToken: string }>("/api/auth/refresh", { method: "POST" })
            .then((data) => {
                setAccessToken(data.accessToken);
                return apiFetch<{ user: UserPublic }>("/api/auth/me", {
                    headers: { Authorization: `Bearer ${data.accessToken}` },
                });
            })
            .then((meData) => setUser(meData.user))
            .catch(() => { /* No session — that's fine */ })
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const data = await apiFetch<AuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        setUser(data.user);
        setAccessToken(data.accessToken);
        setIsAuthModalOpen(false);
    }, []);

    const register = useCallback(async (
        email: string,
        password: string,
        name: string,
        phone?: string
    ) => {
        const data = await apiFetch<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password, name, phone }),
        });
        setUser(data.user);
        setAccessToken(data.accessToken);
        setIsAuthModalOpen(false);
    }, []);

    const logout = useCallback(async () => {
        await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => { });
        setUser(null);
        setAccessToken(null);
    }, []);

    const openLoginModal = useCallback(() => {
        setAuthModalTab("login");
        setIsAuthModalOpen(true);
    }, []);

    const openRegisterModal = useCallback(() => {
        setAuthModalTab("register");
        setIsAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

    return (
        <AuthContext.Provider value={{
            user, accessToken, isLoading,
            isAuthModalOpen, authModalTab,
            login, register, logout,
            openLoginModal, openRegisterModal, closeAuthModal,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
