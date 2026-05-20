"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Scale, Target } from "lucide-react";
import { useUMKM } from "../layout";

export default function AiHargaPage() {
  const { products } = useUMKM();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const startAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      
      const prod = products.find(p => p.name === selectedProduct);
      const currentPrice = prod ? prod.price : 45000;
      const recommendationPrice = currentPrice + 5000;

      setAnalysisResult({
        currentPrice,
        recPrice: recommendationPrice,
        margin: "35%",
        demandIndex: "Tinggi",
        competitorsAvg: currentPrice - 2000,
        tip: `Permintaan pasar regional Jawa Tengah untuk produk ${selectedProduct} sedang meningkat. Kami menyarankan untuk melakukan penyesuaian harga optimal Rp ${recommendationPrice.toLocaleString("id-ID")} dengan margin keuntungan lebih sehat.`
      });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200/50 shadow-sm">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-1">AI Analisis Harga Optimal</h1>
          <p className="text-slate-500 text-sm font-semibold">Tentukan harga jual terbaik berdasarkan indeks kompetitor, inflasi bahan baku, dan permintaan pasar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Setup Calculator Panel */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-100/80 h-fit shadow-sm shadow-emerald-100/5 hover:shadow-md transition-all duration-300 space-y-6">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 pb-3 border-b border-slate-100">Pilih Produk</h3>
          <form onSubmit={startAnalysis} className="space-y-4 text-xs font-bold">
            <div className="space-y-2 flex flex-col">
              <label className="text-slate-500 tracking-wide">Daftar Inventori</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-extrabold cursor-pointer"
              >
                <option value="">-- Pilih Produk Anda --</option>
                {products.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isAnalyzing || !selectedProduct}
              className="w-full bg-emerald-600 hover:bg-emerald-550 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-[11px] shadow-md shadow-emerald-500/10"
            >
              <Brain className="w-4 h-4" /> {isAnalyzing ? "Menganalisis..." : "Hitung Harga Optimal"}
            </button>
          </form>
        </div>

        {/* Dynamic Analysis Result Output */}
        <div className="lg:col-span-2 min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* Analyzing state loader */}
            {isAnalyzing && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-emerald-100/80 flex flex-col justify-center items-center h-full space-y-4 shadow-sm"
              >
                <div className="relative w-12 h-12">
                  <div className="w-full h-full border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin" />
                </div>
                <h4 className="text-sm font-heading font-black text-slate-850">AI sedang mengomparasi data kompetitor...</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Memindai indeks pasar regional</p>
              </motion.div>
            )}

            {/* Empty State */}
            {!isAnalyzing && !analysisResult && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200/80 flex flex-col justify-center items-center h-full text-center py-20 shadow-sm shadow-slate-100/30"
              >
                <Target className="w-12 h-12 text-slate-300 mb-4" />
                <h4 className="text-base font-heading font-black text-slate-700">Asisten AI Siap Membantu</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 leading-relaxed max-w-[280px]">Pilih produk di panel sebelah kiri untuk memulai kalkulasi cerdas.</p>
              </motion.div>
            )}

            {/* Recommendation Result Panel */}
            {!isAnalyzing && analysisResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4.5 shadow-sm">
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex-shrink-0 shadow-sm">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Harga Pasar Saat Ini</span>
                      <strong className="text-base text-slate-800 font-black">Rp {analysisResult.currentPrice.toLocaleString("id-ID")}</strong>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-emerald-100/80 flex items-center gap-4.5 shadow-sm">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex-shrink-0 shadow-sm">
                      <Sparkles className="w-5 h-5 animate-bounce duration-[3000ms]" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Rekomendasi AI</span>
                      <strong className="text-base text-emerald-700 font-black">Rp {analysisResult.recPrice.toLocaleString("id-ID")}</strong>
                    </div>
                  </div>

                </div>

                {/* AI Advice Explanation text box */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-100/80 space-y-5 shadow-sm">
                  <h4 className="font-heading font-black text-xs text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">Saran Strategi Harga AI</h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {analysisResult.tip}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <span>Indeks Permintaan: <strong className="text-slate-850">{analysisResult.demandIndex}</strong></span>
                    <span>Proyeksi Margin: <strong className="text-emerald-600 bg-emerald-50 border border-emerald-250/20 px-2 py-0.5 rounded">{analysisResult.margin}</strong></span>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
