import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { PRODUCTS } from "@/data/products";
import { useNavigate } from "react-router-dom";

const BestSellersSection = () => {
  const ref = useScrollReveal();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Pick first 6 for best sellers
  const products = PRODUCTS.slice(0, 6);

  const handleAddToCart = (e: React.MouseEvent, product: typeof PRODUCTS[0]) => {
    e.stopPropagation();
    addToCart({
      name: product.name,
      price: product.price,
      displayPrice: product.displayPrice,
      image: product.image
    });
    toast.success(`${product.name} added to your bag`);
  };

  return (
    <section id="best-sellers" className="section-warm-white py-24" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-14 scroll-reveal">
          <p className="font-ui text-gold text-sm tracking-[0.2em] uppercase mb-3">Most Loved</p>
          <h2 className="font-heading text-3xl md:text-5xl text-luxury-black">Best Sellers</h2>
        </div>

        <div className="scroll-reveal overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          <div className="flex gap-6 w-max">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-64 flex-shrink-0 bg-warm-white rounded-2xl overflow-hidden shadow-soft border border-border cursor-pointer group"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/40 transition-all duration-500 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      className="font-ui text-warm-white text-xs border border-warm-white/60 px-4 py-2 rounded-full hover:bg-gold hover:border-gold hover:text-luxury-black transition-all flex items-center gap-2"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                    </button>
                    <button className="font-ui text-warm-white text-xs border border-warm-white/60 px-4 py-2 rounded-full hover:bg-warm-white/10 transition-colors">
                      Customize
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base text-luxury-black mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-ui font-semibold text-gold">{product.displayPrice}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
