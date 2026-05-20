"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tractor, Package, Coffee, Droplet, 
  Trees, Scissors, ShieldCheck, Sparkles, ArrowRight, X, Coins, Gift
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Proyek {
  id: number;
  title: string;
  umkm: string;
  icon: React.ComponentType<any>;
  skor: string;
  progress: number;
  target: string;
  targetVal: number;
  roi: number; // percentage
  tenor: string;
  color: string;
}

export default function Investment() {
  const [selectedProyek, setSelectedProyek] = useState<Proyek | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(5000000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const daftarProyek: Proyek[] = [
    { 
      id: 1, 
      title: "Modernisasi Alat Panen Padi", 
      umkm: "Kelompok Tani Padi Biru, Brebes", 
      icon: Tractor, 
      skor: "A+", 
      progress: 85, 
      target: "50 Juta", 
      targetVal: 50000000,
      roi: 15, 
      tenor: "12 Bulan",
      color: "from-emerald-500 to-teal-500"
    },
    { 
      id: 2, 
      title: "Pembelian Bahan Baku Grosir", 
      umkm: "Sentra Kerajinan Bambu Lestari, Garut", 
      icon: Package, 
      skor: "B+", 
      progress: 42, 
      target: "15 Juta", 
      targetVal: 15000000,
      roi: 11, 
      tenor: "6 Bulan",
      color: "from-blue-500 to-indigo-500"
    },
    { 
      id: 3, 
      title: "Ekspansi Kilang Kopi", 
      umkm: "Toko Kopi Rejo, Temanggung", 
      icon: Coffee, 
      skor: "A", 
      progress: 95, 
      target: "30 Juta", 
      targetVal: 30000000,
      roi: 14, 
      tenor: "18 Bulan",
      color: "from-amber-500 to-orange-500"
    },
    { 
      id: 4, 
      title: "Budidaya Lele Sistem Bioflok", 
      umkm: "Giat Tambak Mandiri, Cirebon", 
      icon: Droplet, 
      skor: "A-", 
      progress: 12, 
      target: "40 Juta", 
      targetVal: 40000000,
      roi: 13, 
      tenor: "9 Bulan",
      color: "from-cyan-500 to-blue-500"
    },
    { 
      id: 5, 
      title: "Sewa Lahan Sapi Perah", 
      umkm: "Koperasi Susu Sejahtera, Lembang", 
      icon: Trees, 
      skor: "A+", 
      progress: 66, 
      target: "120 Juta", 
      targetVal: 120000000,
      roi: 18, 
      tenor: "24 Bulan",
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: 6, 
      title: "Renovasi Rumah Konveksi", 
      umkm: "Busana Kriya Desa, Pekalongan", 
      icon: Scissors, 
      skor: "B+", 
      progress: 55, 
      target: "25 Juta", 
      targetVal: 25000000,
      roi: 12, 
      tenor: "12 Bulan",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const handleInvestSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    setSelectedProyek(null);
    setIsSuccess(false);
    setInvestAmount(5000000);
  };

  // Real-time dividend calculation
  const calculatedDividend = selectedProyek 
    ? (investAmount * selectedProyek.roi) / 100 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans antialiased text-slate-800 dark:text-zinc-200">
      <Navbar />

      {/* 1. Glowing Hero Section */}
      <section className="pt-36 pb-32 bg-slate-950 text-white relative overflow-hidden">
        {/* Tech Grid and Blur Blobs */}
        <div className="absolute inset-0 grid-bg-dark opacity-35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
        <div className="absolute right-1/4 top-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute left-1/4 bottom-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.span 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-blue-300 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" /> 
            Proteksi Modal Berbasis AI
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-[1.15]"
          >
            Investasi Finansial<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Ekonomi Rakyat
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-semibold leading-relaxed"
          >
            Bantu UMKM lokal berekspansi secara digital sekaligus raih imbal hasil bersertifikat dengan proteksi asuransi panen bersama.
          </motion.p>
        </div>
      </section>

      {/* 2. Interactive Projects Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full relative z-20 -mt-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {daftarProyek.map((proyek, index) => {
            const IconComponent = proyek.icon;
            return (
              <motion.div
                key={proyek.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl border border-slate-200/50 dark:border-zinc-800 flex flex-col group overflow-hidden hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  {/* Badge & Icon Area */}
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-zinc-800 border border-slate-200/50 dark:border-zinc-700/80 rounded-2xl flex items-center justify-center shadow-sm">
                      <IconComponent className="w-7 h-7 text-blue-500 dark:text-blue-400" />
                    </div>
                    
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-emerald-150 dark:border-emerald-900/30 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> 
                      Skor: <span>{proyek.skor}</span>
                    </div>
                  </div>
                  
                  {/* Descriptions */}
                  <div className="mb-6 space-y-1">
                    <h3 className="font-heading font-black text-slate-900 dark:text-white text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-250">
                      {proyek.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
                      {proyek.umkm}
                    </p>
                  </div>
                  
                  {/* Progress bar info */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 dark:text-zinc-400">
                        Terdanai: <span className="text-slate-900 dark:text-white font-heading font-black">{proyek.progress}%</span>
                      </span>
                      <span className="text-slate-500 dark:text-zinc-400">
                        Target: <span className="text-slate-900 dark:text-white font-heading font-black">Rp {proyek.target}</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-zinc-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${proyek.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 45, damping: 14, delay: 0.15 }}
                        className={`h-full bg-gradient-to-r ${proyek.color} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Specification details */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-200/50 dark:border-zinc-800/60">
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-widest block mb-0.5">Estimasi ROI</span>
                      <span className="font-heading font-black text-emerald-600 dark:text-emerald-400 text-sm">{proyek.roi}% / tahun</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-200/50 dark:border-zinc-800/60">
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-widest block mb-0.5">Durasi Tenor</span>
                      <span className="font-heading font-black text-slate-800 dark:text-zinc-200 text-sm">{proyek.tenor}</span>
                    </div>
                  </div>
                  
                  {/* Action CTA Button */}
                  <button 
                    onClick={() => setSelectedProyek(proyek)}
                    className="w-full bg-slate-950 dark:bg-zinc-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl transition duration-300 shadow-md hover:shadow-emerald-500/10 flex justify-center items-center gap-2 group-hover:-translate-y-0.5 cursor-pointer text-xs uppercase tracking-wider font-heading"
                  >
                    Ikut Pendanaan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* 3. Interactive Quick Investment Simulator Modal */}
      <AnimatePresence>
        {selectedProyek && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl z-10 p-8 relative overflow-hidden border border-slate-200/50 dark:border-zinc-800 text-slate-800 dark:text-zinc-200"
            >
              {/* Internal glowing blobs */}
              <div className="absolute -top-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition bg-slate-50 dark:bg-zinc-800 p-2.5 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div 
                    key="simulator-inputs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-100/50 dark:border-emerald-900/30">
                        Simulator Investasi Cepat
                      </span>
                      <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-white mt-3">
                        {selectedProyek.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
                        {selectedProyek.umkm}
                      </p>
                    </div>

                    {/* Numeric Input & Presets */}
                    <div className="space-y-3.5">
                      <label className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                        Jumlah Dana Penyerapan
                      </label>
                      <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 p-4.5 rounded-[20px] flex items-center justify-between shadow-inner focus-within:border-blue-500 transition-all duration-300">
                        <span className="font-heading font-black text-slate-400 dark:text-zinc-600 text-lg">Rp</span>
                        <input
                          type="number"
                          value={investAmount}
                          onChange={(e) => setInvestAmount(Number(e.target.value))}
                          className="bg-transparent border-none outline-none text-right font-heading font-black text-slate-900 dark:text-white text-xl w-full"
                        />
                      </div>
                      
                      {/* Presets Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {[1000000, 5000000, 10000000].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setInvestAmount(preset)}
                            className="py-2.5 bg-slate-100 dark:bg-zinc-800/60 hover:bg-slate-200 dark:hover:bg-zinc-800 text-[10px] font-black uppercase rounded-xl transition text-slate-600 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-700/60 cursor-pointer"
                          >
                            Rp {(preset / 1000000).toFixed(0)} Jt
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calculations Table Card */}
                    <div className="bg-slate-50 dark:bg-zinc-950/60 p-4.5 rounded-[22px] border border-slate-200/50 dark:border-zinc-850 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-zinc-400">
                        <span>Bagi Hasil (ROI)</span>
                        <span className="text-emerald-500 font-extrabold">{selectedProyek.roi}% / Tahun</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-zinc-400">
                        <span>Durasi Tenor</span>
                        <span className="text-slate-900 dark:text-white font-extrabold">{selectedProyek.tenor}</span>
                      </div>
                      <div className="border-t border-slate-200/60 dark:border-zinc-850 pt-3 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Estimasi Dividen</span>
                        <span className="font-heading font-black text-blue-600 dark:text-blue-400 text-lg">
                          Rp {calculatedDividend.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleInvestSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-4.5 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg hover:bg-emerald-600 dark:hover:bg-emerald-500 transition duration-300 flex justify-center items-center gap-2 cursor-pointer border border-slate-950 dark:border-white disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Coins className="w-4 h-4" />
                          <span>Kirim Penawaran Modal</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success-celebrate"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 space-y-6 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-100 dark:border-emerald-900/30 rounded-[20px] flex items-center justify-center shadow-lg">
                      <Gift className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-white leading-none">
                        Pengajuan Sukses!
                      </h3>
                      <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                        Modal Senilai Rp {investAmount.toLocaleString("id-ID")} Disubmit
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed font-semibold">
                      Terima kasih atas partisipasi Anda! Sistem AI kami akan menyiapkan berkas lembar penawaran modal digital ke email Anda dalam 5 menit.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="px-8 py-3.5 bg-slate-950 dark:bg-zinc-800 text-white rounded-full font-black uppercase text-xs cursor-pointer hover:bg-slate-800 transition"
                    >
                      Kembali ke Peluang
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
