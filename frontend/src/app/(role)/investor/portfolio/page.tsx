"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Landmark } from "lucide-react";
import { useInvestor } from "../layout";

export default function PortfolioPage() {
  const { myPortfolio } = useInvestor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Portofolio Pembiayaan</h1>
        <p className="text-slate-400 text-sm font-semibold">Pantau pergerakan modal investasi aktif Anda di sektor-sektor produksi unggulan desa.</p>
      </div>

      <div className="space-y-4">
        {myPortfolio.length === 0 ? (
          <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center font-bold text-slate-500 uppercase tracking-widest text-xs">
            Anda belum memiliki portofolio investasi aktif
          </div>
        ) : (
          myPortfolio.map((item) => (
            <div key={item.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-heading font-black text-lg text-white leading-tight">{item.title}</h3>
                  <span className="text-xs text-slate-500 font-semibold">{item.umkm}</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full">
                  {item.status}
                </span>
              </div>

              {/* Data metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-900 text-xs font-bold">
                <div>
                  <span className="text-slate-500 block">Nilai Pendanaan</span>
                  <span className="text-sm font-heading font-black text-white">Rp {item.invested.toLocaleString("id-ID")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bagi Hasil ROI</span>
                  <span className="text-sm font-heading font-black text-emerald-400">{item.roi}% / Tahun</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Proyeksi Hasil</span>
                  <span className="text-sm font-heading font-black text-white">Rp {item.expectedReturn.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
