"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function AdminBreadcrumb() {
  const pathname = usePathname() || "";
  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 uppercase tracking-widest leading-none select-none">
      <Link 
        href="/admin/dashboard" 
        className="hover:text-emerald-400 transition-colors flex items-center gap-1"
      >
        <Home className="w-3 h-3 text-slate-500 hover:text-emerald-400" />
        Admin
      </Link>

      {paths.map((p, idx) => {
        // Skip root "admin" node if it's the first element
        if (p === "admin") return null;

        const isLast = idx === paths.length - 1;
        const linkHref = "/" + paths.slice(0, idx + 1).join("/");
        const friendlyName = p.replace(/-/g, " ");

        return (
          <div key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            {isLast ? (
              <span className="text-white font-black">{friendlyName}</span>
            ) : (
              <Link 
                href={linkHref} 
                className="hover:text-emerald-400 transition-colors"
              >
                {friendlyName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
