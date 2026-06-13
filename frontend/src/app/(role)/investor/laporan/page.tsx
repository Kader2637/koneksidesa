"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Landmark, Users, Calendar, Wallet } from "lucide-react";
import { useInvestor } from "../layout";
import { exportToCSV, exportToPDF } from "../../../../utils/exportUtils";

export default function InvestorLaporanPage() {
  const { myPortfolio, investorInvestasis } = useInvestor();
  const [activeTab, setActiveTab] = useState<"semua" | "aktif" | "ditolak">("semua");

  // Filtered lists
  const allInvestments = useMemo(() => {
    // Merge portfolio and direct invest offers
    const list: any[] = [];
    myPortfolio.forEach(item => {
      list.push({
        id: item.id,
        umkm: item.umkm,
        title: item.title,
        amount: item.invested,
        roi: item.roi,
        status: item.status,
        type: "Portofolio Ritel"
      });
    });
    investorInvestasis.forEach(item => {
      // Avoid duplicate listing if it is already in portfolio
      if (!list.some(x => x.id === item.id)) {
        list.push({
          id: item.id,
          umkm: `UMKM ID ${item.umkm_id}`,
          title: "Pembiayaan Langsung",
          amount: Number(item.amount),
          roi: 12, // default / fallback
          status: item.status === "Aktif" ? "Diterima" : item.status,
          type: "Investasi Langsung"
        });
      }
    });
    return list;
  }, [myPortfolio, investorInvestasis]);

  const activeInvestments = useMemo(() => {
    return allInvestments.filter(i => i.status === "Aktif" || i.status === "Diterima" || i.status === "Berjalan");
  }, [allInvestments]);

  const rejectedInvestments = useMemo(() => {
    return allInvestments.filter(i => i.status === "Ditolak");
  }, [allInvestments]);

  const displayedList = useMemo(() => {
    if (activeTab === "aktif") return activeInvestments;
    if (activeTab === "ditolak") return rejectedInvestments;
    return allInvestments;
  }, [activeTab, allInvestments, activeInvestments, rejectedInvestments]);

  // Excel & PDF Export
  const handleExportCSV = () => {
    const data = displayedList.map(i => ({
      "ID Proyek": i.id,
      "UMKM": i.umkm,
      "Tipe": i.type,
      "Nominal": i.amount,
      "ROI": `${i.roi}%`,
      "Status": i.status
    }));
    exportToCSV(data, "Laporan_Investasi_Investor");
  };

  const handleExportPDF = () => {
    const headers = ["ID", "UMKM Target", "Jenis", "Nominal", "ROI", "Status"];
    const rows = displayedList.map(i => [
      i.id,
      i.umkm,
      i.type,
      `Rp ${i.amount.toLocaleString("id-ID")}`,
      `${i.roi}%`,
      i.status
    ]);
    exportToPDF("Laporan Portofolio Investasi - Koneksi Desa", headers, rows, "Laporan_Investasi_Investor");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Laporan Investasi Investor</h1>
          <p className="text-slate-500 text-xs font-semibold">Tinjau sirkulasi pendanaan masuk, investasi ditolak, dan monitoring portfolio aktif.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-2 border-none"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-2 border-none"
          >
            <Download className="w-3.5 h-3.5" /> Cetak PDF
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-3 border-b border-slate-200 pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("semua")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none ${
            activeTab === "semua"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Semua Riwayat ({allInvestments.length})
        </button>
        <button
          onClick={() => setActiveTab("aktif")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none ${
            activeTab === "aktif"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Investasi Aktif ({activeInvestments.length})
        </button>
        <button
          onClick={() => setActiveTab("ditolak")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none ${
            activeTab === "ditolak"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Investasi Ditolak ({rejectedInvestments.length})
        </button>
      </div>

      {/* Investment List Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          {displayedList.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              Belum ada data investasi di kategori ini
            </div>
          ) : (
            <table className="w-full text-xs font-bold text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-450 uppercase text-xs tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Nama UMKM</th>
                  <th className="py-3 px-4">Judul Proyek / Jenis</th>
                  <th className="py-3 px-4">Bagi Hasil (ROI)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Nominal Disalurkan</th>
                </tr>
              </thead>
              <tbody>
                {displayedList.map((i, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 text-slate-700 transition-colors">
                    <td className="py-3 px-4 font-heading font-black text-slate-900">{i.umkm}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-slate-800">{i.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{i.type}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">+{i.roi}% / Th</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        i.status === "Aktif" || i.status === "Diterima" || i.status === "Berjalan"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : i.status === "Ditolak"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>{i.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 font-black">Rp {i.amount.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
}
