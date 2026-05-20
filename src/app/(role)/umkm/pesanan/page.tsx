"use client";
import React from "react";
import { motion } from "framer-motion";
import { useUMKM } from "../layout";

export default function PesananPage() {
  const { orders, advanceOrderStatus } = useUMKM();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-2">Fulfillment Pesanan</h1>
        <p className="text-slate-500 text-sm font-semibold">Proses pesanan baru pembeli, serahkan ke kurir regional, dan pantau penyelesaiannya.</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center font-bold text-slate-450 uppercase tracking-widest text-xs shadow-sm">
            Tidak ada pesanan masuk
          </div>
        ) : (
          orders.map((ord) => (
            <div key={ord.id} className="bg-white p-6 rounded-3xl border border-emerald-100/60 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">ID Transaksi</span>
                  <h3 className="font-heading font-black text-slate-800 text-base">{ord.id}</h3>
                </div>
                <span className={`text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full border ${
                  ord.status === "Pending" 
                    ? "bg-rose-50 text-rose-600 border-rose-250/20" 
                    : ord.status === "Diproses" 
                      ? "bg-blue-50 text-blue-600 border-blue-250/20" 
                      : "bg-emerald-50 text-emerald-600 border-emerald-250/20"
                }`}>{ord.status}</span>
              </div>

              {/* Details order */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
                <div>
                  <span className="text-slate-400 block tracking-wide uppercase text-[9px] mb-1">Nama Pembeli</span>
                  <span className="text-sm font-heading font-black text-slate-800">{ord.buyer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block tracking-wide uppercase text-[9px] mb-1">Nama Produk</span>
                  <span className="text-sm font-heading font-black text-slate-800">{ord.product} x {ord.qty}</span>
                </div>
                <div>
                  <span className="text-slate-400 block tracking-wide uppercase text-[9px] mb-1">Total Bayar</span>
                  <span className="text-sm font-heading font-black text-emerald-600">Rp {ord.total.toLocaleString("id-ID")}</span>
                </div>
                <div>
                  <span className="text-slate-400 block tracking-wide uppercase text-[9px] mb-1">Tanggal Transaksi</span>
                  <span className="text-sm font-heading font-black text-slate-800">{ord.date}</span>
                </div>
              </div>

              {/* Control buttons */}
              {ord.status !== "Dikirim" && (
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      advanceOrderStatus(ord.id);
                      const nextStatus = ord.status === "Pending" ? "Diproses" : "Dikirim";
                      alert(`Pesanan #${ord.id} di-update menjadi: ${nextStatus}!`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-md shadow-emerald-500/10"
                  >
                    {ord.status === "Pending" ? "Terima & Proses Pesanan" : "Kirim ke Kurir"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
