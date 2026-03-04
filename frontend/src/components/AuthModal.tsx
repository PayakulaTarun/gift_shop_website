/**
 * AuthModal.tsx — Login / Register modal using shadcn Dialog + Tabs.
 *
 * Consumed by:
 *   - Navbar (user icon button)
 *   - Cart (checkout flow — "login to continue")
 *
 * Design stays consistent with the existing luxury dark aesthetic.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, Phone, X, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RegisterRequestSchema, LoginRequestSchema } from "@/lib/schemas";

// ---------------------------------------------------------------------------
// Field component
// ---------------------------------------------------------------------------
type FieldProps = {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
    icon?: React.ReactNode;
    suffix?: React.ReactNode;
    required?: boolean;
};

function Field({ id, label, type = "text", value, onChange, placeholder, error, icon, suffix, required }: FieldProps) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-xs font-ui text-warm-white/60 uppercase tracking-wider">
                {label}{required && <span className="text-coral ml-1">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-white/30">
                        {icon}
                    </span>
                )}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`
                        w-full bg-white/5 border rounded-lg px-4 py-2.5 text-sm text-warm-white
                        placeholder:text-warm-white/20 font-ui
                        focus:outline-none focus:ring-1 transition-all duration-200
                        ${icon ? "pl-9" : ""}
                        ${suffix ? "pr-10" : ""}
                        ${error
                            ? "border-red-500/60 focus:ring-red-500/40"
                            : "border-warm-white/10 focus:ring-gold/50 focus:border-gold/30"
                        }
                    `}
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {suffix}
                    </span>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validate = () => {
        const result = LoginRequestSchema.safeParse({ email, password });
        if (!result.success) {
            const msg = result.error.errors[0]?.message ?? "Invalid input";
            setError(msg);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Field
                id="login-email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                icon={<Mail className="w-3.5 h-3.5" />}
                required
            />
            <Field
                id="login-password"
                label="Password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="Min. 8 characters"
                icon={<Lock className="w-3.5 h-3.5" />}
                suffix={
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="text-warm-white/30 hover:text-warm-white/60 transition-colors"
                    >
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                }
                required
            />

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gold to-amber-400 text-luxury-black font-ui font-semibold text-sm
                    hover:from-amber-400 hover:to-gold transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
            >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
            </button>

            <p className="text-center text-xs text-warm-white/40 font-ui">
                Don't have an account?{" "}
                <button type="button" onClick={onSwitch} className="text-gold hover:underline">
                    Create one
                </button>
            </p>
        </form>
    );
}

// ---------------------------------------------------------------------------
// Register form
// ---------------------------------------------------------------------------
function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGlobalError("");

        const result = RegisterRequestSchema.safeParse({ name, email, password, phone: phone || undefined });
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                const key = err.path[0]?.toString() ?? "global";
                fieldErrors[key] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);
        try {
            await register(email, password, name, phone || undefined);
        } catch (err) {
            setGlobalError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Field
                id="reg-name"
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="Ravi Kumar"
                icon={<User className="w-3.5 h-3.5" />}
                error={errors.name}
                required
            />
            <Field
                id="reg-email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                icon={<Mail className="w-3.5 h-3.5" />}
                error={errors.email}
                required
            />
            <Field
                id="reg-phone"
                label="Phone (optional)"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="+91 9999 999 999"
                icon={<Phone className="w-3.5 h-3.5" />}
                error={errors.phone}
            />
            <Field
                id="reg-password"
                label="Password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                icon={<Lock className="w-3.5 h-3.5" />}
                error={errors.password}
                suffix={
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="text-warm-white/30 hover:text-warm-white/60 transition-colors"
                    >
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                }
                required
            />

            {globalError && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {globalError}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gold to-amber-400 text-luxury-black font-ui font-semibold text-sm
                    hover:from-amber-400 hover:to-gold transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
            >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : "Create Account"}
            </button>

            <p className="text-center text-xs text-warm-white/40 font-ui">
                Already have an account?{" "}
                <button type="button" onClick={onSwitch} className="text-gold hover:underline">
                    Sign in
                </button>
            </p>
        </form>
    );
}

// ---------------------------------------------------------------------------
// Modal shell
// ---------------------------------------------------------------------------
export function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, authModalTab, openLoginModal, openRegisterModal } = useAuth();
    const isLogin = authModalTab === "login";

    return (
        <AnimatePresence>
            {isAuthModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAuthModal}
                        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="pointer-events-auto w-full max-w-md bg-luxury-black border border-warm-white/10 rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="relative px-6 pt-6 pb-4 border-b border-warm-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-heading text-xl text-warm-white">
                                            {isLogin ? "Welcome back" : "Join GiftStudio"}
                                        </h2>
                                        <p className="text-xs text-warm-white/40 font-ui mt-0.5">
                                            {isLogin
                                                ? "Sign in to track orders and save your preferences"
                                                : "Create a free account to get started"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeAuthModal}
                                        className="text-warm-white/40 hover:text-warm-white transition-colors p-1"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Tab switcher */}
                                <div className="flex gap-0 mt-4 bg-white/5 rounded-lg p-1">
                                    <button
                                        onClick={openLoginModal}
                                        className={`flex-1 py-1.5 text-xs font-ui font-medium rounded-md transition-all duration-200 ${isLogin
                                                ? "bg-gold/20 text-gold border border-gold/20"
                                                : "text-warm-white/40 hover:text-warm-white/60"
                                            }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={openRegisterModal}
                                        className={`flex-1 py-1.5 text-xs font-ui font-medium rounded-md transition-all duration-200 ${!isLogin
                                                ? "bg-gold/20 text-gold border border-gold/20"
                                                : "text-warm-white/40 hover:text-warm-white/60"
                                            }`}
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5">
                                <AnimatePresence mode="wait">
                                    {isLogin ? (
                                        <motion.div
                                            key="login"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <LoginForm onSwitch={openRegisterModal} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="register"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <RegisterForm onSwitch={openLoginModal} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer note */}
                            <div className="px-6 pb-5 text-center">
                                <p className="text-[10px] text-warm-white/20 font-ui">
                                    By continuing you agree to our{" "}
                                    <span className="underline cursor-pointer">Terms</span> &{" "}
                                    <span className="underline cursor-pointer">Privacy Policy</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default AuthModal;
