import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, MessageCircle, Instagram, User, LogOut, ChevronDown, Package, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/#trust" },
  { label: "Contact", href: "/#final-cta" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const { user, logout, openLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  const handleNav = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);

    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      navigate(href);
      window.scrollTo(0, 0);
    }
  }, [location, navigate]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-black/80 backdrop-blur-lg border-b border-warm-white/5">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex flex-col leading-none">
          <span className="font-heading text-lg text-warm-white tracking-wide">Creative <span className="text-gradient-gold">Gifts</span> Store</span>
          <span className="font-ui text-[10px] text-warm-white/40 tracking-[0.15em] uppercase">Personalized Gifts Store</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="font-ui text-sm text-warm-white/70 hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            className="text-warm-white/70 hover:text-gold transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            className="text-warm-white/70 hover:text-gold transition-colors relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-coral rounded-full text-[9px] flex items-center justify-center text-warm-white font-ui">
                {cartCount}
              </span>
            )}
          </button>

          {/* User button */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 text-warm-white/70 hover:text-warm-white transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center text-luxury-black font-ui font-bold text-xs">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 w-48 bg-luxury-black border border-warm-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-3 py-2.5 border-b border-warm-white/5">
                      <p className="text-xs text-warm-white font-ui font-medium truncate">{user.name ?? "Account"}</p>
                      <p className="text-[10px] text-warm-white/40 font-ui truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gold hover:bg-gold/5 transition-colors font-ui font-semibold border-b border-warm-white/5"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-warm-white/60 hover:text-gold hover:bg-gold/5 transition-colors font-ui"
                    >
                      <Package className="w-3.5 h-3.5" /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-warm-white/60 hover:text-coral hover:bg-coral/5 transition-colors font-ui"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="text-warm-white/70 hover:text-gold transition-colors"
              title="Sign in"
            >
              <User className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile: right-side icons */}
        <div className="md:hidden flex items-center gap-3">
          <button
            className="text-warm-white/70 hover:text-gold transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            className="text-warm-white/70 hover:text-gold transition-colors relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-coral rounded-full text-[9px] flex items-center justify-center text-warm-white font-ui">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-warm-white"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-luxury-black/95 backdrop-blur-lg border-t border-warm-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="font-ui text-warm-white/70 hover:text-gold transition-colors py-1 border-b border-warm-white/5"
                >
                  {link.label}
                </a>
              ))}
              {/* Mobile: Auth section */}
              {user ? (
                <div className="flex items-center justify-between py-1 border-b border-warm-white/5">
                  <div>
                    <p className="text-xs text-warm-white font-ui font-medium">{user.name ?? "Account"}</p>
                    <p className="text-[10px] text-warm-white/40 font-ui mb-1">{user.email}</p>
                    <Link
                      to="/orders"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-1.5 text-xs text-gold font-ui hover:underline"
                    >
                      <Package className="w-3 h-3" /> View My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-1.5 text-xs text-gold font-ui font-bold mt-2"
                      >
                        <LayoutDashboard className="w-3 h-3" /> Go to Admin Panel
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    className="flex items-center gap-1.5 text-xs text-warm-white/40 hover:text-coral font-ui transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setOpen(false); openLoginModal(); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-gold/30 text-gold text-sm font-ui hover:bg-gold/10 transition-colors"
                >
                  <User className="w-4 h-4" /> Sign In / Register
                </button>
              )}
              {/* Mobile social links */}
              <div className="flex gap-3 pt-2">
                <a
                  href="https://wa.me/919951710569"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-ui py-2.5 rounded-full"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/creativegifts.attapur/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-ui py-2.5 rounded-full"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
