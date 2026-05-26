import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CABINS = [
  {
    id: "upper",
    name: "Upper Class",
    description: "The ultimate way to travel. Your own private suite, fully flat bed, and exclusive social spaces.",
    features: ["Fully flat bed", "Exclusive social spaces", "Premium dining", "Lounge access", "Priority boarding"],
    image: "/images/cabin-upper.png"
  },
  {
    id: "premium",
    name: "Premium",
    description: "Stretch out with more space, a wider seat, and enhanced dining in a dedicated cabin.",
    features: ["Wider leather seats", "Extra legroom", "Premium dining", "Priority boarding", "Extra baggage"],
    image: "/images/cabin-premium.png"
  },
  {
    id: "economy",
    name: "Economy",
    description: "A comfortable journey with inclusive food and drinks, endless entertainment, and great service.",
    features: ["Comfortable seats", "Inclusive meals & drinks", "Inflight entertainment", "USB power", "Friendly service"],
    image: "/images/cabin-economy.png"
  }
];

export default function CabinClasses() {
  const [activeCabin, setActiveCabin] = useState(CABINS[0]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#030C16] mb-4">Our cabin classes</h2>
          <p className="text-gray-600 text-lg">However you choose to fly, expect brilliant service, food and entertainment as standard.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="flex flex-col gap-4 mb-8">
              {CABINS.map((cabin) => (
                <button
                  key={cabin.id}
                  onClick={() => setActiveCabin(cabin)}
                  className={`text-left p-5 rounded-xl transition-all duration-300 ${
                    activeCabin.id === cabin.id 
                      ? 'bg-[#A70D2E] text-white shadow-xl scale-105' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-2 ${activeCabin.id === cabin.id ? 'text-white' : 'text-[#030C16]'}`}>
                    {cabin.name}
                  </h3>
                  <p className={`text-sm ${activeCabin.id === cabin.id ? 'text-white/90' : 'text-gray-500'}`}>
                    {cabin.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h4 className="font-bold text-[#030C16] mb-4 uppercase tracking-wider text-sm">Experience {activeCabin.name}</h4>
              <ul className="space-y-3 mb-6">
                {activeCabin.features.map((feature, idx) => (
                  <motion.li 
                    key={`${activeCabin.id}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 text-sm text-gray-600 font-medium"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#5B056A]/10 flex items-center justify-center text-[#5B056A]">
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <Button variant="outline" className="w-full border-[#A70D2E] text-[#A70D2E] hover:bg-[#A70D2E] hover:text-white rounded-full font-bold">
                Explore {activeCabin.name}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div 
              key={activeCabin.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[16/10] shadow-2xl relative"
            >
              <img 
                src={activeCabin.image} 
                alt={activeCabin.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
