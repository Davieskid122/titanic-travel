import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetBookingByReference } from "@workspace/api-client-react";
import { Plane, Clock, Users, Search, Loader2, TicketCheck } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
const CABIN_LABELS: Record<string, string> = { economy: "Economy", premium: "Premium", upper: "Upper Class" };

export default function Manage() {
  const [, setLocation] = useLocation();
  const [refInput, setRefInput] = useState("");
  const [searchRef, setSearchRef] = useState("");

  const { data: booking, isLoading, error } = useGetBookingByReference(searchRef, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { enabled: !!searchRef, retry: false } as any,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchRef(refInput.trim().toUpperCase());
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-100 mb-8">
            <h1 className="text-3xl font-bold text-[#030C16] mb-2 text-center">Manage my booking</h1>
            <p className="text-gray-500 text-center mb-8">View your itinerary, check status, or manage your journey.</p>
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Booking reference</label>
                <Input
                  placeholder="e.g. AB12CD"
                  value={refInput}
                  onChange={e => setRefInput(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="h-14 text-xl font-mono tracking-widest border-gray-300 focus-visible:ring-[#A70D2E] uppercase"
                />
                <p className="text-xs text-gray-500">6-character code found on your confirmation email</p>
              </div>
              <Button type="submit" className="w-full h-14 text-lg bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full font-bold" disabled={!refInput || isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                Find booking
              </Button>
            </form>
          </div>

          {searchRef && !isLoading && !booking && (
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
              <TicketCheck className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="text-gray-700 font-semibold">No booking found for reference <span className="font-mono text-[#A70D2E]">{searchRef}</span></p>
              <p className="text-gray-400 text-sm mt-1">Please check your reference and try again</p>
            </div>
          )}

          {booking && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-[#A70D2E] px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs mb-1">Booking Reference</p>
                  <p className="text-white font-mono font-bold text-2xl tracking-widest">{booking.reference}</p>
                </div>
                <span className={`text-xs font-bold px-4 py-2 rounded-full capitalize ${STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-800"}`}>
                  {booking.status}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#030C16]">{booking.flight.departTime}</p>
                    <p className="font-bold text-gray-700">{booking.flight.originCode}</p>
                    <p className="text-sm text-gray-400">{booking.flight.origin}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 px-4">
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{booking.flight.duration}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full border-2 border-[#A70D2E]"></div>
                      <div className="w-20 h-px bg-[#A70D2E]"></div>
                      <Plane className="w-4 h-4 text-[#A70D2E]" />
                    </div>
                    <p className="text-xs text-gray-400">Direct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#030C16]">{booking.flight.arriveTime}</p>
                    <p className="font-bold text-gray-700">{booking.flight.destinationCode}</p>
                    <p className="text-sm text-gray-400">{booking.flight.destination}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-sm mb-4">
                  <div><p className="text-gray-400 text-xs mb-1">Date</p><p className="font-semibold">{booking.flight.departDate}</p></div>
                  <div><p className="text-gray-400 text-xs mb-1">Cabin</p><p className="font-semibold">{CABIN_LABELS[booking.cabinClass] ?? booking.cabinClass}</p></div>
                  <div><p className="text-gray-400 text-xs mb-1">Total Paid</p><p className="font-bold text-[#A70D2E]">£{booking.totalPrice.toFixed(2)}</p></div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-[#A70D2E]" /> Passengers ({booking.passengers.length})</p>
                  <div className="space-y-2">
                    {booking.passengers.map((p) => (
                      <div key={p.id} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                        <p className="font-medium text-sm">{p.title} {p.firstName} {p.lastName}</p>
                        <span className="text-xs text-gray-400 capitalize">{p.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={() => setLocation(`/booking/${booking.reference}`)} className="w-full mt-6 h-12 bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full font-bold">
                  View full details
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
