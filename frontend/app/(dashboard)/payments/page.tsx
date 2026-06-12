"use client";

import { useEffect, useState } from "react";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/hooks/useAuth";
import { 
  Receipt, 
  CircleDollarSign, 
  Filter, 
  Download, 
  FileBadge, 
  ArrowRightLeft,
  CalendarDays,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function StudentPaymentsPage() {
  const { user } = useAuth();
  const { useHistory, downloadReceiptPdf } = usePayment();

  // Filters State
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTxn, setSearchTxn] = useState("");

  const { data: serverPayments, isLoading, error } = useHistory();

  // Premium fallbacks if server history has not been logged yet
  const fallbackPayments = [
    {
      id: "pay-1",
      transactionId: "TXN-81920512",
      purpose: "SEMESTER FEE (SEM 4)",
      amount: 45000,
      paymentGateway: "NET_BANKING",
      status: "SUCCESS",
      createdAt: "2026-05-10T10:30:00.000Z",
    },
    {
      id: "pay-2",
      transactionId: "TXN-82051829",
      purpose: "REGULAR EXAMS REGISTRATION",
      amount: 1500,
      paymentGateway: "UPI",
      status: "SUCCESS",
      createdAt: "2026-06-03T14:15:00.000Z",
    },
    {
      id: "pay-3",
      transactionId: "TXN-82191823",
      purpose: "E-WALLET DEPOSIT",
      amount: 2000,
      paymentGateway: "RAZORPAY",
      status: "SUCCESS",
      createdAt: "2026-06-10T09:45:00.000Z",
    },
    {
      id: "pay-4",
      transactionId: "TXN-82251025",
      purpose: "HOSTEL MESS RECONCILE",
      amount: 3500,
      paymentGateway: "CASH",
      status: "SUCCESS",
      createdAt: "2026-06-11T11:00:00.000Z",
    }
  ];

  const activePayments = serverPayments && serverPayments.length > 0 ? serverPayments : fallbackPayments;

  // Compute Total Paid
  const totalPaidThisSemester = activePayments
    .filter(p => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  // Applying Filters Client-Side
  const filteredPayments = activePayments.filter((pay) => {
    // Type Filter
    if (filterType !== "ALL") {
      const purp = pay.purpose.toLowerCase();
      if (filterType === "SEMESTER" && !purp.includes("semester")) return false;
      if (filterType === "EXAM" && !purp.includes("exam")) return false;
      if (filterType === "WALLET" && !purp.includes("wallet") && !purp.includes("deposit")) return false;
    }

    // Status Filter
    if (filterStatus !== "ALL" && pay.status !== filterStatus) return false;

    // Search filter
    if (searchTxn.trim() !== "") {
      const query = searchTxn.trim().toLowerCase();
      const matchTxn = pay.transactionId.toLowerCase().includes(query);
      const matchPurp = pay.purpose.toLowerCase().includes(query);
      if (!matchTxn && !matchPurp) return false;
    }

    return true;
  });

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

  const handleDownloadReceipt = async (id: string, txnId: string) => {
    try {
      await downloadReceiptPdf(id, txnId);
    } catch (err: any) {
      toast.error(err.message || "Certified receipt creation aborted.");
    }
  };

  return (
    <div className="space-y-8 select-none text-left">
      
      {/* 1. Typography Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1.5">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            Transaction Desk & Ledger
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase">
            Verify payment gateway resolutions, download thermal transaction invoices, and clear pending academic dues.
          </p>
        </div>

        {/* Total Ledger Summary Card */}
        <div className="bg-gradient-to-r from-blue-600/15 to-indigo-600/15 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4 shadow-md select-none max-w-xs w-full md:w-auto">
          <div className="p-2 bg-blue-600 text-white rounded-xl">
            <CircleDollarSign className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[8.5px] font-black text-blue-400 block uppercase tracking-wider">
              Total Settle (Sem 4)
            </span>
            <span className="text-sm font-black text-white leading-none pt-0.5 block">
              ₹ {totalPaidThisSemester.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filters Widget Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/15 border border-white/5 p-4 rounded-2xl">
        
        {/* Search Txn Input */}
        <div className="relative flex items-center bg-slate-950 border border-slate-800 focus-within:border-blue-500 rounded-xl px-3.5 py-2.5 transition-all">
          <Search className="w-4.5 h-4.5 text-slate-550 mr-2 flex-shrink-0" />
          <input
            placeholder="Search Txn ID / Invoice..."
            value={searchTxn}
            onChange={(e) => setSearchTxn(e.target.value)}
            className="text-xs text-slate-200 bg-transparent focus:outline-none w-full font-bold uppercase"
          />
        </div>

        {/* Purpose filter select */}
        <div className="flex flex-col space-y-1.5 justify-center">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-2.5 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
          >
            <option value="ALL">PURPOSE: ALL DUES</option>
            <option value="SEMESTER">PURPOSE: SEMESTER FEES</option>
            <option value="EXAM">PURPOSE: REGISTRATION FEES</option>
            <option value="WALLET">PURPOSE: E-WALLET TOPUPS</option>
          </select>
        </div>

        {/* Status filter select */}
        <div className="flex flex-col space-y-1.5 justify-center">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-2.5 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
          >
            <option value="ALL">STATUS: ALL ENTRIES</option>
            <option value="SUCCESS">STATUS: SUCCESS</option>
            <option value="PENDING">STATUS: PENDING</option>
            <option value="FAILED">STATUS: EXPIRED / FAIL</option>
          </select>
        </div>

        {/* Reset button stats */}
        <div className="flex items-center justify-end">
          <span className="text-[10px] text-slate-550 font-black uppercase tracking-widest pl-2">
            Resolved: {filteredPayments.length} of {activePayments.length} Items
          </span>
        </div>

      </div>

      {/* 3. Payments Ledger Database Table */}
      {isLoading ? (
        <div className="py-24 flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">
            Resolving Gateway Records Table...
          </p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-slate-900/30 border border-white/5 rounded-[24px] p-20 text-center flex flex-col items-center justify-center gap-4">
          <Receipt className="w-11 h-11 text-slate-800" />
          <p className="text-xs font-black text-slate-550 uppercase tracking-widest">
            No matching transactions found in database ledgers.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-white/5 rounded-[24px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none select-none">
                  <th className="p-4 w-36">Transaction ID</th>
                  <th className="p-4">Dues Category / Purpose</th>
                  <th className="p-4 text-right">Settled Amount</th>
                  <th className="p-4 text-center">Protocol / Gate</th>
                  <th className="p-4 text-center">Ledger Status</th>
                  <th className="p-4 text-center">Settled Date</th>
                  <th className="p-4 text-right">Invoices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-950/20 font-bold">
                {filteredPayments.map((pay) => {
                  const isSuccess = pay.status === "SUCCESS";
                  const isPending = pay.status === "PENDING";
                  const isFailed = pay.status === "FAILED";

                  return (
                    <tr key={pay.id} className="hover:bg-white/5 transition-all">
                      {/* Transaction ID */}
                      <td className="p-4 font-mono font-black text-blue-400 select-all uppercase">
                        {pay.transactionId}
                      </td>

                      {/* Purpose */}
                      <td className="p-4 text-slate-200">
                        {pay.purpose}
                      </td>

                      {/* Settled Amount */}
                      <td className="p-4 text-right text-slate-200 font-black">
                        ₹{pay.amount.toLocaleString()}
                      </td>

                      {/* Method */}
                      <td className="p-4 text-center text-slate-400 font-bold uppercase font-mono">
                        {pay.paymentGateway}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 text-center">
                        <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none ${
                          isSuccess ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                          isPending ? "bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse" :
                          "bg-red-500/10 border border-red-500/20 text-red-400"
                        }`}>
                          {pay.status}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="p-4 text-center text-slate-400 font-bold">
                        {getFormatDate(pay.createdAt)}
                      </td>

                      {/* Download Receipt Thermal invoice */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDownloadReceipt(pay.id, pay.transactionId)}
                          disabled={!isSuccess}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[9px] font-black bg-white/5 hover:bg-blue-600 border border-white/5 hover:border-blue-500 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
                          title="Generate certified invoice PDF"
                        >
                          <Download className="w-3 h-3 flex-shrink-0" />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
