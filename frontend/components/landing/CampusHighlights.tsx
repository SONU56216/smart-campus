"use client";

import { motion } from "framer-motion";
import { Users, Award, Trophy, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HighlightItem {
  targetValue: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function CampusHighlights() {
  const highlightsList: HighlightItem[] = [
    {
      targetValue: 5000,
      suffix: "+",
      label: "Enrolled Scholars",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      description: "Ambitious students researching across diverse technical programs."
    },
    {
      targetValue: 150,
      suffix: "+",
      label: "Ph.D. Faculty",
      icon: <GraduationCap className="w-6 h-6 text-indigo-500" />,
      description: "Mentoring undergraduate profiles with highly peer-reviewed works."
    },
    {
      targetValue: 95,
      suffix: "%",
      label: "Industry Placement",
      icon: <Trophy className="w-6 h-6 text-emerald-500" />,
      description: "Successful integrations directly with Fortune 500 tech partners."
    },
    {
      targetValue: 1,
      suffix: "st Grade",
      label: "NBA Accreditation",
      icon: <Award className="w-6 h-6 text-amber-500" />,
      description: "Recognized nationally for curriculum design and ethical audits."
    }
  ];

  return (
    <section id="highlights" className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Distinguished Academic Milestones
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Our numbers reflect a continuous pursuit of scientific discovery, peer guidance, and future-aligned technology solutions.
          </p>
        </div>

        {/* Counters Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlightsList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="p-6 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all select-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metric Highlight</span>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                  {item.icon}
                </div>
              </div>

              <div className="space-y-1">
                <Counter target={item.targetValue} suffix={item.suffix} />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.label}</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Simple internal self-counting logic triggers on visibility
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    let startTimestamp: number | null = null;
    const duration = 1200; // Count Duration in Ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      if (active) {
        setCount(Math.floor(progress * target));
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);

    return () => {
      active = false;
    };
  }, [target]);

  return (
    <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white-pure leading-none">
      {count.toLocaleString()}{suffix}
    </h3>
  );
}
