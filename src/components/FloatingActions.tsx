import { MessageCircle, Instagram, ShoppingBag, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const FloatingActions = () => {
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.button
        onClick={() => setIsSearchOpen(true)}
        whileHover={{ scale: 1.1 }}
        className="w-11 h-11 rounded-full bg-luxury-black/80 backdrop-blur-sm flex items-center justify-center text-warm-white border border-border/20 shadow-lg"
      >
        <Search className="w-4 h-4" />
      </motion.button>
      <motion.button
        onClick={() => setIsCartOpen(true)}
        whileHover={{ scale: 1.1 }}
        className="relative w-11 h-11 rounded-full bg-luxury-black/80 backdrop-blur-sm flex items-center justify-center text-warm-white border border-border/20 shadow-lg"
      >
        <ShoppingBag className="w-4 h-4" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral rounded-full text-[10px] flex items-center justify-center text-warm-white font-ui">
            {cartCount}
          </span>
        )}
      </motion.button>
      <motion.a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-warm-white shadow-lg"
      >
        <Instagram className="w-4 h-4" />
      </motion.a>
      <motion.a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-warm-white shadow-lg shadow-green-500/30"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </div>
  );
};

export default FloatingActions;
