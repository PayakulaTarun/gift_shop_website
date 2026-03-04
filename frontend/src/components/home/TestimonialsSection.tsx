import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  { name: "Priya Sharma", text: "The LED frame was absolutely stunning! My husband loved his birthday gift. The quality exceeded all expectations.", stars: 5 },
  { name: "Rahul Mehta", text: "Ordered a crystal engraving for our anniversary. The level of detail is incredible. Will definitely order again!", stars: 5 },
  { name: "Anjali Patel", text: "Best gift shop I've found. The customization process was so easy and the result was perfect. Highly recommend!", stars: 5 },
  { name: "Vikram Singh", text: "Got a wooden engraving for my parents. They were moved to tears. Such a thoughtful and beautifully crafted piece.", stars: 5 },
];

const TestimonialsSection = () => {
  const ref = useScrollReveal();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="section-warm-white py-24" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-14 scroll-reveal">
          <p className="font-ui text-gold text-sm tracking-[0.2em] uppercase mb-3">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-5xl text-luxury-black">Customer Love</h2>
        </div>

        <div className="max-w-2xl mx-auto text-center scroll-reveal">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].stars }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-body text-lg md:text-xl text-luxury-black/80 italic leading-relaxed mb-6">
                "{testimonials[current].text}"
              </p>
              <p className="font-ui text-sm font-semibold text-gold">
                {testimonials[current].name}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-gold w-6" : "bg-gold/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
