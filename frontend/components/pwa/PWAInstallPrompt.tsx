"use client";

import { useEffect, useState } from "react";
import { DownloadCheck, X, Sparkles, MonitorSmartphone, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [alreadyInstalled, setAlreadyInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if app is run in standalone mode (already installed)
    const isInWebAppStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                                 (window.navigator as any).standalone === true;

    if (isInWebAppStandalone) {
      setAlreadyInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser default mini-bar from showing
      e.preventDefault();
      // Cache the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install banner with delays
      const dismissed = localStorage.getItem("pwa_prompt_dismissed_v1");
      if (!dismissed) {
        setTimeout(() => {
          setIsVisible(true);
        }, 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Track successful installs
    const handleAppInstalled = () => {
      setAlreadyInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      toast.success("Welcome aboard! Smart Campus is now registered locally on your device desktop.");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Manual fallback advice for iOS or unsupported browsers
      toast.info("In your mobile web browser, tap standard 'Share' then select 'Add to Home Screen' to install Metropolitan Wallet.");
      return;
    }

    // Show the installation prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    try {
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast.loading("Writing pass credentials cache to persistent device blocks...");
      } else {
        toast.error("Install prompt aborted.");
      }
    } catch (_) {}

    // We can only use the event prompt once, clear references
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa_prompt_dismissed_v1", "true");
    toast.message("Install banner dismissed. It can be accessed on next session clearance.");
  };

  if (alreadyInstalled || !isVisible) return null;

  return (
    <div className="fixed bottom-18 md:bottom-6 left-4 right-4 md:left-[inherit] md:right-6 md:w-[380px] bg-slate-900 border border-blue-500/25 rounded-3xl p-5 shadow-2xl shadow-blue-500/10 filter backdrop-blur-md z-50 animate-bump-up flex flex-col gap-4 text-left">
      <div className="flex items-start gap-3.5 relative">
        <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl shrink-0">
          <MonitorSmartphone className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-1 pr-8">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1 leading-none">
            Upgrade to Native Smart App
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </h4>
          <p className="text-[10.5px] text-slate-350 leading-relaxed font-semibold">
            Add Smart Campus directly to your home screen files for zero-delay offline credentials, biometric entries, and portal notifications.
          </p>
        </div>

        {/* close cross */}
        <button
          onClick={handleDismiss}
          className="p-1 md:p-1.5 bg-slate-950 hover:bg-slate-850 border border-white/5 text-slate-400 hover:text-white rounded-lg absolute top-0 right-0 cursor-pointer"
        >
          <X className="w-4 h-4 shrink-0" />
        </button>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={handleDismiss}
          className="flex-1 py-2.5 text-[10px] font-black bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center border border-white/5"
        >
          Later
        </button>
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2.5 text-[10px] font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center shadow-lg shadow-blue-500/20 inline-flex items-center justify-center gap-1"
        >
          <DownloadCheck className="w-3.5 h-3.5" />
          Install App
        </button>
      </div>
    </div>
  );
}
