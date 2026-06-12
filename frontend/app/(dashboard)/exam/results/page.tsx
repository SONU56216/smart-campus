"use client";

import { useExam } from "@/hooks/useExam";
import ResultsTable, { ScoreItem } from "@/components/exam/ResultsTable";
import CGPAChart, { SemesterGpa } from "@/components/exam/CGPAChart";
import { Loader2, Award, Download, RefreshCcw, HelpCircle, ShieldCheck, ArrowRight, ListFilter, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ExamResultsPage() {
  const router = useRouter();
  const { useResults } = useExam();
  const { data: resultsData, isLoading } = useResults();

  const [selectedSemester, setSelectedSemester] = useState(4);
  const [isRevalModalOpen, setIsRevalModalOpen] = useState(false);
  const [revalSubject, setRevalSubject] = useState("");
  const [submittingReval, setSubmittingReval] = useState(false);

  // Fallback mocks if resultsData or evaluations aren't published
  const currentSgpa = resultsData?.sgpa ?? 8.78;
  const overallCgpa = 8.92;

  const mockHistoryGpa: SemesterGpa[] = [
    { semester: "Sem 1", sgpa: 8.4 },
    { semester: "Sem 2", sgpa: 9.1 },
    { semester: "Sem 3", sgpa: 8.6 },
    { semester: "Sem 4", sgpa: 8.78 },
  ];

  const getSyllabusScores = (): ScoreItem[] => {
    // Filter evaluations by selected semester
    if (selectedSemester === 1) {
      return [
        { id: "1", subjectCode: "CS-101", subjectName: "Programming in C & Assembly", maxMarks: 100, obtainedMarks: 82, grade: "A", result: "PASS", credits: 4 },
        { id: "2", subjectCode: "MA-101", subjectName: "Engineering Mathematics I", maxMarks: 100, obtainedMarks: 94, grade: "O", result: "PASS", credits: 4 },
        { id: "3", subjectCode: "PH-101", subjectName: "Engineering Physics & Optics", maxMarks: 100, obtainedMarks: 80, grade: "A", result: "PASS", credits: 3 },
        { id: "4", subjectCode: "ME-102", subjectName: "Applied Workshop & Graphics", maxMarks: 100, obtainedMarks: 75, grade: "B", result: "PASS", credits: 3 },
      ];
    }
    if (selectedSemester === 2) {
      return [
        { id: "1", subjectCode: "CS-201", subjectName: "Data Structures & Algorithms", maxMarks: 100, obtainedMarks: 91, grade: "O", result: "PASS", credits: 4 },
        { id: "2", subjectCode: "MA-202", subjectName: "Discrete Mathematical Structures", maxMarks: 100, obtainedMarks: 88, grade: "A+", result: "PASS", credits: 3 },
        { id: "3", subjectCode: "CS-202", subjectName: "Object Oriented Architectures", maxMarks: 100, obtainedMarks: 95, grade: "O", result: "PASS", credits: 4 },
        { id: "4", subjectCode: "CH-201", subjectName: "Environmental Chemistry", maxMarks: 100, obtainedMarks: 68, grade: "B", result: "PASS", credits: 2 },
      ];
    }
    if (selectedSemester === 3) {
      return [
        { id: "1", subjectCode: "CS-301", subjectName: "Computer Organization & Design", maxMarks: 100, obtainedMarks: 84, grade: "A", result: "PASS", credits: 4 },
        { id: "2", subjectCode: "CS-302", subjectName: "Operating Systems Principles", maxMarks: 100, obtainedMarks: 89, grade: "A+", result: "PASS", credits: 4 },
        { id: "3", subjectCode: "CS-303", subjectName: "Formal Languages & Automata", maxMarks: 100, obtainedMarks: 78, grade: "B+", result: "PASS", credits: 3 },
        { id: "4", subjectCode: "HM-301", subjectName: "Business Economics & Finance", maxMarks: 100, obtainedMarks: 82, grade: "A", result: "PASS", credits: 3 },
      ];
    }

    // Default: Sem 4
    return [
      { id: "1", subjectCode: "CS-401", subjectName: "Compiler Design & Automation", maxMarks: 100, obtainedMarks: 86, grade: "A+", result: "PASS", credits: 4 },
      { id: "2", subjectCode: "CS-402", subjectName: "Artificial Intelligence & Heuristics", maxMarks: 100, obtainedMarks: 92, grade: "O", result: "PASS", credits: 4 },
      { id: "3", subjectCode: "CS-403", subjectName: "Software Testing & Methodologies", maxMarks: 100, obtainedMarks: 80, grade: "A", result: "PASS", credits: 3 },
      { id: "4", subjectCode: "CS-404", subjectName: "Advanced Computer Networks", maxMarks: 100, obtainedMarks: 85, grade: "A", result: "PASS", credits: 3 },
      { id: "5", subjectCode: "HM-402", subjectName: "Professional Ethics & Corporate Law", maxMarks: 100, obtainedMarks: 90, grade: "O", result: "PASS", credits: 2 },
    ];
  };

  const currentScores = getSyllabusScores();

  // Downloads scorecard PDF
  const handleDownloadMarksheet = () => {
    toast.loading("Compiling official academic transcript sheet...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Semester transcript generated and downloaded successfully.");
    }, 1500);
  };

  // Revaluation submissions
  const handleRevalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revalSubject) {
      toast.error("Please choose a target course subject to re-evaluate.");
      return;
    }

    setSubmittingReval(true);
    toast.loading("Filing official auditing claim...");
    
    setTimeout(() => {
      setSubmittingReval(false);
      setIsRevalModalOpen(false);
      toast.dismiss();
      toast.success(`Audit request locked for: ${revalSubject}. You will be notified of changes.`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
        <p className="text-[10px] text-slate-550 font-black uppercase tracking-widest leading-none">
          Securing evaluators transcript ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-6xl mx-auto py-2">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Official Grade Card Transcript
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase">
            Official credit appraisal index reflecting academic cycles
          </p>
        </div>

        {/* Top controls row */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadMarksheet}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            Download Marksheet
          </button>
          
          <button
            onClick={() => setIsRevalModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <RefreshCcw className="w-4 h-4 text-amber-500" />
            Apply Re-evaluation
          </button>
        </div>
      </div>

      {/* 1. CGPA Metric Gauges and Progression charts */}
      <CGPAChart
        currentSgpa={currentSgpa}
        cgpa={overallCgpa}
        history={mockHistoryGpa}
      />

      {/* 2. Semester Filter Selector block */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-900/10 border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-slate-500" />
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">
            Select Evaluation Semester
          </span>
        </div>

        {/* Semester select pills */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-all cursor-pointer ${
                selectedSemester === sem
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-900 text-slate-400 border border-white/5 hover:bg-slate-850 hover:text-white"
              }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Subject wise Result table */}
      <ResultsTable scores={currentScores} />

      {/* Helper disclaimer */}
      <div className="p-4 bg-slate-900/25 border border-white/5 text-left rounded-2xl flex gap-3 text-xs font-medium text-slate-400 leading-relaxed">
        <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <span className="text-[10.5px] uppercase tracking-wide">
          Official printed transcripts carry university seals, dual signatures of the registrar and can be retrieved directly from central university administrative registry decks.
        </span>
      </div>

      {/* APPLY REVALUATION OVERLAY MODAL */}
      {isRevalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <form
            onSubmit={handleRevalSubmit}
            className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-md w-full space-y-6 text-left relative overflow-hidden animate-scale-in"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header info */}
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl">
                <RefreshCcw className="w-6 h-6 animate-spin [animation-duration:10s]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-amber-400 tracking-widest uppercase">
                  Academic Auditing Office
                </span>
                <h4 className="text-base font-black text-white uppercase tracking-wider">
                  Re-evaluation Audit Filing
                </h4>
              </div>
            </div>

            {/* Selector dropdown */}
            <div className="space-y-2 select-none text-left">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Choose Syllabus Course Subject *
              </label>
              <select
                value={revalSubject}
                onChange={(e) => setRevalSubject(e.target.value)}
                className="w-full bg-slate-950/50 hover:bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-white uppercase font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
                required
              >
                <option value="">-- Choose target subject --</option>
                {currentScores.map((score) => (
                  <option key={score.subjectCode} value={score.subjectName}>
                    {score.subjectCode} - {score.subjectName} (Grade: {score.grade})
                  </option>
                ))}
              </select>
            </div>

            {/* Invoicing detail info */}
            <div className="p-4 bg-slate-950 rounded-2xl space-y-2.5 border border-white/5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider">Audit Fee (Per Module)</span>
                <span className="text-white font-bold">₹1,200</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 font-bold text-white text-sm">
                <span className="text-[10px] uppercase font-black text-amber-500 font-sans">Payment Due</span>
                <span>₹1,200</span>
              </div>
            </div>

            {/* Accommodations checklist */}
            <div className="space-y-1 bg-amber-500/10 border border-amber-500/15 p-3 rounded-xl flex gap-2 text-[10px] uppercase text-amber-400 font-semibold leading-relaxed">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Note: Revaluation claims cannot be revoked once filed. Retrying audits checks paper tallies entirely.</span>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRevalModalOpen(false)}
                className="flex-1 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Decline
              </button>
              <button
                type="submit"
                disabled={submittingReval}
                className="flex-1 py-3 text-xs font-black bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                {submittingReval ? "Filing..." : "Confirm & Pay"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
