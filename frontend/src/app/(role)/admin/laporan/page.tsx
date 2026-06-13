"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, FileText, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useAdmin } from "../layout";
import { exportToCSV, exportToPDF } from "../../../../utils/exportUtils";

interface Order {
  id: string;
  buyer: string;
  product: string;
  qty: number;
  total: number;
  status: string;
  date: string;
}

interface Campaign {
  id: number;
  title: string;
  umkm: string;
  target: number;
  roi: number;
  status: string;
}

export default function LaporanPage() {
  const { usersList } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const orderRes = await fetch("http://localhost:8000/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrders(orderData);
        }

        const campaignRes = await fetch("http://localhost:8000/api/admin/campaigns", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (campaignRes.ok) {
          const campaignData = await campaignRes.json();
          setCampaigns(campaignData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportUsersCSV = () => {
    const formatted = usersList.map(u => ({
      "ID Akun": u.id,
      "Nama Pengguna": u.name,
      "Role": u.role,
      "Tanggal Gabung": u.joined,
      "Status": u.status
    }));
    exportToCSV(formatted, "laporan_pengguna_koneksidesa.csv");
  };

  const handleExportUsersPDF = () => {
    const headers = ["ID Akun", "Nama Pengguna", "Role", "Tanggal Gabung", "Status"];
    const rows = usersList.map(u => [u.id, u.name, u.role, u.joined, u.status]);
    exportToPDF("Laporan Database Pengguna - Koneksi Desa", headers, rows, "laporan_pengguna");
  };

  const handleExportOrdersCSV = () => {
    const formatted = orders.map(o => ({
      "ID Transaksi": o.id,
      "Pembeli": o.buyer,
      "Produk": o.product,
      "Qty": o.qty,
      "Total": o.total,
      "Status": o.status,
      "Tanggal": o.date
    }));
    exportToCSV(formatted, "laporan_transaksi_koneksidesa.csv");
  };

  const handleExportOrdersPDF = () => {
    const headers = ["ID", "Pembeli", "Produk", "Qty", "Total", "Status", "Tanggal"];
    const rows = orders.map(o => [
      o.id,
      o.buyer,
      o.product,
      o.qty,
      `Rp ${o.total.toLocaleString("id-ID")}`,
      o.status,
      o.date
    ]);
    exportToPDF("Laporan Transaksi Ritel - Koneksi Desa", headers, rows, "laporan_transaksi");
  };

  const handleExportCampaignsCSV = () => {
    const formatted = campaigns.map(c => ({
      "ID Kampanye": c.id,
      "Nama Proyek": c.title,
      "UMKM Pengaju": c.umkm,
      "Target Dana": c.target,
      "Bagi Hasil": `${c.roi}%`,
      "Status": c.status
    }));
    exportToCSV(formatted, "laporan_investasi_koneksidesa.csv");
  };

  const handleExportCampaignsPDF = () => {
    const headers = ["ID", "Nama Proyek", "UMKM", "Target Dana", "ROI", "Status"];
    const rows = campaigns.map(c => [
      c.id,
      c.title,
      c.umkm,
      `Rp ${c.target.toLocaleString("id-ID")}`,
      `${c.roi}%`,
      c.status
    ]);
    exportToPDF("Laporan Investasi & Pendanaan - Koneksi Desa", headers, rows, "laporan_investasi");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Pusat Laporan Ekosistem</h1>
        <p className="text-slate-505 text-xs font-semibold">Unduh laporan resmi transaksi marketplace, penggalangan dana investasi, dan daftar pengguna dalam format Excel/PDF.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users Report Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-64 shadow-sm hover:shadow-md hover:border-slate-300 transition duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-105">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-heading font-black text-slate-900 leading-tight">Laporan Pengguna</h3>
              <p className="text-[11px] text-slate-450 font-bold leading-relaxed mt-1">Laporan demografi data UMKM, investor, dan pembeli terdaftar.</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={handleExportUsersCSV}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-650 font-extrabold py-2.5 px-2 rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 border border-slate-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV / Excel
            </button>
            <button
              onClick={handleExportUsersPDF}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-2 rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 border-none"
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>

        {/* Transactions Report Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-64 shadow-sm hover:shadow-md hover:border-slate-300 transition duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-purple-55 flex items-center justify-center border border-purple-105">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-heading font-black text-slate-900 leading-tight">Laporan Transaksi</h3>
              <p className="text-[11px] text-slate-450 font-bold leading-relaxed mt-1">Laporan penjualan produk ritel bazar desa beserta status pengiriman.</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={handleExportOrdersCSV}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-650 font-extrabold py-2.5 px-2 rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 border border-slate-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV / Excel
            </button>
            <button
              onClick={handleExportOrdersPDF}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-2.5 px-2 rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 border-none"
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>

        {/* Investments Report Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-64 shadow-sm hover:shadow-md hover:border-slate-300 transition duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-105">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-heading font-black text-slate-900 leading-tight">Laporan Investasi</h3>
              <p className="text-[11px] text-slate-450 font-bold leading-relaxed mt-1">Laporan realisasi perputaran modal investasi, tenor, dan target ROI.</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={handleExportCampaignsCSV}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-650 font-extrabold py-2.5 px-2 rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 border border-slate-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV / Excel
            </button>
            <button
              onClick={handleExportCampaignsPDF}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-2 rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 border-none"
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
