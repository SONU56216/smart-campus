"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  ClipboardList, 
  Wallet, 
  User 
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Card", href: "/card", icon: CreditCard },
    { label: "Exam", href: "/exams", icon: ClipboardList },
    { label: "Wallet", href: "/wallet", icon: Wallet },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/5 shadow-[0_-8px_32px_rgba(0,0,0,0.5)] select-none">
      <div className="grid grid-cols-5 items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center h-full w-full relative transition-all active:scale-95"
            >
              <div 
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? "text-blue-400 scale-105" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[8.5px] font-black uppercase tracking-wider leading-none">
                  {item.label}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute top-0 w-8 h-[3px] bg-blue-500 rounded-b shadow-[0_2px_8px_rgba(59,130,246,0.6)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
