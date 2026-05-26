import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useUser } from "@clerk/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetFlight, useCreateBooking } from "@workspace/api-client-react";
import { Plane, Clock, Users, Plus, Trash2, Loader2, CheckCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PassengerForm {
  title: string;
  firstName: string;
  lastName: string;
  type: string;
}

const CABIN_LABELS: Record<string, string> = { economy: "Economy", premium: "Premium", upper: "Upper Class" };

export default function BookFlight() {
  const { flightId } = useParams<{ flightId: string }>();
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded: authLoaded } = useUser();
  const { toast } = useToast();
  const [passengers, setPassengers] = useState<PassengerForm[]>([{ title: "Mr", firstName: "", lastName: "", type: "adult" }]);

  const { data: flight, isLoading: flightLoading, isError } = useGetFlight(Number(flightId));
  const createBooking = useCreateBooking();

  function addPassenger() {
    setPassengers([...passengers, { title: "Mr", firstName: "", lastName: "", type: "adult" }]);
  }

  function removePassenger(i: number) {
    setPassengers(passengers.filter((_, idx) => idx !== i));
  }

  function updatePassenger(i: number, field: keyof PassengerForm, value: string) {
    setPassengers(passengers.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!flight) return;

    if (!isSignedIn) {
      const returnUrl = encodeURIComponent(window.location.pathname);
      setLocation(`/sign-in?redirect_url=${returnUrl}`);
      return;
    }

    if (passengers.some(p => !p.firstName || !p.lastName)) {
      toast({ title: "Please fill in all passenger names", variant: "destructive" });
      return;
    }
    try {
      const booking = await createBooking.mutateAsync({
        data: {
          flightId: flight.id,
          cabinClass: flight.cabinClass,
          passengers,
        },
      });
      setLocation(`/booking/${booking.reference}`);
    } catch {
      toast({ title: "Booking failed", description: "Please try again", variant: "destructive" });
    }
  }

  if (flightLoading || !authLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#A70D2E]" />
        </main>
      </div>
    );
  }

  if (isError || !flight) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Plane className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium mb-2">Flight not found</p>
            <p className="text-sm mb-6">This flight may no longer be available.</p>
            <Button onClick={() => setLocation("/flights")} className="bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full">
              Browse all flights
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = flight.price * passengers.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-[#030C16] mb-8">Complete your booking</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Sign-in prompt if not authenticated */}
              {!isSignedIn && (
                <div className="bg-[#5B056A]/5 border border-[#5B056A]/20 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#5B056A]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-5 h-5 text-[#5B056A]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#030C16] mb-1">Sign in to complete your booking</p>
                    <p className="text-sm text-gray-600 mb-3">You'll need an account to confirm and manage your booking.</p>
                    <div className="flex gap-3 flex-wrap">
                      <Button
                        type="button"
                        onClick={() => {
                          const returnUrl = encodeURIComponent(window.location.pathname);
                          setLocation(`/sign-in?redirect_url=${returnUrl}`);
                        }}
                        className="bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full text-sm px-5"
                      >
                        Sign in
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const returnUrl = encodeURIComponent(window.location.pathname);
                          setLocation(`/sign-up?redirect_url=${returnUrl}`);
                        }}
                        className="rounded-full text-sm px-5 border-[#A70D2E] text-[#A70D2E] hover:bg-[#A70D2E]/5"
                      >
                        Create account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#A70D2E]" /> Passenger Details
                  </h2>
                  <div className="space-y-6">
                    {passengers.map((p, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-sm text-gray-700">Passenger {i + 1}</p>
                          {passengers.length > 1 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removePassenger(i)} className="text-red-500 hover:text-red-700 h-auto p-1">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Title</label>
                            <Select value={p.title} onValueChange={v => updatePassenger(i, "title", v)}>
                              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mr">Mr</SelectItem>
                                <SelectItem value="Mrs">Mrs</SelectItem>
                                <SelectItem value="Ms">Ms</SelectItem>
                                <SelectItem value="Dr">Dr</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">First Name</label>
                            <Input placeholder="First name" value={p.firstName} onChange={e => updatePassenger(i, "firstName", e.target.value)} className="h-10" required />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Last Name</label>
                            <Input placeholder="Last name" value={p.lastName} onChange={e => updatePassenger(i, "lastName", e.target.value)} className="h-10" required />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="text-xs font-semibold text-gray-500 block mb-1">Type</label>
                          <Select value={p.type} onValueChange={v => updatePassenger(i, "type", v)}>
                            <SelectTrigger className="h-10 w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="adult">Adult (16+)</SelectItem>
                              <SelectItem value="child">Child (2–15)</SelectItem>
                              <SelectItem value="infant">Infant (under 2)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addPassenger} className="mt-4 border-dashed border-[#A70D2E] text-[#A70D2E] hover:bg-[#A70D2E]/5">
                    <Plus className="w-4 h-4 mr-2" /> Add passenger
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={createBooking.isPending}
                  className="w-full h-14 text-lg bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full font-bold shadow-lg"
                >
                  {createBooking.isPending
                    ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing…</>
                    : !isSignedIn
                    ? <><Lock className="w-5 h-5 mr-2" /> Sign in to confirm · £{totalPrice.toFixed(2)}</>
                    : <><CheckCircle className="w-5 h-5 mr-2" /> Confirm booking · £{totalPrice.toFixed(2)}</>
                  }
                </Button>
              </form>
            </div>

            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-lg mb-4 text-[#030C16]">Flight Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-[#A70D2E]/10 rounded-full flex items-center justify-center">
                      <Plane className="w-5 h-5 text-[#A70D2E]" />
                    </div>
                    <div>
                      <p className="font-bold">{flight.originCode} → {flight.destinationCode}</p>
                      <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{flight.departDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Departs</span><span className="font-medium">{flight.departTime}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Arrives</span><span className="font-medium">{flight.arriveTime}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{flight.duration}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Cabin</span><span className="font-medium">{CABIN_LABELS[flight.cabinClass] ?? flight.cabinClass}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Passengers</span><span className="font-medium">{passengers.length}</span></div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Total</span>
                      <span className="text-2xl font-bold text-[#A70D2E]">£{totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">£{flight.price.toFixed(2)} × {passengers.length} passenger{passengers.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
