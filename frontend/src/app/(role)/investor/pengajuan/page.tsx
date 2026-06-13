"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Send, Wallet, HelpCircle, ShieldCheck } from "lucide-react";
import { useInvestor } from "../layout";
import { toast } from "@/components/ui/Toast";
import Select2 from "@/components/ui/Select2";

export default function InvestorPengajuanPage() {
  const {
    walletBalance,
    umkms,
    investorInvestasis,
    submitInvestasi,
    refreshInvestorData
  } = useInvestor();

  const [selectedUmkmId, setSelectedUmkmId] = useState("");
  const [investAmount, setInvestAmount] = useState("");
  const [investRoi, setInvestRoi] = useState("");
  const [investTenor, setInvestTenor] = useState("12 Bulan");
  const [investMessage, setInvestMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, "");
    if (!numberString) return "";
    return Number(numberString).toLocaleString("id-ID");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestAmount(formatRupiah(e.target.value));
  };

  const triggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUmkmId) {
      toast.warning("Pilih UMKM target investasi!");
      return;
    }

    const amt = parseFloat(investAmount.replace(/\./g, ""));
    if (isNaN(amt) || amt < 1000) {
      toast.warning("Masukkan nominal investasi minimal Rp 1.000!");
      return;
    }

    const roi = parseFloat(investRoi);
    if (isNaN(roi) || roi <= 0) {
      toast.warning("Masukkan persentase bagi hasil (ROI) yang valid!");
      return;
    }

    if (amt > walletBalance) {
      toast.error("Saldo dompet Anda tidak mencukupi.");
      return;
    }

    setConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmModal(false);
    setActionLoading(true);
    const amt = parseFloat(investAmount.replace(/\./g, ""));
    const roi = parseFloat(investRoi);
    try {
      const success = await submitInvestasi(parseInt(selectedUmkmId), amt, investMessage, investTenor, roi);
      if (success) {
        toast.success("Penawaran investasi berhasil dikirimkan ke UMKM target!");
        setSelectedUmkmId("");
        setInvestAmount("");
        setInvestRoi("");
        setInvestMessage("");
        refreshInvestorData();
      } else {
        toast.error("Gagal mengirimkan penawaran investasi.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Pengajuan Investasi</h1>
        <p className="text-slate-500 text-xs font-semibold">Tawarkan pendanaan modal kerja secara langsung ke UMKM tertentu, tentukan nominal, dan pantau respons mereka.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 h-fit shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-black text-xs uppercase tracking-widest text-indigo-600">Ajukan Investasi Baru</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Tentukan nominal modal dan ajukan penawaran.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Saldo Dompet</span>
              <span className="text-xs font-black text-indigo-600">Rp {walletBalance.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <form onSubmit={triggerSubmit} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Pilih UMKM Target</label>
              <Select2
                options={umkms.map((u) => ({
                  value: u.id.toString(),
                  label: u.business_name,
                  sublabel: `Pemilik: ${u.owner}`
                }))}
                value={selectedUmkmId}
                onChange={(val) => setSelectedUmkmId(val || "")}
                placeholder="Pilih UMKM..."
                isClearable={true}
                isSearchable={true}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Nominal Investasi (Rp)</label>
              <input
                type="text"
                required
                value={investAmount}
                onChange={handleAmountChange}
                placeholder="Contoh: 5.000.000"
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Bagi Hasil / ROI (%)</label>
                <input
                  type="number"
                  required
                  value={investRoi}
                  onChange={(e) => setInvestRoi(e.target.value)}
                  placeholder="Contoh: 12"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Tenor Kontrak</label>
                <Select2
                  options={[
                    { value: "6 Bulan", label: "6 Bulan" },
                    { value: "12 Bulan", label: "12 Bulan" },
                    { value: "24 Bulan", label: "24 Bulan" }
                  ]}
                  value={investTenor}
                  onChange={(val) => setInvestTenor(val || "12 Bulan")}
                  isClearable={false}
                  isSearchable={false}
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Pesan / Catatan Tambahan</label>
              <textarea
                required
                value={investMessage}
                onChange={(e) => setInvestMessage(e.target.value)}
                placeholder="Tuliskan pesan penawaran kerja sama..."
                className="w-full bg-slate-55 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-medium resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-xs border-none"
            >
              <Send className="w-4 h-4" />
              {actionLoading ? "Mengirim..." : "Kirim Penawaran"}
            </button>
          </form>
        </div>

        {/* Status List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">
              Status Penawaran Investasi Anda
            </h3>

            <div className="space-y-4">
              {investorInvestasis.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  Belum ada penawaran investasi dikirimkan
                </div>
              ) : (
                investorInvestasis.map((i) => {
                  const targetUmkm = umkms.find(u => u.id === i.umkm_id);
                  return (
                    <div key={i.id} className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">Target: {targetUmkm?.business_name || `UMKM ID ${i.umkm_id}`}</h4>
                          <span className="text-xs text-slate-400 font-bold mt-0.5 block">Jangka Kontrak: {i.tenor || "12 Bulan"}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${i.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : i.status === "Aktif" || i.status === "Diterima"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>{i.status === "Aktif" ? "Diterima" : i.status}</span>
                      </div>

                      <div className="text-xs font-semibold text-slate-500 flex justify-between pt-2.5 border-t border-slate-200/40">
                        <div className="flex gap-4">
                          <span>Nilai: <strong className="text-slate-800 font-bold">Rp {Number(i.amount).toLocaleString("id-ID")}</strong></span>
                          <span>ROI: <strong className="text-emerald-600 font-bold">+{i.roi || 0}%</strong></span>
                        </div>
                        <span className="text-xs text-slate-450 italic font-medium">Catatan: {i.message || "-"}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-800 max-w-sm w-full space-y-4 relative"
          >
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base">Konfirmasi Pengajuan Penawaran</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Penawaran Modal Kerja</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin mengirimkan penawaran investasi modal sebesar <strong className="text-slate-800">Rp {investAmount}</strong> dengan bagi hasil <strong className="text-slate-800">{investRoi}%</strong> kepada mitra UMKM?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
              >
                Ya, Kirim
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
