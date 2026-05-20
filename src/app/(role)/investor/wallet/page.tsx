"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowDownCircle, ArrowUpCircle, History } from "lucide-react";
import { useInvestor } from "../layout";

export default function WalletPage() {
  const { walletBalance, depositWallet, withdrawWallet, txHistory } = useInvestor();
  
  const [topupAmt, setTopupAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topupAmt);
    if (isNaN(amt) || amt <= 0) return;

    depositWallet(amt);
    setTopupAmt("");
    alert(`Top Up sebesar Rp ${amt.toLocaleString("id-ID")} sukses dilakukan!`);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmt);
    if (isNaN(amt) || amt <= 0) return;

    const success = withdrawWallet(amt);
    if (success) {
      setWithdrawAmt("");
      alert(`Penarikan dana sebesar Rp ${amt.toLocaleString("id-ID")} sukses diajukan ke BUMDes!`);
    } else {
      alert("Saldo dompet Anda tidak mencukupi!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Dompet & Transaksi Keuangan</h1>
        <p className="text-slate-400 text-sm font-semibold">Lakukan top up saldo belanja investasi atau cairkan hasil bagi hasil dividen langsung ke rekening bank BUMDes.</p>
      </div>

      {/* Main Balance HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total balance card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-44 md:col-span-1">
          <div className="space-y-1">
            <p className="text-blue-200 font-bold text-xs uppercase tracking-wider">Saldo Dompet Tersedia</p>
            <h2 className="text-3xl font-black font-heading">Rp {walletBalance.toLocaleString("id-ID")}</h2>
          </div>
          <div className="text-[10px] text-blue-200 font-black uppercase tracking-wider flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5" /> Garansi Likuiditas 100% BUMDes
          </div>
        </div>

        {/* Top Up panel */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 h-44 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <ArrowDownCircle className="w-4 h-4 text-blue-400" /> Top Up Saldo
            </h4>
          </div>
          <form onSubmit={handleTopup} className="flex gap-2">
            <input
              type="number"
              value={topupAmt}
              onChange={(e) => setTopupAmt(e.target.value)}
              placeholder="Jumlah Topup (Rp)..."
              className="bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-700 w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-2 rounded-xl text-[10px] transition uppercase tracking-wider whitespace-nowrap"
            >
              Isi Saldo
            </button>
          </form>
        </div>

        {/* Withdraw Panel */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 h-44 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <ArrowUpCircle className="w-4 h-4 text-rose-450" /> Tarik Tunai Dana
            </h4>
          </div>
          <form onSubmit={handleWithdraw} className="flex gap-2">
            <input
              type="number"
              value={withdrawAmt}
              onChange={(e) => setWithdrawAmt(e.target.value)}
              placeholder="Jumlah Tarik (Rp)..."
              className="bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-700 w-full"
            />
            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white font-black px-4 py-2 rounded-xl text-[10px] transition uppercase tracking-wider whitespace-nowrap"
            >
              Cairkan
            </button>
          </form>
        </div>

      </div>

      {/* Transaction History ledger */}
      <div className="bg-slate-950 rounded-[2rem] border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/80">
          <h2 className="font-bold text-sm text-slate-350 uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" /> Riwayat Mutasi Rekening Belanja
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-bold text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase text-[9px] tracking-wider bg-slate-950/40">
                <th className="py-4 px-6">ID Transaksi</th>
                <th className="py-4 px-6">Tanggal Mutasi</th>
                <th className="py-4 px-6">Jenis Mutasi</th>
                <th className="py-4 px-6">Jumlah Mutasi</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {txHistory.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-900/60 hover:bg-slate-900/20">
                  <td className="py-4 px-6 font-mono text-white">{tx.id}</td>
                  <td className="py-4 px-6 text-slate-400">{tx.date}</td>
                  <td className="py-4 px-6 text-slate-400">{tx.type}</td>
                  <td className={`py-4 px-6 ${tx.type === "Top Up" ? "text-emerald-400" : "text-rose-400"}`}>
                    {tx.type === "Top Up" ? "+" : "-"} Rp {tx.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded text-[10px] font-black uppercase">{tx.status}</span>
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
