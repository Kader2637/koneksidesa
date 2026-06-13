"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, Calendar, CreditCard, ChevronRight, 
  Clock, ArrowLeft, CheckCircle2, Package, Truck, 
  MapPin, User, Phone, Receipt, ExternalLink, ShieldCheck 
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/Toast";

export default function PembeliPesananPage() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const triggerPaymentFlow = (snapToken: string, rawId: number) => {
    const token = localStorage.getItem("token");

    const syncStatus = async () => {
      if (token && rawId) {
        try {
          await fetch(`http://localhost:8000/api/orders/${rawId}/check-status`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          await fetchOrders();
        } catch (err) {
          console.error("Error syncing status:", err);
        }
      }
    };

    if ((window as any).snap) {
      (window as any).snap.pay(snapToken, {
        onSuccess: async function (res: any) {
          await syncStatus();
          toast.success("Pembayaran Sukses! Terima kasih.");
        },
        onPending: async function (res: any) {
          await syncStatus();
          toast.warning("Pembayaran Pending. Harap segera bayar sesuai petunjuk.");
        },
        onError: async function (res: any) {
          await syncStatus();
          toast.error("Pembayaran Gagal.");
        },
        onClose: async function (res: any) {
          await syncStatus();
          toast.info("Pop-up pembayaran ditutup.");
        }
      });
    } else {
      toast.error("Midtrans Payment SDK tidak terdeteksi.");
    }
  };

  // Listen for navigation state from dashboard
  useEffect(() => {
    if (orders.length > 0 && location.state?.orderId) {
      const found = orders.find(o => o.id === location.state.orderId);
      if (found) {
        setSelectedOrder(found);
      }
    }
  }, [orders, location.state]);

  // Sync selectedOrder with orders list updates
  useEffect(() => {
    if (selectedOrder && orders.length > 0) {
      const found = orders.find(o => o.id === selectedOrder.id || o.raw_id === selectedOrder.raw_id);
      if (found && JSON.stringify(found) !== JSON.stringify(selectedOrder)) {
        setSelectedOrder(found);
      }
    }
  }, [orders, selectedOrder]);

  // Auto trigger snap payment if redirecting from quick buy
  useEffect(() => {
    if (selectedOrder && location.state?.triggerPayment && location.state?.snapToken) {
      const snapToken = location.state.snapToken;
      const rawId = location.state.rawId;

      // Clear state so it doesn't trigger again on component updates
      navigate(location.pathname, { 
        replace: true, 
        state: { orderId: selectedOrder.id } 
      });

      triggerPaymentFlow(snapToken, rawId);
    }
  }, [selectedOrder, location.state]);

  const handleBack = () => {
    setSelectedOrder(null);
    navigate(location.pathname, { replace: true, state: {} });
  };

  // Stepper timeline configurations
  const getTimelineStatus = (currentStatus: string) => {
    const steps = [
      { key: "Pending", label: "Menunggu Pembayaran", icon: Clock },
      { key: "Diproses", label: "Sedang Diproses", icon: Package },
      { key: "Dikirim", label: "Sedang Dikirim", icon: Truck },
      { key: "Selesai", label: "Selesai", icon: CheckCircle2 }
    ];

    let activeIndex = 0;
    if (["Diproses", "processing"].includes(currentStatus)) activeIndex = 1;
    else if (["Dikirim", "shipped"].includes(currentStatus)) activeIndex = 2;
    else if (["Selesai", "success", "completed"].includes(currentStatus)) activeIndex = 3;

    return { steps, activeIndex };
  };

  // Render Order Detail Page View
  if (selectedOrder) {
    const { steps, activeIndex } = getTimelineStatus(selectedOrder.status);
    const subtotal = selectedOrder.total;
    const shippingFee = 15000; // Mock delivery rate
    const serviceFee = 2000;
    const grandTotal = subtotal + shippingFee + serviceFee;

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 pb-16 text-slate-800 max-w-4xl mx-auto font-sans"
      >
        {/* Breadcrumbs / Back button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-xs font-bold uppercase tracking-wider cursor-pointer border-none bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pesanan
        </button>

        {/* Invoice Title Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold uppercase px-2 py-0.5 rounded">
                Invoice Belanja
              </span>
              <span className="text-xs text-slate-400 font-semibold">{selectedOrder.date || "Baru saja"}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-2">ID Transaksi: {selectedOrder.id}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
              ["Selesai", "success", "completed"].includes(selectedOrder.status)
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : ["Batal", "failed", "cancelled"].includes(selectedOrder.status)
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>{selectedOrder.status}</span>
          </div>
        </div>

        {/* Stepper Timeline Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Pelacakan Logistik</h3>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2 pt-2">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={idx} className="flex md:flex-col items-center flex-1 w-full relative">
                  {/* Connect Line */}
                  {idx > 0 && (
                    <div className={`hidden md:block absolute left-[-50%] right-[50%] top-4 h-0.5 z-0 ${
                      idx <= activeIndex ? "bg-emerald-500" : "bg-slate-200"
                    }`} />
                  )}

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border transition-all ${
                    isCompleted 
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10" 
                      : "bg-white border-slate-250 text-slate-400"
                  } ${isCurrent ? "ring-4 ring-emerald-500/10 scale-105" : ""}`}>
                    <StepIcon className="w-4 h-4" />
                  </div>

                  <div className="ml-4 md:ml-0 md:mt-2.5 md:text-center text-left">
                    <p className={`text-[11px] font-bold ${isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[9px] text-emerald-600 font-extrabold uppercase mt-0.5 block tracking-wider">Aktif</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Columns: Items & Address */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Table of Items */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-slate-450" /> Rincian Belanja Barang
              </h3>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase text-[9px] tracking-wider font-bold">
                      <th className="py-3 px-4">Nama Produk</th>
                      <th className="py-3 px-4 text-center">Jumlah</th>
                      <th className="py-3 px-4 text-right">Harga</th>
                      <th className="py-3 px-4 text-right">Subtotal</th>
                      {["Selesai", "success", "completed"].includes(selectedOrder.status) && (
                        <th className="py-3 px-4 text-center">Aksi</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((it: any, index: number) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/20 text-slate-700 font-semibold">
                          <td className="py-3 px-4 text-slate-900">{it.name}</td>
                          <td className="py-3 px-4 text-center text-slate-500">{it.quantity}</td>
                          <td className="py-3 px-4 text-right">Rp {it.price.toLocaleString("id-ID")}</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">Rp {(it.price * it.quantity).toLocaleString("id-ID")}</td>
                          {["Selesai", "success", "completed"].includes(selectedOrder.status) && (
                            <td className="py-3 px-4 text-center">
                              {it.product_id ? (
                                <button
                                  onClick={() => navigate(`/pembeli/ulasan?product_id=${it.product_id}`)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-1 px-2.5 rounded transition text-[10px] uppercase tracking-wider cursor-pointer border-none"
                                >
                                  Beri Ulasan
                                </button>
                              ) : (
                                <span className="text-slate-400 font-medium">-</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-slate-100 text-slate-700 font-semibold">
                        <td className="py-3 px-4 text-slate-900">{selectedOrder.product}</td>
                        <td className="py-3 px-4 text-center text-slate-500">{selectedOrder.qty}</td>
                        <td className="py-3 px-4 text-right">Rp {(selectedOrder.total / (selectedOrder.qty || 1)).toLocaleString("id-ID")}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">Rp {selectedOrder.total.toLocaleString("id-ID")}</td>
                        {["Selesai", "success", "completed"].includes(selectedOrder.status) && (
                          <td className="py-3 px-4 text-center">
                            {selectedOrder.product_id ? (
                              <button
                                onClick={() => navigate(`/pembeli/ulasan?product_id=${selectedOrder.product_id}`)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-1 px-2.5 rounded transition text-[10px] uppercase tracking-wider cursor-pointer border-none"
                              >
                                Beri Ulasan
                              </button>
                            ) : (
                              <span className="text-slate-400 font-medium">-</span>
                            )}
                          </td>
                        )}
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-450" /> Informasi Alamat Pengiriman
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-650">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Penerima</span>
                      <span className="text-slate-800 font-semibold">Budi Santoso</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">No. Telepon</span>
                      <span className="text-slate-800 font-semibold">+62 812-3456-7890</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider leading-none">Alamat Lengkap</span>
                    <p className="text-slate-700 font-semibold text-[11px] leading-relaxed">
                      Jl. Merdeka No. 12, RT 02 / RW 04, Desa Karya Maju, Magelang, Jawa Tengah 56192
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Billing Invoice Card */}
          <div className="space-y-6">
            
            {/* Payment Summary */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detail Ringkasan Biaya</h3>
              
              <div className="space-y-3 text-xs font-bold text-slate-550">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Total Harga ({selectedOrder.qty || 1} barang)</span>
                  <span className="text-slate-800">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Ongkos Kirim Kurir</span>
                  <span className="text-slate-800">Rp {shippingFee.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Biaya Layanan Platform</span>
                  <span className="text-slate-800">Rp {serviceFee.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Metode Pembayaran</span>
                  <span className="text-slate-800">{selectedOrder.payment_method}</span>
                </div>
                
                <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
                  <span className="text-slate-800 font-black">Total Pembayaran</span>
                  <span className="text-emerald-600 font-black">Rp {grandTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Action for payments */}
              {selectedOrder.status === "Pending" && (selectedOrder.snap_token || selectedOrder.snap_url) && (
                <button
                  onClick={() => {
                    if (selectedOrder.snap_token) {
                      triggerPaymentFlow(selectedOrder.snap_token, selectedOrder.raw_id);
                    } else {
                      window.open(selectedOrder.snap_url, "_blank");
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition cursor-pointer text-xs uppercase tracking-wider border-none flex justify-center items-center gap-1.5 shadow-md shadow-emerald-500/10"
                >
                  Bayar Sekarang <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Refresh status manually if pending */}
              {selectedOrder.status === "Pending" && (
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    if (token) {
                      try {
                        toast.info("Sinkronisasi status pembayaran...");
                        const syncRes = await fetch(`http://localhost:8000/api/orders/${selectedOrder.raw_id}/check-status`, {
                          headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (syncRes.ok) {
                          const resData = await syncRes.json();
                          toast.success(`Status terupdate: ${resData.status}`);
                          await fetchOrders();
                        } else {
                          toast.error("Gagal sinkronisasi status pembayaran.");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Gagal menghubungi server.");
                      }
                    }
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl transition cursor-pointer text-xs uppercase tracking-wider border-none flex justify-center items-center gap-1.5 shadow-sm"
                >
                  Refresh Status Pembayaran
                </button>
              )}

              {/* Order completion by buyer if status is Shipped / Dikirim */}
              {selectedOrder.status === "Dikirim" && (
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    if (token) {
                      try {
                        const confirmComplete = window.confirm("Apakah Anda yakin pesanan ini sudah diterima dengan baik?");
                        if (!confirmComplete) return;

                        const compRes = await fetch(`http://localhost:8000/api/orders/${selectedOrder.raw_id}/complete`, {
                          method: "PUT",
                          headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (compRes.ok) {
                          toast.success("Pesanan dinyatakan selesai! Terima kasih.");
                          await fetchOrders();
                        } else {
                          toast.error("Gagal menyelesaikan pesanan.");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Gagal menghubungi server.");
                      }
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition cursor-pointer text-xs uppercase tracking-wider border-none flex justify-center items-center gap-1.5 shadow-md shadow-emerald-500/10"
                >
                  Pesanan Diterima
                </button>
              )}

              {/* Secure transaction notice */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-[9px] text-slate-450 font-semibold leading-relaxed">
                  Platform KoneksiDesa menggunakan teknologi enkripsi SSL dan Midtrans Payment Gateway untuk transaksi aman.
                </span>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 text-slate-800 font-sans"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Riwayat Pesanan Anda</h1>
        <p className="text-slate-500 text-xs font-semibold">Pantau proses pengiriman barang, riwayat belanja, dan status pembayaran invoice transaksi.</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShoppingBag className="w-4 h-4 text-slate-400" /> Daftar Transaksi Belanja
        </h3>

        {loading ? (
          <div className="text-center py-12 text-xs text-slate-450 font-bold animate-pulse">Memuat riwayat belanja...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            Belum ada riwayat pesanan belanja terdaftar
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div 
                key={ord.id} 
                className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 hover:bg-slate-50 hover:border-slate-350 hover:shadow-sm transition duration-200 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer"
                onClick={() => setSelectedOrder(ord)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-black text-slate-900">Order #{ord.id}</span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {ord.date || "Baru saja"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-1">Produk: <span className="text-slate-900 font-bold">{ord.product}</span> • Kuantitas: {ord.qty} pcs</p>
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Pembayaran: {ord.payment_method}
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200/60 pt-3 md:pt-0 md:pl-4 justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Total Tagihan</span>
                    <span className="text-xs font-black text-slate-800">Rp {ord.total.toLocaleString("id-ID")}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded border ${
                    ord.status === "Selesai" || ord.status === "Diproses" || ord.status === "Dikirim"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-250/30"
                      : "bg-rose-50 text-rose-700 border-rose-250/30"
                  }`}>{ord.status}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
