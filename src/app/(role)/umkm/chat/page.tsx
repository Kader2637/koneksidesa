"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useUMKM } from "../layout";

export default function ChatPage() {
  const { messages, sendChatMessage } = useUMKM();
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
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-2">Diskusi Pelanggan</h1>
        <p className="text-slate-500 text-sm font-semibold">Tanggapi pertanyaan pembeli mengenai kustomisasi anyaman, stok grosir, atau logistik pengiriman.</p>
      </div>

      <div className="bg-white border border-emerald-100 rounded-[2.5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-3 h-[500px] shadow-sm">
        
        {/* Contacts column list */}
        <div className="border-r border-slate-100 p-5 space-y-4 hidden lg:block bg-slate-50/40">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Obrolan Pembeli</p>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-left cursor-pointer transition shadow-inner">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center font-black text-emerald-700">B</div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-slate-800">Budi Santoso</h4>
                <p className="text-[10px] text-slate-500 truncate font-semibold">Terima kasih atas respons...</p>
              </div>
            </button>
          </div>
        </div>

        {/* Chat box */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full bg-white">
          
          {/* Box Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/20">
            <div className="w-9 h-9 bg-slate-200 rounded-xl flex items-center justify-center font-black text-slate-700">B</div>
            <div>
              <h4 className="text-xs font-black text-slate-800">Budi Santoso</h4>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 text-xs font-medium">
            {messages.map((msg) => {
              const isSeller = msg.sender === "seller";
              return (
                <div key={msg.id} className={`flex ${isSeller ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-4 rounded-3xl ${
                    isSeller 
                      ? "bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-600/10" 
                      : "bg-slate-50 border border-slate-200/60 text-slate-800 rounded-tl-none"
                  }`}>
                    <p className="leading-relaxed font-semibold">{msg.text}</p>
                    <span className={`text-[8px] font-black block text-right mt-1.5 ${isSeller ? "text-emerald-100/90" : "text-slate-400"}`}>{msg.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form write message */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50/20">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Tulis pesan balas ke Budi..."
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs w-full text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-semibold"
            />
            <button
              type="submit"
              className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition cursor-pointer flex-shrink-0 shadow-sm shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </motion.div>
  );
}
