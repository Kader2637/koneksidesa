"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Landmark, FileText, HelpCircle } from "lucide-react";
import { useInvestor } from "../layout";
import { toast } from "@/components/ui/Toast";

export default function InvestorPersetujuanPage() {
  const { 
    investorPendanaans, 
    resolvePendanaan, 
    refreshInvestorData 
  } = useInvestor();

  const [actionLoading, setActionLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ id: number; decision: "Diterima" | "Ditolak"; amount: number; title: string } | null>(null);

  const handleResolveProposal = async () => {
    if (confirmModal) {
      setActionLoading(true);
      const success = await resolvePendanaan(confirmModal.id, confirmModal.decision);
      setActionLoading(false);
      if (success) {
        toast.success(`Pengajuan pendanaan sebesar Rp ${confirmModal.amount.toLocaleString("id-ID")} berhasil ${confirmModal.decision.toLowerCase()}!`);
        refreshInvestorData();
        setConfirmModal(null);
      } else {
        toast.error("Gagal memproses keputusan.");
      }
    }
  };

  const pendingProposals = investorPendanaans.filter(p => p.status === "Pending");
  const processedProposals = investorPendanaans.filter(p => p.status !== "Pending");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Persetujuan Pendanaan</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau proposal pembiayaan modal kerja syariah masuk dari UMKM desa, lalu terima atau tolak pengajuan.</p>
      </div>

      {/* Proposals Pending */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" /> Proposal Masuk (Butuh Persetujuan)
        </h3>
        
        <div className="space-y-4">
          {pendingProposals.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Tidak ada proposal masuk baru
            </div>
          ) : (
            pendingProposals.map((p) => (
              <div key={p.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition duration-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-extrabold text-slate-800 text-base leading-tight">{p.title}</h4>
                  <p className="text-xs font-bold text-slate-400">UMKM: <span className="text-slate-700">{p.business_name || "Toko UMKM"}</span> • Tenor: {p.tenor}</p>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">Tujuan Penggunaan: {p.purpose}</p>
                  {p.proposal_path && (
                    <div className="pt-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-450" />
                      <a href={p.proposal_path} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-black uppercase tracking-wider hover:underline">Unduh Berkas Proposal PDF</a>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 border-l border-slate-250/60 pl-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-450 font-bold uppercase tracking-wider block">Target Modal</span>
                    <span className="text-base font-black text-slate-800">Rp {Number(p.target_amount ?? p.target ?? 0).toLocaleString("id-ID")}</span>
                    <span className="text-xs text-emerald-650 font-black block">Dividen: +{p.roi}%</span>
                  </div>
                  
                  <button
                    onClick={() => setConfirmModal({ id: p.id, decision: "Diterima", amount: Number(p.target_amount ?? p.target ?? 0), title: p.title })}
                    disabled={actionLoading}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition shadow-sm border-none"
                    title="Terima Pengajuan"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmModal({ id: p.id, decision: "Ditolak", amount: Number(p.target_amount ?? p.target ?? 0), title: p.title })}
                    disabled={actionLoading}
                    className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer transition shadow-sm border-none"
                    title="Tolak Pengajuan"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Riwayat Persetujuan */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Riwayat Keputusan Pengajuan
        </h3>

        <div className="space-y-4">
          {processedProposals.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Belum ada keputusan yang diproses
            </div>
          ) : (
            processedProposals.map((p) => (
              <div key={p.id} className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{p.title}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">UMKM: {p.business_name || p.umkm || 'Toko UMKM'} • Nominal: Rp {Number(p.target_amount ?? p.target ?? 0).toLocaleString("id-ID")} • ROI: {p.roi}%</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border self-start sm:self-center ${
                  p.status === "Aktif" || p.status === "Diterima"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                    : "bg-rose-50 text-rose-700 border-rose-250"
                }`}>{p.status === "Aktif" ? "Diterima" : p.status}</span>
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
              <h3 className="font-heading font-black text-slate-900 text-base">Konfirmasi Keputusan Proposal</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tinjauan Pengajuan Modal</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin <strong className={confirmModal.decision === "Diterima" ? "text-emerald-600" : "text-rose-600"}>{confirmModal.decision === "Diterima" ? "MENYETUJUI" : "MENOLAK"}</strong> pengajuan pendanaan <strong className="text-slate-800">'{confirmModal.title}'</strong> sebesar <strong className="text-slate-800">Rp {confirmModal.amount.toLocaleString("id-ID")}</strong>?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleResolveProposal}
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
