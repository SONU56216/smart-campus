"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  Wallet, 
  Plus, 
  ArrowRight, 
  ArrowDownLeft, 
  ArrowUpRight,
  Printer,
  Utensils, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Sparkles,
  Search
} from "lucide-react";
import { toast } from "sonner";

interface WalletTxn {
  id: string;
  type: "DEBIT" | "CREDIT";
  title: string;
  amount: number;
  date: string;
  method: string;
}

export default function StudentWalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.walletBalance ?? 1250);
  const [depositOpen, setDepositOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const [txns, setTxns] = useState<WalletTxn[]>([
    {
      id: "wtxn-1",
      type: "CREDIT",
      title: "E-Wallet Topup Resolved",
      amount: 2000,
      date: "2026-06-10T09:45:00.000Z",
      method: "RAZORPAY",
    },
    {
      id: "wtxn-2",
      type: "DEBIT",
      title: "Cashless Cafeteria Gate 2 Lunch",
      amount: 120,
      date: "2026-06-10T13:10:00.000Z",
      method: "RFID_CHIP",
    },
    {
      id: "wtxn-3",
      type: "DEBIT",
      title: "Academic Transcript Copy Print",
      amount: 50,
      date: "2026-06-08T11:20:00.000Z",
      method: "BARCODE_SCAN",
    },
    {
      id: "wtxn-4",
      type: "DEBIT",
      title: "Library Book Overdue Clearance",
      amount: 15.5,
      date: "2026-06-04T16:05:00.000Z",
      method: "RFID_CHIP",
    },
    {
      id: "wtxn-5",
      type: "CREDIT",
      title: "E-Wallet Preset Topup",
      amount: 500,
      date: "2026-05-20T10:15:00.000Z",
      method: "UPI",
    }
  ]);

  const presets = [100, 200, 500];

  const handlePresetSelection = (val: number) => {
    setActivePreset(val);
    setCustomAmount(val.toString());
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customAmount);
    
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Please specify a valid monetary amount.");
      return;
    }
    if (parsed > 10000) {
      toast.error("Checkout limit exceeded. Max single topup limit stands at ₹10,000.");
      return;
    }

    toast.loading("Orchestrating secure payment node...");
    
    setTimeout(() => {
      setBalance((b) => b + parsed);
      
      const newTxn: WalletTxn = {
        id: `wtxn-custom-${Date.now()}`,
        type: "CREDIT",
        title: "Cashless wallet Topup",
        amount: parsed,
        date: new Date().toISOString(),
        method: "UPI_GATEWAY",
      };

      setTxns((prev) => [newTxn, ...prev]);
      
      toast.dismiss();
      toast.success(`Success! Credited ₹ ${parsed.toLocaleString()} directly into database wallet!`);
      setDepositOpen(false);
      setCustomAmount("");
      setActivePreset(null);
    }, 1200);
  };

  const getFormatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch (_) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none text-left relative">
      
      {/* 1. Header block */}
      <div className="space-y-1.5 border-b border-white/5 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
          Campus cashless Wallet
        </h1>
        <p className="text-xs text-slate-550 font-bold uppercase leading-normal">
          Manage physical and digital gate utility allocations, clear library duplication invoices, and top up micro balance preset streams.
        </p>
      </div>

      {/* 2. Double split display grid: Debit card vs Quick presets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card display card info */}
        <div className="relative p-6 rounded-[28px] border border-blue-500/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 overflow-hidden shadow-2xl flex flex-col justify-between aspect-[1.586/1] w-full max-w-md select-none">
          {/* Ambient visual decorations */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Live Cashless Balance</span>
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            {/* contactless icon / card chip simulation */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs text-indigo-200/75 uppercase font-black tracking-widest">
                Mit pass
              </span>
              <div className="w-10 h-7 bg-amber-400 border border-amber-300 rounded-lg flex items-center justify-center relative overflow-hidden p-1 shadow-inner">
                <div className="absolute inset-0 border border-amber-500/25 grid grid-cols-3 divide-x divide-amber-600/30" />
                <div className="absolute inset-0 border border-amber-500/25 grid grid-rows-3 divide-y divide-amber-600/30" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="leading-none text-left">
              <span className="text-[9px] text-white/50 font-black block uppercase tracking-widest pb-1 max-w-[200px] truncate leading-none">
                {user?.fullName || "Lucas Bennett"}
              </span>
              <span className="text-[9.5px] text-indigo-150 font-bold font-mono tracking-widest">
                CS2026-921 • •••• 8219
              </span>
            </div>
            
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[8.5px] font-black text-emerald-450 bg-emerald-500/20 px-2.5 py-1 rounded-xl uppercase leading-none border border-emerald-400/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Linked / ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Action widget presets */}
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[28px] shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
              Rapid Top-Up Presets
            </h3>

            {/* preset buttons */}
            <div className="grid grid-cols-3 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetSelection(preset)}
                  className={`py-3 text-xs font-black border rounded-xl transition-all uppercase tracking-wide cursor-pointer ${
                    activePreset === preset 
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10" 
                      : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  + ₹{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Core action button trigger custom topup modal */}
          <div className="pt-6 space-y-3.5 border-t border-white/5 mt-4">
            <button
              onClick={() => {
                setDepositOpen(true);
                // default presets selection
                setCustomAmount("500");
                setActivePreset(500);
              }}
              className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md group cursor-pointer pt-[14px]"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              ADD BALANCES MODAL
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
            </button>

            <span className="text-[10px] text-slate-550 font-bold block text-center uppercase tracking-wide">
              Secure 256-bit SSL gateway checkout
            </span>
          </div>

        </div>

      </div>

      {/* 3. Transaction history ledger displays */}
      <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[28px] shadow-xl space-y-4">
        
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 className="text-xs font-black text-slate-301 uppercase tracking-wider flex items-center gap-1.5">
            <ArrowRightLeft className="w-4 h-4 text-blue-404" />
            Historical Billing Ledger
          </h3>
          <span className="text-[9px] font-black bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded leading-none uppercase tracking-widest font-mono">
            RECENT DEBITS
          </span>
        </div>

        {/* Render Transaction Logs list */}
        <div className="space-y-3">
          {txns.map((txn) => {
            const IsCredit = txn.type === "CREDIT";
            
            return (
              <div 
                key={txn.id} 
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Indicator bullet icons */}
                  <div className={`p-2.5 rounded-xl border ${
                    IsCredit 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}>
                    {IsCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div className="text-left space-y-1">
                    <h4 className="text-xs font-black text-slate-205 leading-none">
                      {txn.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold leading-none select-all font-mono uppercase">
                      {txn.method} • {getFormatDate(txn.date)}
                    </p>
                  </div>
                </div>

                {/* Amount display marker */}
                <span className={`text-xs font-black flex-shrink-0 ${
                  IsCredit ? "text-emerald-450" : "text-slate-300"
                }`}>
                  {IsCredit ? "+" : "-"} ₹ {txn.amount.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* 4. Deposits Custom Input Overlay Modals */}
      {depositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
          <div className="bg-slate-950 border border-white/10 rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-5 animate-scale-up text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-blue-450" />
                Initialize Checkout Top-up
              </h3>
              <button 
                onClick={() => setDepositOpen(false)}
                className="p-1 hover:bg-white/5 border border-transparent hover:border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Forms controls inputs */}
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest pl-1">
                  Specify Monetary Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="₹ 500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full text-sm font-black text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
                />
              </div>

              {/* quick presets in modal */}
              <div className="flex items-center gap-2 justify-around pt-1">
                {presets.map((preset) => (
                  <button
                    key={`modal-${preset}`}
                    type="button"
                    onClick={() => handlePresetSelection(preset)}
                    className={`px-3.5 py-1.5 text-[10px] font-black border rounded-lg transition-all leading-none uppercase ${
                      activePreset === preset 
                        ? "bg-blue-600 border-blue-500 text-white" 
                        : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300"
                    }`}
                  >
                    Preset +₹{preset}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
                >
                  PROCEED AND DEPOSIT ₹{customAmount || "0"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
