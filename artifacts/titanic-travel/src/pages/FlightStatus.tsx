import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchFlights } from "@workspace/api-client-react";
import { Plane, Search, Clock, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function getStatus(flightNumber: string) {
  const seed = flightNumber.charCodeAt(flightNumber.length - 1);
  if (seed % 5 === 0) return { label: "Delayed", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: AlertCircle, iconColor: "text-amber-500", delay: "+35 min" };
  return { label: "On Time", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle, iconColor: "text-green-600", delay: null };
}

export default function FlightStatus() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: flights, isLoading } = useSearchFlights(
    {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query: { enabled: submitted } as any }
  );

  const filtered = flights?.filter(f =>
    f.flightNumber.toLowerCase().includes(query.toLowerCase()) ||
    f.origin.toLowerCase().includes(query.toLowerCase()) ||
    f.destination.toLowerCase().includes(query.toLowerCase()) ||
    f.originCode.toLowerCase().includes(query.toLowerCase()) ||
    f.destinationCode.toLowerCase().includes(query.toLowerCase())
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <div className="bg-[#A70D2E] py-10 md:py-14">
          <div className="container mx-auto px-4 text-center">
            <Plane className="w-10 h-10 md:w-12 md:h-12 text-white/70 mx-auto mb-3 md:mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3">Flight Status</h1>
            <p className="text-white/80 text-base md:text-lg mb-6 md:mb-8">Check live status for all Titanic Travel flights</p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Flight number, city or airport (e.g. TT001, Dubai, LHR)"
                  className="pl-12 h-12 rounded-full bg-white border-0 text-sm md:text-base shadow-lg"
                />
              </div>
              <Button type="submit" className="h-12 px-8 rounded-full bg-white text-[#A70D2E] hover:bg-gray-100 font-bold shadow-lg">
                Search
              </Button>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-10 max-w-4xl">
          {!submitted && (
            <div className="text-center py-12 md:py-16 text-gray-400">
              <Plane className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 opacity-20" />
              <p className="text-base md:text-lg font-medium">Enter a flight number or destination above</p>
              <p className="text-sm mt-2">e.g. TT001, New York, Dubai, LHR</p>
            </div>
          )}

          {submitted && isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-[#A70D2E] mb-4" />
              <p className="text-gray-500 text-lg">Checking flight status…</p>
            </div>
          )}

          {submitted && !isLoading && filtered && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl font-medium">No flights found</p>
              <p className="text-sm mt-2">Try searching by flight number (TT001), city or airport code</p>
            </div>
          )}

          {submitted && !isLoading && filtered && filtered.length > 0 && (
            <div className="space-y-4">
              <p className="text-gray-600 font-medium text-sm">{filtered.length} flight{filtered.length !== 1 ? "s" : ""} found</p>
              {filtered.map((flight, index) => {
                const status = getStatus(flight.flightNumber);
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Flight number + aircraft */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#A70D2E]/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Plane className="w-5 h-5 md:w-6 md:h-6 text-[#A70D2E]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{flight.flightNumber}</p>
                            <p className="text-xs text-gray-400">{flight.aircraft}</p>
                          </div>
                        </div>
                        {/* Status badge — always visible */}
                        <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 md:px-5 md:py-3 ${status.bg}`}>
                          <StatusIcon className={`w-4 h-4 md:w-5 md:h-5 ${status.iconColor} flex-shrink-0`} />
                          <div>
                            <p className={`font-bold text-xs md:text-sm ${status.color}`}>{status.label}</p>
                            {status.delay && <p className="text-xs text-amber-600">{status.delay}</p>}
                            {!status.delay && <p className="text-xs text-green-600 hidden md:block">On schedule</p>}
                          </div>
                        </div>
                      </div>

                      {/* Route info */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-center min-w-0">
                          <p className="text-xl md:text-2xl font-bold text-[#030C16]">{flight.departTime}</p>
                          <p className="text-sm font-semibold text-gray-700">{flight.originCode}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[80px] md:max-w-none">{flight.origin}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1 px-2 flex-shrink-0">
                          <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {flight.duration}</p>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full border-2 border-[#A70D2E]" />
                            <div className="w-8 md:w-14 h-px bg-[#A70D2E]" />
                            <ArrowRight className="w-3 h-3 text-[#A70D2E]" />
                          </div>
                          <p className="text-xs text-gray-400">Direct</p>
                        </div>
                        <div className="text-center min-w-0">
                          <p className="text-xl md:text-2xl font-bold text-[#030C16]">{flight.arriveTime}</p>
                          <p className="text-sm font-semibold text-gray-700">{flight.destinationCode}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[80px] md:max-w-none">{flight.destination}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 text-center">{flight.departDate}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
