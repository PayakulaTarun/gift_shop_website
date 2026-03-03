import { motion } from "framer-motion";
import { Cake, Heart, Gem, HeartHandshake, PartyPopper } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const occasions = [
  { icon: Cake, name: "Birthday" },
  { icon: Heart, name: "Anniversary" },
  { icon: Gem, name: "Wedding" },
  { icon: HeartHandshake, name: "Valentine's" },
  { icon: PartyPopper, name: "Festival Gifts" },
];

const OccasionsSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="occasions" className="section-soft-rose py-24" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-14 scroll-reveal">
          <p className="font-ui text-gold text-sm tracking-[0.2em] uppercase mb-3">Find The Perfect Gift</p>
          <h2 className="font-heading text-3xl md:text-5xl text-luxury-black">Gifts by Occasion</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-5 md:gap-8">
          {occasions.map((occ, i) => (
            <div key={occ.name} className="scroll-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                className="bg-warm-white w-36 md:w-44 rounded-2xl p-6 text-center shadow-soft cursor-pointer border border-border hover:border-gold/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <occ.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-ui text-sm font-medium text-luxury-black">{occ.name}</h3>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OccasionsSection;
