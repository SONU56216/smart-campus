"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet as WalletIcon, 
  Sparkles, 
  Clock, 
  CircleDot, 
  AlertCircle,
  Loader2,
  Lock
} from "lucide-react";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  purpose: string;
  studentName?: string;
  onSuccess: (txnId: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  purpose,
  studentName = "Admissions Candidate",
  onSuccess,
}: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<"UPI" | "CARD" | "NET_BANKING" | "WALLET">("UPI");
  const [processing, setProcessing] = useState(false);
  const [paymentState, setPaymentState] = useState<"IDLE" | "SUCCESS" | "FAILURE">("IDLE");
  const [txnId, setTxnId] = useState("");
  
  // Simulation switches
  const [simulateFailure, setSimulateFailure] = useState(false);
  
  // Forms States
  const [selectedUpi, setSelectedUpi] = useState("gpay");
  const [customUpiId, setCustomUpiId] = useState("");
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [selectedWallet, setSelectedWallet] = useState("paytm");

  if (!isOpen) return null;

  const handleProcessPayment = () => {
    // Basic form validation based on active tab
    if (activeTab === "UPI") {
      if (!customUpiId.includes("@") && customUpiId.length < 3) {
        toast.error("Please enter a valid UPI reference (e.g. name@upi).");
        return;
      }
    } else if (activeTab === "CARD") {
      if (cardNumber.replace(/\s+/g, "").length < 16) {
        toast.error("Card number must contain 16 numeric digits.");
        return;
      }
      if (!cardExpiry.includes("/")) {
        toast.error("Card expiry must match MM/YY format.");
        return;
      }
      if (cardCvv.length < 3) {
        toast.error("CVV must contain 3 digits.");
        return;
      }
    }

    setProcessing(true);
    toast.loading("Securing processor handshake...");
    
    setTimeout(() => {
      toast.dismiss();
      setProcessing(false);
      
      if (simulateFailure) {
        setPaymentState("FAILURE");
      } else {
        const generatedTxnId = `TXN-${Math.floor(Math.random() * 90000000 + 10000000)}`;
        setTxnId(generatedTxnId);
        setPaymentState("SUCCESS");
        onSuccess(generatedTxnId);
      }
    }, 2000);
  };

  const handleDownloadInvoice = () => {
    try {
      const doc = new jsPDF();
      
      // Document branding header
      doc.setFillColor(2, 6, 23); // slate-950
      doc.rect(0, 0, 210, 80, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("CAMPUS CERTIFIED RECEIPT", 14, 30);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("OFFICIALLY SIGNED RESOLUTION RECORD", 14, 38);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`TRANSACTION SETTLED: SUCCESS`, 14, 52);
      
      // Transaction Summary Table Box
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(14, 90, 182, 90, "F");
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.rect(14, 90, 182, 90, "S");
      
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("BILLING PROFILE LEDGER", 20, 105);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Payer Identity Name: ${studentName}`, 20, 118);
      doc.text(`Authorized Purpose: ${purpose}`, 20, 128);
      doc.text(`Date of Settlement: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, 20, 138);
      doc.text(`Transaction Reference ID: ${txnId}`, 20, 148);
      doc.text(`Gateway Processor Protocol: ${activeTab}`, 20, 158);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Total Settled Fees: INR ${amount.toLocaleString()}`, 20, 172);
      
      // Footer
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFontSize(8);
      doc.text("Thank you for choosing Campus Pass Admissions. For support, reach out to helpdesk@campus.edu.", 14, 200);
      doc.text("* This is an automatically generated electronic payment ledger entry and does not require a manual ink seal.", 14, 206);
      
      doc.save(`Receipt_${txnId || "admission"}.pdf`);
      toast.success("Receipt invoice PDF exported successfully.");
    } catch (err: any) {
      toast.error("Could not compile document PDF file.");
    }
  };

  const handleCardNumberChange = (val: string) => {
    const rawVal = val.replace(/\D/g, "");
    const formatted = rawVal.match(/.{1,4}/g)?.join(" ") || rawVal;
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleCardExpiryChange = (val: string) => {
    const rawVal = val.replace(/\D/g, "");
    let formatted = rawVal;
    if (rawVal.length > 2) {
      formatted = `${rawVal.slice(0, 2)}/${rawVal.slice(2, 4)}`;
    }
    if (formatted.length <= 5) {
      setCardExpiry(formatted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      
      {/* Outer Card block */}
      <div className="bg-slate-950 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden flex flex-col justify-between">
        
        {/* Render States dynamically */}
        {paymentState === "SUCCESS" ? (
          <PaymentSuccess
            amount={amount}
            transactionId={txnId}
            purpose={purpose}
            onDownloadReceipt={handleDownloadInvoice}
            onClose={() => {
              setPaymentState("IDLE");
              onClose();
            }}
          />
        ) : paymentState === "FAILURE" ? (
          <PaymentFailure
            errorMessage="The mock transaction sequence collapsed because simulation mode was explicitly flagged as FAILURE."
            onRetry={() => {
              setPaymentState("IDLE");
              handleProcessPayment();
            }}
            onClose={() => {
              setPaymentState("IDLE");
              onClose();
            }}
          />
        ) : (
          /* IDLE FORM SCREEN */
          <div className="p-6 space-y-5 text-left">
            
            {/* Header controls */}
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Gateway Payment Desk
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  Resolving Billing Checkout Terminal
                </p>
              </div>

              <button 
                onClick={onClose}
                disabled={processing}
                className="p-1 hover:bg-white/5 border border-transparent hover:border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Invoiced fee amount block banner */}
            <div className="p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/10 rounded-2xl flex justify-between items-center bg-slate-950">
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-black text-blue-400 block uppercase tracking-wider">
                  Payment Assessment Item
                </span>
                <span className="text-xs font-bold text-slate-350 truncate block max-w-[200px] uppercase">
                  {purpose}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">
                  Amount Due
                </span>
                <span className="text-lg font-black text-white tracking-tight leading-none block pt-0.5">
                  ₹{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Visual Method Icons horizontal row tabs */}
            <div className="grid grid-cols-4 gap-2 border-b border-white/5 pb-3 select-none">
              
              <button
                type="button"
                onClick={() => setActiveTab("UPI")}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === "UPI" 
                    ? "bg-blue-600/10 border-blue-500/40 text-blue-450" 
                    : "bg-white/5 border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[8.5px] font-black tracking-wide uppercase">UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("CARD")}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === "CARD" 
                    ? "bg-blue-600/10 border-blue-500/40 text-blue-450" 
                    : "bg-white/5 border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[8.5px] font-black tracking-wide uppercase">CARD</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("NET_BANKING")}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === "NET_BANKING" 
                    ? "bg-blue-600/10 border-blue-500/40 text-blue-450" 
                    : "bg-white/5 border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[8.5px] font-black tracking-wide uppercase">NET BANK</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("WALLET")}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === "WALLET" 
                    ? "bg-blue-600/10 border-blue-500/40 text-blue-450" 
                    : "bg-white/5 border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <WalletIcon className="w-4 h-4" />
                <span className="text-[8.5px] font-black tracking-wide uppercase">WALLET</span>
              </button>

            </div>

            {/* Active views configurations */}
            <div className="min-h-[140px] flex flex-col justify-center">
              
              {/* UPI PANEL */}
              {activeTab === "UPI" && (
                <div className="space-y-4">
                  {/* graphic apps select buttons */}
                  <div className="flex gap-3 justify-center">
                    {["gpay", "phonepe", "paytm"].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setSelectedUpi(app)}
                        className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
                          selectedUpi === app 
                            ? "bg-white/10 border-indigo-500/50 text-indigo-400" 
                            : "bg-white/5 border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        <CircleDot className={`w-2.5 h-2.5 ${selectedUpi === app ? "text-indigo-400" : "text-slate-600"}`} />
                        {app === "gpay" ? "Google Pay" : app === "phonepe" ? "PhonePe" : "Paytm UPI"}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      UPI VPA Address Link
                    </label>
                    <input
                      placeholder="e.g. signature@paytm"
                      value={customUpiId}
                      onChange={(e) => setCustomUpiId(e.target.value)}
                      className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none uppercase font-mono"
                    />
                  </div>
                </div>
              )}

              {/* CARD PANEL */}
              {activeTab === "CARD" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Credit / Debit Card Number
                    </label>
                    <input
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="w-full text-xs font-mono text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest pl-1">
                        Expiry MM/YY
                      </label>
                      <input
                        placeholder="12/29"
                        value={cardExpiry}
                        onChange={(e) => handleCardExpiryChange(e.target.value)}
                        className="w-full text-xs font-mono text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none text-center"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest pl-1">
                        Card CVV pin
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 4) setCardCvv(val);
                        }}
                        className="w-full text-xs font-mono text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NET BANKING */}
              {activeTab === "NET_BANKING" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Select Registrar Net banking Provider
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
                    >
                      <option value="HDFC">HDFC Bank Limited</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="ICICI">ICICI Bank Limited</option>
                      <option value="AXIS">Axis Bank Limited</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                  <p className="text-[9px] text-slate-550 pl-1 font-bold leading-normal uppercase">
                    * Redirecting to secured electronic treasury portals for user verification token signature.
                  </p>
                </div>
              )}

              {/* WALLET */}
              {activeTab === "WALLET" && (
                <div className="space-y-4">
                  <div className="flex gap-4 justify-center">
                    {["paytm", "amazonpay"].map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setSelectedWallet(wallet)}
                        className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase transition-all flex-1 text-center cursor-pointer ${
                          selectedWallet === wallet 
                            ? "bg-white/10 border-blue-500/50 text-blue-400" 
                            : "bg-white/5 border-transparent text-slate-500"
                        }`}
                      >
                        {wallet === "paytm" ? "Paytm Cashless" : "Amazon Pay Wallet"}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-center text-slate-550 font-bold leading-normal uppercase pt-1">
                    * Standard electronic wallets will process checkouts via OTP factor.
                  </p>
                </div>
              )}

            </div>

            {/* Simulated Debug Toggles */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <label className="text-[9px] font-black text-slate-550 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Simulate Gateway Failures?
              </label>
              <button
                type="button"
                onClick={() => setSimulateFailure(!simulateFailure)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                  simulateFailure ? "bg-red-650 bg-red-600" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    simulateFailure ? "translate-x-5.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Settle Action Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={processing}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider leading-none pt-[15px]"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Processing Secure Node...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-450 animate-pulse" />
                    Authorize & Settle ₹{amount}
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
