"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useAdmin } from "../layout";

export default function ModerasiPage() {
  const { pendingCampaigns, resolveCampaign } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Moderasi Pengajuan Modal</h1>
        <p className="text-slate-400 text-sm font-semibold">Tinjau kelayakan kampanye pembiayaan yang diajukan oleh Mitra UMKM sebelum dirilis secara publik.</p>
      </div>

      <div className="space-y-4">
        {pendingCampaigns.length === 0 ? (
          <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center font-bold text-slate-500 uppercase tracking-widest text-xs">
            Tidak ada pengajuan investasi baru
          </div>
        ) : (
          pendingCampaigns.map((camp) => (
            <div key={camp.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-heading font-black text-lg text-white leading-tight">{camp.title}</h3>
                  <span className="text-xs text-slate-500 font-semibold">{camp.umkm}</span>
                </div>
                <span className={`text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full border ${
                  camp.status === "Pending" 
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                    : camp.status === "Aktif" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-zinc-800 text-zinc-500 border-zinc-700"
                }`}>{camp.status}</span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-900 text-xs font-bold">
                <div>
                  <span className="text-slate-500 block">Kebutuhan Modal</span>
                  <span className="text-sm font-heading font-black text-white">Rp {camp.target.toLocaleString("id-ID")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bagi Hasil ROI</span>
                  <span className="text-sm font-heading font-black text-emerald-400">{camp.roi}% / tahun</span>
                </div>
              </div>

              {/* Decisions Buttons */}
              {camp.status === "Pending" && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-900/60">
                  <button
                    onClick={() => resolveCampaign(camp.id, "Ditolak")}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-black px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Tolak Kampanye
                  </button>
                  <button
                    onClick={() => resolveCampaign(camp.id, "Aktif")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/15"
                  >
                    <CheckCircle className="w-4 h-4" /> Luncurkan Kampanye
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
