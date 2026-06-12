"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react"; // We can use either QRCodeSVG or QRCodeCanvas from qrcode.react
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Droplet, 
  WifiOff, 
  AlertCircle, 
  RefreshCw, 
  UserCheck, 
  Clock, 
  Sparkles,
  PhoneCall,
  MapPin,
  CheckCircle2,
  FileDown
} from "lucide-react";
import useScreenshotProtection from "@/hooks/useScreenshotProtection";
import useShakeDetection from "@/hooks/useShakeDetection";
import { toast } from "sonner";

interface DigitalIDCardProps {
  studentData: {
    studentId: string;
    fullName: string;
    dob: string;
    email: string;
    phone: string;
    guardian: string;
    address: string;
    course: string;
    department: string;
    gpa: string;
    photoUrl: string;
    status: "ACTIVE" | "BLOCKED" | "EXPIRED";
    validUntil: string;
    bloodGroup?: string;
    category?: string;
  } | null;
  isLoading?: boolean;
  error?: any;
  refetch?: () => void;
  isOffline?: boolean;
}

export default function DigitalIDCard({ 
  studentData, 
  isLoading, 
  error, 
  refetch, 
  isOffline 
}: DigitalIDCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hologramBurst, setHologramBurst] = useState(false);
  const [shakeBurstActive, setShakeBurstActive] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<any>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // 1. Screenshot protection hook activation
  const { isBlurred, showWarning, resetProtection } = useScreenshotProtection(
    studentData?.status === "ACTIVE"
  );

  // 2. Accelerometer Shake Hook to trigger holographic shimmer burst
  useShakeDetection(() => {
    if (shakeBurstActive) return;
    setShakeBurstActive(true);
    setHologramBurst(true);
    toast.success("📱 Device Shake Detected! Holographic anti-counterfeiting burst triggered.", {
      icon: "✨",
    });
    
    // Deactivate shimmer burst after 2.5s
    setTimeout(() => {
      setShakeBurstActive(false);
      setHologramBurst(false);
    }, 2500);
  }, 14); // Threshold sensitivity factor

  // Handle double click for full-screen view
  const handleDoubleClick = () => {
    setIsFullscreen(!isFullscreen);
    toast.info(
      isFullscreen ? "Exited full-screen viewer." : "Entered full-screen ID card viewer.",
      { duration: 1500 }
    );
  };

  // Handle long press to open quick download panel
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      toast("📥 Quick Export Hub", {
        description: "Double click to toggle full-screen card, double tap/long press to export files directly.",
        action: {
          label: "Reset card",
          onClick: () => resetProtection(),
        },
      });
    }, 1200);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };

  // Mouse move relative position tracking for premium glassy glare highlight vector
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverPosition({ x, y });
  };

  // Calculate validity date countdown
  const getDaysRemaining = () => {
    if (!studentData?.validUntil) return null;
    const expiry = new Date(studentData.validUntil);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const showCountdown = daysRemaining !== null && daysRemaining > 0 && daysRemaining < 30;

  // Render Skeleton Loader state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 select-none">
        <div className="w-[360px] h-[560px] md:w-[420px] md:h-[620px] border border-slate-200/20 bg-slate-900/50 backdrop-blur-xl rounded-[24px] p-6 space-y-6 flex flex-col justify-between shadow-2xl animate-pulse">
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800" />
              <div className="h-4 w-40 bg-slate-800 rounded-md" />
              <div className="h-3 w-48 bg-slate-800 rounded-md" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="w-[110px] h-[140px] bg-slate-800 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-24 bg-slate-800 rounded-md" />
                <div className="h-4 w-32 bg-slate-800 rounded-md" />
                <div className="h-4 w-28 bg-slate-800 rounded-md" />
                <div className="h-4 w-20 bg-slate-800 rounded-md" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-800 rounded-md" />
              <div className="h-6 w-16 bg-slate-800 rounded-md" />
            </div>
            <div className="w-20 h-20 bg-slate-800 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Render connection crash / card retrieval error state
  if (error || !studentData) {
    return (
      <div className="flex justify-center items-center py-10 select-none">
        <div className="w-[360px] h-[560px] border border-orange-500/20 bg-slate-950/90 backdrop-blur-xl rounded-[24px] p-6 flex flex-col justify-between text-center items-center shadow-2xl">
          <div className="p-4 bg-orange-500/10 rounded-full border border-orange-500/30 text-orange-500 mt-12 animate-bounce">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2.5 max-w-xs">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Credential Handshake Locked
            </h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              We failed to authenticate security parameters over server pipelines. Please ensure you are logged into your enrollment cell.
            </p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mb-8"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Authenticating Secure Socket
          </button>
        </div>
      </div>
    );
  }

  // Evaluate card status overlays
  const isBlocked = studentData.status === "BLOCKED";
  const isExpired = studentData.status === "EXPIRED" || (daysRemaining !== null && daysRemaining <= 0);
  const isActive = studentData.status === "ACTIVE" && !isExpired;

  return (
    <div className="flex flex-col items-center justify-center p-2 relative">
      
      {/* Gesture Pull hints */}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest pb-4 select-none animate-pulse">
        👆 Click Card To Flip · Double-Click Fullscreen
      </p>

      {/* Frame boundary capture wrapping - html2canvas captures this DOM node */}
      <div 
        id="id-card-frame-capture" 
        className={`relative transition-all duration-300 transform select-none ${
          isFullscreen 
            ? "scale-100 sm:scale-105 md:scale-110 z-40 my-8 shadow-[0_0_80px_rgba(30,58,138,0.2)]" 
            : "scale-100"
        }`}
      >
        {/* Anti-tampering border micro-pattern wrapping (concentric corner hairline borders) */}
        <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-[26px] pointer-events-none scale-[1.01]" />
        
        {/* Dynamic Card Shell with 3D Flip capability */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative transition-transform duration-700 select-none cursor-pointer rounded-[24px] overflow-hidden ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          } shadow-2xl border border-white/20 bg-slate-900/10 dark:bg-slate-950/20 backdrop-blur-xl`}
          style={{
            width: "100%",
            maxWidth: "420px",
            aspectRatio: "3/4.6",
            transformStyle: "preserve-3d",
            height: "560px",
          }}
        >
          {/* ==================== CARD FRONT FACE ==================== */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 overflow-hidden backface-hidden"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            {/* 1. Dynamic Mouse Follow Glare overlay (only desktop-hovered and front face active) */}
            {isHovered && !isFlipped && (
              <div
                className="absolute inset-0 pointer-events-none z-15 transition-opacity duration-200"
                style={{
                  background: `radial-gradient(circle 120px at ${hoverPosition.x}px ${hoverPosition.y}px, rgba(255,255,255,0.15) 0%, transparent 80%)`,
                }}
              />
            )}

            {/* 2. Holographic Rainbow Film sweeps (on Shake or Hologram burst action) */}
            {(hologramBurst || isActive) && (
              <div 
                className={`absolute inset-0 pointer-events-none z-10 mix-blend-color-dodge transition-all duration-1000 ${
                  hologramBurst 
                    ? "opacity-60 bg-[linear-gradient(135deg,rgba(255,0,0,0.4),rgba(0,255,0,0.4),rgba(0,0,255,0.4),rgba(255,0,0,0.4))] animate-spin" 
                    : "opacity-15 bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_70%)] animate-shimmer"
                }`}
                style={{
                  backgroundSize: hologramBurst ? "300% 300%" : "200% 100%",
                  animationDuration: hologramBurst ? "2s" : "4s",
                }}
              />
            )}

            {/* 3. Diagonal Repeated Watermark overlay (Student ID repeated) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex flex-wrap gap-8 items-center justify-center rotate-[-30px] scale-125 z-0 select-none">
              {Array.from({ length: 16 }).map((_, idx) => (
                <span key={idx} className="font-black text-sm tracking-widest text-white uppercase select-none">
                  {studentData.studentId}
                </span>
              ))}
            </div>

            {/* 4. Fine-line guilloche protective border frame (with security microtext) */}
            <div className="absolute inset-2 border border-white/5 rounded-[20px] pointer-events-none flex items-center justify-center z-2 select-none">
              <div 
                className="absolute inset-[1px] border border-dotted border-white/10 rounded-[19px]"
              />
              {/* Micro-text framing card contours */}
              <span className="absolute bottom-1 right-2 text-[5.5px] uppercase text-white/10 tracking-[0.25em] pointer-events-none font-bold">
                DIGITAL CARD • VERIFIED • METROPOLITAN INSTITUTE OF TECHNOLOGY
              </span>
            </div>

            {/* CARD TOP BRANDING PANEL */}
            <div className="relative z-20 text-center flex flex-col items-center pt-2 select-none">
              {/* University Logo Badge centered (70px height target) */}
              <div className="w-[70px] h-[70px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg relative p-2 overflow-hidden mb-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-indigo-900/10 pointer-events-none" />
                {/* Stunning custom SVG logo representation of shield + core electronics chip */}
                <svg viewBox="0 0 100 100" className="w-11 h-11 text-blue-400 drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]">
                  <path d="M50,15 L80,25 L80,55 C80,72 50,85 50,85 C50,85 20,72 20,55 L20,25 L50,15 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                  <circle cx="50" cy="50" r="14" fill="currentColor" className="text-primary-dark/80" />
                  <path d="M50,30 L50,70 M30,50 L70,50" stroke="currentColor" strokeWidth="5" />
                  <circle cx="50" cy="50" r="6" fill="white" />
                </svg>
              </div>

              <div>
                <h1 className="text-xs font-black tracking-[0.2em] text-white uppercase leading-none drop-shadow-md">
                  Metropolitan Institute
                </h1>
                <p className="text-[6.5px] text-zinc-400 font-extrabold uppercase tracking-[0.35em] pt-1 select-none">
                  Of Science & Technology
                </p>
                <div className="h-[1px] w-[140px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent my-1.5" />
                <h2 className="text-[8.5px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-sm leading-none">
                  Student Identification Card
                </h2>
              </div>
            </div>

            {/* CARD MIDDLE SECTION - PHOTO (LEFT) & METADATA (RIGHT) */}
            <div className="grid grid-cols-5 gap-3.5 items-center relative z-20 my-1">
              
              {/* STUDENT PHOTO (Left - Grid span 2) */}
              <div className="col-span-2 flex flex-col items-center">
                <div className="relative w-[110px] h-[140px] rounded-xl overflow-hidden border-2 border-white/20 select-none shadow-md group">
                  {/* Avatar wrapper */}
                  <img
                    src={studentData.photoUrl}
                    alt={studentData.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  />
                  {/* Dynamic absolute holographic vertical rainbow swipe animation */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_45%,rgba(255,255,255,0.7)_50%,transparent_55%)] bg-[size:100%_400%] animate-scan mix-blend-overlay opacity-80" />
                  {/* Security matrix micro-overlay lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none mix-blend-overlay" />
                </div>
                
                {/* Core ID Mono text */}
                <div className="pt-2 text-center select-text">
                  <p className="text-[6.5px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    Verified ID
                  </p>
                  <p className="text-[9.5px] font-extrabold text-blue-400 font-mono tracking-wider pt-0.5 select-all">
                    {studentData.studentId}
                  </p>
                </div>
              </div>

              {/* CARD DETAILS LIST PANEL (Right - Grid span 3) */}
              <div className="col-span-3 text-left space-y-2 select-text">
                
                {/* Scholar Legal Name */}
                <div className="space-y-0.5">
                  <span className="text-[6.5px] font-extrabold text-slate-500 uppercase tracking-widest block leading-none">
                    Scholar Full Name
                  </span>
                  <span className="text-sm font-black text-white block truncate leading-tight tracking-wide drop-shadow-sm select-all">
                    {studentData.fullName}
                  </span>
                </div>

                {/* Academic Stream & Division */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-blue-400 pointer-events-none" />
                    <span className="text-[6.5px] font-extrabold text-slate-500 uppercase tracking-widest leading-none block">
                      Program Stream
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-200 block truncate leading-none pt-[1px]">
                    {studentData.course}
                  </span>
                  <span className="text-[8.5px] font-bold text-slate-400 block truncate leading-none">
                    {studentData.department}
                  </span>
                </div>

                {/* Term and Year Semester */}
                {studentData.dob && (
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-emerald-400 pointer-events-none" />
                      <span className="text-[6.5px] font-extrabold text-slate-500 uppercase tracking-widest leading-none block">
                        Academic Standing
                      </span>
                    </div>
                    {/* Defaulting standing for display */}
                    <span className="text-[10px] font-black text-slate-200 block leading-none pt-[1px]">
                      Sophomore • Semester 4
                    </span>
                  </div>
                )}

                {/* Sub row - Blood group & GPA */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  
                  {/* Blood group */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Droplet className="w-2.5 h-2.5 text-red-500 pointer-events-none" />
                      <span className="text-[6px] font-extrabold text-slate-500 uppercase tracking-widest block leading-none">
                        Blood
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-100 block leading-none">
                      {studentData.bloodGroup || "O+"}
                    </span>
                  </div>

                  {/* GPA Score */}
                  <div className="space-y-0.5">
                    <span className="text-[6px] font-extrabold text-slate-500 uppercase tracking-widest block leading-none">
                      Rank/GPA
                    </span>
                    <span className="text-[10px] font-black text-slate-100 block leading-none">
                      {studentData.gpa || "3.84"} GPA
                    </span>
                  </div>

                </div>

                {/* Expiry Date Bounds with Countdown Warnings */}
                <div className="space-y-0.5 pt-0.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-slate-400 pointer-events-none" />
                    <span className="text-[6.5px] font-extrabold text-slate-500 uppercase tracking-widest block leading-none">
                      Valid Until
                    </span>
                  </div>
                  <div className="flex items-center gap-1 leading-none select-none">
                    <span className="text-[9.5px] font-bold text-slate-300">
                      {studentData.validUntil ? new Date(studentData.validUntil).toLocaleDateString() : "2027-06-30"}
                    </span>

                    {/* Expiry Warning Warning stamp */}
                    {showCountdown && (
                      <span className="text-[7.5px] font-black text-amber-400 bg-amber-450/15 border border-amber-400/20 px-1 py-0.5 rounded ml-1 animate-pulse">
                        ({daysRemaining}d Left)
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* CARD BOTTOM SECTION - BARCODE, STATUS, OR DYNAMIC LOGIC */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-20 select-none">
              
              {/* Bottom Left Panel: Status + Fee validation */}
              <div className="flex flex-col gap-2">
                {/* Active/Blocked indicator */}
                <div>
                  <span className="text-[6.5px] font-extrabold text-slate-500 uppercase tracking-widest block leading-none">
                    Access Ledger
                  </span>
                  <div className="flex items-center gap-1.5 pt-1">
                    {/* Breathing Pulsing indicator dot */}
                    <span className="relative flex h-2.5 w-2.5">
                      {isActive && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        isActive 
                          ? "bg-emerald-500" 
                          : isBlocked 
                          ? "bg-red-500" 
                          : "bg-slate-500"
                      }`} />
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      isActive 
                        ? "text-emerald-400" 
                        : isBlocked 
                        ? "text-red-400" 
                        : "text-slate-400"
                    }`}>
                      {isActive ? "ACTIVE VERIFIED" : isBlocked ? "BLOCKED/LOST" : "EXPIRED"}
                    </span>
                  </div>
                </div>

                {/* Custom animated bouncing Fee Grant Sticker */}
                <motion.div 
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                  className="w-fit border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider shadow-xs select-none"
                >
                  Scholarship Granted ✓
                </motion.div>
              </div>

              {/* Center Barcode Pattern representing physical ID coding */}
              <div className="absolute left-[36%] bottom-1 select-none flex flex-col items-center justify-center opacity-65 group-hover:opacity-100 transition-opacity">
                {/* Real svg lines barcode wrapper */}
                <div className="flex items-end h-[28px] gap-[2px]">
                  {[1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1].map((weight, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-[1px] h-full" 
                      style={{ width: `${weight}px` }} 
                    />
                  ))}
                </div>
                <span className="text-[5.5px] font-mono font-bold text-slate-500 tracking-[0.2em] pt-0.5 leading-none uppercase">
                  *CP-{studentData.studentId}*
                </span>
              </div>

              {/* Bottom Right Panel: Encrypted rotating dynamic QR Code */}
              <div className="text-right">
                <span className="text-[6.5px] font-extrabold text-slate-500 uppercase tracking-widest block leading-none pb-1.5">
                  Dynamic OTP
                </span>
                <div 
                  className="p-1.5 bg-white rounded-lg border border-slate-200 inline-block shadow-sm relative overflow-hidden group select-none animate-pulse hover:animate-none scale-95"
                  style={{ animationDuration: "3s" }}
                >
                  <QRCodeSVG
                    value={`SECURE_TOKEN_CARD_DECRYPT_ID_${studentData.studentId}_TIME_${Date.now()}`}
                    size={46}
                    bgColor="#ffffff"
                    fgColor="#020617"
                    level="H"
                  />
                  {/* Holographic scanning laser sweeping line */}
                  <div className="absolute inset-x-0 h-[2px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-bounce text-[0px]" style={{ animationDuration: "2s" }} />
                </div>
              </div>

            </div>

            {/* Offline notification badge overlay */}
            {isOffline && (
              <div className="absolute top-4 right-4 z-30 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 border border-amber-400 text-[8px] font-black text-black rounded-full shadow-md leading-none select-none animate-pulse">
                <WifiOff className="w-3 h-3 text-black" />
                OFFLINE CACHED PASS
              </div>
            )}
          </div>

          {/* ==================== CARD BACK FACE ==================== */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 overflow-hidden backface-hidden [transform:rotateY(180deg)]"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            {/* 1. Diagonal repeating card security background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-wrap gap-12 items-center justify-center rotate-[-30px] scale-125 z-0 select-none">
              {Array.from({ length: 25 }).map((_, idx) => (
                <span key={idx} className="font-extrabold text-[10px] tracking-widest text-white uppercase select-none">
                  MIT SECURITY
                </span>
              ))}
            </div>

            {/* 2. Concentric Guilloche corner accents back face */}
            <div className="absolute inset-2 border border-white/5 rounded-[20px] pointer-events-none z-2 select-none" />

            {/* Magnetic Stripe top element (40px height target) */}
            <div className="w-full h-10 bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 absolute top-6 left-0 border-y border-white/5 shadow-inner" />

            {/* Back upper body: College contact credentials */}
            <div className="relative z-20 pt-12 text-center text-slate-300 space-y-1 mt-1 select-text">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white">
                Metropolitan Institute of Technology
              </h3>
              <p className="text-[8px] font-medium text-slate-400 tracking-wider flex items-center justify-center gap-1.5 leading-none">
                <MapPin className="w-2.5 h-2.5 text-blue-400 pointer-events-none" />
                128 University Ave, Campus Gate, Metropolis
              </p>
              <p className="text-[7.5px] font-mono text-slate-500 tracking-wide select-none">
                WEB: passes.mit.edu · registrar@mit.edu
              </p>
            </div>

            {/* Middle Back Panel: Access checkmarks, Emer contacts */}
            <div className="relative z-20 space-y-3 pt-3">
              
              {/* Emergency Contact highlighted with red left boundary */}
              <div className="border-l-[3px] border-red-500 bg-red-950/20 pl-3.5 py-1.5 rounded-r-xl text-left select-text space-y-1">
                <span className="text-[7.5px] font-extrabold text-red-400 uppercase tracking-widest block leading-none">
                  ⚠️ Emergency Medical & Sponsor Contact
                </span>
                <div className="space-y-[1px] text-[10px] font-medium">
                  <p className="text-slate-100 font-bold block truncate">
                    Guardian: <span className="font-mono">{studentData.guardian || "Robert Miller"}</span>
                  </p>
                  <p className="text-slate-350 leading-none pb-[1px] select-all font-semibold flex items-center gap-1 pt-0.5">
                    <PhoneCall className="w-2.5 h-2.5 text-slate-400 pointer-events-none" />
                    Phone: {studentData.phone || "+1 (555) 012-3456"}
                  </p>
                  <p className="text-slate-400 leading-none truncate select-all">
                    Email: admin.sponsor@gmail.com
                  </p>
                </div>
              </div>

              {/* Access permission rights checklist with green tickers */}
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-left">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block leading-none pb-2 select-none">
                  Active Access Permissions Clearance
                </span>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[10px] font-bold text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 pointer-events-none" />
                    Library Entrance ✓
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 pointer-events-none" />
                    Computer Lab ✓
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 pointer-events-none" />
                    Central Canteen ✓
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 pointer-events-none" />
                    Sports Complex ✓
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 pointer-events-none" />
                    Academic Hostels & Housing Complexes ✓
                  </div>
                </div>
              </div>

            </div>

            {/* Back face lower panel: holographics signs + T&C */}
            <div className="space-y-2 relative z-20 pb-2">
              
              {/* Digital signature area displaying custom dynamic SVG signature shape */}
              <div className="bg-slate-950/40 border border-dashed border-white/10 p-2.5 rounded-xl text-left select-none relative group">
                <span className="text-[5.5px] font-extrabold text-slate-500 uppercase tracking-widest block leading-none pb-1 pb-1.5">
                  Holographic Digital Signature Certificate
                </span>
                <div className="h-6 flex items-center justify-center text-sky-400">
                  {/* Clean SVG cursive handwritten signature sketch */}
                  <svg viewBox="0 0 200 60" className="w-28 h-full filter drop-shadow-[0_1px_4px_rgba(56,189,248,0.5)]">
                    <path
                      d="M20,40 Q40,15 50,30 T75,25 T95,35 T120,20 T150,35 Q170,20 180,30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M100,45 L130,42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="text-[5px] font-mono text-slate-500 text-center uppercase tracking-widest pt-1 leading-none select-none">
                  ID Holder Encryption Validation Seal
                </div>
              </div>

              {/* T&C Small Text */}
              <p className="text-[6.5px] text-slate-400 leading-normal text-center select-none">
                This document is a microchip credential of Metropolitan Institute of Technology. Use is subject to university charter regulations. If discovered, please deliver directly to the registrar desk or physical security gates.
              </p>

              {/* Card specs version details */}
              <div className="flex justify-between items-center text-[6px] font-bold text-slate-505 select-none pt-1">
                <span>SYSTEM VERSION CODE: ISO-CRM-v4.61</span>
                <span>CHIP VER: RFID NFC S20</span>
              </div>

            </div>

          </div>

          {/* ==================== SCREENSHOT VIOLATION BLUR COVER ==================== */}
          <AnimatePresence>
            {(isBlurred || showWarning) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-950/95 backdrop-blur-[30px] p-6 text-center select-none"
              >
                <div className="p-4 bg-red-500/15 border border-red-500/35 text-red-500 rounded-full animate-pulse mb-4">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">
                  ⚠️ Screenshots Restricted
                </h3>
                <p className="text-[10px] text-slate-400 leading-normal max-w-xs pt-1.5">
                  Screenshots are completely blocked. Active security auditors have hidden credentials contents to prevent illegal copy risks on campus.
                </p>
                <button
                  type="button"
                  onClick={resetProtection}
                  className="mt-4 px-4 py-2 border border-red-505/20 hover:bg-red-955 text-red-400 text-xs font-bold rounded-xl transition-all"
                >
                  Confirm Awareness
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== CARD STATUS BLOCKED STAMP OVERLAY ==================== */}
          {isBlocked && (
            <div className="absolute inset-0 z-40 bg-red-900/60 flex items-center justify-center select-none pointer-events-none">
              <div className="border-[6px] border-red-500 text-red-500 text-2xl font-black px-6 py-3 rounded-2xl rotate-[-25deg] shadow-lg bg-black/90 tracking-widest uppercase">
                INVALIDATED / BLOCKED
              </div>
            </div>
          )}

          {/* ==================== CARD STATUS EXPIRED STAMP OVERLAY ==================== */}
          {isExpired && !isBlocked && (
            <div className="absolute inset-0 z-40 bg-slate-950/75 flex items-center justify-center select-none pointer-events-none">
              <div className="border-[6px] border-slate-500 text-slate-500 text-2xl font-black px-6 py-3 rounded-2xl rotate-[-25deg] shadow-lg bg-black/90 tracking-widest uppercase">
                CARD EXPIRED
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
