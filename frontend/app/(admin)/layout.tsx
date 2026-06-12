"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-white">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Core Screen viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-950/25">
        <AdminHeader />
        
        {/* Main nested content scrollable block */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-white/5">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
