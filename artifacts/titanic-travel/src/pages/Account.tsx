import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetMyBookings, useGetUserProfile, useUpdateUserProfile, useCancelBooking, getGetMyBookingsQueryKey, getGetUserProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { TicketCheck, User, Plane, Clock, XCircle, Loader2, Star, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CABIN_LABELS: Record<string, string> = { economy: "Economy", premium: "Premium", upper: "Upper Class" };
const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Account() {
  const [activeTab, setActiveTab] = useState<"bookings" | "profile" | "flyingclub">("bookings");
  const [, setLocation] = useLocation();
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading: bookingsLoading } = useGetMyBookings();
  const { data: profile, isLoading: profileLoading } = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();
  const cancelBooking = useCancelBooking();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  function initProfile() {
    if (profile && !firstName) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setPhone(profile.phone ?? "");
    }
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ data: { firstName, lastName, phone } });
      queryClient.invalidateQueries({ queryKey: getGetUserProfileQueryKey() });
      toast({ title: "Profile updated successfully" });
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  }

  async function handleCancel(id: number) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetMyBookingsQueryKey() });
      toast({ title: "Booking cancelled" });
    } catch {
      toast({ title: "Failed to cancel booking", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#A70D2E] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">{user?.firstName?.charAt(0) ?? "U"}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#030C16]">{user?.fullName ?? "Welcome back"}</h1>
              <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
            {[
              { id: "bookings" as const, label: "My Bookings", icon: TicketCheck },
              { id: "profile" as const, label: "Profile", icon: Settings },
              { id: "flyingclub" as const, label: "Flying Club", icon: Star },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setActiveTab(id); if (id === "profile") initProfile(); }}
                className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap -mb-px ${
                  activeTab === id ? "border-[#A70D2E] text-[#A70D2E]" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && (
            <div>
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#A70D2E]" /></div>
              ) : !bookings || bookings.length === 0 ? (
                <div className="text-center py-20">
                  <TicketCheck className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                  <p className="text-gray-500 text-lg font-medium">No bookings yet</p>
                  <Button onClick={() => setLocation("/flights")} className="mt-6 bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full px-8">
                    Search flights
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-[#A70D2E] text-lg tracking-wider">{booking.reference}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-800"}`}>
                            {booking.status}
                          </span>
                        </div>
                        {booking.status === "confirmed" && (
                          <Button variant="ghost" size="sm" onClick={() => handleCancel(booking.id)}
                            disabled={cancelBooking.isPending}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs">
                            <XCircle className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        )}
                      </div>
                      <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 bg-[#A70D2E]/10 rounded-full flex items-center justify-center">
                            <Plane className="w-5 h-5 text-[#A70D2E]" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{booking.flight.originCode} → {booking.flight.destinationCode}</p>
                            <p className="text-sm text-gray-500">{booking.flight.departDate} · {booking.flight.departTime} – {booking.flight.arriveTime}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />{booking.flight.duration} · {CABIN_LABELS[booking.cabinClass] ?? booking.cabinClass}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Passengers</p>
                            <p className="font-semibold">{booking.passengers.length}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-xl font-bold text-[#A70D2E]">£{booking.totalPrice.toFixed(2)}</p>
                          </div>
                          <Button onClick={() => setLocation(`/booking/${booking.reference}`)} variant="outline" size="sm"
                            className="border-[#A70D2E] text-[#A70D2E] hover:bg-[#A70D2E]/5 rounded-full">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="w-5 h-5 text-[#A70D2E]" /> Profile Settings</h2>
              {profileLoading ? (
                <div className="flex items-center justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#A70D2E]" /></div>
              ) : (
                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">First Name</label>
                      <Input value={firstName || profile?.firstName || ""} onChange={e => setFirstName(e.target.value)} className="h-12" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Last Name</label>
                      <Input value={lastName || profile?.lastName || ""} onChange={e => setLastName(e.target.value)} className="h-12" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Email</label>
                    <Input value={profile?.email ?? ""} disabled className="h-12 bg-gray-50" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Phone</label>
                    <Input placeholder="+44 7700 900000" value={phone || profile?.phone || ""} onChange={e => setPhone(e.target.value)} className="h-12" />
                  </div>
                  <Button type="submit" disabled={updateProfile.isPending} className="w-full h-12 bg-[#A70D2E] hover:bg-[#8A0A26] rounded-full font-bold">
                    {updateProfile.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Save changes
                  </Button>
                </form>
              )}
            </div>
          )}

          {activeTab === "flyingclub" && (
            <div>
              {profileLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#A70D2E]" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-[#5B056A] to-[#A70D2E] rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-white/70 text-sm mb-1">Flying Club Member</p>
                        <p className="font-bold text-xl">{profile?.firstName} {profile?.lastName}</p>
                      </div>
                      <Star className="w-10 h-10 text-white/30" />
                    </div>
                    <div className="mb-6">
                      <p className="text-white/70 text-sm mb-1">Membership Number</p>
                      <p className="font-mono text-2xl font-bold tracking-widest">{profile?.flyingClubNumber ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm mb-1">Miles Balance</p>
                      <p className="text-4xl font-bold">{(profile?.flyingClubMiles ?? 0).toLocaleString()}</p>
                      <p className="text-white/60 text-sm">miles</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="font-bold text-lg mb-4">Miles Activity</h3>
                    <div className="space-y-3">
                      {bookings && bookings.filter(b => b.status === "confirmed").length > 0 ? (
                        bookings.filter(b => b.status === "confirmed").slice(0, 5).map((b) => (
                          <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                            <div>
                              <p className="font-medium text-sm">{b.flight.originCode} → {b.flight.destinationCode}</p>
                              <p className="text-xs text-gray-400">{b.flight.departDate}</p>
                            </div>
                            <span className="text-green-600 font-bold text-sm">+500 miles</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No activity yet. Book a flight to earn miles!</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
