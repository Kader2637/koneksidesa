"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, XCircle, CheckCircle, HelpCircle, X } from "lucide-react";
import { useAdmin } from "../layout";

export default function VerifikasiPage() {
  const { pendingKycs, resolveKyc } = useAdmin();
  const [confirmModal, setConfirmModal] = useState<{
    id: number;
    action: "Disetujui" | "Ditolak";
    umkm: string;
  } | null>(null);

  const handleAction = () => {
    if (confirmModal) {
      resolveKyc(confirmModal.id, confirmModal.action);
      setConfirmModal(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Verifikasi Pendaftaran Mitra</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau kelengkapan berkas NIB & KTP calon Mitra UMKM baru demi menekan risiko fraud.</p>
      </div>

      <div className="space-y-4">
        {pendingKycs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">
            Belum ada pendaftaran KYC yang masuk
          </div>
        ) : (
          pendingKycs.map((kyc) => (
            <div key={kyc.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900 leading-tight">{kyc.umkm}</h3>
                  <span className="text-[11px] text-slate-400 font-bold block mt-0.5">Pemilik: {kyc.owner}</span>
                </div>
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border ${
                  kyc.status === "Pending" 
                    ? "bg-rose-50 text-rose-700 border-rose-200" 
                    : kyc.status === "Disetujui" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>{kyc.status}</span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 text-xs font-bold">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">Nomor Induk Berusaha (NIB)</span>
                  <span className="text-xs font-heading font-black text-slate-800">{kyc.nib}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">Nomor KTP Pemilik</span>
                  <span className="text-xs font-heading font-black text-slate-800">{kyc.ktp}</span>
                </div>
              </div>

              {/* Decisions Buttons */}
              {kyc.status === "Pending" && (
                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setConfirmModal({ id: kyc.id, action: "Ditolak", umkm: kyc.umkm })}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black px-4 py-2 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Tolak Berkas
                  </button>
                  <button
                    onClick={() => setConfirmModal({ id: kyc.id, action: "Disetujui", umkm: kyc.umkm })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1.5 shadow-sm uppercase tracking-wider border-none"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Setujui Mitra
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-800 z-10 relative space-y-4"
            >
              <button
                onClick={() => setConfirmModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 transition cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  confirmModal.action === "Disetujui" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-sm">Konfirmasi Tindakan</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pemeriksaan Sistem Keamanan</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Apakah Anda yakin ingin <strong className={confirmModal.action === "Disetujui" ? "text-emerald-600" : "text-rose-600"}>{confirmModal.action === "Disetujui" ? "MENYETUJUI" : "MENOLAK"}</strong> pendaftaran berkas KYC untuk mitra <strong className="text-slate-800">{confirmModal.umkm}</strong>?
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider border-none transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleAction}
                  className={`flex-1 text-white py-2.5 rounded-lg text-xs font-black uppercase tracking-wider border-none transition cursor-pointer ${
                    confirmModal.action === "Disetujui" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  Ya, Yakin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
