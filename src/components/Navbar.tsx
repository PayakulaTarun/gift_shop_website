import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/#trust" },
  { label: "Contact", href: "/#final-cta" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

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
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-warm-white"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
                  className="font-ui text-warm-white/70 hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
