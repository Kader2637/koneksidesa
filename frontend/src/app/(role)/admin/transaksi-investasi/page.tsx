"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, ShoppingBag, Landmark, Check, X } from "lucide-react";
import { exportToCSV, exportToPDF } from "../../../../utils/exportUtils";
import { toast } from "@/components/ui/Toast";

interface Order {
  id: string;
  raw_id: number;
  buyer: string;
  product: string;
  qty: number;
  total: number;
  status: string;
  date: string;
  payment_method: string;
}

interface Campaign {
  id: number;
  title: string;
  umkm: string;
  target: number;
  roi: number;
  status: string;
}

export default function AdminTransaksiInvestasiPage() {
  const [activeTab, setActiveTab] = useState<"transaksi" | "pendanaan">("transaksi");
  const [orders, setOrders] = useState<Order[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      // Fetch Orders
      const orderRes = await fetch("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }

      // Fetch Campaigns
      const campaignRes = await fetch("http://localhost:8000/api/admin/campaigns", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (campaignRes.ok) {
        const campaignData = await campaignRes.json();
        setCampaigns(campaignData);
      }
    } catch (err) {
      console.error("Error fetching admin transactions/campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveCampaign = async (id: number, decision: "Aktif" | "Ditolak") => {
    if (!confirm(`Apakah Anda yakin ingin ${decision === "Aktif" ? "menyetujui" : "menolak"} pengajuan pendanaan ini?`)) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:8000/api/admin/campaigns/${id}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ decision })
      });
      if (response.ok) {
        toast.success(`Pengajuan pendanaan berhasil ${decision === "Aktif" ? "Disetujui" : "Ditolak"}`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Kelola Transaksi & Investasi</h1>
        <p className="text-slate-500 text-xs font-semibold">Monitor transaksi marketplace ritel dan moderasi pengajuan investasi/pendanaan modal UMKM desa.</p>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-2.5 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("transaksi")}
          className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition ${
            activeTab === "transaksi"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Transaksi Ritel Marketplace
        </button>
        <button
          onClick={() => setActiveTab("pendanaan")}
          className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition ${
            activeTab === "pendanaan"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Pendanaan & Investasi UMKM
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-wrap gap-4">
          <h2 className="font-bold text-xs text-slate-450 uppercase tracking-widest flex items-center gap-2">
            {activeTab === "transaksi" ? (
              <>
                <ShoppingBag className="w-4 h-4 text-blue-600" /> Riwayat Transaksi Ritel
              </>
            ) : (
              <>
                <Landmark className="w-4 h-4 text-emerald-600" /> Daftar Kampanye Pendanaan
              </>
            )}
          </h2>
          
          <div className="flex gap-3 text-xs font-semibold">
            <button
              onClick={() => {
                if (activeTab === "transaksi") {
                  const formatted = orders.map(o => ({
                    ID_Transaksi: o.id,
                    Pembeli: o.buyer,
                    Produk: o.product,
                    Kuantitas: o.qty,
                    Total_Harga: o.total,
                    Status: o.status,
                    Tanggal: o.date,
                    Metode_Pembayaran: o.payment_method
                  }));
                  exportToCSV(formatted, "riwayat_transaksi_marketplace.csv");
                } else {
                  const formatted = campaigns.map(c => ({
                    ID: c.id,
                    Nama_Proyek: c.title,
                    UMKM: c.umkm,
                    Target_Dana: c.target,
                    ROI: c.roi,
                    Status: c.status
                  }));
                  exportToCSV(formatted, "riwayat_investasi_umkm.csv");
                }
              }}
              className="text-xs text-emerald-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor CSV
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={() => {
                if (activeTab === "transaksi") {
                  const headers = ["ID", "Pembeli", "Produk", "Qty", "Total", "Status", "Metode"];
                  const rows = orders.map(o => [
                    o.id,
                    o.buyer,
                    o.product,
                    o.qty,
                    `Rp ${o.total.toLocaleString("id-ID")}`,
                    o.status,
                    o.payment_method
                  ]);
                  exportToPDF("Laporan Transaksi Marketplace", headers, rows, "laporan_transaksi");
                } else {
                  const headers = ["ID", "Nama Proyek", "UMKM", "Target Dana", "ROI", "Status"];
                  const rows = campaigns.map(c => [
                    c.id,
                    c.title,
                    c.umkm,
                    `Rp ${c.target.toLocaleString("id-ID")}`,
                    `${c.roi}%`,
                    c.status
                  ]);
                  exportToPDF("Laporan Pendanaan Investasi UMKM", headers, rows, "laporan_investasi");
                }
              }}
              className="text-xs text-blue-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <Download className="w-3.5 h-3.5" /> Cetak PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-450 font-bold">Memuat data...</div>
          ) : activeTab === "transaksi" ? (
            orders.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200 border-dashed m-5">
                Belum ada transaksi terjadi
              </div>
            ) : (
              <table className="w-full text-xs font-bold text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-405 uppercase text-[9px] tracking-wider bg-slate-50/50">
                    <th className="py-3 px-5">ID Transaksi</th>
                    <th className="py-3 px-5">Pembeli</th>
                    <th className="py-3 px-5">Produk Pesanan</th>
                    <th className="py-3 px-5">Total Pembayaran</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Metode</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-heading font-black text-slate-900">{o.id}</td>
                      <td className="py-3.5 px-5 text-slate-500 font-semibold">{o.buyer}</td>
                      <td className="py-3.5 px-5 text-slate-500 font-semibold">
                        {o.qty} x {o.product}
                      </td>
                      <td className="py-3.5 px-5 text-emerald-600 font-black">
                        Rp {o.total.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase border ${
                          o.status === "Selesai" || o.status === "Diproses" || o.status === "Dikirim"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>{o.status}</span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-400 text-[10px] font-medium">{o.payment_method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200 border-dashed m-5">
              Belum ada proyek pendanaan terdaftar
            </div>
          ) : (
            <table className="w-full text-xs font-bold text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-405 uppercase text-[9px] tracking-wider bg-slate-50/50">
                  <th className="py-3 px-5">Nama Proyek</th>
                  <th className="py-3 px-5">UMKM Pengaju</th>
                  <th className="py-3 px-5">Target Penggalangan</th>
                  <th className="py-3 px-5">Bagi Hasil (ROI)</th>
                  <th className="py-3 px-5">Status Moderasi</th>
                  <th className="py-3 px-5 text-right">Moderasi</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-heading font-black text-slate-900">{c.title}</td>
                    <td className="py-3.5 px-5 text-slate-500 font-semibold">{c.umkm}</td>
                    <td className="py-3.5 px-5 text-slate-900 font-black">Rp {c.target.toLocaleString("id-ID")}</td>
                    <td className="py-3.5 px-5 text-emerald-600 font-black">+{c.roi}% / Th</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase border ${
                        c.status === "Aktif" || c.status === "Diterima"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : c.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>{c.status}</span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-medium">
                      {c.status === "Pending" && (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleResolveCampaign(c.id, "Aktif")}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-650 rounded-lg cursor-pointer border border-emerald-100/50"
                            title="Setujui Pengajuan"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResolveCampaign(c.id, "Ditolak")}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-lg cursor-pointer border border-rose-100/50"
                            title="Tolak Pengajuan"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
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
