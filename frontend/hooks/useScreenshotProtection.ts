"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Advanced custom hook that prevents and detects screen capture, print, and tampering attempts.
 * Returns states allowing components to blur or overlay security warnings.
 */
export const useScreenshotProtection = (active: boolean = true) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    // Apply strict CSS protection classes to the body
    document.body.classList.add("select-none");

    const triggerViolation = (type: string) => {
      setIsBlurred(true);
      setShowWarning(true);
      console.warn(`[SECURITY VIOLATION] Screenshot or print attempt detected via: ${type}`);
      toast.error(`⚠️ Security Violation: Screenshots and printing are strictly prohibited on this card.`);
      
      // Auto-reset warning after 5 seconds
      const timer = setTimeout(() => {
        setIsBlurred(false);
        setShowWarning(false);
      }, 5000);

      return () => clearTimeout(timer);
    };

    // 1. Intercept standard keyboard shortcuts for printing and screen capture
    const handleKeyDown = (e: KeyboardEvent) => {
      const isPrintScreen = e.key === "PrintScreen";
      const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5");
      const isWindowsScreenshot = e.metaKey && e.shiftKey && (e.key === "s" || e.key === "S");
      const isPrintShortcut = (e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P");
      
      if (isPrintScreen || isMacScreenshot || isWindowsScreenshot || isPrintShortcut) {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation(`Keyboard Shortcut (${e.key})`);
        
        // Overwrite clipboard to secure sensitive numbers
        try {
          navigator.clipboard.writeText("[CampusPass Secure Credential Screen Protected]");
        } catch (_) {}
      }
    };

    // 2. Hide visual panels dynamically if workspace focus slips (Window Blur)
    const handleBlur = () => {
      // To avoid annoying triggers on simple clicking away, we blur only,
      // but still flag as active screen capture prevention
      setIsBlurred(true);
    };

    const handleFocus = () => {
      setIsBlurred(false);
    };

    // 3. Catch Page Print Events (matchMedia + onbeforeprint)
    const handleBeforePrint = () => {
      triggerViolation("Print Dialog");
    };

    const mediaQueryList = window.matchMedia("print");
    const handleMediaChange = (mql: MediaQueryListEvent) => {
      if (mql.matches) {
        triggerViolation("Print Media Query");
      }
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handleMediaChange);
    } else {
      // Legacy support
      mediaQueryList.addListener(handleMediaChange);
    }

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // 4. MutationObserver to trap DevTools DOM modifications
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          // If elements are set to visible, unblurred or displays manipulated, flag violation
          const target = mutation.target as HTMLElement;
          if (target.style.filter.includes("none") || target.style.display === "none") {
            triggerViolation("DOM Tampering (Style Modification)");
          }
        }
      }
    });

    observer.observe(document.body, { attributes: true, subtree: true, childList: true });

    // 5. Intercept Right-Clicks to prevent "Save Image As"
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.info("Secure Card Console: Context menu interactions are locked.");
    };
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.body.classList.remove("select-none");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("contextmenu", handleContextMenu);
      
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", handleMediaChange);
      } else {
        mediaQueryList.removeListener(handleMediaChange);
      }
      
      observer.disconnect();
    };
  }, [active]);

  const resetProtection = () => {
    setIsBlurred(false);
    setShowWarning(false);
  };

  return { isBlurred, showWarning, resetProtection };
};
export default useScreenshotProtection;
