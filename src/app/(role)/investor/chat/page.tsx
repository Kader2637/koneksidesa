"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useInvestor } from "../layout";

export default function ChatPage() {
  const { messages, sendChatMessage } = useInvestor();
  const [chatInput, setChatInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendChatMessage(chatInput);
    setChatInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Diskusi dengan Mitra</h1>
        <p className="text-slate-400 text-sm font-semibold">Hubungi pemilik usaha Mitra UMKM langsung untuk menanyakan perkembangan panen atau transparansi operasional.</p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-3 h-[500px] shadow-xl">
        
        {/* Contacts column list */}
        <div className="border-r border-slate-900 p-5 space-y-4 hidden lg:block bg-slate-950/40">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Mitra Pengelola</p>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 bg-blue-650/10 border border-blue-500/20 text-blue-400 rounded-2xl text-left cursor-pointer">
              <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center font-black">K</div>
              <div>
                <h4 className="text-xs font-black text-white">Kelompok Tani Padi</h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px] font-semibold">Terima kasih atas dukungannya Pak...</p>
              </div>
            </button>
          </div>
        </div>

        {/* Chat box */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full bg-slate-950">
          
          {/* Box Header */}
          <div className="px-6 py-4 border-b border-slate-900 flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center font-black">K</div>
            <div>
              <h4 className="text-xs font-black text-white">Kelompok Tani Padi</h4>
              <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 text-xs font-medium">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-4 rounded-3xl ${
                    isUser 
                      ? "bg-blue-600 text-white rounded-tr-none shadow-md" 
                      : "bg-slate-900 border border-slate-800 text-slate-350 rounded-tl-none"
                  }`}>
                    <p className="leading-relaxed font-semibold">{msg.text}</p>
                    <span className="text-[8px] text-slate-400 font-black block text-right mt-1.5">{msg.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form write message */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-900 flex items-center gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Tulis pesan balas ke Kelompok Tani..."
              className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs w-full text-white outline-none focus:border-slate-700 font-semibold"
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </motion.div>
  );
}
