"use client";

import { useState } from "react";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Share2, 
  Heart, 
  MessageCircle, 
  CornerUpRight, 
  ThumbsUp, 
  Clock, 
  Sparkles,
  Award
} from "lucide-react";
import { toast } from "sonner";

export default function SocialFeed() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [likeCount, setLikeCount] = useState<Record<string, number>>({
    ig1: 342,
    ig2: 195,
    ig3: 562,
    tw1: 88,
    tw2: 122
  });

  const toggleLike = (id: string) => {
    const active = likes[id];
    setLikes((prev) => ({ ...prev, [id]: !active }));
    setLikeCount((prev) => ({
      ...prev,
      [id]: active ? prev[id] - 1 : prev[id] + 1
    }));
    toast.success(active ? "Post unliked." : "Post liked! Thanks for interacting!");
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        text: "Check out this update from Metropolitan University of Technology!",
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Metropolitan Tech Update: ${title}`);
      toast.success("Broadcast link copied to clipboard device slot!");
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Horizontal Platform Links Roster Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Instagram", user: "@metrotech_uni", icon: Instagram, color: "text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/20", link: "https://instagram.com" },
          { label: "Twitter / X", user: "@metrounitech", icon: Twitter, color: "text-sky-400 hover:bg-sky-400/10 hover:border-sky-400/20", link: "https://twitter.com" },
          { label: "YouTube Hub", user: "/metrotechnology", icon: Youtube, color: "text-red-500 hover:bg-red-500/10 hover:border-red-500/20", link: "https://youtube.com" },
          { label: "LinkedIn Org", user: "/school/metrotech", icon: Linkedin, color: "text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/20", link: "https://linkedin.com" }
        ].map((plat) => {
          const Icon = plat.icon;
          return (
            <a
              key={plat.label}
              href={plat.link}
              target="_blank"
              rel="noreferrer"
              className={`bg-slate-900 border border-white/5 rounded-2xl p-4 transition-all hover:scale-[1.01] flex items-center gap-3 cursor-pointer group ${plat.color}`}
            >
              <div className="p-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-400 group-hover:text-inherit shrink-0 transition-all">
                <Icon className="w-5 h-5 shrink-0" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-white uppercase tracking-wider leading-none">
                  {plat.label}
                </h4>
                <p className="text-[10px] font-mono font-bold text-slate-500 truncate pt-1 leading-none uppercase">
                  {plat.user}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Primary Panels: Instagram vs Twitter / YouTube */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* L: INSTAGRAM FEED PREVIEW GRID (8 cols on large screens, 4 on small or rows) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-1.5 leading-none">
                <Instagram className="w-4.5 h-4.5 text-pink-500" />
                Instagram Spotlight
              </h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase font-mono mt-1 leading-none">
                Snapshots, hackathon victories, and physical campus snapshots.
              </p>
            </div>
            <span className="text-[8.5px] font-black uppercase text-pink-500 tracking-wider">LIVE REELS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: "ig1", title: "Convocation Ceremony Rehearsals 2026", src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=300&fit=crop" },
              { id: "ig2", title: "Smart Pass NFC Gates deployment launch", src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=300&fit=crop" },
              { id: "ig3", title: "Annual Winter Hackathon grand prize winners", src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=300&fit=crop" }
            ].map((post) => (
              <div key={post.id} className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div className="aspect-square bg-slate-950 overflow-hidden relative">
                  <img 
                    src={post.src} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                  />
                  {/* overlay card hover */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <Heart className={`w-4 h-4 ${likes[post.id] ? "fill-red-500 text-red-500" : ""}`} />
                      <span className="text-[10px] font-bold font-mono">{likeCount[post.id]}</span>
                    </button>
                    <button 
                      onClick={() => handleShare(post.title)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 space-y-2">
                  <p className="text-[11px] text-slate-350 leading-normal font-semibold truncate uppercase">
                    {post.title}
                  </p>
                  
                  <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold border-t border-white/5 pt-2 mt-1">
                    <span className="font-mono flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 ${likes[post.id] ? "fill-red-500 text-red-500 animate-pulse" : ""}`} />
                      {likeCount[post.id]} Likes
                    </span>
                    <button 
                      onClick={() => handleShare(post.title)}
                      className="hover:text-blue-400 cursor-pointer text-[9px] uppercase font-black tracking-wide inline-flex items-center gap-0.5"
                    >
                      Share <CornerUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* YouTube Video Section Grid */}
          <div className="bg-slate-900 border border-white/5 rounded-[24px] p-5 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Youtube className="w-5 h-5 text-red-500 shrink-0" />
              Latest Campus Broadcast Reel
            </h4>
            
            {/* Aspect Video wrapper */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/5 shadow-inner">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Metropolitan Campus Video Guide"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed uppercase">
              METROPOLITAN VIRTUAL CONVOCATION REELS: Virtual tour guidelines, Dean address transcripts, and computer engineering student research galleries.
            </p>
          </div>
        </div>

        {/* R: TWITTER TIMELINE SYNC (4 cols on large screens) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-1.5 leading-none">
                <Twitter className="w-4.5 h-4.5 text-sky-400" />
                Campus X Feed
              </h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase font-mono mt-1 leading-none">
                Real-time updates & notifications.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { id: "tw1", time: "2 Hours Ago", user: "@metrounitech", text: "Commemoration of Guru Nanak Jayanti scheduled. Live campus academic boards closed. Emergency on-chip barcode verifications remain operative around campus. #MetroCalendar" },
              { id: "tw2", time: "1 Day Ago", user: "@metrounitech", text: "Winter registration is now officially LIVE. Ensure all backlog charges, tuition fines, and exam sheet fees are processed via the portal wallet. #MetroAdmissions" }
            ].map((tweet) => (
              <div key={tweet.id} className="bg-slate-900/60 border border-white/5 rounded-2xl p-4.5 space-y-3 hover:border-slate-800 transition-all text-xs font-medium">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-450 flex items-center justify-center shrink-0">
                      <Twitter className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-white uppercase leading-none block">MUT Control Unit</span>
                      <span className="text-[8.5px] font-mono text-slate-550 leading-none block pt-0.5 font-bold">{tweet.user}</span>
                    </div>
                  </div>
                  <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wide flex items-center gap-1 font-bold">
                    <Clock className="w-3 h-3 text-slate-600 shrink-0" />
                    {tweet.time}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed font-semibold">
                  {tweet.text}
                </p>

                <div className="flex items-center gap-4 text-slate-500 text-[10px] uppercase font-bold pt-1">
                  <button 
                    onClick={() => toggleLike(tweet.id)}
                    className="hover:text-pink-500 cursor-pointer inline-flex items-center gap-1 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likes[tweet.id] ? "fill-pink-500 text-pink-500 animate-pulse" : ""}`} />
                    {likeCount[tweet.id]}
                  </button>
                  <button 
                    onClick={() => handleShare(tweet.text)}
                    className="hover:text-blue-400 cursor-pointer inline-flex items-center gap-1 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Broadcast
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Award Node box */}
          <div className="p-4 bg-gradient-to-tr from-amber-500/10 to-amber-500/0 border border-amber-500/15 rounded-2xl flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">OFFICIAL RECOGNITION</span>
              <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed uppercase">
                Metropolitan University named central digital innovation champion for cashless smart campus wallet implementations.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
