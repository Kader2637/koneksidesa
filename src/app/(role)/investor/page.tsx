"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Landmark, TrendingUp, ChevronRight, Briefcase, Wallet } from "lucide-react";
import Link from "next/link";
import { useInvestor } from "./layout";

export default function InvestorDashboard() {
  const { walletBalance, myPortfolio } = useInvestor();

  // Aggregate metrics
  const totalInvested = useMemo(() => {
    return myPortfolio.reduce((sum, item) => sum + item.invested, 0);
  }, [myPortfolio]);

  const totalExpectedReturn = useMemo(() => {
    return myPortfolio.reduce((sum, item) => sum + item.expectedReturn, 0);
  }, [myPortfolio]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Dasbor Portofolio Investor</h1>
        <p className="text-slate-500 text-sm font-semibold">Tinjau nilai modal yang disalurkan, proyeksi dividen roi terkumpul, serta sisa saldo dompet belanja Anda.</p>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Invested */}
        <div className="bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-white p-6 rounded-[2rem] border border-blue-200/50 flex flex-col justify-between h-40 shadow-sm shadow-blue-100/10 hover:shadow-md hover:border-blue-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Modal Disalurkan</p>
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center border border-blue-500/25">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">Rp {totalInvested.toLocaleString("id-ID")}</h3>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-wider flex items-center gap-1 bg-blue-100/60 w-fit px-2.5 py-0.5 rounded-full border border-blue-200/50">
            Aset Aktif
          </span>
        </div>

        {/* Expected ROI */}
        <div className="bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-white p-6 rounded-[2rem] border border-emerald-200/50 flex flex-col justify-between h-40 shadow-sm shadow-emerald-100/10 hover:shadow-md hover:border-emerald-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimasi Pengembalian ROI</p>
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/25">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-emerald-700">Rp {totalExpectedReturn.toLocaleString("id-ID")}</h3>
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-100/60 w-fit px-2.5 py-0.5 rounded-full border border-emerald-200/50">
            +11.5% Rata-rata
          </span>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-white p-6 rounded-[2rem] border border-amber-200/50 flex flex-col justify-between h-40 shadow-sm shadow-amber-100/10 hover:shadow-md hover:border-amber-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Saldo Dompet Tersedia</p>
            <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center border border-amber-500/25">
              <Wallet className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">Rp {walletBalance.toLocaleString("id-ID")}</h3>
          <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider flex items-center gap-1 bg-amber-100/60 w-fit px-2.5 py-0.5 rounded-full border border-amber-200/50">
            Siap Diinvestasikan
          </span>
        </div>
      </div>

      {/* Active holdings list preview */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Portofolio Anda
          </h3>
          <Link href="/investor/portfolio" className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-0.5">
            Lihat rincian <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-4">
          {myPortfolio.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Anda belum menyalurkan pembiayaan apapun
            </div>
          ) : (
            myPortfolio.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 leading-tight">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">{item.umkm} • Bagi Hasil: {item.roi}%</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">Rp {item.invested.toLocaleString("id-ID")}</span>
                  <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-200/60 px-2.5 py-0.5 rounded font-black uppercase mt-1.5 inline-block">{item.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
