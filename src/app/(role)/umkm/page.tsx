"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ChevronRight, ShoppingBag, Package } from "lucide-react";
import Link from "next/link";
import { useUMKM } from "./layout";

export default function MerchantDashboard() {
  const { products, orders } = useUMKM();

  // Metrics summary computing
  const totalSalesVal = useMemo(() => {
    return orders.filter(o => o.status === "Dikirim").reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === "Pending").length;
  }, [orders]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Dasbor Mitra UMKM</h1>
        <p className="text-slate-500 text-sm font-semibold">Pantau performa penjualan, omset kas, dan status pesanan toko Anda secara realtime.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Omset Card */}
        <div className="bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-white p-6 rounded-[2rem] border border-emerald-200/50 flex flex-col justify-between h-40 shadow-sm shadow-emerald-100/10 hover:shadow-md hover:border-emerald-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Omset Terkirim</p>
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/25">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-emerald-700">Rp {totalSalesVal.toLocaleString("id-ID")}</h3>
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-100/60 w-fit px-2.5 py-0.5 rounded-full border border-emerald-200/50">
            Stabil
          </span>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-white p-6 rounded-[2rem] border border-amber-200/50 flex flex-col justify-between h-40 shadow-sm shadow-amber-100/10 hover:shadow-md hover:border-amber-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pesanan Baru (Pending)</p>
            <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center border border-amber-500/25">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">{pendingOrdersCount} Pesanan</h3>
          <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 bg-amber-100/60 w-fit px-2.5 py-0.5 rounded-full border border-amber-200/50">
            Butuh Konfirmasi
          </span>
        </div>

        {/* Product Count Card */}
        <div className="bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-white p-6 rounded-[2rem] border border-blue-200/50 flex flex-col justify-between h-40 shadow-sm shadow-blue-100/10 hover:shadow-md hover:border-blue-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Jumlah Produk Aktif</p>
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center border border-blue-500/25">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">{products.length} Entitas</h3>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-wider flex items-center gap-1 bg-blue-100/60 w-fit px-2.5 py-0.5 rounded-full border border-blue-200/50">
            Katalog Aktif
          </span>
        </div>
      </div>

      {/* Latest Orders List */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Pesanan Terbaru
          </h3>
          <Link href="/umkm/pesanan" className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
            Lihat semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Tidak ada pesanan masuk
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="flex justify-between items-center bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 leading-tight">{ord.buyer}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">{ord.product} • Kuantitas: {ord.qty}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">Rp {ord.total.toLocaleString("id-ID")}</span>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded mt-1.5 inline-block ${
                    ord.status === "Pending" ? "bg-rose-500/10 text-rose-600 border border-rose-250/20" : ord.status === "Diproses" ? "bg-blue-500/10 text-blue-600 border border-blue-250/20" : "bg-emerald-500/10 text-emerald-600 border border-emerald-250/20"
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
