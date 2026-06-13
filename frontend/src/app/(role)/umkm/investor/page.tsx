"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Users, HelpCircle } from "lucide-react";
import { useUMKM } from "../layout";
import { toast } from "@/components/ui/Toast";

export default function UMKMInvestorPage() {
  const { 
    umkmInvestasis, 
    resolveInvestasi,
    refreshUmkmData 
  } = useUMKM();

  const [actionLoading, setActionLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ id: number; decision: "Diterima" | "Ditolak"; amount: number; investorName: string } | null>(null);

  const handleResolveOffer = async () => {
    if (confirmModal) {
      setActionLoading(true);
      try {
        await resolveInvestasi(confirmModal.id, confirmModal.decision);
        toast.success(`Penawaran investasi sebesar Rp ${confirmModal.amount.toLocaleString("id-ID")} berhasil ${confirmModal.decision.toLowerCase()}!`);
        refreshUmkmData();
        setConfirmModal(null);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memproses keputusan investasi.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const pendingOffers = umkmInvestasis.filter(i => i.status === "Pending");
  const processedOffers = umkmInvestasis.filter(i => i.status !== "Pending");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Kelola Penawaran Investor</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau, terima, atau tolak penawaran investasi modal kerja langsung yang dikirimkan oleh investor desa.</p>
      </div>

      {/* Penawaran Pending */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" /> Penawaran Masuk (Butuh Konfirmasi)
        </h3>
        
        <div className="space-y-4">
          {pendingOffers.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Tidak ada penawaran investasi baru
            </div>
          ) : (
            pendingOffers.map((i) => {
              const name = i.user?.name || `Investor ID ${i.user_id}`;
              return (
                <div key={i.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition duration-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-sm">Penawaran dari: {name}</h4>
                    <p className="text-xs text-slate-500 font-bold">Tenor Jangka Waktu: {i.tenor || "12 Bulan"}</p>
                    <p className="text-xs text-slate-400 font-medium">Catatan Penawaran: {i.message || "-"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Nominal Ditawarkan</span>
                      <span className="text-base font-black text-slate-800">Rp {Number(i.amount).toLocaleString("id-ID")}</span>
                    </div>
                    <button
                      onClick={() => setConfirmModal({ id: i.id, decision: "Diterima", amount: Number(i.amount), investorName: name })}
                      disabled={actionLoading}
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition shadow-sm border-none"
                      title="Terima Investasi"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmModal({ id: i.id, decision: "Ditolak", amount: Number(i.amount), investorName: name })}
                      disabled={actionLoading}
                      className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer transition shadow-sm border-none"
                      title="Tolak Investasi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Riwayat Penawaran yang Sudah Diproses */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Riwayat Keputusan Investasi
        </h3>

        <div className="space-y-4">
          {processedOffers.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Belum ada penawaran investasi yang diproses
            </div>
          ) : (
            processedOffers.map((i) => (
              <div key={i.id} className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Investor: {i.user?.name || `ID ${i.user_id}`}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Tenor: {i.tenor || "12 Bulan"} • Nominal: Rp {Number(i.amount).toLocaleString("id-ID")}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border self-start sm:self-center ${
                  i.status === "Aktif" || i.status === "Diterima"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}>{i.status === "Aktif" ? "Diterima" : i.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-800 max-w-sm w-full space-y-4 relative"
          >
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base">Konfirmasi Keputusan Investasi</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tinjauan Penawaran Modal</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin <strong className={confirmModal.decision === "Diterima" ? "text-emerald-600" : "text-rose-600"}>{confirmModal.decision === "Diterima" ? "MENERIMA" : "MENOLAK"}</strong> penawaran investasi dari <strong className="text-slate-800">{confirmModal.investorName}</strong> sebesar <strong className="text-slate-800">Rp {confirmModal.amount.toLocaleString("id-ID")}</strong>?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleResolveOffer}
                className={`flex-1 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer ${
                  confirmModal.decision === "Diterima" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Ya, Yakin
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
