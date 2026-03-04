/**
 * ErrorBoundary.tsx
 *
 * Class-based error boundary (React still requires a class for this).
 * - Catches render errors in the subtree.
 * - Shows a graceful fallback UI.
 * - Provides a "try again" action.
 * - Reports to Sentry when DSN is configured (Phase 6).
 *
 * Usage:
 *   <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *     <MyComponent />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary section="Product Page">
 *     <ProductDetail />
 *   </ErrorBoundary>
 */
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: React.ReactNode;
    /** Optional custom fallback. Replaces built-in. */
    fallback?: React.ReactNode;
    /** Human-readable context label for error reports */
    section?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        this.setState({ errorInfo: info });

        // Sentry hook — enabled automatically when VITE_SENTRY_DSN is set (Phase 6)
        if (typeof window !== "undefined" && (window as { Sentry?: { captureException: (e: Error, ctx: unknown) => void } }).Sentry) {
            (window as { Sentry?: { captureException: (e: Error, ctx: unknown) => void } }).Sentry?.captureException(error, {
                extra: {
                    section: this.props.section ?? "unknown",
                    componentStack: info.componentStack,
                },
            });
        }

        // Structured error log (will be picked up by Pino-compatible log shippers in Phase 6)
        console.error(
            JSON.stringify({
                level: "error",
                msg: "React render error",
                section: this.props.section ?? "unknown",
                error: error.message,
                stack: error.stack,
            })
        );
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-border/50 bg-white p-8 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="font-heading text-lg text-luxury-black mb-1">
                        Something went wrong
                    </h3>
                    <p className="font-ui text-sm text-luxury-black/60 mb-6 max-w-xs">
                        {this.props.section
                            ? `We couldn't load the ${this.props.section}. Please try again.`
                            : "An unexpected error occurred. Please try again."}
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="inline-flex items-center gap-2 rounded-full bg-luxury-black px-5 py-2.5 font-ui text-sm text-warm-white transition-colors hover:bg-gold hover:text-luxury-black"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * withErrorBoundary HOC — wrap any component with a named error boundary.
 *
 * @example
 * const SafeShop = withErrorBoundary(Shop, 'Shop Page');
 */
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    section: string
): React.FC<P> {
    const Wrapped: React.FC<P> = (props) => (
        <ErrorBoundary section={section}>
            <Component {...props} />
        </ErrorBoundary>
    );
    Wrapped.displayName = `WithErrorBoundary(${section})`;
    return Wrapped;
}
