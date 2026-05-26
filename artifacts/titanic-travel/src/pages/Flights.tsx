import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchFlights } from "@workspace/api-client-react";
import { MapPin, Calendar, Clock, Plane, ChevronRight, Loader2, ArrowLeftRight, Zap, Star, TrendingDown } from "lucide-react";

const CABIN_LABELS: Record<string, string> = { economy: "Economy", premium: "Premium", upper: "Upper Class" };

function getSearchParam(search: string, key: string): string {
  try {
    return new URLSearchParams(search).get(key) ?? "";
  } catch {
    return "";
  }
}

type SortMode = "cheapest" | "best" | "quickest";

export default function Flights() {
  const [location, setLocation] = useLocation();
  const search = typeof window !== "undefined" ? window.location.search : "";

  const [origin, setOrigin] = useState(() => getSearchParam(search, "origin"));
  const [destination, setDestination] = useState(() => getSearchParam(search, "destination"));
  const [departDate, setDepartDate] = useState(() => getSearchParam(search, "departDate"));
  const [cabinClass, setCabinClass] = useState(() => getSearchParam(search, "cabinClass") || "economy");
  const [sortMode, setSortMode] = useState<SortMode>("best");
  const [searchParams, setSearchParams] = useState<{ origin: string; destination: string; departDate: string; cabinClass: string }>(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    return {
      origin: params.get("origin") ?? "",
      destination: params.get("destination") ?? "",
      departDate: params.get("departDate") ?? "",
      cabinClass: params.get("cabinClass") ?? "economy",
    };
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrigin(params.get("origin") ?? "");
    setDestination(params.get("destination") ?? "");
    setDepartDate(params.get("departDate") ?? "");
    setCabinClass(params.get("cabinClass") ?? "economy");
    setSearchParams({
      origin: params.get("origin") ?? "",
      destination: params.get("destination") ?? "",
      departDate: params.get("departDate") ?? "",
      cabinClass: params.get("cabinClass") ?? "economy",
    });
  }, [location]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: flights, isLoading } = useSearchFlights(searchParams, { query: { enabled: true } as any });

  const sorted = useMemo(() => {
    if (!flights) return [];
    const arr = [...flights];
    if (sortMode === "cheapest") return arr.sort((a, b) => a.price - b.price);
    if (sortMode === "quickest") return arr.sort((a, b) => a.duration.localeCompare(b.duration));
    return arr.sort((a, b) => {
      const score = (f: typeof arr[0]) => f.price * 0.6 + f.seatsAvailable * -2;
      return score(a) - score(b);
    });
  }, [flights, sortMode]);

  const cheapestPrice = useMemo(() => flights ? Math.min(...flights.map(f => f.price)) : null, [flights]);
  const quickestDuration = useMemo(() => flights ? [...flights].sort((a, b) => a.duration.localeCompare(b.duration))[0]?.duration : null, [flights]);
  const bestFlight = useMemo(() => {
    if (!flights || flights.length === 0) return null;
    return [...flights].sort((a, b) => {
      const score = (f: typeof flights[0]) => f.price * 0.6 + f.seatsAvailable * -2;
      return score(a) - score(b);
    })[0];
  }, [flights]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin.trim()) params.set("origin", origin.trim());
    if (destination.trim()) params.set("destination", destination.trim());
    if (departDate) params.set("departDate", departDate);
    params.set("cabinClass", cabinClass);
    setLocation(`/flights?${params.toString()}`);
    setSearchParams({ origin: origin.trim(), destination: destination.trim(), departDate, cabinClass });
  }

  function swapLocations() {
    const tmp = origin;
    setOrigin(destination);
    setDestination(tmp);
  }

  function getBadge(flight: typeof sorted[0]) {
    if (!flights || flights.length < 2) return null;
    if (flight.price === cheapestPrice) return { label: "Cheapest", color: "bg-green-100 text-green-700 border-green-200" };
    if (bestFlight && flight.id === bestFlight.id) return { label: "Best", color: "bg-blue-100 text-blue-700 border-blue-200" };
    if (flight.duration === quickestDuration) return { label: "Quickest", color: "bg-purple-100 text-purple-700 border-purple-200" };
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero search bar */}
        <div className="relative py-20 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(167,13,46,0.82) 0%, rgba(91,5,106,0.55) 60%, rgba(3,12,22,0.30) 100%)" }}
          />
          <div className="relative container mx-auto px-4">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Titanic Travel · Direct Flights Worldwide</p>
            <h1 className="text-white text-4xl font-black mb-2 drop-shadow-lg">Where to next?</h1>
            <p className="text-white/80 mb-8 text-sm">Search hundreds of routes and find the best fare for your journey</p>
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* From / To */}
                <div className="md:col-span-5 flex border border-gray-200 rounded-xl overflow-visible relative">
                  <div className="flex-1 p-3 border-r border-gray-200">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">From</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                      <input
                        type="text"
                        value={origin}
                        onChange={e => setOrigin(e.target.value)}
                        placeholder="City or airport"
                        className="w-full text-sm font-medium text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={swapLocations}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-[#A70D2E] hover:border-[#A70D2E] transition-colors group hidden md:flex"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#A70D2E] group-hover:text-white" />
                  </button>
                  <div className="flex-1 p-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">To</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                      <input
                        type="text"
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        placeholder="City or airport"
                        className="w-full text-sm font-medium text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Depart date */}
                <div className="md:col-span-3 border border-gray-200 rounded-xl p-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Depart</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#A70D2E] flex-shrink-0" />
                    <input
                      type="date"
                      value={departDate}
                      onChange={e => setDepartDate(e.target.value)}
                      className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none border-none"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {/* Cabin */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Cabin</label>
                  <Select value={cabinClass} onValueChange={setCabinClass}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="upper">Upper Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search button */}
                <div className="md:col-span-2 flex items-end">
                  <Button type="submit" className="w-full h-12 bg-[#A70D2E] hover:bg-[#8A0A26] rounded-xl font-bold text-base">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-8">
          {isLoading && (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-[#A70D2E] mb-4" />
              <p className="text-gray-500 text-lg">Finding the best flights for you…</p>
            </div>
          )}

          {!isLoading && flights && flights.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Plane className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl font-medium">No flights found</p>
              <p className="text-sm mt-2">Try different dates or destinations</p>
            </div>
          )}

          {!isLoading && flights && flights.length > 0 && (
            <>
              {/* Sort tabs */}
              <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
                <button
                  onClick={() => setSortMode("cheapest")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all ${
                    sortMode === "cheapest"
                      ? "bg-[#A70D2E] text-white border-[#A70D2E] shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#A70D2E]/40"
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  Cheapest
                  {cheapestPrice && <span className="font-bold">£{cheapestPrice.toFixed(0)}</span>}
                </button>
                <button
                  onClick={() => setSortMode("best")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all ${
                    sortMode === "best"
                      ? "bg-[#A70D2E] text-white border-[#A70D2E] shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#A70D2E]/40"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Best
                  {bestFlight && <span className="font-bold">£{bestFlight.price.toFixed(0)}</span>}
                </button>
                <button
                  onClick={() => setSortMode("quickest")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all ${
                    sortMode === "quickest"
                      ? "bg-[#A70D2E] text-white border-[#A70D2E] shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#A70D2E]/40"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Quickest
                  {quickestDuration && <span className="font-bold">{quickestDuration}</span>}
                </button>
                <span className="ml-auto text-sm text-gray-500 whitespace-nowrap">{flights.length} flight{flights.length !== 1 ? "s" : ""} found</span>
              </div>

              {/* Flight cards */}
              <div className="space-y-3">
                {sorted.map((flight) => {
                  const badge = getBadge(flight);
                  return (
                    <div
                      key={flight.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#A70D2E]/20 transition-all"
                    >
                      <div className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">

                          {/* Airline logo + name */}
                          <div className="flex items-center gap-3 md:w-44 flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#A70D2E] to-[#5B056A] rounded-xl flex items-center justify-center flex-shrink-0">
                              <Plane className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800 leading-tight">Titanic Travel</p>
                              <p className="text-[11px] text-gray-400">{flight.flightNumber}</p>
                              <p className="text-[11px] text-gray-400">{flight.aircraft}</p>
                            </div>
                          </div>

                          {/* Times + route */}
                          <div className="flex-1 flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-black text-gray-900 leading-none">{flight.departTime}</p>
                              <p className="text-xs font-bold text-gray-500 mt-1">{flight.originCode}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-1 min-w-[80px]">
                              <div className="flex items-center w-full gap-1">
                                <div className="w-2 h-2 rounded-full border-2 border-[#A70D2E] flex-shrink-0" />
                                <div className="flex-1 h-px bg-gradient-to-r from-[#A70D2E] to-[#5B056A]" />
                                <Plane className="w-4 h-4 text-[#5B056A] flex-shrink-0" />
                              </div>
                              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />{flight.duration}
                              </p>
                              <p className="text-[11px] font-semibold text-green-600">Nonstop</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-black text-gray-900 leading-none">{flight.arriveTime}</p>
                              <p className="text-xs font-bold text-gray-500 mt-1">{flight.destinationCode}</p>
                            </div>
                          </div>

                          {/* Date + cabin */}
                          <div className="hidden md:block text-center md:w-28 flex-shrink-0">
                            <p className="text-xs text-gray-400">{flight.departDate}</p>
                            <p className="text-xs font-semibold text-gray-600 mt-1">{CABIN_LABELS[flight.cabinClass] ?? flight.cabinClass}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{flight.seatsAvailable} seats left</p>
                          </div>

                          {/* Price + button */}
                          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-36 flex-shrink-0 md:border-l md:border-gray-100 md:pl-5">
                            <div className="text-right">
                              {badge && (
                                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border mb-1 ${badge.color}`}>
                                  {badge.label}
                                </span>
                              )}
                              <p className="text-2xl font-black text-[#A70D2E] leading-none">£{flight.price.toFixed(0)}</p>
                              <p className="text-[11px] text-gray-400">per person</p>
                            </div>
                            <Button
                              onClick={() => setLocation(`/book/${flight.id}`)}
                              className="bg-[#A70D2E] hover:bg-[#8A0A26] text-white rounded-xl px-5 font-bold text-sm flex items-center gap-1.5 whitespace-nowrap"
                            >
                              Select <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Mobile extras */}
                        <div className="md:hidden flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                          <span>{flight.departDate} · {CABIN_LABELS[flight.cabinClass] ?? flight.cabinClass}</span>
                          <span>{flight.seatsAvailable} seats left</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}