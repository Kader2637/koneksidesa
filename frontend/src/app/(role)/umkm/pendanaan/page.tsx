"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, FileText, Plus, Landmark, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useUMKM } from "../layout";
import { toast } from "@/components/ui/Toast";
import Select2 from "@/components/ui/Select2";

export default function UMKMPendanaanPage() {
  const {
    investors,
    umkmPendanaans,
    submitPendanaan
  } = useUMKM();

  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalPurpose, setProposalPurpose] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [proposalAmount, setProposalAmount] = useState("");
  const [proposalRoi, setProposalRoi] = useState("10");
  const [proposalTenor, setProposalTenor] = useState("12 Bulan");
  const [selectedInvestorId, setSelectedInvestorId] = useState("");
  const [proposalPdf, setProposalPdf] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, "");
    if (!numberString) return "";
    return Number(numberString).toLocaleString("id-ID");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProposalAmount(formatRupiah(e.target.value));
  };

  const triggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestorId) {
      toast.warning("Pilih investor tujuan!");
      return;
    }
    const amt = parseFloat(proposalAmount.replace(/\./g, ""));
    if (isNaN(amt) || amt < 1000) {
      toast.warning("Masukkan nominal target dana yang valid!");
      return;
    }
    const roi = parseFloat(proposalRoi);
    if (isNaN(roi) || roi <= 0) {
      toast.warning("Masukkan persentase bagi hasil yang valid!");
      return;
    }
    setConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmModal(false);
    const amt = parseFloat(proposalAmount.replace(/\./g, ""));
    const roi = parseFloat(proposalRoi);
    setFormLoading(true);
    try {
      await submitPendanaan(
        proposalTitle,
        "Toko UMKM Anda",
        proposalDesc,
        proposalPurpose,
        amt,
        proposalTenor,
        parseInt(selectedInvestorId),
        roi,
        proposalPdf
      );
      toast.success(`Pengajuan proposal pendanaan '${proposalTitle}' sebesar Rp ${amt.toLocaleString("id-ID")} berhasil dikirimkan!`);
      setProposalTitle("");
      setProposalPurpose("");
      setProposalDesc("");
      setProposalAmount("");
      setProposalRoi("10");
      setProposalPdf("");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengirimkan proposal.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Pengajuan Pendanaan</h1>
        <p className="text-slate-500 text-xs font-semibold">Pitch usaha Anda ke investor dengan membuat pengajuan modal kerja syariah baru beserta proposal usaha.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 h-fit shadow-sm space-y-6">
          <div>
            <h3 className="font-heading font-black text-xs uppercase tracking-widest text-emerald-600 mb-1">Buat Pengajuan Baru</h3>
            <p className="text-xs text-slate-400 font-semibold">Isi rincian penggalangan dana dan unggah berkas proposal pendanaan Anda.</p>
          </div>

          <form onSubmit={triggerSubmit} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Pilih Investor Tujuan</label>
              <Select2
                options={investors.map((inv) => ({
                  value: inv.id.toString(),
                  label: inv.name,
                  sublabel: inv.email
                }))}
                value={selectedInvestorId}
                onChange={(val) => setSelectedInvestorId(val || "")}
                placeholder="Pilih Investor..."
                isClearable={true}
                isSearchable={true}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Nama Proyek / Judul Usaha</label>
              <input
                type="text"
                required
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder="Contoh: Modernisasi Alat Panen Kopi"
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Nominal Dana (Rp)</label>
                <input
                  type="text"
                  required
                  value={proposalAmount}
                  onChange={handleAmountChange}
                  placeholder="Jumlah Rupiah"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Bagi Hasil / ROI (%)</label>
                <input
                  type="number"
                  required
                  value={proposalRoi}
                  onChange={(e) => setProposalRoi(e.target.value)}
                  placeholder="Contoh: 10"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Jangka Waktu (Tenor)</label>
                <Select2
                  options={[
                    { value: "6 Bulan", label: "6 Bulan" },
                    { value: "12 Bulan", label: "12 Bulan" },
                    { value: "24 Bulan", label: "24 Bulan" }
                  ]}
                  value={proposalTenor}
                  onChange={(val) => setProposalTenor(val || "12 Bulan")}
                  isClearable={false}
                  isSearchable={false}
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Deskripsi Usaha</label>
              <textarea
                required
                value={proposalDesc}
                onChange={(e) => setProposalDesc(e.target.value)}
                placeholder="Jelaskan prospek bisnis Anda..."
                className="w-full bg-slate-55 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-medium resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Tujuan Penggunaan Dana</label>
              <textarea
                required
                value={proposalPurpose}
                onChange={(e) => setProposalPurpose(e.target.value)}
                placeholder="Rincian alokasi dana..."
                className="w-full bg-slate-55 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-medium resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Tautan Berkas Proposal (PDF)</label>
              <input
                type="text"
                required
                value={proposalPdf}
                onChange={(e) => setProposalPdf(e.target.value)}
                placeholder="https://tautan-berkas-proposal.pdf"
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-xs border-none"
            >
              <Send className="w-4 h-4" />
              {formLoading ? "Mengirim..." : "Kirim Pengajuan"}
            </button>
          </form>
        </div>

        {/* Status List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">
              Status Pengajuan & Proposal Anda
            </h3>

            <div className="space-y-4">
              {umkmPendanaans.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  Belum ada pengajuan pendanaan dikirim
                </div>
              ) : (
                umkmPendanaans.map((p) => {
                  const targetAmt = Number(p.target_amount ?? p.target ?? 0);
                  return (
                    <div key={p.id} className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">{p.title}</h4>
                          <span className="text-xs text-slate-400 font-bold mt-0.5 block">Investor: {p.investor?.name || (p.investor_id ? `ID ${p.investor_id}` : '-')} • Tenor: {p.tenor}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${p.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : p.status === "Aktif" || p.status === "Diterima"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>{p.status}</span>
                      </div>

                      <div className="text-xs font-semibold text-slate-500 flex justify-between pt-2.5 border-t border-slate-200/40">
                        <span>Target: <strong className="text-slate-800 font-bold">Rp {targetAmt.toLocaleString("id-ID")}</strong></span>
                        <span>Bagi Hasil (ROI): <strong className="text-emerald-600 font-bold">{p.roi}%</strong></span>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <Link to={`/umkm/pendanaan/${p.id}`} className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 font-bold transition">
                          <Eye className="w-3.5 h-3.5" />
                          Lihat Detail
                        </Link>

                        {p.proposal_path && (
                          <div className="text-xs flex items-center gap-1.5 text-slate-400">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <a href={p.proposal_path} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500 font-bold">Unduh Proposal</a>
                          </div>
                        )}
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
              <h3 className="font-heading font-black text-slate-900 text-base">Konfirmasi Pengajuan Dana</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Pengiriman Proposal Kemitraan</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin mengirim proposal pendanaan <strong className="text-slate-800">'{proposalTitle}'</strong> sebesar <strong className="text-slate-800">Rp {proposalAmount}</strong>?
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
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
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
