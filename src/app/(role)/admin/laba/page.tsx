"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Percent, ShieldCheck, Download, History } from "lucide-react";
import { useAdmin } from "../layout";

export default function LabaPage() {
  const { villageTreasury, withdrawals, addWithdrawal } = useAdmin();
  const [withdrawAmt, setWithdrawAmt] = useState("");

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmt);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > villageTreasury) {
      alert("Saldo Kas Desa tidak mencukupi!");
      return;
    }
    addWithdrawal(amt);
    setWithdrawAmt("");
    alert(`Sukses mengajukan penarikan sebesar Rp ${amt.toLocaleString("id-ID")} ke rekening BUMDes!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Laba & Transparansi Keuangan</h1>
        <p className="text-slate-400 text-sm font-semibold">Tinjau pendapatan kas desa hasil potongan fee transaksi ekosistem 2.5% dan asuransi investasi.</p>
      </div>

      {/* Income Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-44">
          <div className="space-y-1">
            <p className="text-blue-200 font-bold text-xs uppercase tracking-wider">Total Laba Bersih Platform (2.5%)</p>
            <h2 className="text-3xl font-black">Rp {villageTreasury.toLocaleString("id-ID")}</h2>
          </div>
          <form onSubmit={handleWithdraw} className="flex gap-2 relative z-10">
            <input
              type="number"
              value={withdrawAmt}
              onChange={(e) => setWithdrawAmt(e.target.value)}
              placeholder="Jumlah (Rp)..."
              className="bg-slate-900/60 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-white/50 w-full"
            />
            <button
              type="submit"
              className="bg-white hover:bg-slate-100 text-blue-700 font-black px-3 py-1.5 rounded-xl text-[10px] transition uppercase tracking-wider whitespace-nowrap"
            >
              Tarik Laba
            </button>
          </form>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center h-44 space-y-2">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Skema Biaya Fasilitator</p>
            <h3 className="text-lg font-black text-white">2.5% per Transaksi UMKM</h3>
            <p className="text-[10px] text-slate-400">Biaya operasional pemeliharaan server dan listrik desa.</p>
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center h-44 space-y-2">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fee Asuransi Investasi</p>
            <h3 className="text-lg font-black text-white">1.0% per Pencairan Dana</h3>
            <p className="text-[10px] text-slate-400">Garansi proteksi pembiayaan modal UMKM dari desa.</p>
          </div>
        </div>
      </div>

      {/* Laba Table */}
      <div className="bg-slate-950 rounded-[2rem] border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/80">
          <h2 className="font-bold text-sm text-slate-350 uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" /> Riwayat Penarikan Dana Operasional
          </h2>
          <button 
            onClick={() => alert("Mengunduh laporan PDF...")}
            className="text-xs text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Unduh Laporan PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-bold text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase text-[9px] tracking-wider bg-slate-950/40">
                <th className="py-4 px-6">ID Penarikan</th>
                <th className="py-4 px-6">Tanggal Pencairan</th>
                <th className="py-4 px-6">Rekening Tujuan</th>
                <th className="py-4 px-6">Nominal Penarikan</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((wd) => (
                <tr key={wd.id} className="border-b border-slate-900/60 hover:bg-slate-900/20">
                  <td className="py-4 px-6 font-mono text-white">{wd.id}</td>
                  <td className="py-4 px-6 text-slate-400">{wd.date}</td>
                  <td className="py-4 px-6 text-slate-400">{wd.bank}</td>
                  <td className="py-4 px-6 text-emerald-400">Rp {wd.amount.toLocaleString("id-ID")}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      wd.status === "Berhasil" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                    }`}>{wd.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
