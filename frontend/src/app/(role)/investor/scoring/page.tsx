"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, AlertTriangle, BookOpen } from "lucide-react";

export default function ScoringPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">AI Credit Risk Scoring</h1>
        <p className="text-slate-400 text-sm font-semibold">Tinjau nilai kredibilitas modal UMKM desa berdasarkan audit geospasial dan transparansi pembukuan kas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rating HUD */}
        <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center items-center text-center space-y-4 shadow-xl">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Grade Risiko Platform</span>
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-slate-900 border-4 border-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.2)]">
            <span className="text-5xl font-black font-heading text-blue-400 tracking-tighter">AA+</span>
          </div>
          <div>
            <h3 className="text-base font-heading font-black text-white">Risiko Gagal Bayar Minimal</h3>
            <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1">Dijamin 100% Asuransi Desa</p>
          </div>
        </div>

        {/* Scoring list breakdown parameters */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 space-y-6 shadow-xl">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-400">Parameter Kredibilitas Proyek</h3>

          <div className="space-y-4 text-xs font-bold">
            
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-850">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-450" />
                <div>
                  <h4 className="text-white">Transparansi Pembukuan Kas</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Audit berkala BUMDes secara digital.</p>
                </div>
              </div>
              <strong className="text-base text-white">Sangat Terbuka</strong>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-850">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-white">Rasio Pertumbuhan Penjualan</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Rata-rata pertumbuhan omset triwulan.</p>
                </div>
              </div>
              <strong className="text-base text-emerald-450">+15% / Tahun</strong>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-850">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="text-white">Tingkat Tunggakan (Default)</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Persentase keterlambatan bayar cicilan.</p>
                </div>
              </div>
              <strong className="text-base text-white">0.0% (Sempurna)</strong>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
