"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Star, Clock, Heart } from "lucide-react";

export default function SkorPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-2">Skor Kualitas AI</h1>
        <p className="text-slate-500 text-sm font-semibold">Tinjau peringkat kesehatan bisnis Anda berdasarkan akumulasi metrik logistik & ulasan pembeli.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Score HUD */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100/80 flex flex-col justify-center items-center text-center space-y-6 shadow-sm shadow-emerald-100/5 hover:shadow-md transition-all duration-300">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Indeks Kualitas Usaha</span>
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-emerald-50/30 border-4 border-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.1)]">
            <span className="text-5xl font-black font-heading text-emerald-600 tracking-tighter">A+</span>
          </div>
          <div>
            <h3 className="text-base font-heading font-black text-slate-800">Sangat Layak Pendanaan</h3>
            <span className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-wide bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full mt-2 inline-block shadow-sm">
              Sertifikasi Grade A BUMDes
            </span>
          </div>
        </div>

        {/* Breakdown parameters */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-emerald-100/80 space-y-6 shadow-sm shadow-emerald-100/5">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Rincian Metrik Keandalan</h3>

          <div className="space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/60 transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200/40 shadow-sm">
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-extrabold text-sm leading-snug">Rating Kepuasan Pembeli</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Rata-rata ulasan produk bintang 5.</p>
                </div>
              </div>
              <strong className="text-base text-slate-800 font-black">4.9 / 5.0</strong>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/60 transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200/40 shadow-sm">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-extrabold text-sm leading-snug">Kecepatan Fulfillment Pesanan</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Waktu rata-rata memproses paket.</p>
                </div>
              </div>
              <strong className="text-base text-slate-800 font-black">12 Jam</strong>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/60 transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200/40 shadow-sm">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-extrabold text-sm leading-snug">Integritas Riwayat Pelunasan</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ketepatan mencicil angsuran modal.</p>
                </div>
              </div>
              <strong className="text-base text-emerald-600 font-black uppercase tracking-wide bg-emerald-50 border border-emerald-250/20 px-3 py-1 rounded-lg">100% Lancar</strong>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
