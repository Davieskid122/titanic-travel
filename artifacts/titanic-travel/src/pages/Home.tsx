import Header from "@/components/Header";
import HeroBooking from "@/components/HeroBooking";
import OffersSection from "@/components/OffersSection";
import DestinationsSection from "@/components/DestinationsSection";
import CabinClasses from "@/components/CabinClasses";
import ExploreSection from "@/components/ExploreSection";
import FlyingClub from "@/components/FlyingClub";
import Footer from "@/components/Footer";
import DealPopup from "@/components/DealPopup";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <DealPopup />
      <Header />
      <main>
        <HeroBooking />
        <OffersSection />
        <DestinationsSection />
        <CabinClasses />
        <ExploreSection />
        <FlyingClub />
      </main>
      <Footer />
    </div>
  );
}