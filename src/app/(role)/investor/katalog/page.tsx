"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, TrendingUp, Sparkles, Plus, X } from "lucide-react";
import Image from "next/image";
import { useInvestor } from "../layout";

export default function KatalogPage() {
  const { catalogCampaigns, investInCampaign, walletBalance } = useInvestor();
  
  // Funding modal states
  const [selectedCamp, setSelectedCamp] = useState<any | null>(null);
  const [investAmt, setInvestAmt] = useState("");

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCamp) return;

    const amt = parseFloat(investAmt);
    if (isNaN(amt) || amt <= 0) {
      alert("Masukkan nominal investasi yang valid!");
      return;
    }

    if (amt > walletBalance) {
      alert("Saldo dompet Anda tidak mencukupi! Silakan lakukan Top Up di menu Dompet.");
      return;
    }

    const success = investInCampaign(selectedCamp.id, amt);
    if (success) {
      alert(`Sukses menyalurkan investasi sebesar Rp ${amt.toLocaleString("id-ID")} untuk proyek: ${selectedCamp.title}!`);
      setSelectedCamp(null);
      setInvestAmt("");
    } else {
      alert("Gagal melakukan investasi! Pastikan nominal tidak melebihi kapasitas penggalangan dana.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Katalog Investasi Desa</h1>
        <p className="text-slate-400 text-sm font-semibold">Salurkan modal Anda ke proyek-proyek produktif pilihan dengan bagi hasil syariah yang adil.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogCampaigns.map((camp) => (
          <div key={camp.id} className="bg-slate-950 rounded-3xl border border-slate-800/80 shadow-lg overflow-hidden flex flex-col group">
            <div className="relative h-44 bg-slate-800">
              <Image 
                src={camp.img} 
                alt={camp.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-[9px] font-bold text-slate-350 flex items-center gap-1">
                <Landmark className="w-3 h-3 text-blue-400" /> {camp.risk} Risk
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-heading font-black text-white text-base leading-tight">{camp.title}</h3>
                <span className="text-[10px] text-slate-500 font-bold block mt-1">{camp.umkm}</span>
                
                {/* Progress bar */}
                <div className="space-y-1.5 mt-4 text-[10px] font-bold text-slate-400">
                  <div className="flex justify-between">
                    <span>Terkumpul: Rp {camp.current.toLocaleString("id-ID")}</span>
                    <span>{camp.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/65">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${camp.progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-900">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-black">Bagi Hasil</span>
                  <span className="text-sm font-black text-emerald-400 font-heading">{camp.roi}% / Tahun</span>
                </div>
                {camp.progress < 100 ? (
                  <button
                    onClick={() => setSelectedCamp(camp)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
                  >
                    Investasikan
                  </button>
                ) : (
                  <span className="text-xs font-black text-slate-500 uppercase">Terdanai</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment input modal popup */}
      <AnimatePresence>
        {selectedCamp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-[2.5rem] w-full max-w-md p-6 relative shadow-2xl space-y-6"
            >
              <button
                onClick={() => setSelectedCamp(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 w-fit block">Konfirmasi Pendanaan</span>
                <h3 className="text-lg font-heading font-black text-white leading-tight mt-1">{selectedCamp.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold">{selectedCamp.umkm}</p>
              </div>

              <form onSubmit={handleInvestSubmit} className="space-y-4 text-xs font-bold">
                <div className="space-y-2">
                  <label className="text-slate-400">Nominal Investasi (Rupiah)</label>
                  <input
                    type="number"
                    value={investAmt}
                    onChange={(e) => setInvestAmt(e.target.value)}
                    placeholder="Contoh: 5000000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-slate-700 font-semibold"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-black">
                    <span>Saldo Dompet Anda: Rp {walletBalance.toLocaleString("id-ID")}</span>
                    <span>Sisa Kuota: Rp {(selectedCamp.target - selectedCamp.current).toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-[11px] shadow-lg shadow-emerald-500/15"
                >
                  Salurkan Pembiayaan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
