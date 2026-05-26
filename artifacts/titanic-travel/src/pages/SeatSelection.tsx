import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetBookingByReference } from "@workspace/api-client-react";
import { Armchair, Search, Loader2, ArrowRight, CheckCircle, Star, Wind, Wifi } from "lucide-react";
import { motion } from "framer-motion";

const CABIN_PERKS: Record<string, { label: string; perks: string[]; color: string }> = {
  economy: {
    label: "Economy",
    color: "border-blue-200 bg-blue-50",
    perks: ["Standard seat pitch", "Overhead bin storage", "In-flight entertainment"],
  },
  premium: {
    label: "Premium Economy",
    color: "border-purple-200 bg-purple-50",
    perks: ["Extra legroom", "Priority boarding", "Enhanced meal service", "Wider recline"],
  },
  upper: {
    label: "Upper Class",
    color: "border-amber-200 bg-amber-50",
    perks: ["Fully flat bed", "Private suite", "À la carte dining", "Dedicated check-in", "Lounge access"],
  },
};

export default function SeatSelection() {
  const [, setLocation] = useLocation();
  const [ref, setRef] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const { data: booking, isLoading, isError } = useGetBookingByReference(bookingRef, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { enabled: !!bookingRef } as any,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = ref.trim().toUpperCase();
    if (!cleaned) return;
    setBookingRef(cleaned);
    setSubmitted(true);
  }

  const cabin = booking?.cabinClass as keyof typeof CABIN_PERKS | undefined;
  const cabinInfo = cabin ? CABIN_PERKS[cabin] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#030C16] to-[#5B056A] py-14">
          <div className="container mx-auto px-4 text-center">
            <Armchair className="w-12 h-12 text-white/70 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-3">Seat Selection</h1>
            <p className="text-white/80 text-lg mb-8">Choose your perfect seat using your booking reference</p>

            <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={ref}
                  onChange={e => setRef(e.target.value)}
                  placeholder="Booking reference (e.g. TT-ABC123)"
                  className="pl-12 h-12 rounded-full bg-white border-0 text-base shadow-lg uppercase"
                />
              </div>
              <Button type="submit" className="h-12 px-8 rounded-full bg-[#A70D2E] hover:bg-[#8A0A26] text-white font-bold shadow-lg">
                Find
              </Button>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-3xl">
          {!submitted && (
            <>
              <div className="text-center py-8 text-gray-400 mb-10">
                <p className="text-sm">Enter your booking reference to view and select your seats.</p>
                <p className="text-sm mt-1">You can find your reference in your confirmation email.</p>
              </div>

              {/* Cabin class options */}
              <h2 className="text-xl font-bold text-[#030C16] mb-5">Available seat types</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(CABIN_PERKS).map(([key, info]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl border-2 p-5 ${info.color}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Armchair className="w-5 h-5 text-[#030C16]" />
                      <h3 className="font-bold text-[#030C16]">{info.label}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {info.perks.map(p => (
                        <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 items-center">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#A70D2E]/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-[#A70D2E]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#030C16] mb-1">Don't have a booking yet?</p>
                    <p className="text-sm text-gray-600">Browse available flights and book your seat today.</p>
                  </div>
                </div>
                <Button onClick={() => setLocation("/flights")} className="bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full px-7 font-bold flex-shrink-0 flex items-center gap-2">
                  Find flights <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}

          {submitted && isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-[#A70D2E] mb-4" />
              <p className="text-gray-500 text-lg">Looking up your booking…</p>
            </div>
          )}

          {submitted && !isLoading && (isError || !booking) && (
            <div className="text-center py-16 text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-medium text-gray-700">Booking not found</p>
              <p className="text-sm mt-2">Please check your reference and try again.</p>
              <Button variant="outline" onClick={() => { setSubmitted(false); setRef(""); setBookingRef(""); }} className="mt-6 rounded-full border-[#A70D2E] text-[#A70D2E]">
                Try again
              </Button>
            </div>
          )}

          {submitted && !isLoading && booking && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Booking found */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-bold text-[#030C16]">Booking found: {booking.reference}</p>
                    <p className="text-sm text-gray-500">Status: <span className="font-medium capitalize">{booking.status}</span></p>
                  </div>
                </div>
                {cabinInfo && (
                  <div className={`rounded-xl border-2 p-4 ${cabinInfo.color}`}>
                    <p className="font-semibold text-sm text-[#030C16] mb-2">{cabinInfo.label} — included perks</p>
                    <ul className="space-y-1">
                      {cabinInfo.perks.map(p => (
                        <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Seat map info */}
              <div className="bg-gradient-to-br from-[#030C16] to-[#5B056A] rounded-2xl p-8 text-center text-white">
                <div className="flex justify-center gap-6 mb-6 opacity-60">
                  <Armchair className="w-8 h-8" />
                  <Wifi className="w-8 h-8" />
                  <Wind className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Interactive seat map</h3>
                <p className="text-white/70 text-sm mb-6">
                  Seat selection for your flight opens 30 days before departure.
                  You'll receive an email with a direct link when it becomes available.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => setLocation(`/booking/${booking.reference}`)}
                    className="bg-white text-[#030C16] hover:bg-gray-100 rounded-full font-bold"
                  >
                    View booking details
                  </Button>
                  <Button
                    onClick={() => setLocation("/manage")}
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 rounded-full font-bold"
                  >
                    Manage booking
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
