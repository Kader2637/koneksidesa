"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

export default function LacakPage() {
  const steps = [
    { title: "Kurir Menuju Lokasi Anda", desc: "Paket dibawa kurir regional ke alamat tujuan.", time: "14:22 WIB", active: true },
    { title: "Paket Tiba di Gudang Regional", desc: "Hub sortir logistik utama Jawa Tengah.", time: "09:12 WIB", active: true },
    { title: "Pesanan Dikirim oleh Penjual", desc: "Mitra UMKM menyerahkan paket ke logistik terdekat.", time: "Kemarin, 16:30 WIB", active: true },
    { title: "Pembayaran Dikonfirmasi", desc: "Transaksi berhasil diselesaikan melalui platform.", time: "Kemarin, 16:15 WIB", active: true }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Lacak Pengiriman</h1>
        <p className="text-slate-400 text-sm font-semibold">Pantau pergerakan logistik kurir regional yang mengirimkan pesanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Timeline details */}
        <div className="lg:col-span-2 bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 space-y-8">
          <div className="flex justify-between items-center border-b border-slate-900 pb-4">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">No. Resi Pengiriman</span>
              <span className="font-heading font-black text-white text-base">KD-LOG98231264</span>
            </div>
            <span className="bg-emerald-500/15 text-emerald-405 border border-emerald-500/20 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider text-emerald-400">
              Dalam Perjalanan
            </span>
          </div>

          {/* Vertical timeline steps */}
          <div className="space-y-8 relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
            {steps.map((step, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Pulsing circle indicators */}
                <div className={`absolute -left-8 top-1.5 w-2 h-2 rounded-full border-2 border-slate-900 ${
                  step.active 
                    ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] scale-125" 
                    : "bg-slate-750"
                }`} />
                <h4 className={`text-sm font-bold ${step.active ? "text-white" : "text-slate-500"}`}>{step.title}</h4>
                <p className="text-xs text-slate-400 font-semibold">{step.desc}</p>
                <span className="text-[10px] text-slate-500 font-black block pt-0.5">{step.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Courier Info card */}
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 space-y-5 shadow-lg">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-400">Informasi Kurir</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-400 font-black border border-slate-800">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Setyo Adi (Kurir Regional)</h4>
                <p className="text-[10px] text-slate-500 font-bold">KoneksiLogistics Express</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
