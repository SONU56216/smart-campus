"use client";

import { useExam } from "@/hooks/useExam";
import { useStudent } from "@/hooks/useStudent";
import AdmitCardPreview from "@/components/exam/AdmitCardPreview";
import ExamCountdown from "@/components/exam/ExamCountdown";
import SeatAssignment from "@/components/exam/SeatAssignment";
import ExamSchedule from "@/components/exam/ExamSchedule";
import { Loader2, Calendar, ClipboardCheck, ArrowLeft, ShieldCheck, Map, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdmitCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdFilter = searchParams.get("formId");

  const { useMyAdmitCards, useSchedule, useSyncWalletCard } = useExam();
  const { useProfile } = useStudent();

  const { data: student, isLoading: loadingStudent } = useProfile();
  const { data: cards, isLoading: loadingCards } = useMyAdmitCards();
  const { data: scheduleData, isLoading: loadingSchedule } = useSchedule(
    student?.course,
    student?.semester
  );

  const walletSyncMutation = useSyncWalletCard();

  // Find a released card. If a specific formId filter is requested, target it first.
  const activeCard = cards?.find((c) => {
    if (formIdFilter) {
      return c.examFormId === formIdFilter;
    }
    return c.isReleased;
  }) || cards?.find((c) => c.isReleased);

  const isReleased = !!activeCard;

  // Let's create a beautiful structured examination schedules table
  // mapping from scheduleData or falling back to default syllabus timetables
  const examEvents = scheduleData?.map((item: any) => ({
    date: item.date || "18 Dec 2024",
    day: item.day || "Wednesday",
    time: item.time || "10:00 AM - 01:00 PM",
    subjectCode: item.subjectCode || "CS-401",
    subjectName: item.subjectName || "Compiler Design",
    room: item.room || "HALL-Block-B",
    seatNo: item.seatNo || "A-23",
  })) || [
    { date: "16 Dec 2024", day: "Monday", time: "10:00 AM - 01:00 PM", subjectCode: "CS-401", subjectName: "Compiler Design & Automation", room: "CS-BLOCK-A", seatNo: "A-12" },
    { date: "18 Dec 2024", day: "Wednesday", time: "10:00 AM - 01:00 PM", subjectCode: "CS-402", subjectName: "Artificial Intelligence & Heuristics", room: "CS-BLOCK-A", seatNo: "B-04" },
    { date: "20 Dec 2024", day: "Friday", time: "10:00 AM - 01:00 PM", subjectCode: "CS-403", subjectName: "Software Testing & Methodologies", room: "CS-BLOCK-A", seatNo: "C-15" },
    { date: "23 Dec 2024", day: "Monday", time: "10:00 AM - 01:00 PM", subjectCode: "CS-404", subjectName: "Advanced Computer Networks", room: "CS-BLOCK-A", seatNo: "D-09" },
    { date: "26 Dec 2024", day: "Thursday", time: "10:00 AM - 12:00 PM", subjectCode: "HM-402", subjectName: "Professional Ethics & Corporate Law", room: "CS-BLOCK-A", seatNo: "E-18" },
  ];

  // Action for digital wallet synchronization
  const handleWalletSync = async () => {
    if (!activeCard) return;
    try {
      await walletSyncMutation.mutateAsync(activeCard.id);
    } catch (e) {
      // toast is automatically thrown inside the hook implementation
    }
  };

  const isLoading = loadingStudent || loadingCards || loadingSchedule;

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
        <p className="text-[10px] text-slate-550 font-black uppercase tracking-widest leading-none">
          Decrypting digital credential badges...
        </p>
      </div>
    );
  }

  // target countdown unlock: let's pick a simulated date in the future
  const releaseTargetDate = "2026-12-15T09:00:00Z";

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-6xl mx-auto py-2">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            Hall Tickets Ledger
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase">
            Official pass issued once form registration checks are verified.
          </p>
        </div>

        <button
          onClick={() => router.push("/exam/forms")}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Forms Catalog
        </button>
      </div>

      {/* Conditional rendering depending on whether card is released */}
      {!isReleased ? (
        /* If not released, show Countdown block */
        <div className="space-y-8 py-4">
          <ExamCountdown
            targetDate={releaseTargetDate}
            title="Secured Hall Entry Passes Release Date"
            subtitle="Central controller is auditing entry schedules. Countdown timer reflects release slot."
          />
          
          <div className="border border-white/5 p-6 rounded-[28px] bg-slate-900/10 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Expected Examination Schedule Draft (Preview)
            </h4>
            <ExamSchedule events={examEvents} />
          </div>
        </div>
      ) : (
        /* Released Hall Admit Card */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Beautiful secure printout card preview */}
            <AdmitCardPreview
              student={{
                fullName: student?.fullName ?? "Sample Student",
                rollNumber: student?.rollNumber ?? "MU-1002341",
                course: student?.course ?? "B.Tech Computer Science Engineering",
                semester: student?.semester ?? 4,
                photo: student?.photo,
              }}
              examCenter={activeCard?.examCenter ?? "Computer Science Block A - Delhi Campus"}
              admitCardId={activeCard?.id ?? "ADM_TOKEN_EX_43292"}
              schedule={examEvents}
              onWalletSync={handleWalletSync}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            
            {/* Seating Layout map block */}
            <SeatAssignment
              roomName={activeCard?.examCenter ? activeCard.examCenter.split("-")[0] : "BLOCK-A"}
              selectedSeat={examEvents[0]?.seatNo ?? "A-12"}
              totalSeats={40}
            />

            {/* Quick Helper Notice */}
            <div className="p-5 bg-blue-500/10 border border-blue-500/20 text-left rounded-2xl flex gap-3 text-xs font-medium leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">
                  Security Certificate Verification
                </span>
                <p className="text-[10px] uppercase text-blue-300 leading-normal font-semibold">
                  This card utilizes anti-screenshot, tamper-proof and double-sealed QR verifications. Any unauthorized redistribution or duplication is strictly logged.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
