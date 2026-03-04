import { motion } from "framer-motion";
import heroGifts from "@/assets/hero-gifts.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="section-luxury-black relative min-h-screen flex items-center overflow-hidden grain-overlay">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-luxury-black-light to-luxury-black opacity-90" />

      <div className="container relative z-10 mx-auto px-6 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-ui text-gold text-sm tracking-[0.3em] uppercase mb-6"
            >
              Personalized Gifts
            </motion.p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading leading-[1.1] mb-6">
              Turn Your Memories Into{" "}
              <span className="text-gradient-gold italic">Timeless Gifts</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-warm-white/70 max-w-lg mb-10 leading-relaxed">
              Personalized gifts crafted with love & precision. Make every moment unforgettable.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 32px -8px hsl(36 35% 60% / 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="btn-gold text-base"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Customize Your Gift
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline-gold text-base"
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Gifts
              </motion.button>
            </div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              <img
                src={heroGifts}
                alt="Premium personalized gifts - LED frame, crystal, and custom mug"
                className="w-full rounded-2xl animate-float"
              />
              {/* Gold glow behind image */}
              <div className="absolute -inset-4 bg-gold/5 rounded-3xl blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gold/40 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
