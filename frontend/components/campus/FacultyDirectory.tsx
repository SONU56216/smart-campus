"use client";

import { useState } from "react";
import { Search, Mail, Phone, School, Sparkles, Star, Award, GraduationCap, ArrowUpRight } from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: "CSE" | "ECE" | "ME" | "Biotech" | "Basic Sciences" | "Registrar Office";
  email: string;
  phone: string;
  avatar: string;
  office: string;
  bio: string;
  rating: number; // 4.8+ prestigious ratings
}

const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: "1",
    name: "Dr. Sudha Chandran",
    designation: "Professor & Head of Department",
    department: "CSE",
    email: "sudha.cs@metrouni.edu.in",
    phone: "+91 1122334401",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    office: "Block A - Room 302",
    bio: "Ph.D. in Computer Vision from IIT Delhi. Researcher of deep neural network architectures and autonomous systems.",
    rating: 4.9
  },
  {
    id: "2",
    name: "Dr. Ramesh Sarin",
    designation: "Associate Professor",
    department: "CSE",
    email: "ramesh.cs@metrouni.edu.in",
    phone: "+91 1122334402",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    office: "Block A - Room 305",
    bio: "Specialist in Advanced Algorithms and Distributed Systems. Former Senior Engineer at Intel Labs.",
    rating: 4.8
  },
  {
    id: "3",
    name: "Dr. Arundhati Roy",
    designation: "Assistant Professor",
    department: "ECE",
    email: "arundhati.ece@metrouni.edu.in",
    phone: "+91 1122334403",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    office: "Block B - Room 104",
    bio: "RF Circuit specialist. Focuses on Internet of Things networks and millimeter-wave communication schemes.",
    rating: 4.85
  },
  {
    id: "4",
    name: "Dr. Raghuram Rajan",
    designation: "Professor Emeritus",
    department: "ME",
    email: "raghuram.me@metrouni.edu.in",
    phone: "+91 1122334404",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    office: "Block C - Room 201",
    bio: "Fluid mechanics & thermodynamics researcher. Author of 'Introductory Fluid Dynamics: Principles & Applications'.",
    rating: 4.95
  },
  {
    id: "5",
    name: "Dr. Manisha Koirala",
    designation: "Senior Scientist & Prof",
    department: "Biotech",
    email: "manisha.bio@metrouni.edu.in",
    phone: "+91 1122334405",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    office: "Block D - Biotech Lab Room 1",
    bio: "Ph.D. in CRISPR Gene Editing Technologies. Awarded National Fellowship for biomedical genetics breakthroughs.",
    rating: 4.9
  },
  {
    id: "6",
    name: "Dr. Abdul Kalam",
    designation: "Professor of Applied Physics",
    department: "Basic Sciences",
    email: "kalam.physics@metrouni.edu.in",
    phone: "+91 1122334406",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    office: "Science Complex - Lab 4",
    bio: "Research focus in Quantum Computing and Nano-Structures. Inspires student project teams in space satellites modeling.",
    rating: 5.0
  },
  {
    id: "7",
    name: "Pranab Mukherjee",
    designation: "Registrar Stafford Controller",
    department: "Registrar Office",
    email: "pranab.registrar@metrouni.edu.in",
    phone: "+91 1122334455",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    office: "Registrar Hall - Desk 1",
    bio: "Manages general student admissions, RFID pass clearance approvals, biometric registration audit boards.",
    rating: 4.75
  }
];

