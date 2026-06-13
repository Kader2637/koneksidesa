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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      <Navbar />

      {/* 1. Top Help Search Hero Section */}
      <section className="pt-36 pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 border-b border-slate-100 relative overflow-hidden">
        {/* Glow ambient background circles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-550/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-205 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest"
          >
            <MessageCircle className="w-4 h-4 text-blue-600" /> 
            Pusat Bantuan Cerdas
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-[1.2] text-slate-900"
          >
            Apa yang Bisa Kami<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 font-extrabold">
              Bantu Hari Ini?
            </span>
          </motion.h1>

          {/* glowing search input bar widget */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl shadow-slate-100/80 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300 max-w-xl mx-auto"
          >
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik kata kunci pertanyaan Anda di sini..."
              className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-slate-800 font-semibold placeholder:text-slate-400"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Main Accordions Area */}
      <main className="flex-grow max-w-3xl mx-auto px-6 w-full relative z-20 -mt-10 pb-24 space-y-10">
        
        {/* Category Pill filter tags */}
        <div className="flex flex-wrap justify-center gap-3 bg-white/80 backdrop-blur-xl p-4.5 rounded-[2rem] border border-slate-200/60 shadow-md shadow-slate-100/50 select-none">
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
                    ? "bg-slate-950 text-white border-slate-950 shadow-md"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
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
                className="text-center py-16 bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shadow-inner">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-black text-slate-900">
                  Jawaban Tidak Ditemukan
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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
                    className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <button 
                      onClick={() => toggleAccordion(index)}
                      className="w-full text-left p-6 font-heading font-black text-slate-900 text-base md:text-lg flex justify-between items-center bg-white hover:bg-slate-50/70 group cursor-pointer border-none outline-none"
                    >
                      <span>{fq.q}</span>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen 
                            ? "bg-blue-600 text-white rotate-180" 
                            : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
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
                            className="p-6 pt-0 text-slate-500 text-xs md:text-sm font-semibold leading-relaxed border-t border-slate-100 bg-slate-50/30 mt-2"
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
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 text-center space-y-4 shadow-xl shadow-slate-100"
        >
          <div className="space-y-1">
            <h3 className="text-xl font-heading font-black text-slate-900 leading-none">
              Masih Belum Menemukan Jawaban?
            </h3>
            <p className="text-slate-550 text-xs font-semibold leading-relaxed max-w-sm mx-auto">
              Tim Customer Service kami siaga 24 jam untuk melayani keluhan produk katalog atau pemantauan investasi Anda.
            </p>
          </div>
          
          <button 
            onClick={() => {
              window.open("https://wa.me/6281234567890", "_blank");
            }}
            className="inline-flex items-center gap-2 text-emerald-700 border-2 border-emerald-600 px-8 py-3.5 rounded-full hover:bg-emerald-600 hover:text-white transition duration-300 cursor-pointer text-xs uppercase tracking-wider font-heading shadow-md"
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
