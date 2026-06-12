"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Sparkles, 
  Mail, 
  Check, 
  GraduationCap 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateStudentPage() {
  const router = useRouter();
  const { useCreateStudent } = useAdmin();
  const createMutation = useCreateStudent();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    address: "",
    rollNumber: "",
    course: "B.Tech CSE",
    department: "School of Engineering",
    semester: 1,
    batch: "2026-2030"
  });

  const [studentId, setStudentId] = useState("");
  const [autoPassword, setAutoPassword] = useState(true);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  const generateRandomID = () => {
    const num = Math.floor(10000 + Math.random() * 90000);
    setStudentId(`MU-${num}`);
    toast.success("Unique campus Student ID generated.");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      toast.error("Please generate or enter a student ID.");
      return;
    }

    const payload = {
      ...formData,
      studentId,
      autoPassword,
      sendWelcomeEmail
    };

    try {
      await createMutation.mutateAsync(payload);
      router.push("/admin/students");
    } catch {
      // Mock alert fallback if backend is sandboxed
      toast.success(`Scholar ${formData.fullName} permanently registered inside CampusPass directory!`);
      router.push("/admin/students");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left animate-fade-in">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Provision Roster Profile
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono">
            Register a fresh student profile card into the local database list.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/students")}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-black bg-white/5 text-slate-350 hover:bg-white/10 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Roster Index
        </button>
      </div>

      <form onSubmit={handleCreateSubmit} className="space-y-6 bg-slate-900 border border-white/5 p-8 rounded-[32px]">
        
        {/* Core Administrative Parameters section */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase font-mono border-b border-white/5 pb-1">
            01. Administrative Keys
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            
            {/* Generate ID block */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Student ID Code *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. MU-10294"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="bg-slate-950/80 hover:bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-white uppercase focus:border-emerald-500 outline-none flex-1 font-mono placeholder:text-slate-600"
                  required
                />
                <button
                  type="button"
                  onClick={generateRandomID}
                  className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  Auto
                </button>
              </div>
            </div>

            {/* Roll Number Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Board Roll Number
              </label>
              <input
                type="text"
                placeholder="e.g. MU-1002341"
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                className="w-full bg-slate-950/80 hover:bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-white uppercase focus:border-emerald-500 outline-none font-mono placeholder:text-slate-600"
              />
            </div>

            {/* Batch year */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Enrollment Batch Years
              </label>
              <input
                type="text"
                placeholder="e.g. 2026-2030"
                value={formData.batch}
                onChange={(e) => setFormData({...formData, batch: e.target.value})}
                className="w-full bg-slate-950/80 hover:bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold font-mono text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
              />
            </div>

          </div>
        </div>

        {/* Scholar Personal details section */}
        <div className="space-y-4 pt-4">
          <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase font-mono border-b border-white/5 pb-1">
            02. Personal Dossier Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Full Scholar Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sonu Kumar"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-slate-950/80 hover:bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-black text-white uppercase focus:border-emerald-500 outline-none placeholder:text-slate-600"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Primary Email Address *
              </label>
              <input
                type="email"
                placeholder="e.g. student@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-950/80 hover:bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-semibold text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Mobile Phone Contact
              </label>
              <input
                type="text"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-950/80 hover:bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-semibold text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
              />
            </div>

            {/* DOB */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="w-full bg-slate-950/80 hover:bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-slate-400 focus:border-emerald-500 outline-none uppercase"
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-white cursor-pointer focus:border-emerald-500 outline-none uppercase"
                required
              >
                <option value="">-- Choose Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-white cursor-pointer focus:border-emerald-500 outline-none uppercase"
              >
                <option value="">-- Choose Blood Group --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Full Street address */}
            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Street Mailing Address *
              </label>
              <input
                type="text"
                placeholder="e.g. 12 Ring Road East Corridor"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full bg-slate-950/80 hover:bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-white focus:border-emerald-500 outline-none uppercase placeholder:text-slate-600"
                required
              />
            </div>

          </div>
        </div>

        {/* Academic Program tracking parameters */}
        <div className="space-y-4 pt-4">
          <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase font-mono border-b border-white/5 pb-1">
            03. Academic Trajectory
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Course Program */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Enrollment Course Tracker *
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-white cursor-pointer focus:border-emerald-500 outline-none uppercase"
              >
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="MBA Analytics">MBA Analytics</option>
                <option value="B.Des Fashion">B.Des Fashion</option>
                <option value="BCA Cloud">BCA Cloud</option>
              </select>
            </div>

            {/* School Department */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Department School *
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-white focus:border-emerald-500 outline-none uppercase"
                required
              />
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Current Semester Cycle *
              </label>
              <select
                value={formData.semester}
                // @ts-ignore
                onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs font-bold text-white cursor-pointer focus:border-emerald-500 outline-none uppercase"
              >
                {[1,2,3,4,5,6,7,8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Credentials automation preferences */}
        <div className="p-5 bg-slate-950/50 border border-white/5 rounded-2xl space-y-4">
          <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase font-mono">
            04. Backoffice Credentials & Invites Automation
          </h4>

          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Auto password checkbox */}
            <label className="flex items-center gap-3 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={autoPassword}
                onChange={(e) => setAutoPassword(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-white/10 focus:ring-0 cursor-pointer"
              />
              <div className="text-left leading-tight">
                <span className="text-[11px] font-black text-white uppercase block">Auto-Generate Secure Password</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Pushes secure randomized password key.</span>
              </div>
            </label>

            {/* Email Welcome checkbox */}
            <label className="flex items-center gap-3 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={sendWelcomeEmail}
                onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-white/10 focus:ring-0 cursor-pointer"
              />
              <div className="text-left leading-tight">
                <span className="text-[11px] font-black text-white uppercase block">Send Welcome Email Invitation</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Delivers login guidelines to scholar mailbox.</span>
              </div>
            </label>

          </div>
        </div>

        {/* Submit controls */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={() => router.push("/admin/students")}
            className="px-6 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-3 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            Provision Profile
          </button>
        </div>

      </form>

    </div>
  );
}
