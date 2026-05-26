import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";

const OFFERS = [
  {
    id: 1,
    origin: "London",
    originCode: "LHR",
    destination: "New York",
    destinationCode: "JFK",
    price: "£425",
    type: "Economy Light",
    image: "/images/dest-ny.png",
    label: "New York (JFK)",
  },
  {
    id: 2,
    origin: "London",
    originCode: "LHR",
    destination: "Dubai",
    destinationCode: "DXB",
    price: "£489",
    type: "Economy Light",
    image: "/images/dest-dubai.png",
    label: "Dubai (DXB)",
  },
  {
    id: 3,
    origin: "London",
    originCode: "LHR",
    destination: "Los Angeles",
    destinationCode: "LAX",
    price: "£512",
    type: "Economy Light",
    image: "/images/dest-la.png",
    label: "Los Angeles (LAX)",
  },
  {
    id: 4,
    origin: "London",
    originCode: "LHR",
    destination: "Barbados",
    destinationCode: "BGI",
    price: "£580",
    type: "Economy Classic",
    image: "/images/dest-barbados.png",
    label: "Barbados (BGI)",
  },
];

export default function OffersSection() {
  const [, setLocation] = useLocation();

  function handleOfferClick(offer: typeof OFFERS[0]) {
    const params = new URLSearchParams();
    params.set("origin", offer.originCode);
    params.set("destination", offer.destinationCode);
    params.set("cabinClass", "economy");
    setLocation(`/flights?${params.toString()}`);
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#030C16] mb-2">Exclusive flight offers</h2>
            <p className="text-gray-600 text-lg">Hand-picked deals for your next adventure</p>
          </div>
          <Link href="/flights" className="hidden md:flex items-center gap-2 text-[#A70D2E] font-bold hover:text-[#5B056A] transition-colors group">
            See all flights
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 lg:mx-0 lg:px-0 gap-6 snap-x snap-mandatory hide-scrollbar">
          {OFFERS.map((offer, index) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={offer.id}
              onClick={() => handleOfferClick(offer)}
              className="flex-none w-[300px] md:w-[350px] snap-start group cursor-pointer"
            >
              <div className="rounded-xl overflow-hidden mb-4 relative aspect-[4/3]">
                <img
                  src={offer.image}
                  alt={offer.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-[#A70D2E] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    View flights <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 group-hover:shadow-lg group-hover:border-[#A70D2E]/20 transition-all duration-300">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider">
                  <span>{offer.origin}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{offer.destination}</span>
                </div>
                <h3 className="text-xl font-bold text-[#030C16] mb-1">{offer.label}</h3>
                <p className="text-gray-500 text-sm mb-4">{offer.type}</p>
                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Return from</span>
                  <span className="text-2xl font-bold text-[#A70D2E]">{offer.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 md:hidden">
          <Link href="/flights" className="flex items-center justify-center gap-2 text-[#A70D2E] font-bold hover:text-[#5B056A] transition-colors py-3 border border-[#A70D2E] rounded-full">
            See all flights
          </Link>
        </div>
      </div>
    </section>
  );
}
