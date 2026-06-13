"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, HelpCircle, X } from "lucide-react";
import { useAdmin } from "../layout";

export default function ModerasiPage() {
  const { pendingCampaigns, resolveCampaign } = useAdmin();
  const [confirmModal, setConfirmModal] = useState<{
    id: number;
    action: "Aktif" | "Ditolak";
    title: string;
    umkm: string;
  } | null>(null);

  const handleAction = () => {
    if (confirmModal) {
      resolveCampaign(confirmModal.id, confirmModal.action);
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
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Moderasi Pengajuan Modal</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau kelayakan kampanye pembiayaan yang diajukan oleh Mitra UMKM sebelum dirilis secara publik.</p>
      </div>

      <div className="space-y-4">
        {pendingCampaigns.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">
            Tidak ada pengajuan investasi baru
          </div>
        ) : (
          pendingCampaigns.map((camp) => (
            <div key={camp.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900 leading-tight">{camp.title}</h3>
                  <span className="text-[11px] text-slate-405 font-bold mt-0.5 block">{camp.umkm}</span>
                </div>
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border ${
                  camp.status === "Pending" 
                    ? "bg-rose-50 text-rose-700 border-rose-200" 
                    : camp.status === "Aktif" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>{camp.status}</span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-4 border-t border-slate-100 text-xs font-bold">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">Kebutuhan Modal</span>
                  <span className="text-xs font-heading font-black text-slate-800">Rp {camp.target.toLocaleString("id-ID")}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">Bagi Hasil ROI</span>
                  <span className="text-xs font-heading font-black text-emerald-600">{camp.roi}% / tahun</span>
                </div>
              </div>

              {/* Decisions Buttons */}
              {camp.status === "Pending" && (
                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setConfirmModal({ id: camp.id, action: "Ditolak", title: camp.title, umkm: camp.umkm })}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black px-4 py-2 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Tolak Kampanye
                  </button>
                  <button
                    onClick={() => setConfirmModal({ id: camp.id, action: "Aktif", title: camp.title, umkm: camp.umkm })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1.5 shadow-sm uppercase tracking-wider border-none"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Luncurkan Kampanye
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
                  confirmModal.action === "Aktif" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-sm">Konfirmasi Tindakan</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Moderasi Pendanaan</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Apakah Anda yakin ingin <strong className={confirmModal.action === "Aktif" ? "text-emerald-600" : "text-rose-600"}>{confirmModal.action === "Aktif" ? "MENYETUJUI" : "MENOLAK"}</strong> kampanye investasi <strong className="text-slate-800">"{confirmModal.title}"</strong> oleh <strong className="text-slate-800">{confirmModal.umkm}</strong>?
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
                    confirmModal.action === "Aktif" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
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
