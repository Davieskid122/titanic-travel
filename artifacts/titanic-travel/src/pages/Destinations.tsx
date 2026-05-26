import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DestinationsSection from "@/components/DestinationsSection";

export default function Destinations() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-[#A70D2E] py-16 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Where we fly</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">Discover our network of incredible destinations around the world.</p>
      </div>
      <main className="flex-1">
        <DestinationsSection />
      </main>
      <Footer />
    </div>
  );
}
