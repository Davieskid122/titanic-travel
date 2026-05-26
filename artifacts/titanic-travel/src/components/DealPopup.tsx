import { useState, useEffect } from "react";
import { X, Tag, Plane, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const DEALS = [
  { route: "London → New York", code: "LHR–JFK", price: "£349", original: "£529", tag: "34% OFF", cabin: "Economy" },
  { route: "London → Dubai", code: "LHR–DXB", price: "£289", original: "£449", tag: "36% OFF", cabin: "Economy" },
  { route: "London → Maldives", code: "LHR–MLE", price: "£599", original: "£899", tag: "33% OFF", cabin: "Premium" },
];

export default function DealPopup() {
  const [visible, setVisible] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("deal-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem("deal-popup-dismissed", "1");
    setVisible(false);
  }

  function handleClaim(deal: typeof DEALS[0]) {
    dismiss();
    setLocation(`/flights?origin=London&destination=${deal.code.split("–")[1]}&cabinClass=${deal.cabin.toLowerCase()}`);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-[#A70D2E] to-[#5B056A] px-6 py-5">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-yellow-300" />
            <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">Flash Sale · Today Only</span>
          </div>
          <h2 className="text-white text-2xl font-black leading-tight">Exclusive Deals<br />Just For You</h2>
          <p className="text-white/70 text-sm mt-1">Limited seats at these prices — book before they're gone.</p>
        </div>

        <div className="px-6 py-4 space-y-3">
          {DEALS.map((deal) => (
            <div
              key={deal.code}
              className="flex items-center justify-between border border-gray-100 rounded-xl p-3 hover:border-[#A70D2E]/30 hover:bg-[#A70D2E]/5 transition-all group cursor-pointer"
              onClick={() => handleClaim(deal)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#A70D2E]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plane className="w-4 h-4 text-[#A70D2E]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{deal.route}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{deal.cabin}</span>
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">{deal.tag}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#A70D2E] text-lg font-black">{deal.price}</p>
                <p className="text-xs text-gray-400 line-through">{deal.original}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5 flex gap-3">
          <Button
            onClick={dismiss}
            variant="outline"
            className="flex-1 rounded-xl border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            No thanks
          </Button>
          <Button
            onClick={() => { dismiss(); setLocation("/flights"); }}
            className="flex-1 rounded-xl bg-[#A70D2E] hover:bg-[#8A0A26] font-bold"
          >
            See all deals
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-4 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="text-xs">Offer expires at midnight</span>
        </div>
      </div>
    </div>
  );
}