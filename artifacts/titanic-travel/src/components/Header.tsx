import { Link, useLocation } from "wouter";
import { Menu, Search, Globe, ChevronDown, Anchor, User, LogOut, TicketCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Show, useUser, useClerk } from "@clerk/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();

  return (
    <header className="bg-[#A70D2E] text-white sticky top-0 z-50 w-full shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Anchor className="w-5 h-5 text-[#A70D2E]" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="block font-extrabold text-xl tracking-tight text-white">TITANIC</span>
              <span className="block font-light text-xs tracking-[0.2em] uppercase text-white/80">TRAVEL</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
            <Link href="/flights" className="hover:text-white/70 transition-colors py-2 border-b-2 border-transparent hover:border-white">Flights</Link>
            <Link href="/holidays" className="hover:text-white/70 transition-colors py-2 border-b-2 border-transparent hover:border-white">Holidays</Link>
            <Link href="/destinations" className="hover:text-white/70 transition-colors py-2 border-b-2 border-transparent hover:border-white">Destinations</Link>
            <Link href="/manage" className="hover:text-white/70 transition-colors py-2 border-b-2 border-transparent hover:border-white">Manage</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white rounded-full">
            <Search className="w-5 h-5" />
          </Button>

          <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors text-sm font-medium">
            <Globe className="w-4 h-4" /><span>EN</span><ChevronDown className="w-4 h-4" />
          </div>

          <Show when="signed-out">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white flex items-center gap-2 rounded-full hidden sm:flex">
                <User className="w-5 h-5" />
                <span className="font-semibold tracking-wide">Sign In</span>
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-white text-[#A70D2E] hover:bg-white/90 font-bold rounded-full px-5 hidden sm:flex">
                Join free
              </Button>
            </Link>
          </Show>

          <Show when="signed-in">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white flex items-center gap-2 rounded-full hidden sm:flex">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#A70D2E] font-bold text-sm">
                      {user?.firstName?.charAt(0) ?? "U"}
                    </span>
                  </div>
                  <span className="font-semibold">{user?.firstName ?? "Account"}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-bold">{user?.fullName ?? "My Account"}</p>
                    <p className="text-xs text-gray-500 font-normal truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/account")} className="cursor-pointer">
                  <TicketCheck className="w-4 h-4 mr-2 text-[#A70D2E]" /> My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/account?tab=profile")} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2 text-[#A70D2E]" /> Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut(() => setLocation("/"))} className="cursor-pointer text-red-600">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Show>

          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 hover:text-white rounded-full" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#8B0A25] border-t border-white/10 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            <Link href="/flights" className="py-3 px-2 font-semibold text-sm hover:bg-white/10 rounded-lg transition-colors">Flights</Link>
            <Link href="/holidays" className="py-3 px-2 font-semibold text-sm hover:bg-white/10 rounded-lg transition-colors">Holidays</Link>
            <Link href="/destinations" className="py-3 px-2 font-semibold text-sm hover:bg-white/10 rounded-lg transition-colors">Destinations</Link>
            <Link href="/manage" className="py-3 px-2 font-semibold text-sm hover:bg-white/10 rounded-lg transition-colors">Manage</Link>
            <div className="border-t border-white/20 mt-2 pt-3 flex flex-col gap-2">
              <Show when="signed-out">
                <Link href="/sign-in">
                  <Button variant="outline" className="w-full text-white border-white bg-transparent hover:bg-white/10">
                    <User className="w-4 h-4 mr-2" /> Sign In
                  </Button>
                </Link>
              </Show>
              <Show when="signed-in">
                <Link href="/account">
                  <Button variant="outline" className="w-full text-white border-white bg-transparent hover:bg-white/10">
                    <TicketCheck className="w-4 h-4 mr-2" /> My Account
                  </Button>
                </Link>
              </Show>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
