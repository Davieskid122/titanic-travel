import { useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useGetBookingByReference } from "@workspace/api-client-react";
import { CheckCircle, Plane, Clock, Users, Download, TicketCheck, Loader2 } from "lucide-react";

const CABIN_LABELS: Record<string, string> = { economy: "Economy", premium: "Premium", upper: "Upper Class" };
const STATUS_COLORS: Record<string, string> = { confirmed: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800" };

export default function BookingConfirmation() {
  const { reference } = useParams<{ reference: string }>();
  const [, setLocation] = useLocation();

  const { data: booking, isLoading } = useGetBookingByReference(reference);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#A70D2E]" />
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center"><TicketCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p className="text-gray-500">Booking not found</p></div>
        </main>
      </div>
    );
  }

  const { flight, passengers } = booking;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#030C16] mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 text-lg">Your reference number is</p>
            <div className="inline-block bg-[#A70D2E] text-white text-2xl font-bold tracking-widest px-8 py-3 rounded-xl mt-3 shadow">
              {booking.reference}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="bg-[#A70D2E] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg flex items-center gap-2"><Plane className="w-5 h-5" /> Flight Details</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-800"}`}>
                {booking.status}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#030C16]">{flight.departTime}</p>
                  <p className="text-lg font-bold text-gray-700 mt-1">{flight.originCode}</p>
                  <p className="text-sm text-gray-500">{flight.origin}</p>
                </div>
                <div className="flex flex-col items-center gap-1 px-6">
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{flight.duration}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full border-2 border-[#A70D2E]"></div>
                    <div className="w-28 h-px bg-[#A70D2E]"></div>
                    <Plane className="w-5 h-5 text-[#A70D2E]" />
                  </div>
                  <p className="text-xs text-gray-400">Direct</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#030C16]">{flight.arriveTime}</p>
                  <p className="text-lg font-bold text-gray-700 mt-1">{flight.destinationCode}</p>
                  <p className="text-sm text-gray-500">{flight.destination}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-sm">
                <div><p className="text-gray-400 text-xs mb-1">Date</p><p className="font-semibold">{flight.departDate}</p></div>
                <div><p className="text-gray-400 text-xs mb-1">Flight</p><p className="font-semibold">{flight.flightNumber}</p></div>
                <div><p className="text-gray-400 text-xs mb-1">Cabin</p><p className="font-semibold">{CABIN_LABELS[booking.cabinClass] ?? booking.cabinClass}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#A70D2E]" />
              <h2 className="font-bold text-lg">Passengers ({passengers.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {passengers.map((p, i) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{p.title} {p.firstName} {p.lastName}</p>
                    <p className="text-sm text-gray-500 capitalize">{p.type}</p>
                  </div>
                  <span className="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full">Passenger {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total paid</p>
                <p className="text-3xl font-bold text-[#A70D2E]">£{booking.totalPrice.toFixed(2)}</p>
              </div>
              <Button variant="outline" className="border-[#A70D2E] text-[#A70D2E] hover:bg-[#A70D2E]/5 flex items-center gap-2">
                <Download className="w-4 h-4" /> Download itinerary
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => setLocation("/account")} className="flex-1 h-12 bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full font-bold">
              View all bookings
            </Button>
            <Button onClick={() => setLocation("/flights")} variant="outline" className="flex-1 h-12 rounded-full border-[#A70D2E] text-[#A70D2E] font-bold hover:bg-[#A70D2E]/5">
              Book another flight
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
