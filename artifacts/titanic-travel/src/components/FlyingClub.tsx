import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function FlyingClub() {
  return (
    <section className="relative py-24 bg-[#5B056A] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the Flying Club</h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Earn miles on flights, everyday spending, and with our partners. Spend them on reward flights, upgrades, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="w-full sm:w-auto bg-white text-[#5B056A] hover:bg-gray-100 hover:text-[#5B056A] px-8 py-6 text-lg rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
                Join now for free
              </Button>
              <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg rounded-full font-bold transition-colors">
                Learn more
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
