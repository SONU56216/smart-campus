"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ShieldAlert, Receipt, CircleDollarSign } from "lucide-react";

export default function FeeStatusCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    { name: "PAID FEES", value: 48000, color: "#3b82f6" }, // Elegant Blue
    { name: "PENDING DUES", value: 12000, color: "#f59e0b" }, // Amber
    { name: "RECONCILING", value: 3500, color: "#06b6d4" }, // Cyan
  ];

  const totalFees = data.reduce((acc, current) => acc + current.value, 0);
  const paidFees = data[0].value;
  const payPercentage = Math.round((paidFees / totalFees) * 100);

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-left select-none shadow-2xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{payload[0].name}</p>
          <p className="text-xs font-black text-white pt-1">₹ {payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] shadow-xl flex flex-col justify-between select-none h-full min-h-[340px] text-left">
      <div>
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <CircleDollarSign className="w-4.5 h-4.5 text-blue-400" />
            Treasury Ledger Breakdown
          </h3>
          <span className="text-[9px] font-black bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2' py-0.5 rounded">
            SEM 4
          </span>
        </div>

        {/* Graphical Representation */}
        <div className="h-44 w-full relative flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-6 h-6 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
          )}

          {/* Absolute Center percentage gauge overlay */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none leading-none">
            <span className="text-xl font-black text-white">{payPercentage}%</span>
            <span className="text-[8px] font-black text-slate-550 uppercase tracking-widest pt-1 leading-none">Paid</span>
          </div>
        </div>
      </div>

      {/* Grid Summary Row */}
      <div className="grid grid-cols-3 gap-2.5 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col text-left space-y-1">
            <span className="text-[8px] font-black text-slate-550 uppercase tracking-wider block leading-none truncate">
              {item.name.split(" ")[0]}
            </span>
            <span className="text-xs font-black text-white block leading-none">
              ₹{(item.value / 1000).toFixed(1)}k
            </span>
            <div className="w-2.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}
