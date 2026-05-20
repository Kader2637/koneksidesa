"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, XCircle, CheckCircle } from "lucide-react";
import { useAdmin } from "../layout";

export default function VerifikasiPage() {
  const { pendingKycs, resolveKyc } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Verifikasi Pendaftaran Mitra</h1>
        <p className="text-slate-400 text-sm font-semibold">Tinjau kelengkapan berkas NIB & KTP calon Mitra UMKM baru demi menekan risiko fraud.</p>
      </div>

      <div className="space-y-4">
        {pendingKycs.length === 0 ? (
          <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center font-bold text-slate-500 uppercase tracking-widest text-xs">
            Belum ada pendaftaran KYC yang masuk
          </div>
        ) : (
          pendingKycs.map((kyc) => (
            <div key={kyc.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-heading font-black text-lg text-white leading-tight">{kyc.umkm}</h3>
                  <span className="text-xs text-slate-500 font-semibold">Nama Pemilik: {kyc.owner}</span>
                </div>
                <span className={`text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full border ${
                  kyc.status === "Pending" 
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                    : kyc.status === "Disetujui" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-zinc-800 text-zinc-500 border-zinc-700"
                }`}>{kyc.status}</span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-900 text-xs font-bold">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Nomor Izin Berusaha (NIB)</span>
                  <span className="text-sm font-heading font-black text-white">{kyc.nib}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Kartu Tanda Penduduk (KTP)</span>
                  <span className="text-sm font-heading font-black text-white">{kyc.ktp}</span>
                </div>
              </div>

              {/* Decisions Buttons */}
              {kyc.status === "Pending" && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-900/60">
                  <button
                    onClick={() => resolveKyc(kyc.id, "Ditolak")}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-black px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Tolak Berkas
                  </button>
                  <button
                    onClick={() => resolveKyc(kyc.id, "Disetujui")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/15"
                  >
                    <CheckCircle className="w-4 h-4" /> Setujui Mitra
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
