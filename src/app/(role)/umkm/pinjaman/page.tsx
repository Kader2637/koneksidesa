"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CreditCard } from "lucide-react";
import { useUMKM } from "../layout";

export default function PinjamanPage() {
  const { loans, submitLoanRequest } = useUMKM();
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenor, setLoanTenor] = useState("6 Bulan");

  const handleRequestLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(loanAmount);
    if (isNaN(amt) || amt <= 0) return;

    submitLoanRequest(amt, loanTenor);
    setLoanAmount("");
    alert(`Pengajuan pinjaman modal sebesar Rp ${amt.toLocaleString("id-ID")} berhasil dikirimkan ke Admin Desa untuk divalidasi!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-2">Pembiayaan & Pinjaman Modal</h1>
        <p className="text-slate-500 text-sm font-semibold">Ajukan pembiayaan modal kerja syariah berbasis crowdfunding dari investor desa maupun luar daerah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Application Form */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-100/80 h-fit shadow-sm shadow-emerald-100/5 hover:shadow-md transition-all duration-300">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 mb-6 pb-3 border-b border-slate-100">Ajukan Pendanaan</h3>
          <form onSubmit={handleRequestLoan} className="space-y-4 text-xs font-bold">
            <div className="space-y-2 flex flex-col">
              <label className="text-slate-500 tracking-wide">Jumlah Dana (Rp)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Contoh: 15000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-semibold"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-slate-500 tracking-wide">Tenor Pengembalian</label>
              <select
                value={loanTenor}
                onChange={(e) => setLoanTenor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-extrabold cursor-pointer"
              >
                <option>3 Bulan</option>
                <option>6 Bulan</option>
                <option>12 Bulan</option>
                <option>24 Bulan</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-550 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-[11px] shadow-md shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4" /> Ajukan Kampanye Modal
            </button>
          </form>
        </div>

        {/* Existing Active Campaigns List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Kampanye Permodalan Anda</h3>
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="bg-white p-6 rounded-3xl border border-emerald-100/60 space-y-5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Nomor Kontrak</span>
                    <h4 className="text-slate-800 text-lg font-heading font-black">{loan.id}</h4>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                    loan.status === "Pending" 
                      ? "bg-rose-50 text-rose-600 border-rose-200/50" 
                      : "bg-emerald-50 text-emerald-600 border-emerald-200/50"
                  }`}>{loan.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2 text-slate-500 border-t border-slate-50">
                  <span>Jumlah Dana: <strong className="text-slate-800 font-extrabold">Rp {loan.amount.toLocaleString("id-ID")}</strong></span>
                  <span>Tenor Pengembalian: <strong className="text-slate-800 font-extrabold">{loan.tenor}</strong></span>
                </div>

                {loan.status === "Aktif" && (
                  <div className="space-y-2 text-xs font-bold pt-3 border-t border-slate-50">
                    <div className="flex justify-between text-[10px] uppercase text-slate-400 tracking-wider">
                      <span>Progres Pelunasan</span>
                      <span className="text-slate-700 font-extrabold">{loan.paymentProgress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${loan.paymentProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
