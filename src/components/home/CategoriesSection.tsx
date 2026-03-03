import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Photo Gifts", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop&auto=format", emoji: "📸", count: "8+ items" },
  { name: "LED Gifts", image: "https://images.unsplash.com/photo-1567255378603-985a46e0d952?w=600&h=700&fit=crop&auto=format", emoji: "💡", count: "4+ items" },
  { name: "Crystal Gifts", image: "https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=600&h=700&fit=crop&auto=format", emoji: "💎", count: "3+ items" },
  { name: "Wooden Engravings", image: "https://images.unsplash.com/photo-1550684848-2f14fbca0bb8?w=600&h=700&fit=crop&auto=format", emoji: "🪵", count: "3+ items" },
  { name: "Artistic Gifts", image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&h=700&fit=crop&auto=format", emoji: "🎨", count: "3+ items" },
  { name: "Home Decor", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=700&fit=crop&auto=format", emoji: "🏠", count: "2+ items" },
  { name: "T-Shirts & Apparel", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop&auto=format", emoji: "👕", count: "3+ items" },
  { name: "Corporate Gifts", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=700&fit=crop&auto=format", emoji: "🏢", count: "4+ items" },
  { name: "Gift Combos", image: "https://images.unsplash.com/photo-1513558556155-bdb3ea9d33cf?w=600&h=700&fit=crop&auto=format", emoji: "🎁", count: "4+ items" },
];

const CategoriesSection = () => {
  const ref = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section id="categories" className="section-soft-rose py-24" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="font-ui text-gold text-sm tracking-[0.2em] uppercase mb-3">Collections</p>
          <h2 className="font-heading text-3xl md:text-5xl text-luxury-black">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <div key={cat.name} className="scroll-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <motion.div
                onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
                whileHover="hover"
                className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[4/5]"
              >
                <motion.img
                  variants={{ hover: { scale: 1.08 } }}
                  transition={{ duration: 0.6 }}
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                {/* Default overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-luxury-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="font-ui text-warm-white text-sm tracking-wider border border-gold/60 px-6 py-2 rounded-full">
                    View Gifts
                  </span>
                </div>
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.emoji}</span>
                    <div>
                      <h3 className="font-heading text-base md:text-lg text-warm-white leading-tight">{cat.name}</h3>
                      <p className="font-ui text-xs text-warm-white/60">{cat.count}</p>
                    </div>
                  </div>
                </div>
                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold/40 transition-colors duration-500" />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
