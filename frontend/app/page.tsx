"use client";

import HeroSection from "@/components/landing/HeroSection";
import QuickActions from "@/components/landing/QuickActions";
import CampusHighlights from "@/components/landing/CampusHighlights";
import SocialMediaHub from "@/components/landing/SocialMediaHub";
import VirtualTour from "@/components/landing/VirtualTour";
import EmergencyContacts from "@/components/landing/EmergencyContacts";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30">
      {/* 1. Interactive Animated Hero Banner */}
      <HeroSection />

      {/* 2. Dynamically Adapting Profile Cards */}
      <QuickActions />

      {/* 3. Core Academic Milestone Highlights */}
      <CampusHighlights />

      {/* 4. Immersive Virtual Reality Map CTA */}
      <VirtualTour />

      {/* 5. Broad Campus Social Media Grid Feed */}
      <SocialMediaHub />

      {/* 6. Emergency Contacts and Helplines Accordion */}
      <EmergencyContacts />

      {/* Footer Design Branding */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center select-none text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        © 2026 Metropolitan Institute of Technology · All Rights Reserved
      </footer>
    </main>
  );
}
