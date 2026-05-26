import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const ARTICLES = [
  {
    id: 1,
    title: "The Ultimate Guide to Barbados",
    category: "Destination guide",
    image: "/images/explore-1.png",
    link: "/flights?destination=BGI&cabinClass=economy"
  },
  {
    id: 2,
    title: "10 hidden gems in Los Angeles",
    category: "Travel tips",
    image: "/images/explore-2.png",
    link: "/flights?destination=LAX&cabinClass=economy"
  },
  {
    id: 3,
    title: "How to spend 48 hours in Dubai",
    category: "Itinerary",
    image: "/images/explore-3.png",
    link: "/flights?destination=DXB&cabinClass=economy"
  }
];

export default function ExploreSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#030C16] mb-2">Travel inspiration</h2>
            <p className="text-gray-600 text-lg">Ideas and guides for your next getaway</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={article.id}
              className="group cursor-pointer"
            >
              <div className="rounded-xl overflow-hidden mb-4 relative aspect-[4/3]">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </div>
              <div className="px-2">
                <span className="text-sm font-bold text-[#A70D2E] uppercase tracking-wider mb-2 block">{article.category}</span>
                <h3 className="text-2xl font-bold text-[#030C16] mb-3 group-hover:text-[#5B056A] transition-colors line-clamp-2">{article.title}</h3>
                <Link href={article.link} className="inline-flex items-center gap-2 text-[#030C16] font-bold group-hover:text-[#5B056A] transition-colors">
                  Read more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
