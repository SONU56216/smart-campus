"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Bot, Sparkles, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "support";
  text: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  "How can I resolve my ₹500 portal clearance fine?",
  "Where is the B.Tech CSE lab block located?",
  "My digital NFC wallet card is failing to log library entry.",
  "What are the office hours for registrar desk inquiry?"
];

const BOT_RESPONSES: Record<string, string> = {
  default: "Thank you for contacting Metropolitan Support. An academic officer has been notified. Let us know your student register ID tag to accelerate checking.",
  "How can I resolve my ₹500 portal clearance fine?": "Fines can be cleared instantly via the 'Payments/Wallet' tab. Once settled, your barcode is instantly re-validated for physical gate transits. No print-outs necessary.",
  "Where is the B.Tech CSE lab block located?": "The computer science computer labs are in Block A, 3rd Floor (Sector 12 complex). You can find real-time layouts and walking paths under our 'Campus Map' tab.",
  "My digital NFC wallet card is failing to log library entry.": "This is typically caused by a stale encryption token. Try clicking 'Regenerate Barcode' on 'My Card' to sync credentials with physical RFID readers.",
  "What are the office hours for registrar desk inquiry?": "The Registrar Headquarters operates from Monday to Friday, 9:00 AM to 5:00 PM. Lunch intervals run from 1:00 PM to 2:00 PM."
};

export default function LiveChat({ inline = false }: { inline?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "support",
      text: "Welcome to Metropolitan Concierge desk! Select a preset question below or type your administrative ledger inquiry.",
      timestamp: "10:00 PM"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const triggerBotResponse = (userQuery: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const matched = BOT_RESPONSES[userQuery] || BOT_RESPONSES.default;
      const responseMsg: Message = {
        id: Date.now().toString(),
        sender: "support",
        text: matched,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, responseMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    triggerBotResponse(textToSend);
  };

  const currentChatLayout = (
    <div className={`bg-slate-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[480px] w-full md:w-[380px] ${
      inline ? "" : "fixed bottom-6 right-6 z-50 shadow-2xl shadow-blue-500/10"
    } animate-scale-in`}>
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
              <Bot className="w-5 h-5 text-blue-300" />
            </div>
            {/* status active dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-900 rounded-full" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider leading-none flex items-center gap-1">
              Academic Concierge
              <Sparkles className="w-3 h-3 text-amber-300" />
            </h4>
            <p className="text-[8.5px] text-blue-200 font-bold uppercase tracking-wide leading-none pt-1">
              Representative is active
            </p>
          </div>
        </div>

        {!inline && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preset quick queries selector banner */}
      <div className="p-3 bg-slate-950/40 border-b border-white/5 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
        {PRESET_QUERIES.map((preset) => (
          <button
            key={preset}
            onClick={() => handleSendMessage(preset)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 hover:border-slate-875 border border-white/5 text-[9px] font-black text-blue-300 uppercase tracking-wide rounded-xl cursor-pointer transition-all"
          >
            {preset.slice(0, 32)}...
          </button>
        ))}
      </div>

      {/* Messages thread container */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/20 scrollbar-none">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div key={m.id} className={`flex gap-2.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto text-left"}`}>
              {/* Avatar circle */}
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                isUser 
                  ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400" 
                  : "bg-blue-600/10 border-blue-500/20 text-blue-400"
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-1">
                <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                  isUser 
                    ? "bg-indigo-600 text-white rounded-tr-none text-right" 
                    : "bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none text-left"
                }`}>
                  {m.text}
                </div>
                <div className={`flex items-center gap-1 text-[8.5px] text-slate-500 font-bold uppercase tracking-wide ${
                  isUser ? "justify-end" : "justify-start"
                }`}>
                  {m.timestamp}
                  {isUser && <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing bubble placeholder */}
        {isTyping && (
          <div className="flex gap-2.5 max-w-[80%] text-left">
            <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Bot className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <div className="bg-slate-900 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input keyboard controller */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 bg-slate-950 border-t border-white/5 flex gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Ask something about Metro campus..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-900 border border-white/5 rounded-xl text-xs font-semibold px-3 py-2.5 text-white placeholder:text-slate-550 outline-none focus:border-blue-500/50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );

  if (inline) {
    return currentChatLayout;
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-500 text-white p-4.5 rounded-full shadow-2xl hover:scale-105 transition-all shadow-blue-500/40 border border-blue-400/20 cursor-pointer flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6 shrink-0" />
      </button>

      {isOpen && currentChatLayout}
    </>
  );
}
