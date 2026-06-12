"use client";

import { motion } from "framer-motion";
import { Youtube, Twitter, Linkedin, Instagram, Github, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialChannel {
  name: string;
  count: string;
  metric: string;
  icon: React.ReactNode;
  theme: string;
  href: string;
}

export default function SocialMediaHub() {
  const channels: SocialChannel[] = [
    {
      name: "LinkedIn",
      count: "24,000+",
      metric: "Professional Alumni",
      icon: <Linkedin className="w-5 h-5" />,
      theme: "border-blue-100 hover:bg-blue-50/50 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 bg-blue-50/20",
      href: "https://linkedin.com",
    },
    {
      name: "YouTube",
      count: "8,500+",
      metric: "Video Lectures",
      icon: <Youtube className="w-5 h-5" />,
      theme: "border-red-100 hover:bg-red-50/50 dark:border-red-900/40 text-red-600 dark:text-red-400 bg-red-50/20",
      href: "https://youtube.com",
    },
    {
      name: "GitHub",
      count: "1,200+",
      metric: "Open Repositories",
      icon: <Github className="w-5 h-5" />,
      theme: "border-slate-200 hover:bg-slate-100/50 dark:border-slate-800 text-slate-800 dark:text-slate-200 bg-slate-50",
      href: "https://github.com",
    },
    {
      name: "Twitter / X",
      count: "12,400+",
      metric: "Instant Bulletins",
      icon: <Twitter className="w-5 h-5" />,
      theme: "border-slate-100 hover:bg-slate-50/50 dark:border-slate-900 text-slate-900 dark:text-slate-100 bg-slate-50/10",
      href: "https://twitter.com",
    },
    {
      name: "Instagram",
      count: "18,200+",
      metric: "Campus Life Daily",
      icon: <Instagram className="w-5 h-5" />,
      theme: "border-pink-100 hover:bg-pink-50/50 dark:border-pink-900/40 text-pink-600 dark:text-pink-400 bg-pink-50/20",
      href: "https://instagram.com",
    },
    {
      name: "College Forum",
      count: "4,500+",
      metric: "Active Threads",
      icon: <MessageCircle className="w-5 h-5" />,
      theme: "border-emerald-100 hover:bg-emerald-50/50 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/20",
      href: "#",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Follow Our Social Media Streams
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Stay synchronised with instant campus alerts, technical student hackathon reviews, and global collegiate collaborations.
          </p>
        </div>

        {/* Tiles Hub Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {channels.map((ch, idx) => (
            <motion.a
              key={idx}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className={cn(
                "p-4 border rounded-2xl flex flex-col items-center justify-center text-center space-y-3 transition-all cursor-pointer shadow-sm select-none hover:-translate-y-1",
                ch.theme
              )}
            >
              <div className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
                {ch.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold leading-none tracking-tight">
                  {ch.count}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  {ch.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 leading-none font-medium">
                  {ch.metric}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
