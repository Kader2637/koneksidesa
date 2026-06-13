"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Calendar, CreditCard, ChevronRight, X, Clock } from "lucide-react";

export default function PembeliPesananPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);

        // Sync pending digital payments in the background
        const pendingDigital = data.filter((ord: any) => 
          ord.status === "Pending" && ord.payment_method.includes("Digital")
        );

        if (pendingDigital.length > 0) {
          Promise.all(
            pendingDigital.map((ord: any) =>
              fetch(`http://localhost:8000/api/orders/${ord.raw_id}/check-status`, {
                headers: { Authorization: `Bearer ${token}` }
              }).catch(err => console.error("Sync error:", err))
            )
          ).then(async () => {
            const freshRes = await fetch("http://localhost:8000/api/orders", {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (freshRes.ok) {
              const freshData = await freshRes.json();
              setOrders(freshData);
            }
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Riwayat Pesanan Anda</h1>
        <p className="text-slate-500 text-xs font-semibold">Pantau proses pengiriman barang, riwayat belanja, dan status pembayaran invoice transaksi.</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-sm space-y-5">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-slate-400" /> Daftar Transaksi Belanja
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400 font-bold">Memuat riwayat belanja...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            Belum ada riwayat pesanan belanja terdaftar
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div 
                key={ord.id} 
                className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 transition duration-200 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer"
                onClick={() => setSelectedOrder(ord)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-black text-slate-900">Order #{ord.id}</span>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {ord.date || "Baru saja"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-1">Produk: <span className="text-slate-900 font-extrabold">{ord.product}</span> • Kuantitas: {ord.qty} pcs</p>
                  <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Metode Pembayaran: {ord.payment_method}
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200/60 pt-3 md:pt-0 md:pl-4 justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Pembayaran</span>
                    <span className="text-xs font-black text-emerald-650">Rp {ord.total.toLocaleString("id-ID")}</span>
                  </div>
                  <span className={`text-xs font-black uppercase px-2.5 py-1 rounded border ${
                    ord.status === "Selesai" || ord.status === "Diproses" || ord.status === "Dikirim"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-250/30"
                      : "bg-rose-50 text-rose-600 border-rose-250/30"
                  }`}>{ord.status}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 p-6 space-y-5"
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer border border-slate-200 z-20 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detail Transaksi Belanja</p>
                <h3 className="font-heading font-black text-slate-900 text-lg leading-tight">Order #{selectedOrder.id}</h3>
              </div>

              {/* Status Tracker */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Status Pengiriman</p>
                  <p className="font-heading font-black text-slate-800 text-sm">{selectedOrder.status}</p>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-3 text-xs font-bold text-slate-500">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Produk Pesanan</span>
                  <span className="text-slate-800 font-extrabold">{selectedOrder.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Jumlah Kuantitas</span>
                  <span className="text-slate-800 font-extrabold">{selectedOrder.qty} Pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Metode Pembayaran</span>
                  <span className="text-slate-800 font-extrabold">{selectedOrder.payment_method}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3">
                  <span className="text-slate-450 font-black">Total Pembayaran</span>
                  <span className="text-emerald-600 font-black text-base">Rp {selectedOrder.total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer text-xs uppercase tracking-wider border-none font-heading"
                >
                  Tutup Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
