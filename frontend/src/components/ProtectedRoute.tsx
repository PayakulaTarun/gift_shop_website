/**
 * ProtectedRoute.tsx — Route guard for authenticated routes.
 *
 * Usage (in App.tsx):
 *   <ProtectedRoute>
 *     <AdminPage />
 *   </ProtectedRoute>
 *
 *   <ProtectedRoute role="admin">
 *     <AdminDashboard />
 *   </ProtectedRoute>
 *
 * While checking auth: shows a centered spinner.
 * Not authed: prompts the login modal; renders null for the protected content.
 * Wrong role: shows a 403 message.
 */
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Props = {
    children: ReactNode;
    role?: "customer" | "admin";
};

export function ProtectedRoute({ children, role }: Props) {
    const { user, isLoading, openLoginModal } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            openLoginModal();
        }
    }, [isLoading, user, openLoginModal]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!user) return null;

    if (role && user.role !== role) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-2xl font-heading text-warm-white">Access Denied</p>
                <p className="text-warm-white/40 font-ui text-sm">
                    This page requires {role} access.
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