export default function FacultyDirectory() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const filteredFaculty = FACULTY_MEMBERS.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) || 
                          member.designation.toLowerCase().includes(search.toLowerCase()) ||
                          member.bio.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "all" || member.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Search and Filters panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 p-4 border border-white/5 rounded-2xl">
        <div className="relative md:col-span-3">
          <Search className="w-4.5 h-4.5 text-slate-550 absolute left-3 w-4 h-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search credentials, research topics (neural networks, quantum physics, DNA...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-xl text-xs font-semibold pl-10 pr-4 py-2.5 text-white placeholder:text-slate-550 outline-none focus:border-blue-500/50"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-950 border border-white/5 text-xs text-slate-300 font-bold rounded-xl p-2.5 cursor-pointer outline-none focus:border-blue-500/50"
        >
          <option value="all">-- All Departments --</option>
          <option value="CSE">Computer Science (CSE)</option>
          <option value="ECE">Electronics (ECE)</option>
          <option value="ME">Mech Engineering (ME)</option>
          <option value="Biotech">Biotechnology (Biotech)</option>
          <option value="Basic Sciences">Physics & Science</option>
          <option value="Registrar Office">Registrar Office staff</option>
        </select>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((memb) => (
          <div
            key={memb.id}
            className="bg-slate-900 border border-white/5 rounded-[24px] overflow-hidden p-5 flex flex-col justify-between hover:scale-[1.01] hover:border-slate-800 transition-all duration-300 relative group"
          >
            {/* Visual design badges right-topped */}
            <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-1 font-mono text-[9px] font-bold">
              <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 rounded-lg uppercase tracking-wider border border-blue-500/10">
                {memb.department}
              </span>
              <span className="px-2 py-0.5 bg-amber-550/15 text-amber-500 rounded-lg uppercase tracking-wider border border-amber-500/10 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> {memb.rating.toFixed(2)}
              </span>
            </div>

            <div className="flex items-start gap-4">
              {/* Photo frame */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shrink-0 relative">
                <img
                  src={memb.avatar}
                  alt={memb.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                />
              </div>

              <div className="min-w-0 pr-12 text-left">
                <h4 className="text-sm font-black text-white uppercase tracking-tight truncate leading-tight">
                  {memb.name}
                </h4>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wide truncate pt-1 leading-none">
                  {memb.designation}
                </p>
                <div className="text-[9px] text-slate-500 font-black flex items-center gap-1 uppercase font-mono mt-1 leading-none">
                  <School className="w-3 h-3 shrink-0" />
                  {memb.office}
                </div>
              </div>
            </div>

            {/* Micro Bio */}
            <div className="py-4.5 border-y border-white/5 my-4.5 text-xs text-slate-400 leading-relaxed font-semibold">
              {memb.bio}
            </div>

            {/* Card Buttons Links footer */}
            <div className="flex gap-2.5">
              <a
                href={`mailto:${memb.email}`}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2.5 bg-slate-950 border border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 text-slate-400 hover:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all leading-none shrink-0"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" /> Email
              </a>
              <a
                href={`tel:${memb.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2.5 bg-slate-950 border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 text-slate-400 hover:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all leading-none shrink-0"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" /> Contact
              </a>
            </div>
          </div>
        ))}

        {filteredFaculty.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-900/40 border border-white/5 rounded-3xl">
            <GraduationCap className="w-8 h-8 text-slate-650 mx-auto mb-2 opacity-50 animate-pulse" />
            <p className="text-xs text-slate-500 uppercase font-black tracking-wider leading-none">
              No faculty credentials matching current keywords
            </p>
            <p className="text-[10px] text-slate-550 uppercase font-bold tracking-normal mt-1 leading-none">
              Verify spelling or expand the default division query.
            </p>
          </div>
        )}
      </div>

      {/* Advisory Node Row */}
      <div className="flex items-center gap-3 p-5 bg-blue-500/10 border border-blue-500/15 rounded-2xl">
        <Award className="w-5 h-5 text-blue-400 shrink-0" />
        <p className="text-[10px] text-slate-400 font-semibold uppercase leading-normal">
          Faculty office sessions run from 1:30 PM to 3:30 PM (Consultation Block schedule). For academic overrides, visit the Registrar Coordinator with pre-requisite physical admit block papers.
        </p>
      </div>

    </div>
  );
}
