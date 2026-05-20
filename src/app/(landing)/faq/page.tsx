"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, MessageCircle, Headphones } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FAQItem {
  q: string;
  a: string;
  category: "pembeli" | "investor" | "umkm";
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", label: "Semua Topik" },
    { id: "pembeli", label: "Untuk Pembeli" },
    { id: "investor", label: "Untuk Investor" },
    { id: "umkm", label: "Untuk UMKM" },
  ];

  const faqs: FAQItem[] = [
    { 
      q: "Bagaimana keamanan sistem investasi di sini?", 
      a: "Sistem menggunakan <strong>AI Credit Score</strong> terenkripsi untuk menilai kemampuan bayar UMKM berdasarkan data transaksi riil (omset harian) langsung dari dompet digital platform ini, menurunkan risiko default secara drastis.",
      category: "investor"
    },
    { 
      q: "Bisakah saya mendaftar UMKM secara gratis?", 
      a: "Pendaftaran 100% gratis. Silakan masuk, buat akun sebagai <strong>Mitra UMKM</strong>, lalu lengkapi dokumen digital (KTP, NIB). Kami akan memverifikasi dalam kurun waktu max 2x24 jam.",
      category: "umkm"
    },
    { 
      q: "Bagaimana metode pengiriman produk katalog?", 
      a: "Dukungan sistem logistik regional dan kurir pihak ketiga telah terintegrasi sehingga estimasi resi pengiriman dapat dilacak persis secara otomatis dari <strong>Dashboard Pembeli</strong>.",
      category: "pembeli"
    },
    { 
      q: "Metode pembayaran apa saja yang disediakan?", 
      a: "Kami mendukung QRIS, Virtual Account (Mandiri, BCA, BNI, BRI), Kartu Kredit/Debit, hingga pembayaran cicilan bekerja sama dengan mitra pihak ketiga terpercaya.",
      category: "pembeli"
    },
    { 
      q: "Bagaimana skema pencairan dana hasil investasi?", 
      a: "Bagi hasil dan pengembalian pokok dibagikan ke Dompet Investor setiap bulannya. Anda bisa melakukan penarikan ke rekening bank setiap saat tanpa dikenakan biaya potongan jika ditarik ke bank nasional.",
      category: "investor"
    }
  ];

  // Perform searching and categorization filter
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchSearch =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCat = activeCategory === "all" || faq.category === activeCategory;

      return matchSearch && matchCat;
    });
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans antialiased text-slate-800 dark:text-zinc-200">
      <Navbar />

      {/* 1. Top Help Search Hero Section */}
      <section className="pt-36 pb-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Glow ambient background circles */}
        <div className="absolute inset-0 grid-bg-dark opacity-35 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md"
          >
            <MessageCircle className="w-4 h-4 text-blue-400" /> 
            Pusat Bantuan Cerdas
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-[1.2]"
          >
            Apa yang Bisa Kami<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-extrabold">
              Bantu Hari Ini?
            </span>
          </motion.h1>

          {/* Glowing scale search input bar widget */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300 max-w-xl mx-auto"
          >
            <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik kata kunci pertanyaan Anda di sini..."
              className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-slate-800 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-650"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Main Accordions Area (Negative Margin Overlap) */}
      <main className="flex-grow max-w-3xl mx-auto px-6 w-full relative z-20 -mt-10 pb-24 space-y-10">
        
        {/* Category Pill filter tags */}
        <div className="flex flex-wrap justify-center gap-3 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-4.5 rounded-[2rem] border border-slate-200/50 dark:border-zinc-800/80 shadow-md select-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(null); // Close accordions when changing categories
                }}
                className={`px-6 py-2.5 rounded-full text-xs font-black transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white shadow-md"
                    : "bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800/40"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Accordion Cards List */}
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 bg-white/80 dark:bg-zinc-900/20 border border-slate-200/50 dark:border-zinc-850 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800/50 text-slate-350 dark:text-zinc-650 rounded-xl flex items-center justify-center shadow-inner">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                  Jawaban Tidak Ditemukan
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
                  Coba ubah kata kunci pencarian Anda
                </p>
              </motion.div>
            ) : (
              filteredFaqs.map((fq, index) => {
                const isOpen = openIndex === index;
                return (
                  <motion.div
                    key={fq.q}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-zinc-800 overflow-hidden hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <button 
                      onClick={() => toggleAccordion(index)}
                      className="w-full text-left p-6 font-heading font-black text-slate-900 dark:text-white text-base md:text-lg flex justify-between items-center bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850/20 group cursor-pointer"
                    >
                      <span>{fq.q}</span>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen 
                            ? "bg-blue-600 dark:bg-blue-500 text-white rotate-180" 
                            : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div 
                            className="p-6 pt-0 text-slate-500 dark:text-zinc-400 text-xs md:text-sm font-semibold leading-relaxed border-t border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/30 mt-2"
                            dangerouslySetInnerHTML={{ __html: fq.a }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* Whatsapp customer support Card HUD */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-zinc-800 text-center space-y-4 shadow-xl"
        >
          <div className="space-y-1">
            <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white leading-none">
              Masih Belum Menemukan Jawaban?
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold leading-relaxed max-w-sm mx-auto">
              Tim Customer Service kami siaga 24 jam untuk melayani keluhan produk katalog atau pemantauan investasi Anda.
            </p>
          </div>
          
          <button 
            onClick={() => {
              window.open("https://wa.me/6281234567890", "_blank");
            }}
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black border-2 border-emerald-600 dark:border-emerald-500/50 px-8 py-3.5 rounded-full hover:bg-emerald-600 hover:text-white transition duration-300 cursor-pointer text-xs uppercase tracking-wider font-heading shadow-md"
          >
            <Headphones className="w-4 h-4" /> 
            Hubungi WhatsApp Helpdesk
          </button>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}
