"use client";

import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle, Clock, Target, Percent, Calendar } from "lucide-react";
import { useUMKM } from "../../layout";

export default function DetailPendanaanUMKM() {
  const { id } = useParams<{ id: string }>();
  const context = useUMKM();

  if (!context) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-rose-600 font-bold">Terjadi Kesalahan: Data Layout UMKM tidak ditemukan.</p>
        <Link to="/umkm/pendanaan" className="text-emerald-600 underline text-sm">Kembali ke Daftar</Link>
      </div>
    );
  }

  const umkmPendanaans = context.umkmPendanaans || [];

  const pendanaan = useMemo(() => {
    return umkmPendanaans.find((p: any) => String(p.id) === id);
  }, [umkmPendanaans, id]);

  if (!pendanaan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Memuat detail pengajuan...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header dengan Tombol Kembali */}
      <div className="flex items-center justify-between">
        <Link to="/umkm/pendanaan" className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-semibold text-sm bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm w-fit">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar
        </Link>
        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${pendanaan.status === "Pending"
            ? "bg-amber-50 text-amber-600 border-amber-200"
            : pendanaan.status === "Ditolak"
              ? "bg-rose-50 text-rose-600 border-rose-200"
              : "bg-emerald-50 text-emerald-600 border-emerald-200"
          }`}>
          Status: {pendanaan.status}
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner Atas / Area Judul */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white">
          <h1 className="text-3xl font-black mb-2">{pendanaan.title}</h1>
          <p className="text-emerald-100 font-medium text-sm flex items-center gap-2">
            <Target className="w-4 h-4" /> Tujuan Pendanaan: {pendanaan.purpose}
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Kolom Kiri: Detail & Deskripsi */}
            <div className="lg:col-span-2 space-y-8">

              {/* Rincian Modal */}
              <section>
                <h3 className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">
                  <span className="w-8 h-[2px] bg-emerald-500 inline-block"></span> Rincian Modal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-center">
                    <span className="text-slate-500 text-xs font-bold mb-1 flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-emerald-500" /> Target Dana</span>
                    <span className="font-black text-slate-800 text-lg">Rp {Number(pendanaan.target_amount || pendanaan.target || 0).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-center">
                    <span className="text-slate-500 text-xs font-bold mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-500" /> Tenor / Jangka Waktu</span>
                    <span className="font-black text-slate-800 text-lg">{pendanaan.tenor}</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-center">
                    <span className="text-slate-500 text-xs font-bold mb-1 flex items-center gap-1.5"><Percent className="w-3.5 h-3.5 text-amber-500" /> Bagi Hasil (ROI)</span>
                    <span className="font-black text-emerald-600 text-lg">+{pendanaan.roi || 0}%</span>
                  </div>
                </div>
              </section>

              {/* Deskripsi */}
              <section>
                <h3 className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">
                  <span className="w-8 h-[2px] bg-emerald-500 inline-block"></span> Deskripsi Proyek
                </h3>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{pendanaan.description}</p>
                </div>
              </section>
            </div>

            {/* Kolom Kanan: Profil Investor */}
            <div className="lg:col-span-1 space-y-8">
              <section>
                <h3 className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">
                  <span className="w-8 h-[2px] bg-emerald-500 inline-block"></span> Profil Investor
                </h3>

                {pendanaan.investor ? (
                  <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-14 h-14 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-black text-xl shadow-lg border-2 border-white/10">
                        {pendanaan.investor?.name ? pendanaan.investor.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-white">{pendanaan.investor?.name || "Investor"}</h4>
                        <p className="text-xs text-slate-400 font-medium">{pendanaan.investor?.email || "Tidak ada email"}</p>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-white/10 pt-5 relative z-10">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Status Penyaluran</p>
                        <p className="text-sm font-semibold flex items-center gap-2 text-emerald-400">
                          <CheckCircle className="w-4 h-4" /> Terjadwal / Tersalurkan
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Total Pengembalian (Estimasi)</p>
                        <p className="text-base font-bold text-white">
                          Rp {(Number(pendanaan.target_amount || pendanaan.target || 0) * (1 + Number(pendanaan.roi || 0) / 100)).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[250px]">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="font-bold text-slate-700 mb-1">Belum Ada Investor</h4>
                    <p className="text-xs text-slate-500 font-medium">Menunggu persetujuan dan komitmen dari investor tujuan Anda.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Penampil Dokumen Proposal PDF */}
      {pendanaan.proposal_path && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center gap-4 bg-slate-50/50">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Dokumen Proposal</h3>
              <p className="text-xs text-slate-500">Pratinjau dokumen proposal yang Anda lampirkan.</p>
            </div>
            <a
              href={pendanaan.proposal_path}
              target="_blank"
              rel="noreferrer"
              className="ml-auto bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              Buka di Tab Baru
            </a>
          </div>
          <div className="w-full bg-slate-100/50 h-[600px] sm:h-[800px] relative">
            <iframe
              src={`${pendanaan.proposal_path}#toolbar=0`}
              className="w-full h-full border-none"
              title="Dokumen Proposal"
            />
          </div>
        </div>
      )}

    </motion.div>
  );
}
