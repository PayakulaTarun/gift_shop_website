import { motion } from "framer-motion";
import { Package, Upload, PenTool, Eye } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { icon: Package, title: "Choose Product", desc: "Browse our premium collection" },
  { icon: Upload, title: "Upload Photo", desc: "Share your favorite memory" },
  { icon: PenTool, title: "Customize Design", desc: "Add text, adjust layout" },
  { icon: Eye, title: "Preview & Order", desc: "See it before you buy" },
];

const HowItWorksSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="how-it-works" className="section-luxury-black py-24 grain-overlay relative" ref={ref}>
      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="font-ui text-gold text-sm tracking-[0.2em] uppercase mb-3">Simple Process</p>
          <h2 className="font-heading text-3xl md:text-5xl text-warm-white">How Customization Works</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          {steps.map((step, i) => (
            <div key={step.title} className="scroll-reveal" style={{ transitionDelay: `${i * 200}ms` }}>
              <motion.div whileHover={{ y: -4 }} className="text-center relative">
                <div className="w-20 h-20 rounded-full border-2 border-gold/30 flex items-center justify-center mx-auto mb-6 bg-luxury-black relative z-10">
                  <step.icon className="w-8 h-8 text-gold" />
                </div>
                <span className="font-ui text-gold/40 text-xs absolute top-0 right-1/2 translate-x-1/2 -translate-y-2">
                  0{i + 1}
                </span>
                <h3 className="font-heading text-lg text-warm-white mb-2">{step.title}</h3>
                <p className="font-body text-sm text-warm-white/50">{step.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
