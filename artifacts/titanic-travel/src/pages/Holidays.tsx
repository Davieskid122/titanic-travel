import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBooking from "@/components/HeroBooking";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plane, Hotel, Star, Clock, ChevronRight, Sun, Umbrella, Camera } from "lucide-react";

const PACKAGES = [
  {
    id: 1,
    destination: "New York City Break",
    destinationCode: "JFK",
    country: "United States",
    image: "/images/dest-ny.png",
    nights: 7,
    priceFrom: 799,
    rating: 4.8,
    reviews: 1240,
    highlights: ["5-star Times Square hotel", "Return flights included", "City sightseeing tour"],
    tag: "Best Seller",
    tagColor: "bg-[#A70D2E]",
    flightDest: "JFK",
  },
  {
    id: 2,
    destination: "Dubai Luxury Escape",
    destinationCode: "DXB",
    country: "United Arab Emirates",
    image: "/images/dest-dubai.png",
    nights: 10,
    priceFrom: 1299,
    rating: 4.9,
    reviews: 980,
    highlights: ["Burj Al Arab upgrade available", "Desert safari included", "Infinity pool resort"],
    tag: "Luxury",
    tagColor: "bg-[#5B056A]",
    flightDest: "DXB",
  },
  {
    id: 3,
    destination: "Los Angeles & California",
    destinationCode: "LAX",
    country: "United States",
    image: "/images/dest-la.png",
    nights: 14,
    priceFrom: 1499,
    rating: 4.7,
    reviews: 756,
    highlights: ["Hollywood & Beverly Hills tour", "Pacific Coast Highway road trip", "Universal Studios tickets"],
    tag: "Summer Special",
    tagColor: "bg-orange-500",
    flightDest: "LAX",
  },
  {
    id: 4,
    destination: "Barbados Beach Retreat",
    destinationCode: "BGI",
    country: "Barbados",
    image: "/images/dest-barbados.png",
    nights: 7,
    priceFrom: 999,
    rating: 4.9,
    reviews: 2100,
    highlights: ["Adults-only beachfront resort", "All-inclusive available", "Snorkelling & water sports"],
    tag: "Beach Paradise",
    tagColor: "bg-teal-600",
    flightDest: "BGI",
  },
  {
    id: 5,
    destination: "Miami & South Beach",
    destinationCode: "MIA",
    country: "United States",
    image: "/images/dest-miami.png",
    nights: 5,
    priceFrom: 849,
    rating: 4.6,
    reviews: 630,
    highlights: ["Ocean Drive boutique hotel", "Art Deco architecture tour", "Everglades day trip"],
    tag: "City & Beach",
    tagColor: "bg-blue-600",
    flightDest: "MIA",
  },
  {
    id: 6,
    destination: "Hong Kong Explorer",
    destinationCode: "HKG",
    country: "Hong Kong",
    image: "/images/dest-hongkong.png",
    nights: 10,
    priceFrom: 1199,
    rating: 4.8,
    reviews: 445,
    highlights: ["Harbour-view hotel included", "Day trip to Macau", "Street food & culture tour"],
    tag: "Far East",
    tagColor: "bg-red-700",
    flightDest: "HKG",
  },
  {
    id: 7,
    destination: "Mumbai Cultural Journey",
    destinationCode: "BOM",
    country: "India",
    image: "/images/dest-mumbai.png",
    nights: 10,
    priceFrom: 1099,
    rating: 4.7,
    reviews: 310,
    highlights: ["Heritage hotel stay", "Bollywood studio tour", "Taj Mahal day excursion"],
    tag: "Culture",
    tagColor: "bg-amber-600",
    flightDest: "BOM",
  },
  {
    id: 8,
    destination: "Johannesburg Safari",
    destinationCode: "JNB",
    country: "South Africa",
    image: "/images/dest-johannesburg.png",
    nights: 14,
    priceFrom: 2199,
    rating: 5.0,
    reviews: 218,
    highlights: ["Big Five safari included", "Luxury lodge accommodation", "Cape Town extension available"],
    tag: "Adventure",
    tagColor: "bg-green-700",
    flightDest: "JNB",
  },
];

