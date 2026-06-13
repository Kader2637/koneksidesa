"use client";
import React from "react";
import { motion } from "framer-motion";
import { useUMKM } from "../layout";
import { toast } from "@/components/ui/Toast";

export default function PesananPage() {
  const { orders, advanceOrderStatus } = useUMKM();

  const [confirmModal, setConfirmModal] = React.useState<{ id: string; currentStatus: string } | null>(null);

  const handleAdvanceStatus = () => {
    if (confirmModal) {
      advanceOrderStatus(confirmModal.id);
      const nextStatus = confirmModal.currentStatus === "Pending" ? "Diproses" : "Selesai";
      toast.success(`Pesanan #${confirmModal.id} di-update menjadi: ${nextStatus}!`);
      setConfirmModal(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Fulfillment Pesanan</h1>
        <p className="text-slate-500 text-xs font-semibold">Proses pesanan baru pembeli, serahkan ke kurir regional, dan pantau penyelesaiannya.</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center font-bold text-slate-400 uppercase tracking-widest text-xs shadow-sm">
            Tidak ada pesanan masuk
          </div>
        ) : (
          orders.map((ord) => (
            <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-5 shadow-sm hover:shadow-md hover:border-emerald-100/60 transition-all duration-300">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">ID Transaksi</span>
                  <h3 className="font-heading font-black text-slate-800 text-base">#{ord.id}</h3>
                </div>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-md border ${
                  ord.status === "Pending" 
                    ? "bg-rose-50 text-rose-700 border-rose-100" 
                    : ord.status === "Diproses" 
                      ? "bg-blue-50 text-blue-700 border-blue-100" 
                      : "bg-emerald-50 text-emerald-700 border-emerald-100"
                }`}>{ord.status}</span>
              </div>

              {/* Details order */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
                <div>
                  <span className="text-slate-400 block tracking-wide uppercase text-xs mb-0.5">Nama Pembeli</span>
                  <span className="text-sm font-heading font-black text-slate-800">{ord.buyer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block tracking-wide uppercase text-xs mb-0.5">Nama Produk</span>
                  <span className="text-sm font-heading font-black text-slate-800">{ord.product} x {ord.qty}</span>
                </div>
                <div>
                  <span className="text-slate-400 block tracking-wide uppercase text-xs mb-0.5">Total Bayar</span>
                  <span className="text-sm font-heading font-black text-emerald-600">Rp {ord.total.toLocaleString("id-ID")}</span>
                </div>
                <div>
                  <span className="text-slate-400 block tracking-wide uppercase text-xs mb-0.5">Tanggal Transaksi</span>
                  <span className="text-sm font-heading font-black text-slate-800">{ord.date}</span>
                </div>
              </div>

              {/* Control buttons */}
              {ord.status !== "Selesai" && (
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setConfirmModal({ id: ord.id, currentStatus: ord.status })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm border-none uppercase tracking-wider"
                  >
                    {ord.status === "Pending" ? "Terima & Proses Pesanan" : "Selesaikan Pesanan"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
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
              <h3 className="font-heading font-black text-slate-900 text-base">Konfirmasi Pembaruan Status</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Pembaruan Alur Logistik</p>
            </div>
            <p className="text-xs text-slate-550 leading-relaxed font-semibold">
              Apakah Anda yakin ingin memperbarui status pesanan <strong className="text-slate-800">#{confirmModal.id}</strong> menjadi <strong className="text-slate-800">{confirmModal.currentStatus === "Pending" ? "DIPROSES" : "SELESAI"}</strong>?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleAdvanceStatus}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
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
