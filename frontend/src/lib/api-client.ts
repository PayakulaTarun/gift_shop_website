/**
 * Typed fetch wrapper (api-client.ts).
 *
 * Behaviour:
 * - Prepends VITE_API_URL to all paths.
 * - Injects Authorization: Bearer <token> when accessToken is set.
 * - Parses response with a provided Zod schema.
 * - Throws ApiError on non-2xx responses.
 * - Handles 401 → dispatches a custom 'auth:logout' event so AuthContext can clear state.
 *
 * The client is a plain object (not a class) so it works cleanly with TanStack Query.
 */
import { z } from "zod";
import { ApiErrorSchema, type ApiError } from "./schemas";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

// ---------------------------------------------------------------------------
// Access token store — avoids prop-drilling token through every call site.
// AuthContext calls `accessTokenStore.set()` on login/refresh.
// ---------------------------------------------------------------------------
let _accessToken: string | null = null;

/** @deprecated Use accessTokenStore.set() instead */
export function setAccessToken(token: string | null) {
    _accessToken = token;
}

export function getAccessToken(): string | null {
    return _accessToken;
}

/** Object-oriented alias for AuthContext use. */
export const accessTokenStore = {
    set: (token: string | null) => { _accessToken = token; },
    get: () => _accessToken,
};

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------
export class ApiClientError extends Error {
    readonly status: number;
    readonly apiError: ApiError;

    constructor(status: number, apiError: ApiError) {
        super(apiError.message);
        this.name = "ApiClientError";
        this.status = status;
        this.apiError = apiError;
    }
}

// ---------------------------------------------------------------------------
// Core request helper
// ---------------------------------------------------------------------------
type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
};

async function request<TData>(
    path: string,
    schema: z.ZodType<TData>,
    options: RequestOptions = {}
): Promise<TData> {
    const { method = "GET", body, headers = {}, credentials = "include" } = options;

    const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (_accessToken) {
        requestHeaders["Authorization"] = `Bearer ${_accessToken}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers: requestHeaders,
        credentials,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    // Handle 401 globally
    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    if (!response.ok) {
        let apiError: ApiError = {
            message: `Request failed with status ${response.status}`,
        };
        try {
            const json = await response.json();
            const parsed = ApiErrorSchema.safeParse(json);
            if (parsed.success) apiError = parsed.data;
        } catch {
            // ignore parse errors — use default message
        }
        throw new ApiClientError(response.status, apiError);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as TData;
    }

    const json = await response.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
        console.error("[api-client] Schema parse error:", parsed.error.flatten());
        throw new ApiClientError(0, {
            message: "Server returned unexpected data shape",
            code: "SCHEMA_MISMATCH",
        });
    }

    return parsed.data;
}

// ---------------------------------------------------------------------------
// Public API surface
// ---------------------------------------------------------------------------
export const apiClient = {
    get: <T>(path: string, schema: z.ZodType<T>, options?: Omit<RequestOptions, "method" | "body">) =>
        request(path, schema, { ...options, method: "GET" }),

    post: <T>(path: string, body: unknown, schema: z.ZodType<T>, options?: Omit<RequestOptions, "method">) =>
        request(path, schema, { ...options, method: "POST", body }),

    patch: <T>(path: string, body: unknown, schema: z.ZodType<T>, options?: Omit<RequestOptions, "method">) =>
        request(path, schema, { ...options, method: "PATCH", body }),

    put: <T>(path: string, body: unknown, schema: z.ZodType<T>, options?: Omit<RequestOptions, "method">) =>
        request(path, schema, { ...options, method: "PUT", body }),

    delete: <T>(path: string, schema: z.ZodType<T>, options?: Omit<RequestOptions, "method" | "body">) =>
        request(path, schema, { ...options, method: "DELETE" }),
};
