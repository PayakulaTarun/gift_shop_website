import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FinalCTASection = () => {
  const ref = useScrollReveal();

  return (
    <section id="final-cta" className="section-luxury-black py-28 grain-overlay relative" ref={ref}>
      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="scroll-reveal">
          <p className="font-ui text-gold text-sm tracking-[0.2em] uppercase mb-4">Don't Wait</p>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-warm-white mb-6 max-w-3xl mx-auto leading-tight">
            Create something{" "}
            <span className="text-gradient-gold italic">unforgettable</span> today
          </h2>
          <p className="font-body text-warm-white/60 text-lg max-w-md mx-auto mb-10">
            Your memories deserve to be cherished forever
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="https://wa.me/919951710569"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-coral inline-flex items-center gap-2 text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px -8px hsl(36 35% 60% / 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="btn-gold text-base"
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Customizing
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
