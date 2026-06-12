"use client";

import { useState } from "react";
import FAQ from "@/components/campus/FAQ";
import LiveChat from "@/components/campus/LiveChat";
import { HelpCircle, Mail, MessageSquare, Send, Sparkles, User, FileText } from "lucide-react";
import { toast } from "sonner";

export default function HelpDeskPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("All form values are required before lodging an inquiry.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast.success("Support ticket successfully created and committed! An officer will respond in 2 hours.");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-400" />
          University Support Desk & Knowledgebase
        </h1>
        <p className="text-xs text-slate-550 font-bold uppercase font-mono">
          Resolve portal billing issues, review registration bottlenecks, and chat with technical representatives.
        </p>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* L: FAQ ACCORDION - 7 COLS */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-1.5 leading-none">
              <Sparkles className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
              Frequently Asked Questions
            </h3>
            <p className="text-[10px] text-slate-550 font-bold uppercase font-mono mt-1.5 leading-none">
              Double check our instant knowledge base for standard answers prior to mailing support.
            </p>
          </div>

          <FAQ />
        </div>

        {/* R: CONTACT EMAIL FORM + LIVEPORTAL - 5 COLS */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Support Intake form */}
          <div className="bg-slate-900 border border-white/5 rounded-[32px] p-6 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              Lodge Support Ticket
            </h3>
            <p className="text-[10.5px] text-slate-400 leading-relaxed font-semibold">
              Fill out the digital dispatch parcel to transmit support coordinates to the Central Registrar IT desk.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 leading-none">
                  <User className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Student Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sonia Gandhi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white uppercase outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 leading-none">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Office Registry Mailbox
                </label>
                <input
                  type="email"
                  placeholder="e.g. sonia@metrouni.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-semibold text-white outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 leading-none">
                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Ticket Subject Context
                </label>
                <input
                  type="text"
                  placeholder="e.g. Backlog fee transaction discrepancy"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white uppercase outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Inquiry Narrative Description</label>
                <textarea
                  placeholder="Describe your credentials query or fine rollback request in elaborate detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-white/5 p-3.5 rounded-xl text-xs font-semibold text-slate-300 outline-none focus:border-blue-500/50 resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5 leading-none"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Sledging Inquiry Node..." : "Dispatch Support Parcel"}
              </button>
            </form>
          </div>

          {/* INLINE LIVE CHAT CONCIERGE PANEL */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.25em] flex items-center gap-1.5 leading-none">
              <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 animate-pulse" />
              Inline Chat Console
            </h3>
            <LiveChat inline={true} />
          </div>

        </div>

      </div>

      {/* Floating active chat trigger button for general workspace assistance */}
      <LiveChat inline={false} />

    </div>
  );
}
