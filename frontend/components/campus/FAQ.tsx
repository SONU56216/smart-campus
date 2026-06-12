"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles, MessageCircle, Info } from "lucide-react";

interface FAQItem {
  id: string;
  category: "admission" | "exams" | "fees" | "campus";
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    category: "admission",
    question: "What documents are required during physical gate verification?",
    answer: "You must present your seat allotment confirmation letter, original high school certificates, digital or physical Aadhaar/Passport ID, and a valid biometric passport-sized registration photo. Keep your Digital PassKit wallet ready on your phone for immediate NFC validator clearance."
  },
  {
    id: "2",
    category: "admission",
    question: "How long does the RFID/Smart Card induction take?",
    answer: "RFID tag writing and barcode generation occur instantly upon approval from the Registrar Portal. Physical smart cards with printed photo IDs are typically ready at the Admin Center within 2 hours of enrollment."
  },
  {
    id: "3",
    category: "exams",
    question: "How do I download my regular or backlog admit cards?",
    answer: "Navigate to the 'Admit Card' portal section. If you have completed the prerequisite digital academic registration blocks, paid the examination fee, and crossed the 75% attendance threshold, your digitally signed cryptographically verified Admit Card will display a download icon."
  },
  {
    id: "4",
    category: "exams",
    question: "Are results declared directly to the blockchain ledger?",
    answer: "Yes, once final grades are signed off by the Academic Controller desk, transcripts are compiled, compressed, and committed to both our central servers and decentralized identity logs for fraud-resistant background checks."
  },
  {
    id: "5",
    category: "fees",
    question: "What are the payment options for semester tuition tariffs?",
    answer: "The treasury board accepts UPI, major credit/debit networks, net banking, and manual offline cash deposits (valid receipt code required). You can also use your Student Portal Wallet to pay micro-fines, late registration charges, or supplementary exams."
  },
  {
    id: "6",
    category: "fees",
    question: "Is there a fine for late semester enrollment?",
    answer: "Standard tuition must be cleared by the date specified in the Academic Calendar. Any enrollments processed after the deadline trigger an automated fine of ₹500, appended to the wallet portal billing ledger."
  },
  {
    id: "7",
    category: "campus",
    question: "How do I access the digital barcode library turnstiles?",
    answer: "Open your Smart Card page on the student app, present the rotating security QR code under the library scanner, and step through the turnstile once the green ambient lights engage."
  },
  {
    id: "8",
    category: "campus",
    question: "What is the policy for emergency medical services on campus?",
    answer: "Our medical center is active 24/7 with immediate paramedic staff. If you require critical dispatch, tap the pulsing SOS button in the 'Emergency Portal' to immediately broadcast your coordinates to campus security."
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "admission" | "exams" | "fees" | "campus">("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["1"]));

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  const filteredFAQs = FAQ_ITEMS.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full space-y-6 text-left">
      {/* Category Toggles & Search Bar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search common campus questions, admission pipelines, exam dates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-2xl text-xs font-semibold px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 outline-none transition-all"
            />
            <HelpCircle className="w-4.5 h-4.5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="md:col-span-12 flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-900">
          {[
            { id: "all", label: "All Questions" },
            { id: "admission", label: "Admissions" },
            { id: "exams", label: "Exams & Grades" },
            { id: "fees", label: "Tariffs & Fees" },
            { id: "campus", label: "Campus Life" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all border whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-blue-600 border-blue-500 text-white font-bold"
                  : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => {
          const isExpanded = expandedIds.has(faq.id);
          return (
            <div
              key={faq.id}
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? "bg-slate-900/80 border-blue-500/20 shadow-lg shadow-blue-500/5" 
                  : "bg-slate-900 border-white/5"
              }`}
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full py-4.5 px-5 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border transition-colors ${
                    isExpanded 
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                      : "bg-slate-950 border-white/5 text-slate-500"
                  }`}>
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-350 shrink-0 ${
                  isExpanded ? "rotate-180 text-blue-400" : ""
                }`} />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out px-5 overflow-hidden ${
                  isExpanded ? "max-h-[300px] border-t border-white/5 py-4 bg-slate-950/40" : "max-h-0"
                }`}
              >
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {faq.answer}
                </p>
                <div className="mt-3 flex items-center gap-1 w-fit">
                  <span className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-400 tracking-widest px-2 py-0.5 rounded-full border border-blue-500/10">
                    {faq.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 bg-slate-900/50 border border-white/5 rounded-3xl">
            <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-500 uppercase font-black tracking-wider leading-none">
              No matching questions in our knowledge base
            </p>
            <p className="text-[10px] text-slate-550 uppercase font-bold tracking-normal mt-1 leading-none">
              Try keyword revisions or launch the live chat helper.
            </p>
          </div>
        )}
      </div>

      {/* Support Box */}
      <div className="p-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/5 border border-blue-500/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Encountering specific bottlenecks?
          </h4>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Connect directly with an admissions clerk or financial desk support node immediately.
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-5 py-3 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider">
          <MessageCircle className="w-4 h-4" />
          Initiate Support Dispatch
        </button>
      </div>
    </div>
  );
}
