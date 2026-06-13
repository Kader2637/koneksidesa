import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface Order {
  id: string;
  raw_id: number;
  buyer: string;
  product: string;
  qty: number;
  total: number;
  status: string; // Pending, Diproses, Dikirim, Selesai, Cancelled
  date: string;
  payment_method: string;
  snap_token?: string;
  snap_url?: string;
}

export default function LacakPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/api/orders", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        if (data.length > 0) {
          setSelectedOrder(data[0]);
        }
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSyncStatus = async (order: Order) => {
    setSyncing(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${order.raw_id}/check-status`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(`Sinkronisasi sukses! Status saat ini: ${data.status}`);
        fetchOrders(); // Reload orders list
      }
    } catch (err) {
      console.error("Sync status error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const getTimelineSteps = (status: string) => {
    const steps = [
      { title: "Pesanan Selesai / Diterima", desc: "Barang sudah diterima oleh pembeli.", active: status === "Selesai" },
      { title: "Kurir Menuju Lokasi Anda", desc: "Paket dibawa kurir regional ke alamat tujuan.", active: status === "Dikirim" || status === "Selesai" },
      { title: "Pesanan Dikirim oleh Penjual", desc: "Mitra UMKM menyerahkan paket ke logistik terdekat.", active: status === "Dikirim" || status === "Selesai" },
      { title: "Pembayaran Dikonfirmasi", desc: "Transaksi berhasil diselesaikan melalui platform.", active: status !== "Pending" && status !== "Cancelled" },
    ];
    return steps;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-2">Status Pesanan & Lacak</h1>
        <p className="text-slate-500 text-sm font-semibold">Pantau status pembayaran Midtrans dan pergerakan logistik pesanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Orders list selector */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Daftar Transaksi</h3>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 border-dashed rounded-2xl">
              Belum ada transaksi pembelian
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                    selectedOrder?.id === ord.id
                      ? "bg-indigo-50/60 border-indigo-300 shadow-sm"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-heading font-black text-xs text-slate-800">{ord.id}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      ord.status === "Pending" ? "bg-rose-500/10 text-rose-600 border border-rose-250/20" : ord.status === "Diproses" ? "bg-blue-500/10 text-blue-600 border border-blue-250/20" : ord.status === "Dikirim" ? "bg-amber-500/10 text-amber-600 border border-amber-250/20" : "bg-emerald-500/10 text-emerald-600 border border-emerald-250/20"
                    }`}>{ord.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold mt-2 truncate">{ord.product}</p>
                  <span className="text-xs font-black text-emerald-600 block mt-1">Rp {ord.total.toLocaleString("id-ID")}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Detailed Selected Order timeline */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">ID Pesanan</span>
                  <span className="font-heading font-black text-slate-800 text-base">{selectedOrder.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  {selectedOrder.status === "Pending" && selectedOrder.snap_url && (
                    <a
                      href={selectedOrder.snap_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl uppercase tracking-wider shadow-sm transition"
                    >
                      Bayar Sekarang
                    </a>
                  )}
                  <button
                    onClick={() => handleSyncStatus(selectedOrder)}
                    disabled={syncing}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Sinkronisasi</span>
                  </button>
                </div>
              </div>

              {/* Vertical timeline steps */}
              <div className="space-y-8 relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                {getTimelineSteps(selectedOrder.status).map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Circle indicators */}
                    <div className={`absolute -left-8 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      step.active 
                        ? "bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.8)] scale-125" 
                        : "bg-slate-200"
                    }`} />
                    <h4 className={`text-sm font-black ${step.active ? "text-slate-800" : "text-slate-400"}`}>{step.title}</h4>
                    <p className="text-xs text-slate-400 font-semibold">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-4 text-xs font-bold text-slate-400">
                <span>Metode Pembayaran: <strong className="text-slate-600">{selectedOrder.payment_method}</strong></span>
                <span>Tanggal: <strong className="text-slate-600">{selectedOrder.date}</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-12 h-12 text-slate-350 mb-3" />
              <h3 className="text-base font-bold text-slate-800">Tidak Ada Detail Pesanan</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Silakan pilih salah satu pesanan dari daftar di sebelah kiri.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
