"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Download, Landmark, Users, Calendar, ArrowRightLeft } from "lucide-react";
import { useUMKM } from "../layout";
import { exportToCSV, exportToPDF } from "../../../../utils/exportUtils";

export default function UMKMLaporanPage() {
  const { umkmInvestasis } = useUMKM();

  // 1. Total Dana Diterima
  const totalReceived = useMemo(() => {
    return umkmInvestasis
      .filter(i => i.status === "Aktif" || i.status === "Diterima")
      .reduce((sum, i) => sum + Number(i.amount), 0);
  }, [umkmInvestasis]);

  // 2. Daftar Investor
  const activeInvestors = useMemo(() => {
    const list: any[] = [];
    const seen = new Set();
    umkmInvestasis
      .filter(i => i.status === "Aktif" || i.status === "Diterima")
      .forEach(i => {
        const key = i.user_id;
        if (!seen.has(key)) {
          seen.add(key);
          list.push({
            id: i.user_id,
            name: i.user?.name || `Investor ID ${i.user_id}`,
            email: i.user?.email || "-",
            amount: Number(i.amount),
            tenor: i.tenor || "12 Bulan"
          });
        } else {
          // Accumulate amount if same investor funded multiple times
          const existing = list.find(item => item.id === key);
          if (existing) {
            existing.amount += Number(i.amount);
          }
        }
      });
    return list;
  }, [umkmInvestasis]);

  // Excel & PDF Export
  const handleExportCSV = () => {
    const data = umkmInvestasis.map(i => ({
      "ID Investasi": i.id,
      "Investor ID": i.user_id,
      "Nominal": Number(i.amount),
      "Tenor": i.tenor || "12 Bulan",
      "Status": i.status,
      "Catatan": i.message || ""
    }));
    exportToCSV(data, "Laporan_Investasi_Masuk_UMKM");
  };

  const handleExportPDF = () => {
    const headers = ["ID", "Investor ID", "Nominal", "Tenor", "Status"];
    const rows = umkmInvestasis.map(i => [
      i.id,
      i.user_id,
      `Rp ${Number(i.amount).toLocaleString("id-ID")}`,
      i.tenor || "12 Bulan",
      i.status
    ]);
    exportToPDF("Laporan Riwayat Investasi Masuk UMKM - Koneksi Desa", headers, rows, "Laporan_Investasi_Masuk");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Laporan Investasi Toko</h1>
          <p className="text-slate-500 text-xs font-semibold">Lihat riwayat perputaran dana modal investasi, total pendanaan masuk, dan detail daftar investor penanam modal.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-2 border-none"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-2 border-none"
          >
            <Download className="w-3.5 h-3.5" /> Cetak PDF
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Dana Diterima */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-36 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Dana Diterima</p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Landmark className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-600">Rp {totalReceived.toLocaleString("id-ID")}</h3>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-50 w-fit px-2.5 py-0.5 rounded-md border border-slate-200">
            Kredit & Investasi Rilis
          </span>
        </div>

        {/* Jumlah Investor Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-36 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Investor Aktif</p>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800">{activeInvestors.length} Akun</h3>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-50 w-fit px-2.5 py-0.5 rounded-md border border-slate-200">
            Pemegang Saham Mitra
          </span>
        </div>

        {/* Total Penawaran Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-36 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Penawaran Masuk</p>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
              <ArrowRightLeft className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800">{umkmInvestasis.length} Pengajuan</h3>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-50 w-fit px-2.5 py-0.5 rounded-md border border-slate-200">
            Dalam Database
          </span>
        </div>
      </div>

      {/* Active Investor Lists */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Daftar Investor Penanam Modal
        </h3>
        
        <div className="overflow-x-auto">
          {activeInvestors.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Belum ada investor terdaftar
            </div>
          ) : (
            <table className="w-full text-xs font-bold text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-450 uppercase text-xs tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Nama Investor</th>
                  <th className="py-3 px-4">Kontak Email</th>
                  <th className="py-3 px-4">Tenor Terpilih</th>
                  <th className="py-3 px-4 text-right">Total Nominal Investasi</th>
                </tr>
              </thead>
              <tbody>
                {activeInvestors.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-slate-700 transition-colors">
                    <td className="py-3 px-4 font-heading font-black text-slate-900">{inv.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-500">{inv.email}</td>
                    <td className="py-3 px-4 text-slate-500">{inv.tenor}</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-black">Rp {inv.amount.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Riwayat Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Riwayat Semua Transaksi Investasi
        </h3>
        
        <div className="overflow-x-auto">
          {umkmInvestasis.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Belum ada riwayat transaksi investasi
            </div>
          ) : (
            <table className="w-full text-xs font-bold text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-450 uppercase text-xs tracking-wider bg-slate-50">
                  <th className="py-3 px-4">ID Investasi</th>
                  <th className="py-3 px-4">Investor ID</th>
                  <th className="py-3 px-4">Jangka Tenor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody>
                {umkmInvestasis.map((i) => (
                  <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-slate-700 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-900">#{i.id}</td>
                    <td className="py-3 px-4 text-slate-500">ID-{i.user_id}</td>
                    <td className="py-3 px-4 text-slate-500">{i.tenor || "12 Bulan"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        i.status === "Aktif" || i.status === "Diterima"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : i.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>{i.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">Rp {Number(i.amount).toLocaleString("id-ID")}</td>
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
