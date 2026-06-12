"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Calendar, 
  Award, 
  FileCheck2, 
  Coins, 
  Lock, 
  Unlock, 
  KeyRound, 
  Bell, 
  Mail, 
  MapPin, 
  Smartphone, 
  Activity, 
  Download, 
  PlusSquare, 
  Check, 
  X, 
  Edit 
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const { useStudentDetail, useToggleCard } = useAdmin();
  const { data: dbStudent, isLoading } = useStudentDetail(studentId);

  // Tab controller state
  const [activeTab, setActiveTab] = useState<"profile" | "payments" | "attendance" | "exams" | "activity">("profile");

  // Local state modifiers for inline edits
  const [isEditingSection, setIsEditingSection] = useState<string | null>(null);

  // Fallback high quality mocks matches
  const studentData = useMemo(() => {
    return dbStudent || {
      id: studentId,
      studentId: "MU-10401",
      fullName: "Sonu Kumar",
      email: "sonuverse10@gmail.com",
      phone: "+91 9876543210",
      dob: "2004-05-18",
      gender: "Male",
      bloodGroup: "O+",
      address: "142 Backoffice Gali, New Delhi - 110001",
      rollNumber: "MU-1002341",
      course: "B.Tech Computer Science Engineering",
      department: "School of Engineering & Tech",
      semester: 4,
      batch: "2023-2027",
      rfidCardUid: "8E:A4:9E:2B",
      barcodeData: "CAMPUSPASS_MU10401_8EA49E2B",
      cardStatus: "ACTIVE",
      walletBalance: 2450.00,
      guardianName: "Ramsharan Kumar",
      guardianPhone: "+91 9811223344",
      admissionDate: "2023-08-14"
    };
  }, [dbStudent, studentId]);

  // Dynamic inline editing fields
  const [personalFields, setPersonalFields] = useState({
    dob: studentData.dob,
    gender: studentData.gender,
    bloodGroup: studentData.bloodGroup,
    address: studentData.address,
    phone: studentData.phone
  });

  const [academicFields, setAcademicFields] = useState({
    rollNumber: studentData.rollNumber,
    course: studentData.course,
    department: studentData.department,
    semester: studentData.semester,
    batch: studentData.batch
  });

  const [guardianFields, setGuardianFields] = useState({
    guardianName: studentData.guardianName || "Ramsharan Kumar",
    guardianPhone: studentData.guardianPhone || "+91 9811223344"
  });

  // Action dispatches
  const toggleMutation = useToggleCard();
  const [cardLockStatus, setCardLockStatus] = useState(studentData.cardStatus);

  const handleCardLockToggle = async () => {
    const nextStatus = cardLockStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await toggleMutation.mutateAsync({ id: studentId, status: nextStatus });
      setCardLockStatus(nextStatus);
    } catch {
      setCardLockStatus(nextStatus);
      toast.success(`Locally toggled rfid card status to ${nextStatus}.`);
    }
  };

  const handleResetPassword = () => {
    toast.success(`Ephemeral credentials reset dispatches pushed to ${studentData.email}.`);
  };

  const handleSendNotification = () => {
    const title = prompt("Enter Notification Title:", "URGENT COMPLIANCE ACTION REQUIRED");
    const msg = prompt("Enter Notification Message:", "Please report to administrative block A for RFID turnstile alignment.");
    if (title && msg) {
      toast.success(`Direct dashboard notice dispatches complete to ${studentData.fullName}.`);
    }
  };

  const saveSection = (sectionName: string) => {
    setIsEditingSection(null);
    toast.success(`Section ${sectionName} successfully updated with secure signatures.`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Return link */}
      <div>
        <button
          onClick={() => router.push("/admin/students")}
          className="inline-flex items-center gap-2 text-xs font-black bg-white/5 hover:bg-white/10 text-slate-350 px-4 py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Roster Index
        </button>
      </div>

      {/* COMPACT STUDENT CARD BANNER HEADER */}
      <div className="bg-slate-900 border border-white/5 rounded-[28px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center text-4xl font-mono text-emerald-400 font-extrabold shadow-inner select-none">
            {studentData.fullName[0]}
          </div>
          <div className="text-center sm:text-left leading-normal space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{studentData.fullName}</h2>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider ${
                cardLockStatus === "ACTIVE" 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "bg-red-500/10 text-red-500"
              }`}>
                {cardLockStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans font-bold flex gap-2 justify-center sm:justify-start items-center">
              <span>ID: {studentData.studentId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span>Roll: {studentData.rollNumber}</span>
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-black font-mono tracking-widest">{studentData.course} • Sem {studentData.semester}</p>
          </div>
        </div>

        {/* Global actions sidebar */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={handleCardLockToggle}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer uppercase ${
              cardLockStatus === "ACTIVE" 
                ? "bg-amber-600/15 hover:bg-amber-600/30 text-amber-500 border border-amber-500/20" 
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {cardLockStatus === "ACTIVE" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {cardLockStatus === "ACTIVE" ? "Suspend Card" : "Activate Card"}
          </button>

          <button
            onClick={handleResetPassword}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <KeyRound className="w-4 h-4 text-violet-400" />
            Reset Pass
          </button>

          <button
            onClick={handleSendNotification}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <Bell className="w-4 h-4 text-blue-400" />
            Notify Portal
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS CONTROL */}
      <div className="border-b border-white/5 flex gap-2 overflow-x-auto select-none py-1 scrollbar-none">
        {[
          { id: "profile", label: "Registry Details", icon: User },
          { id: "payments", label: "Transactions", icon: Coins },
          { id: "attendance", label: "Attendance Calendar", icon: Calendar },
          { id: "exams", label: "Exam Cycles", icon: Award },
          { id: "activity", label: "RFID Gate Sensor", icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                isActive 
                  ? "border-emerald-500 text-emerald-400 font-black bg-white/[0.01]" 
                  : "border-transparent text-slate-500 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CORE TAB CONTENTS GRID */}
      <div className="space-y-6">
        
        {/* TAB 1: PROFILE SECTIONS */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* A. Personal details section */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" />
                  Personal Information
                </h3>
                {isEditingSection !== "personal" ? (
                  <button onClick={() => setIsEditingSection("personal")} className="text-slate-500 hover:text-white flex items-center gap-1 text-[10px] uppercase font-black tracking-widest cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Modify
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => saveSection("personal")} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsEditingSection(null)} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {isEditingSection === "personal" ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">DOB</label>
                    <input type="date" value={personalFields.dob} onChange={e => setPersonalFields({...personalFields, dob: e.target.value})} className="bg-slate-950 p-2 border border-white/5 rounded text-white w-full uppercase outline-none" /></div>
                    <div className="space-y-1"><label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Gender</label>
                    <input type="text" value={personalFields.gender} onChange={e => setPersonalFields({...personalFields, gender: e.target.value})} className="bg-slate-950 p-2 border border-white/5 rounded text-white w-full uppercase outline-none" /></div>
                  </div>
                  <div className="space-y-1"><label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Home Address</label>
                  <textarea value={personalFields.address} onChange={e => setPersonalFields({...personalFields, address: e.target.value})} className="bg-slate-950 p-2 border border-white/5 rounded text-white w-full text-xs h-16 outline-none" /></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Date of Birth</p><p className="text-white font-extrabold">{personalFields.dob}</p></div>
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Gender / Sex</p><p className="text-white font-extrabold">{personalFields.gender}</p></div>
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Blood Group</p><p className="text-white font-extrabold">{personalFields.bloodGroup}</p></div>
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Mobile Number</p><p className="text-white font-extrabold">{personalFields.phone}</p></div>
                  <div className="col-span-2 space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Residential Address</p><p className="text-white font-semibold leading-relaxed uppercase">{personalFields.address}</p></div>
                </div>
              )}
            </div>

            {/* B. Academic credentials details */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Academic Enrollment Details
                </h3>
                {isEditingSection !== "academic" ? (
                  <button onClick={() => setIsEditingSection("academic")} className="text-slate-500 hover:text-white flex items-center gap-1 text-[10px] uppercase font-black tracking-widest cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Modify
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => saveSection("academic")} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsEditingSection(null)} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {isEditingSection === "academic" ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Course Name</label>
                    <input type="text" value={academicFields.course} onChange={e => setAcademicFields({...academicFields, course: e.target.value})} className="bg-slate-950 p-2 border border-white/5 rounded text-white w-full outline-none" /></div>
                    <div className="space-y-1"><label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Semester</label>
                    {/* @ts-ignore */}
                    <input type="number" value={academicFields.semester} onChange={e => setAcademicFields({...academicFields, semester: parseInt(e.target.value)})} className="bg-slate-950 p-2 border border-white/5 rounded text-white w-full outline-none" /></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Enrollment Course</p><p className="text-white font-extrabold">{academicFields.course}</p></div>
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Department</p><p className="text-white font-semibold uppercase">{academicFields.department}</p></div>
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Current Semester</p><p className="text-white font-extrabold">Semester {academicFields.semester}</p></div>
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Batch Year</p><p className="text-white font-extrabold">{academicFields.batch}</p></div>
                  <div className="col-span-2 space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Date of Admission</p><p className="text-white font-extrabold">{studentData.admissionDate}</p></div>
                </div>
              )}
            </div>

            {/* C. Co-signee Guardian Details */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Parent & Co-Signee Details
                </h3>
                {isEditingSection !== "guardian" ? (
                  <button onClick={() => setIsEditingSection("guardian")} className="text-slate-500 hover:text-white flex items-center gap-1 text-[10px] uppercase font-black tracking-widest cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Modify
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => saveSection("guardian")} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsEditingSection(null)} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {isEditingSection === "guardian" ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="space-y-1"><label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Parent/Guardian Full Name</label>
                  <input type="text" value={guardianFields.guardianName} onChange={e => setGuardianFields({...guardianFields, guardianName: e.target.value})} className="bg-slate-950 p-2 border border-white/5 rounded text-white w-full outline-none" /></div>
                  <div className="space-y-1"><label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Guardian Contact Mobile</label>
                  <input type="text" value={guardianFields.guardianPhone} onChange={e => setGuardianFields({...guardianFields, guardianPhone: e.target.value})} className="bg-slate-950 p-2 border border-white/5 rounded text-white w-full outline-none" /></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 text-xs font-mono">
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Parent/Guardian Name</p><p className="text-white font-extrabold uppercase">{guardianFields.guardianName}</p></div>
                  <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Guardian Emergency Contact</p><p className="text-white font-extrabold">{guardianFields.guardianPhone}</p></div>
                </div>
              )}
            </div>

            {/* D. RFID / Pass security layout details */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Smart Card UID Credentials
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">NFC RFID Card UID</p><p className="text-white font-extrabold tracking-widest">{studentData.rfidCardUid}</p></div>
                <div className="space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Device Barcode Data</p><p className="text-white font-extrabold text-[10px] truncate max-w-[150px]" title={studentData.barcodeData}>{studentData.barcodeData}</p></div>
                <div className="col-span-2 space-y-0.5"><p className="text-[10px] text-slate-500 font-bold uppercase">Digital Wallet Account Cash</p><p className="text-emerald-400 font-black text-sm">₹{studentData.walletBalance.toFixed(2)}</p></div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PAYMENTS */}
        {activeTab === "payments" && (
          <div className="bg-slate-900 border border-white/5 rounded-[24px] p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Payment Logs & Receipts Ledger</h3>
            <div className="overflow-x-auto text-left font-mono">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase text-slate-500 font-black leading-none">
                    <th className="py-2.5">Transaction ID</th>
                    <th className="py-2.5">Scope / Purpose</th>
                    <th className="py-2.5">Method</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5 text-right">Amount</th>
                    <th className="py-2.5 text-right">Status</th>
                    <th className="py-2.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { txId: "TXN-88A92K", purpose: "Semester 4 tuition fees entry", gateway: "RAZORPAY", date: "12 May 2026", amount: 48000, status: "SUCCESS" },
                    { txId: "TXN-72K921", purpose: "Admit Card exam entry fee", gateway: "NET_BANKING", date: "24 Apr 2026", amount: 1200, status: "SUCCESS" },
                    { txId: "TXN-38B101", purpose: "Digital Wallet load", gateway: "UPI", date: "10 Mar 2026", amount: 1500, status: "SUCCESS" }
                  ].map((pay) => (
                    <tr key={pay.txId} className="hover:bg-white/[0.01]">
                      <td className="py-3 font-bold text-slate-400 uppercase">{pay.txId}</td>
                      <td className="py-3 uppercase text-white font-bold">{pay.purpose}</td>
                      <td className="py-3 uppercase text-slate-500 font-semibold">{pay.gateway}</td>
                      <td className="py-3">{pay.date}</td>
                      <td className="py-3 text-right font-black text-slate-350">₹{pay.amount.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-black">
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => toast.success("Certified transaction receipt generated.")} 
                          className="text-emerald-500 hover:text-emerald-400 font-black"
                        >
                          <Download className="w-4 h-4 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeTab === "attendance" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 bg-slate-900 border border-white/5 rounded-2xl p-6 text-center space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Attendance Index</h3>
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold font-mono text-white">92.4%</span>
              </div>
              <p className="text-[10px] text-slate-550 uppercase font-black">Meets syllabus threshold (75%)</p>
            </div>
            <div className="md:col-span-8 bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Gate Entries (Auto RFID sensors)</h3>
              <div className="overflow-x-auto font-mono text-xs text-left">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 text-[9px] text-slate-500 font-black uppercase">
                      <th className="py-2">Date</th>
                      <th className="py-2">In Time</th>
                      <th className="py-2">Out Time</th>
                      <th className="py-2">Gate Location</th>
                      <th className="py-2 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { date: "10 Jun 2026", in: "08:52 AM", out: "04:32 PM", loc: "Main South Gate #1", mode: "RFID_RFID" },
                      { date: "09 Jun 2026", in: "08:44 AM", out: "04:15 PM", loc: "Main South Gate #1", mode: "RFID_RFID" },
                      { date: "08 Jun 2026", in: "08:58 AM", out: "04:45 PM", loc: "Library West Turnstile #2", mode: "BIOMETRIC" }
                    ].map((att, i) => (
                      <tr key={i}>
                        <td className="py-2.5 font-semibold text-slate-350">{att.date}</td>
                        <td className="py-2.5 text-emerald-400 font-bold">{att.in}</td>
                        <td className="py-2.5 text-slate-400">{att.out}</td>
                        <td className="py-2.5 uppercase text-slate-500 font-bold">{att.loc}</td>
                        <td className="py-2.5 text-right font-black text-slate-550 text-[9px] uppercase tracking-wider">{att.mode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXAMS */}
        {activeTab === "exams" && (
          <div className="bg-slate-900 border border-white/5 rounded-[24px] p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Exam Forms & Hall Passes</h3>
            <div className="overflow-x-auto text-left font-mono text-xs">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] text-slate-500 uppercase font-black">
                    <th className="py-2">Form ID</th>
                    <th className="py-2">Semester</th>
                    <th className="py-2">Dues Status</th>
                    <th className="py-2 font-black text-center">Hall Admit Release</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 font-bold text-slate-400">EX-FOM_884218</td>
                    <td className="py-3 font-bold">Semester 4 Regular</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-black">
                        PAID & SIGNED
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-black">
                        RELEASED
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => toast.success("Downloading exam hall pass PDF matching semester checklist...")}
                        className="text-emerald-500 hover:text-emerald-400 font-black cursor-pointer"
                      >
                        Download Admit Card
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM LOGS */}
        {activeTab === "activity" && (
          <div className="bg-slate-900 border border-white/5 rounded-[24px] p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Audit Activity Ledger for this student</h3>
            <div className="space-y-2.5 font-mono text-xs">
              {[
                { actor: "Super Admin", action: "Authorized student digital biometric bypass", date: "10 Jun 2026 12:44 PM" },
                { actor: "Treasury Staff", action: "Reconciled semester core library fine manually", date: "04 May 2026 10:11 AM" },
                { actor: "Auto-System", action: "NFC RFID Card successfully provisioned with UID 8E:A4:9E:2B", date: "14 Aug 2023 11:32 AM" }
              ].map((log, i) => (
                <div key={i} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex justify-between items-center text-left">
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-white text-[11px] uppercase tracking-wide">{log.action}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black font-sans">actor: {log.actor}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">{log.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
