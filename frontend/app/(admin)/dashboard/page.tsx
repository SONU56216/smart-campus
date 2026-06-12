"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { useState, useEffect } from "react";
import { 
  Users, 
  CreditCard, 
  FileCheck2, 
  IndianRupee, 
  ShieldAlert, 
  Activity, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  UserPlus 
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { useStats } = useAdmin();
  const { data: serverStats, isLoading } = useStats();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Layout metrics Fallback parameters
  const statMetrics = [
    {
      title: "Total Registered Rosters",
      value: serverStats?.totalStudents ?? 1248,
      change: "+24% vs last term",
      icon: Users,
      color: "from-blue-600/20 to-blue-500/5",
      iconColor: "text-blue-400"
    },
    {
      title: "Active Identity Passes",
      value: serverStats?.activeCards ?? 1210,
      change: "97.11% issue index",
      icon: CreditCard,
      color: "from-emerald-600/20 to-emerald-500/5",
      iconColor: "text-emerald-400"
    },
    {
      title: "Pending Admissions Desk",
      value: serverStats?.pendingAdmissions ?? 142,
      change: "Forms awaiting triage",
      icon: UserPlus,
      color: "from-amber-600/20 to-amber-500/5",
      iconColor: "text-amber-400"
    },
    {
      title: "Fee Gathered Today",
      value: `₹${(serverStats?.feeReceptionsSum ?? 384000).toLocaleString()}`,
      change: "Razorpay ledger live",
      icon: IndianRupee,
      color: "from-indigo-600/20 to-indigo-500/5",
      iconColor: "text-indigo-400"
    },
    {
      title: "Pending Exams Registries",
      value: 68,
      change: "Needs backoffice signatures",
      icon: FileCheck2,
      color: "from-purple-600/20 to-purple-500/5",
      iconColor: "text-purple-400"
    },
    {
      title: "Today's Corridor Entries",
      value: serverStats?.dailyGateEntries ?? 892,
      change: "Turnstile sync OK",
      icon: Activity,
      color: "from-rose-600/20 to-rose-500/5",
      iconColor: "text-rose-400"
    }
  ];

  // Recharts Chart Mock Data Arrays
  const trendData = [
    { day: "01 Jun", apps: 12 }, { day: "03 Jun", apps: 20 },
    { day: "05 Jun", apps: 34 }, { day: "07 Jun", apps: 48 },
    { day: "09 Jun", apps: 60 }, { day: "11 Jun", apps: 85 },
    { day: "13 Jun", apps: 92 }, { day: "15 Jun", apps: 110 },
    { day: "17 Jun", apps: 122 }, { day: "19 Jun", apps: 135 },
    { day: "21 Jun", apps: 142 }, { day: "23 Jun", apps: 158 },
    { day: "25 Jun", apps: 180 }, { day: "27 Jun", apps: 195 },
    { day: "29 Jun", apps: 220 }, { day: "01 Jul", apps: 248 }
  ];

  const feeData = [
    { month: "Jan", collections: 850000 },
    { month: "Feb", collections: 1200000 },
    { month: "Mar", collections: 1750000 },
    { month: "Apr", collections: 2400000 },
    { month: "May", collections: 1950000 },
    { month: "Jun", collections: 3840000 }
  ];

  const distributionData = [
    { name: "B.Tech CSE", value: 450, color: "#10b981" },
    { name: "B.Tech ECE", value: 300, color: "#3b82f6" },
    { name: "MBA Analytics", value: 250, color: "#f59e0b" },
    { name: "B.Des Fashion", value: 150, color: "#ec4899" },
    { name: "BCA Cloud", value: 98, color: "#8b5cf6" }
  ];

  const attendanceRate = [
    { week: "W1", presentRate: 88 },
    { week: "W2", presentRate: 91 },
    { week: "W3", presentRate: 94 },
    { week: "W4", presentRate: 89 },
    { week: "W5", presentRate: 95 },
    { week: "W6", presentRate: 92 },
    { week: "W7", presentRate: 96 }
  ];

  // Last 20 Recent Actions Activity Log items list
  const recentActivities = [
    { id: "act-1", admin: "Super Admin", action: "Approved admitting application", target: "#AP-9281 (Mohit Roy)", time: "3 mins ago" },
    { id: "act-2", admin: "CoE Registrar", action: "Locked syllabus exam date sheets", target: "Semester 4 Exams", time: "12 mins ago" },
    { id: "act-3", admin: "Super Admin", action: "Updated security credentials", target: "Admin User #4", time: "42 mins ago" },
    { id: "act-4", admin: "Treasury Lead", action: "Bypassed UPI fee transaction manually", target: "TXN_77ADK3 (Rhea Paul)", time: "1 hr ago" },
    { id: "act-5", admin: "Super Admin", action: "Imported student roster via CSV upload", target: "56 MCA Scholars", time: "2 hrs ago" },
    { id: "act-6", admin: "Office Admin", action: "Enforced biometric gate sensor rule", target: "South Gate Hub", time: "4 hrs ago" },
    { id: "act-7", admin: "CoE Registrar", action: "Triggered individual hall ticket publish", target: "Roll #MU-100452", time: "5 hrs ago" },
    { id: "act-8", admin: "Super Admin", action: "Configured payment Razorpay dynamic keys", target: "College Settings Panel", time: "6 hrs ago" },
    { id: "act-9", admin: "Treasury Lead", action: "Reconciled outstanding fees backlog items", target: "18 B.Tech CSE students", time: "8 hrs ago" },
    { id: "act-10", admin: "Office Admin", action: "Reset credentials for student account", target: "Roll #MU-100234 (Ansh)", time: "10 hrs ago" },
    { id: "act-11", admin: "Super Admin", action: "Modified total program intake slots", target: "B.Tech CSE limits to 480", time: "12 hrs ago" },
    { id: "act-12", admin: "CoE Registrar", action: "Authorized hall admittance ticket reprint", target: "Roll #MU-100392", time: "14 hrs ago" },
    { id: "act-13", admin: "Treasury Lead", action: "Approved refund request", target: "TXN-88B92K (Siddharth)", time: "1 day ago" },
    { id: "act-14", admin: "Super Admin", action: "Approved admitting application", target: "#AP-9012 (Gaurav Singh)", time: "1 day ago" },
    { id: "act-15", admin: "Super Admin", action: "Suspended identity card", target: "Roll #MU-099201", time: "1 day ago" },
    { id: "act-16", admin: "Office Admin", action: "Marked student as Leave status", target: "Roll #MU-100104", time: "2 days ago" },
    { id: "act-17", admin: "CoE Registrar", action: "Verified bulk backlogged semester forms", target: "12 candidates", time: "2 days ago" },
    { id: "act-18", admin: "Super Admin", action: "Created academic admin member profile", target: "Kishore Kumar", time: "2 days ago" },
    { id: "act-19", admin: "Treasury Lead", action: "Updated overall admission fee", target: "Settings - Fee structure to ₹1,500", time: "3 days ago" },
    { id: "act-20", admin: "Super Admin", action: "System cold boot sequence fully complete", target: "Production core platform", time: "3 days ago" }
  ];

  // Outstanding Actions pending list items
  const pendingActions = [
    { id: "pa-1", type: "Admissions Form Review", desc: "Varun Malhotra (#AP-8854) - High School score 94.5%", actionRoute: "/admin/admissions" },
    { id: "pa-2", type: "Admissions Form Review", desc: "Smita Patel (#AP-8859) - B.Des candidate - portfolios pending", actionRoute: "/admin/admissions" },
    { id: "pa-3", type: "Admit Card Verification", desc: "Verify 18 backlog subject exam forms B.Tech ECE", actionRoute: "/admin/exams/forms" },
    { id: "pa-4", type: "Treasury Audit Flags", desc: "Reconcile duplicate Razorpay webhook webhook_99b2k", actionRoute: "/admin/payments" },
    { id: "pa-5", type: "Card Override Signoff", desc: "Release suspended pass for Ritvik Verma (Security clearence)", actionRoute: "/admin/students" }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Welcome banner and global summary metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Campus Office Command Bridge
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase font-mono">
            Full management terminal sync. Active session: Superintendent SA-01.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          SYSTEM LIVE FEED ON
        </div>
      </div>

      {/* Grid: 6 stats counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statMetrics.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={idx} 
              className={`p-5 bg-gradient-to-br ${stat.color} border border-white/5 rounded-2xl flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 font-sans truncate">
                  {stat.title}
                </span>
                <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-[9px] uppercase font-black tracking-wider text-slate-400">
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 1: Charts Section 1 */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Admission Trend */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-white/5 rounded-[24px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 leading-none">Admission Submissions Trend</h4>
                <p className="text-[10px] text-slate-550 font-bold uppercase mt-1">Application velocity last 30 days</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#475569" fontSize={9} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                    labelStyle={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}
                    itemStyle={{ color: "#10b981", fontSize: 10 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="apps" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 2 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fee collection bar chart */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-white/5 rounded-[24px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 leading-none">Fee Collection Inflow</h4>
                <p className="text-[10px] text-slate-550 font-bold uppercase mt-1">Monthly collection totals (INR)</p>
              </div>
              <IndianRupee className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#475569" fontSize={9} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                    itemStyle={{ color: "#818cf8" }}
                  />
                  <Bar dataKey="collections" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Row 2: Charts Section 2 */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Course Distribution Chart */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-white/5 rounded-[24px] p-6 space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 leading-none">Course Wise Student Share</h4>
              <p className="text-[10px] text-slate-550 font-bold uppercase mt-1">Key distribution percentages</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-44 w-full flex justify-center">
                <ResponsiveContainer width={150} height={150}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="space-y-2">
                {distributionData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }} />
                    <div className="text-left font-mono leading-none">
                      <span className="text-[10px] font-black text-slate-350 block uppercase truncate max-w-[130px]">{item.name}</span>
                      <span className="text-[9px] text-slate-500 font-bold block">{item.value} Scholars</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Area rate chart */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-white/5 rounded-[24px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 leading-none">Daily Attendance Efficiency Rate</h4>
                <p className="text-[10px] text-slate-550 font-bold uppercase mt-1">Gate checking accuracy ratio (%)</p>
              </div>
              <CheckCircle className="w-4 h-4 text-blue-400" />
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceRate} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="week" stroke="#475569" fontSize={9} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                  />
                  <Area type="monotone" dataKey="presentRate" stroke="#3b82f6" fill="rgba(59,130,246,0.15)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Row 3: Recent Activity Log Feed & Pending Tasks row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Admin Audit trail */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-white/5 rounded-[28px] p-6 flex flex-col h-[520px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-slate-450" />
                Live System Access & Audits Trail
              </h4>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Chronological record of backoffice updates (Last 20)</p>
            </div>

            <button 
              onClick={() => router.push("/admin/logs")}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300 rounded-lg cursor-pointer"
            >
              Full Trail
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/5">
            {recentActivities.map((act) => (
              <div 
                key={act.id} 
                className="flex items-start justify-between gap-4 p-3.5 bg-slate-950/45 hover:bg-slate-950 border border-white/5 rounded-2xl transition-colors font-mono text-xs text-left"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 font-black tracking-wider rounded-md">
                      {act.admin}
                    </span>
                    <span className="text-slate-200 text-[10.5px] font-bold uppercase">{act.action}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold">{act.target}</p>
                </div>

                <span className="text-[9px] text-slate-550 font-black whitespace-nowrap uppercase tracking-wider">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Triage action items panel list */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-white/5 rounded-[28px] p-6 flex flex-col h-[520px]">
          <div className="mb-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              Prioritized Registrar Tasks Checklist
            </h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Actionable tasks flagged by audit algorithms</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {pendingActions.map((task) => (
              <div 
                key={task.id} 
                className="p-4 bg-slate-950/30 hover:bg-slate-500/5 border border-white/5 rounded-2xl text-left space-y-3 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block font-mono">
                    {task.type}
                  </span>
                  <p className="text-[11px] font-black text-slate-200 leading-normal uppercase">
                    {task.desc}
                  </p>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => router.push(task.actionRoute)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[9px] font-black tracking-widest uppercase bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Assess Profile
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