const INCLUDES = [
  { icon: Plane, label: "Return flights" },
  { icon: Hotel, label: "Hotel accommodation" },
  { icon: Sun, label: "Transfers included" },
  { icon: Umbrella, label: "ATOL protected" },
];

export default function Holidays() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "beach" | "city" | "luxury" | "adventure">("all");

  const searchDest = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("destination")?.toLowerCase() ?? ""
    : "";

  const FILTERS = [
    { value: "all", label: "All holidays" },
    { value: "beach", label: "Beach" },
    { value: "city", label: "City breaks" },
    { value: "luxury", label: "Luxury" },
    { value: "adventure", label: "Adventure" },
  ];

  const filterMap: Record<string, number[]> = {
    beach: [4, 5],
    city: [1, 3, 5, 6, 7],
    luxury: [2, 4, 8],
    adventure: [7, 8],
  };

  const byFilter = filter === "all" ? PACKAGES : PACKAGES.filter(p => filterMap[filter]?.includes(p.id));
  const filtered = searchDest
    ? byFilter.filter(p =>
        p.destination.toLowerCase().includes(searchDest) ||
        p.destinationCode.toLowerCase().includes(searchDest) ||
        p.country.toLowerCase().includes(searchDest)
      )
    : byFilter;

  function handleBook(pkg: typeof PACKAGES[0]) {
    const params = new URLSearchParams();
    params.set("destination", pkg.flightDest);
    params.set("cabinClass", "economy");
    setLocation(`/flights?${params.toString()}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <HeroBooking defaultTab="holiday" />

        {/* What's included bar */}
        <div className="bg-[#A70D2E] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {INCLUDES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white text-sm font-semibold">
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#030C16] mb-3">Holiday Packages</h1>
            <p className="text-gray-600 text-lg">All-inclusive flight and hotel packages to our most popular destinations</p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as typeof filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  filter === f.value
                    ? "bg-[#A70D2E] text-white border-[#A70D2E]"
                    : "border-gray-300 text-gray-600 hover:border-[#A70D2E] hover:text-[#A70D2E]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Package grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400">
                <Plane className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">No packages found</p>
                <p className="text-sm mt-2">Try a different destination or clear your search</p>
              </div>
            ) : filtered.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`${pkg.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {pkg.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-bold text-lg leading-tight">{pkg.destination}</p>
                    <p className="text-white/80 text-sm">{pkg.country}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(pkg.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{pkg.rating}</span>
                    <span className="text-xs text-gray-400">({pkg.reviews.toLocaleString()} reviews)</span>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {pkg.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A70D2E] mt-1.5 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="border-t border-gray-100 pt-4 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{pkg.nights} nights</span>
                        <span>·</span>
                        <Plane className="w-3.5 h-3.5" />
                        <span>Flights included</span>
                      </div>
                      <p className="text-xs text-gray-400">Per person from</p>
                      <p className="text-2xl font-bold text-[#A70D2E]">£{pkg.priceFrom.toLocaleString()}</p>
                    </div>
                    <Button
                      onClick={() => handleBook(pkg)}
                      className="bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full px-5 font-bold flex items-center gap-1.5 text-sm"
                    >
                      Book now <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info banner */}
          <div className="mt-12 bg-[#5B056A]/5 border border-[#5B056A]/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
            <Camera className="w-12 h-12 text-[#5B056A] flex-shrink-0" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-xl text-[#030C16] mb-1">Can't find what you're looking for?</h3>
              <p className="text-gray-600">Browse all our available flights and build your own perfect holiday package.</p>
            </div>
            <Button
              onClick={() => setLocation("/flights")}
              className="bg-[#5B056A] hover:bg-[#4a0458] text-white rounded-full px-8 font-bold flex-shrink-0"
            >
              Browse all flights
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}