"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Briefcase, Download, FileText, ChevronRight, Wallet, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useInvestor } from "./layout";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

export default function InvestorDashboard() {
  const { 
    walletBalance,
    myPortfolio
  } = useInvestor();

  // Aggregate metrics
  const totalInvested = useMemo(() => {
    return myPortfolio.reduce((sum, item) => sum + item.invested, 0);
  }, [myPortfolio]);

  const activeInvestmentsCount = useMemo(() => {
    return myPortfolio.filter(item => item.status === "Aktif" || item.status === "Berjalan").length;
  }, [myPortfolio]);

  const uniqueUmkmsCount = useMemo(() => {
    const names = new Set(
      myPortfolio
        .filter(item => item.status === "Aktif" || item.status === "Berjalan")
        .map(item => item.umkm)
    );
    return names.size;
  }, [myPortfolio]);

  // Export handlers
  const handleExportExcel = () => {
    const dataToExport = myPortfolio.map(item => ({
      "ID Proyek": `PRJ-${item.id}`,
      "Nama Usaha": item.umkm,
      "Judul Proyek": item.title,
      "Nominal Investasi": `Rp ${item.invested.toLocaleString("id-ID")}`,
      "Bagi Hasil (ROI)": `${item.roi}% / Tahun`,
      "Proyeksi Pengembalian": `Rp ${item.expectedReturn.toLocaleString("id-ID")}`,
      "Status": item.status
    }));
    exportToCSV(dataToExport, "Riwayat_Investasi_Koneksi_Desa");
  };

  const handleExportPDF = () => {
    const headers = ["ID Proyek", "Nama Usaha", "Judul Proyek", "Nominal Investasi", "Bagi Hasil", "Proyeksi Pengembalian", "Status"];
    const rows = myPortfolio.map(item => [
      `PRJ-${item.id}`,
      item.umkm,
      item.title,
      `Rp ${item.invested.toLocaleString("id-ID")}`,
      `${item.roi}%`,
      `Rp ${item.expectedReturn.toLocaleString("id-ID")}`,
      item.status
    ]);
    exportToPDF("Riwayat Investasi - Koneksi Desa", headers, rows, "Riwayat_Investasi");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Dasbor Investor</h1>
          <p className="text-slate-500 text-xs font-semibold">Tinjau sirkulasi investasi modal, status pendanaan aktif, dan UMKM binaan Anda.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 border border-emerald-600"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 border border-blue-600"
          >
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Investasi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Investasi</p>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">Rp {totalInvested.toLocaleString("id-ID")}</h3>
          <span className="text-[9px] text-blue-705 font-black uppercase tracking-wider flex items-center gap-1 bg-blue-50 w-fit px-2.5 py-0.5 rounded-md border border-blue-100">
            Dana Disalurkan
          </span>
        </div>

        {/* Investasi Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Investasi Aktif</p>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">{activeInvestmentsCount} Proyek</h3>
          <span className="text-[9px] text-emerald-705 font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-50 w-fit px-2.5 py-0.5 rounded-md border border-emerald-100">
            Sedang Berjalan
          </span>
        </div>

        {/* Jumlah UMKM yang Didanai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">UMKM Didanai</p>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100">
              <Users className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">{uniqueUmkmsCount} UMKM</h3>
          <span className="text-[9px] text-purple-705 font-black uppercase tracking-wider flex items-center gap-1 bg-purple-50 w-fit px-2.5 py-0.5 rounded-md border border-purple-100">
            Mitra Binaan
          </span>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Saldo Dompet</p>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
              <Wallet className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">Rp {walletBalance.toLocaleString("id-ID")}</h3>
          <span className="text-[9px] text-amber-705 font-black uppercase tracking-wider flex items-center gap-1 bg-amber-50 w-fit px-2.5 py-0.5 rounded-md border border-amber-100">
            Siap Digunakan
          </span>
        </div>
      </div>

      {/* Riwayat Investasi (List of items in myPortfolio) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Riwayat Transaksi & Portofolio Investasi
          </h3>
          <Link to="/investor/laporan" className="text-xs text-indigo-600 font-extrabold hover:underline flex items-center gap-0.5">
            Lihat Laporan Lengkap <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {myPortfolio.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200/60 border-dashed">
              Anda belum menyalurkan pembiayaan apapun
            </div>
          ) : (
            myPortfolio.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-55 p-4 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 leading-tight">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{item.umkm} • Bagi Hasil: {item.roi}%</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">Rp {item.invested.toLocaleString("id-ID")}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase mt-1.5 inline-block ${
                    item.status === "Aktif" || item.status === "Berjalan"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>{item.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
