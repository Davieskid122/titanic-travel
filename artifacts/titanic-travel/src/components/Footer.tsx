import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Anchor } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#030C16] text-white pt-12 md:pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 mb-12 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5 cursor-pointer w-fit">
              <div className="w-9 h-9 bg-[#A70D2E] rounded-full flex items-center justify-center">
                <Anchor className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="leading-none">
                <span className="block font-extrabold text-lg tracking-tight text-white">TITANIC</span>
                <span className="block font-light text-[10px] tracking-[0.2em] uppercase text-white/60">TRAVEL</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-5 max-w-sm leading-relaxed">
              Titanic Travel brings you premium flights and spectacular holiday packages to the world's most desirable destinations.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#A70D2E] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Book */}
          <div className="col-span-1">
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 tracking-wide">Book</h4>
            <ul className="space-y-2.5 md:space-y-3 text-gray-400 text-sm">
              <li><Link href="/flights" className="hover:text-white transition-colors">Search flights</Link></li>
              <li><Link href="/holidays" className="hover:text-white transition-colors">Book a holiday</Link></li>
              <li><Link href="/destinations" className="hover:text-white transition-colors">Our destinations</Link></li>
              <li><Link href="/flights" className="hover:text-white transition-colors">Flight deals</Link></li>
            </ul>
          </div>

          {/* Manage */}
          <div className="col-span-1">
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 tracking-wide">Manage</h4>
            <ul className="space-y-2.5 md:space-y-3 text-gray-400 text-sm">
              <li><Link href="/manage" className="hover:text-white transition-colors">Manage my booking</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Check in</Link></li>
              <li><Link href="/flight-status" className="hover:text-white transition-colors">Flight status</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Baggage allowance</Link></li>
              <li><Link href="/seat-selection" className="hover:text-white transition-colors">Seat selection</Link></li>
            </ul>
          </div>

          {/* Help — hidden on mobile, shown on md+ */}
          <div className="col-span-1 hidden md:block">
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 tracking-wide">Help</h4>
            <ul className="space-y-2.5 md:space-y-3 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Help centre</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Special assistance</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Delayed/lost baggage</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refunds & compensation</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Titanic Travel Airways Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms & conditions</Link>
            <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
