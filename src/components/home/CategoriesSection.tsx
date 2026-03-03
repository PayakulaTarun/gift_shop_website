import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";
import categoryPhoto from "@/assets/category-photo-gifts.jpg";
import categoryLed from "@/assets/category-led-gifts.jpg";
import categoryCrystal from "@/assets/category-crystal-gifts.jpg";
import categoryWooden from "@/assets/category-wooden.jpg";
import categoryArtistic from "@/assets/category-artistic.jpg";
import categoryHomeDecor from "@/assets/category-home-decor.jpg";

const categories = [
  { name: "Photo Gifts", image: categoryPhoto },
  { name: "LED Gifts", image: categoryLed },
  { name: "Crystal Gifts", image: categoryCrystal },
  { name: "Wooden Engravings", image: categoryWooden },
  { name: "Artistic Gifts", image: categoryArtistic },
  { name: "Home Decor", image: categoryHomeDecor },
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-heading text-lg md:text-xl text-warm-white">{cat.name}</h3>
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
