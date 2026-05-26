import { motion } from "framer-motion";
import { useLocation } from "wouter";

const DESTINATIONS = [
  { name: "New York", price: "425", image: "/images/dest-ny.png", featured: true },
  { name: "Los Angeles", price: "512", image: "/images/dest-la.png", featured: false },
  { name: "Miami", price: "450", image: "/images/dest-miami.png", featured: false },
  { name: "Dubai", price: "489", image: "/images/dest-dubai.png", featured: false },
  { name: "Johannesburg", price: "620", image: "/images/dest-johannesburg.png", featured: false },
  { name: "Mumbai", price: "550", image: "/images/dest-mumbai.png", featured: false },
  { name: "Hong Kong", price: "680", image: "/images/dest-hongkong.png", featured: false },
  { name: "Barbados", price: "580", image: "/images/dest-barbados.png", featured: false },
];

export default function DestinationsSection() {
  const [, setLocation] = useLocation();

  const destCodes: Record<string, string> = {
    "New York": "JFK",
    "Los Angeles": "LAX",
    "Miami": "MIA",
    "Dubai": "DXB",
    "Johannesburg": "JNB",
    "Mumbai": "BOM",
    "Hong Kong": "HKG",
    "Barbados": "BGI",
  };

  function handleClick(dest: typeof DESTINATIONS[0]) {
    const code = destCodes[dest.name];
    if (code) {
      const params = new URLSearchParams({ destination: code, cabinClass: "economy" });
      setLocation(`/flights?${params.toString()}`);
    }
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#030C16] mb-2 text-center">Popular destinations</h2>
        <p className="text-gray-600 text-base md:text-lg text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          Explore our most loved cities and beaches around the world. Where will you go next?
        </p>

        {/* Mobile: 2-col grid. Tablet: 2-col. Desktop: 4-col mosaic */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {DESTINATIONS.map((dest, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              key={dest.name}
              onClick={() => handleClick(dest)}
              className={`relative group overflow-hidden rounded-xl cursor-pointer shadow-sm
                ${dest.featured ? "col-span-2 row-span-2 h-[280px] md:h-[380px] lg:h-auto lg:aspect-[4/3]" : "h-[160px] md:h-[200px] lg:h-[180px]"}
                lg:col-span-1
                ${dest.name === "New York" ? "lg:col-span-2 lg:row-span-2" : ""}
                ${dest.name === "Dubai" ? "lg:col-span-2" : ""}
                ${dest.name === "Johannesburg" ? "lg:row-span-2" : ""}
              `}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                <h3 className="text-white text-lg md:text-2xl font-bold">{dest.name}</h3>
                <p className="text-white/90 text-sm font-medium hidden group-hover:block mt-0.5">
                  Return from <span className="font-bold">£{dest.price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
