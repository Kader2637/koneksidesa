"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Store, ShoppingBag, Package, DollarSign, Users, 
  TrendingUp, Download, FileText, ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUMKM } from "./layout";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

export default function MerchantDashboard() {
  const { 
    products, 
    orders, 
    umkmInvestasis,
    umkmPendanaans
  } = useUMKM();

  // Metrics computing
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  
  const totalFundingReceived = useMemo(() => {
    return umkmInvestasis
      .filter(i => i.status === "Aktif" || i.status === "Diterima")
      .reduce((sum, i) => sum + Number(i.amount), 0);
  }, [umkmInvestasis]);

  const activeInvestorsCount = useMemo(() => {
    const uniqueInvestors = new Set(
      umkmInvestasis
        .filter(i => i.status === "Aktif" || i.status === "Diterima")
        .map(i => i.user_id)
    );
    return uniqueInvestors.size;
  }, [umkmInvestasis]);

  // Export handlers
  const handleExportExcel = () => {
    const dataToExport = orders.map(ord => ({
      "ID Pesanan": ord.id,
      "Pembeli": ord.buyer,
      "Produk": ord.product,
      "Qty": ord.qty,
      "Total": `Rp ${ord.total.toLocaleString("id-ID")}`,
      "Status": ord.status,
      "Tanggal": ord.date
    }));
    exportToCSV(dataToExport, "Laporan_Penjualan_UMKM");
  };

  const handleExportPDF = () => {
    const headers = ["ID Pesanan", "Pembeli", "Produk", "Qty", "Total", "Status", "Tanggal"];
    const rows = orders.map(ord => [
      ord.id,
      ord.buyer,
      ord.product,
      ord.qty,
      `Rp ${ord.total.toLocaleString("id-ID")}`,
      ord.status,
      ord.date
    ]);
    exportToPDF("Laporan Penjualan UMKM - Koneksi Desa", headers, rows, "Laporan_Penjualan");
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
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Dasbor Mitra UMKM</h1>
          <p className="text-slate-500 text-xs font-semibold">Pantau performa penjualan, omset kas, dan status pesanan toko Anda secara realtime.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 border border-emerald-600"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 border border-blue-600"
          >
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Produk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Produk</p>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
              <Package className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">{totalProductsCount} Item</h3>
          <span className="text-[9px] text-blue-705 font-black uppercase tracking-wider flex items-center gap-1 bg-blue-50 w-fit px-2.5 py-0.5 rounded-md border border-blue-100">
            Terpajang Ritel
          </span>
        </div>

        {/* Total Pesanan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Pesanan</p>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">{totalOrdersCount} Pesanan</h3>
          <span className="text-[9px] text-amber-705 font-black uppercase tracking-wider flex items-center gap-1 bg-amber-50 w-fit px-2.5 py-0.5 rounded-md border border-amber-100">
            Masuk & Diproses
          </span>
        </div>

        {/* Total Dana Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Dana Masuk</p>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">Rp {totalFundingReceived.toLocaleString("id-ID")}</h3>
          <span className="text-[9px] text-indigo-705 font-black uppercase tracking-wider flex items-center gap-1 bg-indigo-50 w-fit px-2.5 py-0.5 rounded-md border border-indigo-100">
            Dari Investor
          </span>
        </div>

        {/* Total Investor */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Investor</p>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100">
              <Store className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">{activeInvestorsCount} Mitra</h3>
          <span className="text-[9px] text-purple-705 font-black uppercase tracking-wider flex items-center gap-1 bg-purple-50 w-fit px-2.5 py-0.5 rounded-md border border-purple-100">
            Pendana Aktif
          </span>
        </div>
      </div>

      {/* Progress Pendanaan Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
          Progress Pendanaan & Kampanye Aktif
        </h3>
        
        <div className="space-y-4">
          {umkmPendanaans.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200/60 border-dashed">
              Belum ada kampanye pendanaan diajukan
            </div>
          ) : (
            umkmPendanaans.map((p) => {
              const targetAmt = Number(p.target_amount ?? p.target ?? 0);
              const currentAmt = Number(p.current_amount ?? p.current ?? 0);
              const progressPct = targetAmt > 0 ? Math.round((currentAmt / targetAmt) * 100) : 0;
              return (
                <div key={p.id} className="bg-slate-55 p-5 rounded-xl border border-slate-200/60 space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{p.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Target: Rp {targetAmt.toLocaleString("id-ID")} • Tenor: {p.tenor}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      p.status === "Pending" 
                        ? "bg-amber-50 text-amber-700 border-amber-200" 
                        : p.status === "Aktif" || p.status === "Diterima"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>{p.status}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-505">
                      <span>Progress Terkumpul</span>
                      <span>{progressPct}% ({`Rp ${currentAmt.toLocaleString("id-ID")}`})</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, progressPct)}%` }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Latest Orders List */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Pesanan Masuk Terbaru
          </h3>
          <Link to="/umkm/pesanan" className="text-xs text-emerald-600 font-extrabold hover:underline flex items-center gap-0.5">
            Lihat semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200/60 border-dashed">
              Tidak ada pesanan masuk
            </div>
          ) : (
            orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="flex justify-between items-center bg-slate-55 p-4 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 leading-tight">{ord.buyer}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{ord.product} • Kuantitas: {ord.qty}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">Rp {ord.total.toLocaleString("id-ID")}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded mt-1.5 inline-block ${
                    ord.status === "Pending" ? "bg-rose-50 text-rose-700 border border-rose-200" : ord.status === "Diproses" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>{ord.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
