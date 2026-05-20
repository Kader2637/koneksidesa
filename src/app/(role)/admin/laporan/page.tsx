"use client";

import React from "react";
import { motion } from "framer-motion";
import { LifeBuoy, CheckCircle, Clock } from "lucide-react";
import { useAdmin } from "../layout";

export default function LaporanPage() {
  const { tickets, resolveTicket } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Pusat Keluhan & Tiket Bantuan</h1>
        <p className="text-slate-400 text-sm font-semibold">Tinjau keluhan teknis maupun kendala transaksi dari pembeli, investor, dan mitra UMKM desa.</p>
      </div>

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center font-bold text-slate-500 uppercase tracking-widest text-xs">
            Tidak ada keluhan tiket yang masuk
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <div>
                  <span className="text-slate-500 uppercase tracking-widest text-[9px] block">Kode Tiket</span>
                  <h4 className="text-white text-base font-heading font-black">{t.id}</h4>
                </div>
                <span className={`text-[10px] uppercase px-3 py-1 rounded-lg border ${
                  t.status === "Terbuka" 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                } flex items-center gap-1`}>
                  {t.status === "Terbuka" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                  {t.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-900 text-xs font-bold">
                <div>
                  <span className="text-slate-500 block">Pelapor</span>
                  <span className="text-sm font-heading font-black text-white">{t.user}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Kategori</span>
                  <span className="text-sm font-heading font-black text-white">{t.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Subjek Laporan</span>
                  <span className="text-sm font-heading font-black text-white">{t.subject}</span>
                </div>
              </div>

              {t.status === "Terbuka" && (
                <div className="flex justify-end pt-4 border-t border-slate-900/60">
                  <button
                    onClick={() => {
                      resolveTicket(t.id);
                      alert(`Tiket #${t.id} berhasil diselesaikan!`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" /> Selesaikan Tiket
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
