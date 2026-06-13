"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tractor, Package, Coffee, Droplet, 
  Trees, Scissors, ShieldCheck, Sparkles, ArrowRight, X, Coins, Gift
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "@/components/ui/Toast";

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

  const [daftarProyek, setDaftarProyek] = useState<Proyek[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/bazar-campaigns");
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((c: any, index: number) => {
            const icons = [Tractor, Package, Coffee, Droplet, Trees, Scissors];
            const colors = [
              "from-emerald-500 to-teal-500",
              "from-blue-500 to-indigo-500",
              "from-amber-500 to-orange-500",
              "from-cyan-500 to-blue-500",
              "from-purple-500 to-pink-500",
              "from-pink-500 to-rose-500"
            ];
            return {
              id: c.id,
              title: c.title,
              umkm: c.umkm || c.business_name || "Mitra UMKM Desa",
              icon: icons[index % icons.length],
              skor: c.risk === "Sangat Rendah" ? "A+" : (c.risk === "Rendah" ? "A" : "B+"),
              progress: Number(c.progress || 0),
              target: `${(Number(c.target) / 1000000).toFixed(0)} Juta`,
              targetVal: Number(c.target),
              roi: Number(c.roi),
              tenor: c.tenor,
              color: colors[index % colors.length]
            };
          });
          setDaftarProyek(mapped);
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };
    fetchCampaigns();
  }, []);

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

  const handleInvestClick = (proyek: Proyek) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Silakan masuk/log in sebagai Investor terlebih dahulu untuk ikut pendanaan.");
      window.location.href = "/login";
      return;
    }
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== "Investor" && user.role !== "Admin") {
          toast.error("Hanya akun dengan role Investor yang dapat melakukan investasi.");
          return;
        }
      } catch (e) {}
    }
    setSelectedProyek(proyek);
  };

  // Real-time dividend calculation
  const calculatedDividend = selectedProyek 
    ? (investAmount * selectedProyek.roi) / 100 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      <Navbar />

      {/* 1. Glowing Hero Section */}
      <section className="pt-36 pb-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-b border-slate-100 relative overflow-hidden">
        {/* Tech Grid and Blur Blobs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute right-1/4 top-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-1/4 bottom-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.span 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-55 border border-blue-200 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" /> 
            Proteksi Modal Berbasis AI
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-[1.15] text-slate-900"
          >
            Investasi Finansial<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              Ekonomi Rakyat
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed"
          >
            Bantu UMKM lokal berekspansi secara digital sekaligus raih imbal hasil bersertifikat dengan proteksi asuransi panen bersama.
          </motion.p>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-6 w-full pb-24 relative z-20 -mt-10">
        {daftarProyek.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center min-h-[320px] space-y-4">
            <h3 className="text-xl font-heading font-black text-slate-900">
              Tidak ada peluang investasi aktif
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Kembali lagi nanti ketika ada UMKM mengajukan pendanaan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {daftarProyek.map((proyek, index) => {
              const IconComponent = proyek.icon;
              return (
                <motion.div
                  key={proyek.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-100/50 border border-slate-200/60 flex flex-col group overflow-hidden hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    {/* Badge & Icon Area */}
                    <div className="flex justify-between items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-sm">
                        <IconComponent className="w-7 h-7 text-blue-600" />
                      </div>
                      
                      <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-lg border border-emerald-150 shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> 
                        Skor: <span>{proyek.skor}</span>
                      </div>
                    </div>
                    
                    {/* Descriptions */}
                    <div className="mb-6 space-y-1">
                      <h3 className="font-heading font-black text-slate-900 text-xl group-hover:text-blue-600 transition-colors duration-250">
                        {proyek.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">
                        {proyek.umkm}
                      </p>
                    </div>
                    
                    {/* Progress bar info */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">
                          Terdanai: <span className="text-slate-900 font-heading font-black">{proyek.progress}%</span>
                        </span>
                        <span className="text-slate-500">
                          Target: <span className="text-slate-900 font-heading font-black">Rp {proyek.target}</span>
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
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
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block mb-0.5">Estimasi ROI</span>
                        <span className="font-heading font-black text-emerald-600 text-sm">{proyek.roi}% / tahun</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block mb-0.5">Durasi Tenor</span>
                        <span className="font-heading font-black text-slate-800 text-sm">{proyek.tenor}</span>
                      </div>
                    </div>
                    
                    {/* Action CTA Button */}
                    <button 
                      onClick={() => handleInvestClick(proyek)}
                      className="w-full bg-slate-950 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl transition duration-300 shadow-md hover:shadow-emerald-500/10 flex justify-center items-center gap-2 group-hover:-translate-y-0.5 cursor-pointer text-xs uppercase tracking-wider font-heading"
                    >
                      Ikut Pendanaan
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
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
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl z-10 p-8 relative overflow-hidden border border-slate-200/60 text-slate-800"
            >
              {/* Internal glowing blobs */}
              <div className="absolute -top-10 -left-10 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition bg-slate-50 p-2.5 rounded-full cursor-pointer"
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
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        Simulator Investasi Cepat
                      </span>
                      <h3 className="text-2xl font-heading font-black text-slate-900 mt-3">
                        {selectedProyek.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">
                        {selectedProyek.umkm}
                      </p>
                    </div>

                    {/* Numeric Input & Presets */}
                    <div className="space-y-3.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                        Jumlah Dana Penyerapan
                      </label>
                      <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-[20px] flex items-center justify-between shadow-inner focus-within:border-blue-500 transition-all duration-300">
                        <span className="font-heading font-black text-slate-400 text-lg">Rp</span>
                        <input
                          type="number"
                          value={investAmount}
                          onChange={(e) => setInvestAmount(Number(e.target.value))}
                          className="bg-transparent border-none outline-none text-right font-heading font-black text-slate-900 text-xl w-full"
                        />
                      </div>
                      
                      {/* Presets Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {[1000000, 5000000, 10000000].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setInvestAmount(preset)}
                            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-black uppercase rounded-xl transition text-slate-600 border border-slate-200/50 cursor-pointer"
                          >
                            Rp {(preset / 1000000).toFixed(0)} Jt
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calculations Table Card */}
                    <div className="bg-slate-50 p-4.5 rounded-[22px] border border-slate-200/50 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>Bagi Hasil (ROI)</span>
                        <span className="text-emerald-500 font-extrabold">{selectedProyek.roi}% / Tahun</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>Durasi Tenor</span>
                        <span className="text-slate-900 font-extrabold">{selectedProyek.tenor}</span>
                      </div>
                      <div className="border-t border-slate-250 pt-3 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Estimasi Dividen</span>
                        <span className="font-heading font-black text-blue-600 text-lg">
                          Rp {calculatedDividend.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleInvestSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 text-white py-4.5 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg hover:bg-emerald-600 transition duration-300 flex justify-center items-center gap-2 cursor-pointer border border-slate-950 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                    <div className="w-16 h-16 bg-emerald-55 text-emerald-600 border border-emerald-100 rounded-[20px] flex items-center justify-center shadow-lg">
                      <Gift className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-heading font-black text-slate-900 leading-none">
                        Pengajuan Sukses!
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Modal Senilai Rp {investAmount.toLocaleString("id-ID")} Disubmit
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
                      Terima kasih atas partisipasi Anda! Sistem kami akan menyiapkan berkas lembar penawaran modal digital ke email Anda dalam 5 menit.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="px-8 py-3.5 bg-slate-950 text-white rounded-full font-black uppercase text-xs cursor-pointer hover:bg-slate-800 transition"
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
