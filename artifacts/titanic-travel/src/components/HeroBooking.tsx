import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, ArrowLeftRight, ChevronDown, Plane, Palmtree, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const CABIN_OPTIONS = [
  { value: "economy", label: "Economy" },
  { value: "premium", label: "Premium" },
  { value: "upper", label: "Upper Class" },
];

type BookingTab = "flight" | "holiday";

interface HeroBookingProps {
  defaultTab?: BookingTab;
}

export default function HeroBooking({ defaultTab = "flight" }: HeroBookingProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<BookingTab>(defaultTab);
  const [tripType, setTripType] = useState<"return" | "oneway">("return");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabinClass, setCabinClass] = useState("economy");
  const [passengers, setPassengers] = useState(1);
  const [showPassengers, setShowPassengers] = useState(false);
  const [duration, setDuration] = useState("7");

  function swapLocations() {
    setFrom(to);
    setTo(from);
  }

  function handleFlightSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("origin", from.trim());
    if (to.trim()) params.set("destination", to.trim());
    if (departDate) params.set("departDate", departDate);
    if (returnDate && tripType === "return") params.set("returnDate", returnDate);
    params.set("cabinClass", cabinClass);
    params.set("passengers", String(passengers));
    params.set("tripType", tripType);
    setLocation(`/flights?${params.toString()}`);
  }

  function handleHolidaySearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("origin", from.trim());
    if (to.trim()) params.set("destination", to.trim());
    if (departDate) params.set("departDate", departDate);
    params.set("duration", duration);
    params.set("cabinClass", cabinClass);
    params.set("passengers", String(passengers));
    setLocation(`/holidays?${params.toString()}`);
  }

  const cabinLabel = CABIN_OPTIONS.find((c) => c.value === cabinClass)?.label ?? "Economy";

  return (
    <section className="relative min-h-[520px] md:min-h-[580px] flex items-center pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.png"
          alt="Airplane soaring over ocean"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Tab bar */}
          <div className="bg-[#A70D2E] px-4 md:px-8 pt-4 pb-0">
            <div className="flex items-center gap-1 mb-0">
              <button
                type="button"
                onClick={() => setActiveTab("flight")}
                className={`flex items-center gap-1.5 px-3 md:px-5 py-3 text-xs md:text-sm font-semibold rounded-t-xl transition-colors ${
                  activeTab === "flight"
                    ? "bg-white text-[#A70D2E]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Plane className="w-4 h-4 flex-shrink-0" />
                <span>Book a Flight</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("holiday")}
                className={`flex items-center gap-1.5 px-3 md:px-5 py-3 text-xs md:text-sm font-semibold rounded-t-xl transition-colors ${
                  activeTab === "holiday"
                    ? "bg-white text-[#A70D2E]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Palmtree className="w-4 h-4 flex-shrink-0" />
                <span>Book a Holiday</span>
              </button>
            </div>
          </div>

          {/* Flight form */}
          {activeTab === "flight" && (
            <form onSubmit={handleFlightSearch} className="p-4 md:p-8">
              {/* Trip type sub-tabs */}
              <div className="flex gap-2 mb-4 md:mb-5">
                {(["return", "oneway"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTripType(type)}
                    className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold border transition-colors ${
                      tripType === type
                        ? "bg-[#A70D2E] text-white border-[#A70D2E]"
                        : "border-gray-300 text-gray-600 hover:border-[#A70D2E] hover:text-[#A70D2E]"
                    }`}
                  >
                    {type === "return" ? "Return" : "One way"}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {/* From / To row — stacks on mobile, side-by-side on md+ */}
                <div className="relative flex flex-col sm:flex-row border border-gray-200 rounded-xl overflow-visible">
                  <div className="flex-1 p-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">From</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                      <input
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="City or airport"
                        className="w-full text-sm md:text-base font-medium text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
                      />
                    </div>
                  </div>

                  {/* Swap button — shown between fields */}
                  <button
                    type="button"
                    onClick={swapLocations}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-[#A70D2E] hover:text-white hover:border-[#A70D2E] transition-colors group hidden sm:flex"
                    title="Swap"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#A70D2E] group-hover:text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={swapLocations}
                    className="sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-[#A70D2E] hover:border-[#A70D2E] transition-colors"
                    title="Swap"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-[#A70D2E]" />
                  </button>

                  <div className="flex-1 p-3">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">To</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="City or airport"
                        className="w-full text-sm md:text-base font-medium text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates + Passengers row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Depart */}
                  <div className="border border-gray-200 rounded-xl p-3">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Depart</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full text-sm md:text-base font-medium text-gray-800 bg-transparent outline-none border-none"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  {/* Return */}
                  {tripType === "return" && (
                    <div className="border border-gray-200 rounded-xl p-3">
                      <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Return</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full text-sm md:text-base font-medium text-gray-800 bg-transparent outline-none border-none"
                          min={departDate || new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                  )}

                  {/* Passengers & Class */}
                  <div className={`relative ${tripType === "oneway" ? "sm:col-span-2 md:col-span-1" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setShowPassengers(!showPassengers)}
                      className="w-full h-full border border-gray-200 rounded-xl p-3 text-left hover:border-[#A70D2E] transition-colors"
                    >
                      <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1 pointer-events-none">Passengers & Class</label>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#A70D2E]" />
                          <span className="text-sm md:text-base font-medium text-gray-800 truncate">
                            {passengers} Adult{passengers !== 1 ? "s" : ""}, {cabinLabel}
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showPassengers ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {showPassengers && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5 space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm text-gray-800">Adults</p>
                            <p className="text-xs text-gray-400">16+ years</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-[#A70D2E] hover:text-[#A70D2E] transition-colors">
                              −
                            </button>
                            <span className="w-6 text-center font-bold text-gray-800">{passengers}</span>
                            <button type="button" onClick={() => setPassengers(Math.min(9, passengers + 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-[#A70D2E] hover:text-[#A70D2E] transition-colors">
                              +
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800 mb-2">Cabin class</p>
                          <div className="space-y-1">
                            {CABIN_OPTIONS.map((opt) => (
                              <button key={opt.value} type="button"
                                onClick={() => setCabinClass(opt.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  cabinClass === opt.value
                                    ? "bg-[#A70D2E] text-white"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Button type="button" onClick={() => setShowPassengers(false)}
                          className="w-full bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full font-bold">
                          Done
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-5 flex justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#A70D2E] hover:bg-[#8A0A26] text-white px-10 py-5 text-base rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Search flights
                </Button>
              </div>
            </form>
          )}

          {/* Holiday form */}
          {activeTab === "holiday" && (
            <form onSubmit={handleHolidaySearch} className="p-4 md:p-8">
              <p className="text-sm text-gray-500 mb-4 md:mb-5 font-medium">Flight + hotel packages to our most popular destinations</p>

              <div className="flex flex-col gap-3">
                {/* From / To */}
                <div className="flex flex-col sm:flex-row border border-gray-200 rounded-xl overflow-visible">
                  <div className="flex-1 p-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Flying from</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                      <input
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="City or airport"
                        className="w-full text-sm md:text-base font-medium text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-3">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Going to</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="City or destination"
                        className="w-full text-sm md:text-base font-medium text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Depart + Duration + Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-gray-200 rounded-xl p-3">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Depart</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full text-sm md:text-base font-medium text-gray-800 bg-transparent outline-none border-none"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-3">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Duration</label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="h-7 border-0 p-0 shadow-none font-medium text-sm md:text-base text-gray-800 focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["3","5","7","10","14","21"].map(d => (
                          <SelectItem key={d} value={d}>{d} nights</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassengers(!showPassengers)}
                      className="w-full h-full border border-gray-200 rounded-xl p-3 text-left hover:border-[#A70D2E] transition-colors"
                    >
                      <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1 pointer-events-none">Guests</label>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#A70D2E]" />
                          <span className="text-sm md:text-base font-medium text-gray-800">{passengers} Guest{passengers !== 1 ? "s" : ""}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPassengers ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {showPassengers && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5 space-y-5 min-w-[220px]">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm text-gray-800">Guests</p>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-[#A70D2E] hover:text-[#A70D2E] transition-colors">
                              −
                            </button>
                            <span className="w-6 text-center font-bold text-gray-800">{passengers}</span>
                            <button type="button" onClick={() => setPassengers(Math.min(9, passengers + 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-[#A70D2E] hover:text-[#A70D2E] transition-colors">
                              +
                            </button>
                          </div>
                        </div>
                        <Button type="button" onClick={() => setShowPassengers(false)}
                          className="w-full bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full font-bold">
                          Done
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-5 flex justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#5B056A] hover:bg-[#4a0458] text-white px-10 py-5 text-base rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Search holidays
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
