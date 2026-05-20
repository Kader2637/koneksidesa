"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Banknote, Store, Users, ShoppingBag, 
  TrendingUp, Activity, PieChart 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Counter from "@/components/ui/Counter";

export default function Statistics() {
  const chartData = [
    { month: "Jan", val: 30 },
    { month: "Feb", val: 45 },
    { month: "Mar", val: 40 },
    { month: "Apr", val: 60 },
    { month: "Mei", val: 80 },
    { month: "Jun", val: 95 },
  ];

  const sectorData = [
    { name: "Pertanian Makro", pct: 45, color: "bg-emerald-500", border: "#10b981" },
    { name: "Kerajinan Kriya", pct: 30, color: "bg-amber-500", border: "#f59e0b" },
    { name: "Kuliner Reseller", pct: 20, color: "bg-blue-500", border: "#3b82f6" },
    { name: "Lainnya", pct: 5, color: "bg-purple-500", border: "#8b5cf6" },
  ];

  const metrics = [
    {
      label: "Volume Sirkulasi Finansial",
      value: 18.5,
      prefix: "Rp ",
      suffix: " Miliar",
      decimals: 1,
      icon: Banknote,
      iconBg: "bg-blue-50 dark:bg-blue-950/20 text-blue-500",
      trend: "Meningkat 12.5% Bulan Ini",
      trendUp: true,
    },
    {
      label: "UMKM Digital Terdaftar",
      value: 1254,
      prefix: "",
      suffix: " Mitra",
      decimals: 0,
      icon: Store,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500",
      trend: "45 Entitas Desa Baru bergabung",
      trendUp: true,
    },
    {
      label: "Investor Terverifikasi",
      value: 342,
      prefix: "",
      suffix: " Akun",
      decimals: 0,
      icon: Users,
      iconBg: "bg-amber-50 dark:bg-amber-950/20 text-amber-500",
      trend: "100% Lulus Verifikasi KYC AI",
      trendUp: false,
    },
    {
      label: "Pembeli Aktif Bulanan",
      value: 42.4,
      prefix: "",
      suffix: " Ribu",
      decimals: 1,
      icon: ShoppingBag,
      iconBg: "bg-purple-50 dark:bg-purple-950/20 text-purple-500",
      trend: "Sirkulasi Barang Sangat Aktif",
      trendUp: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans antialiased text-slate-800 dark:text-zinc-200">
      <Navbar />

      {/* 1. Header Hero */}
      <section className="pt-36 pb-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Glow particles and modern dark grids */}
        <div className="absolute inset-0 grid-bg-dark opacity-35 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md"
          >
            <Activity className="w-3.5 h-3.5" /> 
            Data Sirkulasi Transparan
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-[1.15]"
          >
            Statistik Pertumbuhan<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Ekonomi Pedesaan
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-350 text-sm md:text-base max-w-xl mx-auto font-semibold leading-relaxed"
          >
            Pantau pergerakan ekonomi makro, sirkulasi modal usaha, serta tren belanja produk komoditas UMKM secara aktual dan transparan.
          </motion.p>
        </div>
      </section>

      {/* 2. Metrics & Dashboard overlap */}
      <main className="flex-grow max-w-7xl mx-auto px-6 w-full relative z-20 -mt-12 pb-24 space-y-12">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-200/50 dark:border-zinc-800 transition relative overflow-hidden flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Floating blur circle indicator inside card */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />

                <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full flex items-start justify-end p-3.5 ${metric.iconBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-1.5 pt-3 relative z-10">
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-black uppercase tracking-wider max-w-[170px] leading-tight">
                    {metric.label}
                  </p>
                  <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white">
                    <Counter 
                      value={metric.value} 
                      prefix={metric.prefix} 
                      suffix={metric.suffix} 
                      decimals={metric.decimals}
                    />
                  </h3>
                </div>

                {/* Footer status trend */}
                <div className="mt-6 border-t border-slate-100 dark:border-zinc-800/80 pt-3 relative z-10">
                  {metric.trendUp ? (
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> 
                      {metric.trend}
                    </p>
                  ) : (
                    <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-black uppercase tracking-wider flex items-center gap-1">
                      {metric.trend}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Simulated Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Custom bar chart (Left 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl border border-slate-200/50 dark:border-zinc-800 p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white">
                Volume Transaksi Bulanan
              </h3>
              <div className="bg-slate-50 dark:bg-zinc-800 text-[10px] font-black text-slate-500 dark:text-zinc-400 px-3.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-zinc-700 uppercase tracking-wider">
                Tahun Ini (2026)
              </div>
            </div>

            {/* Custom Interactive Bars Canvas */}
            <div className="h-68 flex items-end gap-3 sm:gap-6 justify-between mt-12 relative w-full select-none">
              {/* Y Axis Grid lines */}
              <div className="absolute left-0 h-full flex flex-col justify-between text-[9px] text-slate-400 dark:text-zinc-500 font-black py-2 border-r border-slate-100 dark:border-zinc-850 pr-4 pb-8">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Bars Row */}
              <div className="w-full flex justify-between h-full items-end pb-8 ml-12">
                {chartData.map((bar, i) => (
                  <div key={i} className="flex-1 mx-1.5 sm:mx-3.5 flex flex-col justify-end h-full group relative">
                    {/* Hover Floating Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg pointer-events-none z-10 whitespace-nowrap border border-white/10 dark:border-none">
                      Penyerapan: {bar.val}%
                    </div>
                    
                    {/* Glowing bar column */}
                    <div className="w-full bg-slate-50 dark:bg-zinc-950/60 rounded-t-xl h-full flex items-end overflow-hidden border border-slate-150 dark:border-zinc-850/60">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${bar.val}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 50, damping: 13, delay: i * 0.08 }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-blue-500 group-hover:from-emerald-500 group-hover:to-blue-400 rounded-t-xl transition duration-300 cursor-pointer shadow-md shadow-emerald-500/10"
                      />
                    </div>
                    
                    {/* Label at bottom */}
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Donut sectors chart (Right 1 col) */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl border border-slate-200/50 dark:border-zinc-800 p-8 flex flex-col justify-between"
          >
            <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white">
              Sektor Dominasi
            </h3>

            {/* Glowing Conic Donut Circle Wheel */}
            <div className="flex-grow flex items-center justify-center py-6 relative">
              {/* Outer rotating neon shadow glow */}
              <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 blur-xl pointer-events-none" />

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-44 h-44 rounded-full flex items-center justify-center relative shadow-lg"
                style={{
                  background: `conic-gradient(#10b981 0% 45%, #f59e0b 45% 75%, #3b82f6 75% 95%, #8b5cf6 95% 100%)`,
                }}
              >
                {/* Center Masking Circle */}
                <div className="w-32 h-32 bg-white dark:bg-zinc-900 rounded-full flex flex-col items-center justify-center shadow-inner">
                  <PieChart className="w-5 h-5 text-slate-400 dark:text-zinc-550 mb-1" />
                  <span className="text-xl font-heading font-black text-slate-900 dark:text-white leading-none">
                    100%
                  </span>
                  <span className="text-[8px] uppercase font-black text-slate-400 dark:text-zinc-500 mt-1 tracking-widest">
                    Kategori Sektor
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Sektor Legends List */}
            <div className="space-y-3.5 border-t border-slate-100 dark:border-zinc-800/80 pt-5">
              {sectorData.map((sec) => (
                <div key={sec.name} className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-2.5 text-slate-500 dark:text-zinc-400">
                    <span className={`w-3.5 h-3.5 rounded-full ${sec.color} border border-white/20 shadow-sm`} />
                    {sec.name}
                  </span>
                  <span className="font-heading font-black text-slate-900 dark:text-white">
                    {sec.pct}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
