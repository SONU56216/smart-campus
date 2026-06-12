"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Trash2, 
  UserPlus, 
  Check, 
  X, 
  Eye, 
  User, 
  Key 
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersRosterPage() {
  const [search, setSearch] = useState("");

  // Invite Admin modal forms states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("Registrar Stafford");

  // Mock Admin Roster list
  const [adminsList, setAdminsList] = useState([
    { id: 1, name: "Pranab Mukherjee", email: "pranab.registrar@metrouni.edu.in", role: "Registrar Stafford", status: "ACTIVE", lastLogin: "11 Jun 2026 12:14 PM" },
    { id: 2, name: "Shanta Kumar", email: "shanta.treasury@metrouni.edu.in", role: "Treasury Accountant", status: "ACTIVE", lastLogin: "11 Jun 2026 11:30 AM" },
    { id: 3, name: "Nirmala Sitharaman", email: "nirmala.super@metrouni.edu.in", role: "Super Administrator", status: "ACTIVE", lastLogin: "11 Jun 2026 09:44 AM" },
    { id: 4, name: "Rajiv Gandhi", email: "rajiv.academic@metrouni.edu.in", role: "Academic Coordinator", status: "SUSPENDED", lastLogin: "08 Jun 2026 04:32 PM" }
  ]);

  const filteredAdmins = adminsList.filter(adm => 
    adm.name.toLowerCase().includes(search.toLowerCase()) ||
    adm.email.toLowerCase().includes(search.toLowerCase()) ||
    adm.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) {
      toast.error("Both name and email values are required.");
      return;
    }

    const newAdmin = {
      id: Date.now(),
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      status: "ACTIVE",
      lastLogin: "Never logged in yet"
    };

    setAdminsList([...adminsList, newAdmin]);
    toast.success(`Account invitation dispatched to ${newAdmin.email}.`);
    setIsInviteOpen(false);
    setNewAdminName("");
    setNewAdminEmail("");
  };

  const handleToggleStatus = (id: number) => {
    setAdminsList(adminsList.map(adm => {
      if (adm.id === id) {
        const nextStatus = adm.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        toast.success(`User Account for ${adm.name} toggled to ${nextStatus}.`);
        return { ...adm, status: nextStatus };
      }
      return adm;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Metropolitan Admin Guild
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono">
            Audit registrar accounts, configure security clearances, invite fresh supervisors.
          </p>
        </div>

        <div className="flex wrap gap-2">
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <UserPlus className="w-4 h-4" />
            Invite Staff User
          </button>
        </div>
      </div>

      {/* FILTER SEARCH PANEL */}
      <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search register name, email address target or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-xl text-xs font-semibold pl-10 pr-3 py-2.5 text-white placeholder:text-slate-550 focus:border-emerald-500/50 outline-none"
          />
        </div>
      </div>

      {/* ADMINS ROSTER GRID TABLE */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="bg-slate-950 border-b border-white/5 text-[10px] font-black text-slate-400 tracking-widest uppercase leading-none">
                <th className="p-4">Admin Name</th>
                <th className="p-4">Office Email Address</th>
                <th className="p-4">Guild Domain Role</th>
                <th className="p-4">Timestamps Last Access</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Clearance ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-350">
              {filteredAdmins.map(adm => (
                <tr key={adm.id} className="hover:bg-white/[0.01]">
                  <td className="p-4 font-extrabold text-white uppercase">{adm.name}</td>
                  <td className="p-4 font-mono text-zinc-500 font-semibold">{adm.email}</td>
                  <td className="p-4 font-bold text-[11px] uppercase text-emerald-450">{adm.role}</td>
                  <td className="p-4 font-mono text-slate-500 font-bold">{adm.lastLogin}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase ${
                      adm.status === "ACTIVE" 
                        ? "bg-emerald-500/10 text-emerald-400" 
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {adm.status}
                    </span>
                  </td>

                  {/* Account Action control */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(adm.id)}
                      className={`px-3 py-1.5 font-sans font-black text-[9px] uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        adm.status === "ACTIVE"
                          ? "bg-amber-600/10 border border-amber-500/20 hover:bg-amber-600/20 text-amber-500"
                          : "bg-emerald-600/15 border border-emerald-500/20 hover:bg-emerald-600/30 text-emerald-400"
                      }`}
                    >
                      {adm.status === "ACTIVE" ? "Suspend Clearance" : "Grant Access"}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 uppercase font-black font-sans text-[10px]">
                    No security accounts cleared matching constraints ...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE DIALOG SLIDE OVERLAY PANEL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-scale-in">
          <form onSubmit={handleInviteSubmit} className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-sm w-full space-y-4 text-left relative">
            
            <button 
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="p-1 px-2.5 bg-slate-950 hover:bg-slate-850 rounded-xl border border-white/5 text-slate-400 absolute top-6 right-6 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-base font-black text-white uppercase tracking-wider">Configure Office Invitation</h3>
            <p className="text-xs text-slate-450 font-semibold leading-relaxed">
              Dispatch administrative register authorization package parameters to the candidates office inbox.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Guild Username *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sonia Gandhi"
                  value={newAdminName}
                  onChange={e => setNewAdminName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white uppercase"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Office Mailbox Address *</label>
                <input 
                  type="email" 
                  placeholder="e.g. sonia@university.edu"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono font-sans">Role Domain Security Clearance *</label>
                <select
                  value={newAdminRole}
                  onChange={e => setNewAdminRole(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white"
                >
                  <option value="Registrar Stafford">Registrar Stafford</option>
                  <option value="Treasury Accountant">Treasury Accountant</option>
                  <option value="Super Administrator">Super Administrator</option>
                  <option value="Academic Coordinator">Academic Coordinator</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="flex-1 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Abort
              </button>
              <button
                type="submit"
                className="flex-1 py-3 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Dispatch Invite
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
