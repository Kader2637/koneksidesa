"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tractor, Trees, Store, Users, ArrowRight, ArrowUpRight, 
  BookOpen, Leaf, Wallet, Sparkles, TrendingUp, Check, 
  X, MapPin, Activity, HelpCircle, ArrowRightLeft, Star
} from "lucide-react";

// Import Custom Modular Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import Counter from "@/components/ui/Counter";
import FAQAccordion from "@/components/ui/FAQAccordion";
import MapRadar from "@/components/ui/MapRadar";

interface InvestCampaign {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  umkm: string;
  skor: string;
  target: string;
  targetVal: number;
  tenor: string;
  roi: number;
  prog: number;
  color: string;
  badgeColor: string;
}

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    timeout = setTimeout(() => {
      let i = 0;
      setDisplayedText("");
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, 70);
      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="relative">
      {displayedText}
      <motion.span 
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="absolute -right-3 top-[10%] h-[80%] w-[4px] sm:w-[6px] bg-emerald-500 rounded-full"
      />
    </span>
  );
};

export default function Home() {
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [activeTab, setActiveTab] = useState("pembeli");
  const [currentTxIndex, setCurrentTxIndex] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState<InvestCampaign | null>(null);
  const [investAmount, setInvestAmount] = useState("1000000");
  const [investSuccess, setInvestSuccess] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const categories = ["Semua", "Minuman", "Kriya", "Dekorasi", "Konsumsi"];

  const previewCatalog = [
    { 
      id: 1, 
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80", 
      cat: "Minuman", 
      name: "Roast Beans Robusta", 
      desa: "Desa Agro Rejo" 
    },
    { 
      id: 2, 
      img: "https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80", 
      cat: "Kriya", 
      name: "Tas Anyam Pandan Liar", 
      desa: "Desa Karya Maju" 
    },
    { 
      id: 3, 
      img: "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&q=80", 
      cat: "Dekorasi", 
      name: "Keramik Pola Klasik", 
      desa: "Desa Sentra Kriya" 
    },
    { 
      id: 4, 
      img: "https://images.unsplash.com/photo-1549429402-99933e1ebfc6?w=600&q=80", 
      cat: "Konsumsi", 
      name: "Madu Fajar Asli Hutan", 
      desa: "Desa Tani Sari" 
    },
    { 
      id: 5, 
      img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80", 
      cat: "Minuman", 
      name: "Teh Hijau Oolong Organik", 
      desa: "Desa Kebun Asri" 
    },
    { 
      id: 6, 
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80", 
      cat: "Kriya", 
      name: "Ukiran Kayu Jati Dinding", 
      desa: "Desa Jepara Mulya" 
    },
    { 
      id: 7, 
      img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80", 
      cat: "Konsumsi", 
      name: "Gula Semut Aren Asli", 
      desa: "Desa Aren Sari" 
    },
    { 
      id: 8, 
      img: "https://images.unsplash.com/photo-1526434426615-1abe81efcb0b?w=600&q=80", 
      cat: "Dekorasi", 
      name: "Lentera Kap Bambu Hangat", 
      desa: "Desa Bambu Lestari" 
    }
  ];

  const previewInvest: InvestCampaign[] = [
    { 
      id: 1, 
      icon: Tractor, 
      title: "Renovasi Siklus Penggilingan", 
      umkm: "Kelompok Tani Padi Biru Bersama", 
      skor: "A+", 
      target: "Rp 50 Juta", 
      targetVal: 50000000,
      tenor: "12 Bulan", 
      roi: 15,
      prog: 85,
      color: "from-emerald-500 to-teal-500",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    { 
      id: 2, 
      icon: Trees, 
      title: "Pembebasan Lahan Bambu", 
      umkm: "Koperasi Kriya Alam Nusantara", 
      skor: "B+", 
      target: "Rp 25 Juta", 
      targetVal: 25000000,
      tenor: "6 Bulan", 
      roi: 11,
      prog: 42,
      color: "from-blue-500 to-indigo-500",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    },
    { 
      id: 3, 
      icon: Store, 
      title: "Peralatan Kilang Kopi Temanggung", 
      umkm: "Toko Kopi Rejo Lestari Mandiri", 
      skor: "A", 
      target: "Rp 40 Juta", 
      targetVal: 40000000,
      tenor: "18 Bulan", 
      roi: 14,
      prog: 68,
      color: "from-amber-500 to-orange-500",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    }
  ];

  const liveTransactions = [
    { name: "Andi S.", action: "Membeli Tas Anyam Pandan", value: "Rp 185.000", location: "Jawa Barat", time: "Baru saja" },
    { name: "Farhan H.", action: "Investasi Siklus Penggilingan", value: "Rp 5.000.000", location: "DKI Jakarta", time: "2 menit lalu" },
    { name: "Siti Rahma", action: "Membeli Madu Fajar Asli", value: "Rp 95.000", location: "Jawa Timur", time: "5 menit lalu" },
    { name: "Budi Santoso", action: "Membeli Keramik Klasik", value: "Rp 320.000", location: "Banten", time: "8 menit lalu" },
    { name: "Dewi Lestari", action: "Investasi Lahan Bambu", value: "Rp 2.000.000", location: "Bali", time: "12 menit lalu" }
  ];

  const testimonials = [
    {
      quote: "KoneksiDesa telah memotong rantai tengkulak yang menekan harga jual kerajinan anyaman kami. Sekarang omzet kami naik tiga kali lipat dengan pasar nasional!",
      author: "Ibu Kartini",
      role: "Ketua Koperasi Kerajinan Anyaman",
      desa: "Desa Karya Maju, Magelang",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
    },
    {
      quote: "Saya sangat terbantu dengan transparansi analisis AI Credit Scoring di dashboard Investor. Dividen terkirim otomatis tepat waktu setiap bulannya.",
      author: "Hendra Wijaya",
      role: "Investor Ritel & Pengusaha",
      desa: "Tangerang Selatan, Banten",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
    },
    {
      quote: "Pengenalan Sistem Kontrol Toko (SKT) berbasis mobile memudahkan seluruh petani padi kami melacak pesanan dan memantau stok beras secara real-time.",
      author: "Pak Kades Mulyono",
      role: "Kepala Desa & Penasihat BUMDes",
      desa: "Desa Agro Rejo, Pekalongan",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80"
    }
  ];

  const previewFAQ = [
    { 
      q: "Apakah pendaftaran UMKM dipungut biaya langganan bulanan?", 
      a: "Sama sekali tidak ada biaya bulanan. Pendaftaran, penggunaan Sistem Kontrol Toko (SKT), dan promosi semuanya gratis. KoneksiDesa hanya memotong persentase administrasi transparan sebesar 2% per transaksi selesai." 
    },
    { 
      q: "Siapa penjamin risiko ketika saya menanamkan modal investasi?", 
      a: "KoneksiDesa memfasilitasi algoritma AI yang terintegrasi untuk menyaring data cash-flow riil setiap UMKM guna menghasilkan Credit Scoring yang akurat. Kami juga menyertakan dana jaminan perlindungan modal bersama yang bersumber dari pooling dividen cadangan." 
    },
    { 
      q: "Kenapa harga grosir katalog UMKM tidak ditampilkan secara publik?", 
      a: "Hal ini untuk menjaga kelangsungan bisnis UMKM serta menghormati kesepakatan harga dengan distributor lokal. Harga detail, grosir, dan opsi checkout baru akan terbuka setelah Anda mendaftar sebagai Pembeli terverifikasi." 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTxIndex((prev) => (prev + 1) % liveTransactions.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const filteredCatalog = selectedCat === "Semua" 
    ? previewCatalog 
    : previewCatalog.filter(item => item.cat === selectedCat);

  const activeTx = liveTransactions[currentTxIndex];

  const calculatedEarnings = (parseFloat(investAmount) * ((selectedCampaign?.roi || 0) / 100)).toFixed(0);

  const simulateInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(parseFloat(investAmount)) || parseFloat(investAmount) <= 0) return;
    setInvestSuccess(true);
    setTimeout(() => {
      setInvestSuccess(false);
      setSelectedCampaign(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900 dark:selection:bg-emerald-900/60 dark:selection:text-emerald-200 overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <Navbar />

      <main className="flex-1 w-full pt-[73px]">
        
        {/* 2. HERO SECTION WITH DEEP GLASSMORPHISM & ANIMATED GRADIENT */}
        <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-slate-50 dark:bg-zinc-950 border-b border-slate-200/60 dark:border-zinc-900">
          {/* Glowing animated ambient circles */}
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "10s" }} />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "14s" }} />
          
          {/* Tech Grid Pattern */}
          <div className="absolute inset-0 grid-bg opacity-35 dark:grid-bg-dark dark:opacity-25 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side text column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              {/* Version Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4.5 py-2 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Leaf className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: "12s" }} />
                <span>Koneksi Baru Hub Finansial Pedesaan</span>
              </motion.div>

              {/* Main Heading Text */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]"
              >
                Desa Mandiri.<br />
                <span className="text-emerald-600 dark:text-emerald-400 relative inline-block pr-4">
                  <TypewriterText text="Ekonomi Berputar." delay={600} />
                </span>
              </motion.h1>

              {/* Description Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold max-w-2xl"
              >
                KoneksiDesa mempertemukan pembeli ritel nasional, pemodal ventura modern, dan pengrajin UMKM pedesaan dalam jaringan sirkular cerdas dengan akurasi scoring finansial berbasis AI.
              </motion.p>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link 
                  href="/katalog" 
                  className="bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 px-9 py-4.5 rounded-full text-xs font-black uppercase tracking-wider transition shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2 border border-slate-950 dark:border-white cursor-pointer"
                >
                  Belanja Produk Desa 
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
                <Link 
                  href="/investasi" 
                  className="bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-white border border-slate-200 dark:border-zinc-800/80 px-9 py-4.5 rounded-full text-xs font-black uppercase tracking-wider transition shadow-sm hover:-translate-y-0.5 flex justify-center items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Mulai Pendanaan
                </Link>
              </motion.div>
            </div>

            {/* Right side Ultra-Modern Floating Stack */}
            <div className="lg:col-span-5 relative z-10 w-full mt-12 lg:mt-0 h-[450px] lg:h-[550px] flex items-center justify-center">
              
              {/* Massive background glow */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

              {/* Main Image Base */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="w-full max-w-[280px] sm:max-w-sm lg:max-w-md h-[380px] lg:h-[450px] rounded-[3rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] relative z-10 cursor-pointer border border-white/20 dark:border-white/10"
              >
                <Image src="/madu.png" alt="Madu Desa" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent flex items-end p-6 lg:p-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold mb-3 border border-white/20">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Premium Product
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black text-white drop-shadow-md tracking-tight">Madu Fajar Asli</h3>
                    <p className="text-xs lg:text-sm text-white/80 font-semibold mt-1">Desa Tani Sari, Nusantara</p>
                  </div>
                </div>
              </motion.div>

              {/* Interactive Card 1: AI Credit Score (Floating Top Left) */}
              <motion.div 
                initial={{ opacity: 0, x: -50, y: 50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                className="absolute top-4 lg:top-12 left-0 lg:-left-12 z-20"
              >
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  className="w-[220px] lg:w-[240px] bg-white/20 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 p-5 rounded-[2rem] shadow-2xl cursor-pointer"
                >
                   <div className="flex items-center gap-2 mb-3">
                     <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                       <Sparkles className="w-4 h-4 text-emerald-400" />
                     </div>
                     <div>
                       <p className="text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">AI Verified</p>
                       <h4 className="font-bold text-slate-900 dark:text-white text-sm">Credit Score A+</h4>
                     </div>
                   </div>
                   <div className="h-1.5 w-full bg-slate-200/50 dark:bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: "0%" }}
                       animate={{ width: "99%" }}
                       transition={{ duration: 1.5, delay: 0.8 }}
                       className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" 
                     />
                   </div>
                </motion.div>
              </motion.div>

              {/* Interactive Card 2: Live Transaksi (Floating Bottom Right) */}
              <motion.div 
                initial={{ opacity: 0, x: 50, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                className="absolute bottom-4 lg:bottom-12 right-0 lg:-right-12 z-20"
              >
                <motion.div
                  animate={{ y: [8, -8, 8] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  className="w-[260px] lg:w-[280px] bg-white/20 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 p-4 rounded-[2rem] shadow-2xl cursor-pointer"
                >
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 relative flex-shrink-0 bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center p-2 border border-white/20">
                         <Image src="/favicon.png" alt="Transaction" fill className="object-contain p-2" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[9px] font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-0.5">Live Transaksi</p>
                         <AnimatePresence mode="wait">
                           <motion.div
                             key={currentTxIndex}
                             initial={{ opacity: 0, y: 5 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -5 }}
                             transition={{ duration: 0.3 }}
                           >
                             <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{activeTx.name}</h4>
                             <div className="flex justify-between items-center mt-0.5">
                               <span className="text-[10px] text-slate-600 dark:text-zinc-300 font-semibold truncate pr-2">{activeTx.action}</span>
                               <span className="text-emerald-600 dark:text-emerald-400 font-black text-[10px] whitespace-nowrap">{activeTx.value}</span>
                             </div>
                           </motion.div>
                         </AnimatePresence>
                       </div>
                   </div>
                </motion.div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* 3. GRID PILAR UTAMA (THE 4 INTERACTIVE ECOSYSTEM PILLARS) */}
        <section className="py-24 md:py-32 bg-white dark:bg-zinc-950 relative border-b border-slate-200/60 dark:border-zinc-900">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto px-6"
          >
            
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <span className="text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase text-xs block">
                Struktur Portal
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Empat Pilar Kolaborasi Ekosistem.
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base font-semibold max-w-xl mx-auto leading-relaxed">
                Pilih peran Anda dan akses rangkaian fitur digital khusus yang didesain untuk kenyamanan interaksi Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  id: "pembeli",
                  title: "Bazar Pembeli",
                  desc: "Belanja produk kerajinan tangan khas, kopi premium, madu hutan murni, langsung dari pengrajin.",
                  icon: Users,
                  color: "border-blue-500/20 hover:border-blue-500/60 text-blue-500",
                  bg: "bg-blue-500/5",
                  link: "/pembeli",
                  btnText: "Buka Bazar Belanja"
                },
                {
                  id: "umkm",
                  title: "Toko UMKM",
                  desc: "Urus stok jualan, kontrol pesanan digital secara otomatis, dan ajukan proposal investasi ke publik.",
                  icon: Store,
                  color: "border-emerald-500/20 hover:border-emerald-500/60 text-emerald-500",
                  bg: "bg-emerald-500/5",
                  link: "/umkm",
                  btnText: "Kelola Toko Saya"
                },
                {
                  id: "investor",
                  title: "Portal Investor",
                  desc: "Kembangkan aset finansial Anda dengan mendanai ekspansi alat tani atau bahan baku UMKM tervalidasi.",
                  icon: TrendingUp,
                  color: "border-amber-500/20 hover:border-amber-500/60 text-amber-500",
                  bg: "bg-amber-500/5",
                  link: "/investor",
                  btnText: "Mulai Investasi"
                },
                {
                  id: "admin",
                  title: "Admin Desa",
                  desc: "Monitor pertumbuhan ekonomi, pembagian dividen BUMDes, serta penyebaran klaster UMKM.",
                  icon: Leaf,
                  color: "border-purple-500/20 hover:border-purple-500/60 text-purple-500",
                  bg: "bg-purple-500/5",
                  link: "/admin",
                  btnText: "Dashboard Pengawas"
                }
              ].map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={pillar.id}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`p-8 rounded-[2.5rem] border ${pillar.color} bg-white dark:bg-zinc-900/30 flex flex-col justify-between h-[360px] shadow-sm relative group overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-500/5 dark:to-white/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div>
                      <div className={`w-14 h-14 rounded-2xl ${pillar.bg} flex items-center justify-center mb-6`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-white leading-tight mb-3">
                        {pillar.title}
                      </h3>
                      <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>

                    <Link 
                      href={pillar.link}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold py-3.5 px-4 rounded-xl text-[10px] uppercase tracking-wider text-center transition-colors duration-300 hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                    >
                      <span>{pillar.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

          </motion.div>
        </section>

        {/* 4. SHOWCASE CATALOG DENGAN INTERACTIVE FILTER ANIMATIONS */}
        <section className="py-24 md:py-32 bg-slate-50 dark:bg-zinc-950/20 relative border-b border-slate-200/60 dark:border-zinc-900">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto px-6"
          >
            
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl space-y-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase text-xs block">
                  Galeri Katalog
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  Katalog Unggulan Nusantara.
                </h2>
                <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base font-semibold leading-relaxed">
                  Pilih produk asli buatan tangan pengrajin pedesaan. Terjamin bebas tengkulak dan bersertifikat mutu platform.
                </p>
              </div>
              
              <Link 
                href="/katalog" 
                className="font-bold text-xs text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center gap-2 border-b-2 border-slate-950 dark:border-white pb-1 group cursor-pointer"
              >
                Semua Produk ({previewCatalog.length})
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2.5 mb-12">
              {categories.map((cat) => {
                const isActive = selectedCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 relative cursor-pointer border ${
                      isActive 
                        ? "bg-slate-950 border-slate-950 text-white dark:bg-white dark:border-white dark:text-zinc-950 shadow-md"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
                    }`}
                  >
                    <span>{cat}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeFilterIndicator"
                        className="absolute inset-0 bg-transparent rounded-full border-2 border-emerald-500 dark:border-emerald-400 pointer-events-none"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Grid of product cards with layout animation */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredCatalog.map((prod, index) => (
                  <motion.div
                    layout
                    key={prod.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard
                      id={prod.id}
                      img={prod.img}
                      cat={prod.cat}
                      name={prod.name}
                      desa={prod.desa}
                      delay={index * 0.05}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </section>

        {/* 5. SIRKULASI INVESTASI PINTAR DENGAN MOCK SIMULATOR MODAL */}
        <section className="py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900">
          <div className="absolute inset-0 grid-bg-dark opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-500/5 to-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto px-6 relative z-10"
          >
            
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl space-y-3">
                <span className="text-blue-400 font-black tracking-widest uppercase text-xs block">
                  Akselerasi Finansial
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-none">
                  Bantu Pendanaan, Dapatkan Dividen.
                </h2>
                <p className="text-slate-400 text-sm md:text-base font-semibold leading-relaxed">
                  Semua proyek disaring langsung lewat validasi laporan kas. Dapatkan imbal hasil bulanan berjangka secara transparan.
                </p>
              </div>
              
              <Link 
                href="/investasi" 
                className="font-bold text-xs text-white hover:text-blue-400 transition-all flex items-center gap-2 border-b-2 border-white pb-1 group cursor-pointer"
              >
                Portal Investor Utama
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Grid of premium investment cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {previewInvest.map((inv, index) => {
                const IconComponent = inv.icon;
                return (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="glass-card-dark p-8 rounded-[2.5rem] border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300 relative group flex flex-col justify-between h-[450px]"
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`w-14 h-14 bg-gradient-to-br ${inv.color} text-zinc-950 rounded-2xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xl font-heading font-black text-white leading-tight truncate">
                            {inv.title}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 truncate">
                            {inv.umkm}
                          </p>
                        </div>
                      </div>

                      {/* AI Credit Score Badge & ROI */}
                      <div className="flex items-center justify-between mb-6 bg-black/40 border border-zinc-800 p-4.5 rounded-2xl">
                        <div>
                          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">AI Risk Score</p>
                          <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-black border ${inv.badgeColor}`}>
                            {inv.skor} VERIFIED
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">Cita-Cita ROI</p>
                          <p className="font-heading font-black text-emerald-400 text-lg">+{inv.roi}% / Th</p>
                        </div>
                      </div>

                      {/* Middle specifications */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/20 border border-zinc-800/50 p-4 rounded-xl text-center">
                          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Target Dana</p>
                          <p className="font-heading font-black text-white text-sm">{inv.target}</p>
                        </div>
                        <div className="bg-black/20 border border-zinc-800/50 p-4 rounded-xl text-center">
                          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Tenor</p>
                          <p className="font-heading font-black text-slate-300 text-sm">{inv.tenor}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Progress Bar & Button */}
                    <div className="space-y-4 mt-auto">
                      <div className="relative pt-2 w-full">
                        <div className="flex justify-between items-center text-xs font-bold mb-2">
                          <span className="text-zinc-500">Persentase Terkumpul</span>
                          <span className="text-blue-400 text-sm font-heading">{inv.prog}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden border border-zinc-800">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${inv.prog}%` }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 45, damping: 12, delay: 0.15 }}
                            className={`h-full bg-gradient-to-r ${inv.color} rounded-full`}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedCampaign(inv)}
                        className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-black py-3 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>Pendanaan Kilat</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* 6. INTERACTIVE RADAR MAPPING SECTION */}
        <section className="py-24 md:py-32 bg-slate-50 dark:bg-zinc-950/10 relative overflow-hidden border-b border-slate-200/60 dark:border-zinc-900">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto px-6"
          >
            
            {/* Header Content */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase text-xs block">
                Navigasi Sentral
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Radar Logistik Transaksi Nasional.
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base font-semibold max-w-xl mx-auto leading-relaxed">
                Pemetaan rantai logistik dan pengiriman terintegrasi langsung dari sentra produksi desa menuju kota besar distributor ritel.
              </p>
            </div>
            
            {/* Massive Map Radar component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <MapRadar />
            </motion.div>
          </motion.div>
        </section>

        {/* 7. LIVE METRICS GROWING COUNTER */}
        <section className="py-24 bg-white dark:bg-zinc-950 relative border-b border-slate-200/60 dark:border-zinc-900">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto px-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 space-y-6"
              >
                <span className="text-slate-400 dark:text-zinc-500 font-black tracking-widest uppercase text-xs block">
                  Metrik Transparansi
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Tumbuh Bersama Secara Terbuka.
                </h2>
                <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base font-semibold leading-relaxed">
                  Seluruh dana yang mengalir, pertumbuhan UMKM, dan pembagian dividen terekam secara transparan dalam basis data publik yang tak dapat diretas.
                </p>
                
                <Link 
                  href="/statistik" 
                  className="font-bold text-xs text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-2 border-b-2 border-slate-950 dark:border-white pb-1 w-max group cursor-pointer"
                >
                  Analisis Statistik Detail
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Right Column Stats Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Modal Tersalurkan", val: 18.5, pref: "Rp ", suff: "M", dec: 1, icon: Wallet, color: "text-blue-500 bg-blue-500/10" },
                  { label: "UKM Tergabung", val: 850, suff: "+", dec: 0, icon: Store, color: "text-emerald-500 bg-emerald-500/10" },
                  { label: "Pelanggan Aktif", val: 24.2, suff: "K", dec: 1, icon: Users, color: "text-amber-500 bg-amber-500/10" },
                  { label: "Rata-Rata Dividen", val: 14.5, suff: "%", dec: 1, icon: Sparkles, color: "text-purple-500 bg-purple-500/10" }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="bg-slate-50 dark:bg-zinc-900/30 p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500 mb-2">
                        {stat.label}
                      </p>
                      <h4 className="text-4xl text-slate-900 dark:text-white font-heading font-black">
                        <Counter value={stat.val} prefix={stat.pref} suffix={stat.suff} decimals={stat.dec} />
                      </h4>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </motion.div>
        </section>

        {/* 8. TESTIMONIALS SLIDER SECTION */}
        <section className="py-24 md:py-32 bg-slate-50 dark:bg-zinc-950/20 relative overflow-hidden border-b border-slate-200/60 dark:border-zinc-900">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto px-6"
          >
            
            <div className="text-center mb-16 space-y-4">
              <span className="text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase text-xs block">
                Kisah Sukses
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Cerita dari Penjuru Pedesaan.
              </h2>
            </div>

            <div className="relative min-h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 p-8 md:p-12 rounded-[2.5rem] shadow-xl text-center md:text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                >
                  <div className="md:col-span-4 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-emerald-500 shadow-md relative mb-4">
                      <img 
                        src={testimonials[activeTestimonial].avatar} 
                        alt={testimonials[activeTestimonial].author}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h4 className="font-heading font-black text-slate-900 dark:text-white text-base">
                      {testimonials[activeTestimonial].author}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                      {testimonials[activeTestimonial].role}
                    </p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                      {testimonials[activeTestimonial].desa}
                    </span>
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    <div className="flex gap-1 justify-center md:justify-start">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-semibold italic">
                      "{testimonials[activeTestimonial].quote}"
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Testimonials Pagination Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeTestimonial === i 
                      ? "w-8 bg-emerald-500 dark:bg-emerald-400" 
                      : "w-2.5 bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

          </motion.div>
        </section>

        {/* 9. FAQ ACCORDION SECTION */}
        <section className="py-24 md:py-32 bg-white dark:bg-zinc-950 relative border-b border-slate-200/60 dark:border-zinc-900">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-6"
          >
            
            {/* Header Content */}
            <div className="text-center mb-20 space-y-4">
              <span className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-xs block">
                Info Ekosistem
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Masih Menyimpan Pertanyaan?
              </h2>
            </div>
            
            {/* FAQ Accordion list */}
            <FAQAccordion items={previewFAQ} />
            
            {/* Bottom Actions CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mt-16"
            >
              <Link 
                href="/faq" 
                className="inline-flex bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 hover:border-slate-400 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 px-8 py-4.5 rounded-full text-xs font-black uppercase tracking-wider transition shadow-sm items-center gap-2 cursor-pointer"
              >
                Baca Pusat Bantuan Lengkap
                <BookOpen className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* 10. ACTIVE REDIRECTION HERO CTA BANNER */}
        <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
          {/* Glowing blur effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 grid-bg-dark opacity-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-10"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-tight">
              Siap Memulai Langkah Anda di<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Ekosistem KoneksiDesa?
              </span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg font-semibold max-w-2xl mx-auto leading-relaxed">
              Daftar sekarang secara gratis baik sebagai pembeli, pengelola UMKM desa, atau investor pembuat dampak sosial.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/katalog"
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-4 rounded-full text-xs font-black uppercase tracking-wider transition hover:-translate-y-0.5 shadow-xl shadow-emerald-500/10 cursor-pointer"
              >
                Jelajahi Produk
              </Link>
              <Link
                href="/investasi"
                className="bg-transparent hover:bg-white/5 border border-white/20 hover:border-white text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-wider transition hover:-translate-y-0.5 cursor-pointer"
              >
                Mulai Danai UMKM
              </Link>
            </div>
          </motion.div>
        </section>

      </main>

      {/* 8. footer Section */}
      <Footer />

      {/* QUICK SIMULATED INVESTMENT DRAWER/MODAL */}
      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!investSuccess) setSelectedCampaign(null);
              }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl z-10 p-8 relative overflow-hidden border border-slate-200/50 dark:border-zinc-800 text-slate-800 dark:text-zinc-200"
            >
              {investSuccess ? (
                /* Success screen representation */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Check className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white">Investasi Berhasil!</h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-400 font-bold uppercase tracking-widest">Dana Anda Telah Disalurkan</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Terima kasih atas kontribusi Anda mendukung kemajuan kelompok usaha akar rumput. Dividen bagi hasil bulanan Anda akan terekam langsung di Dashboard.
                  </p>
                </motion.div>
              ) : (
                /* Interactive forms */
                <>
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition bg-slate-50 dark:bg-zinc-800 p-2.5 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="mb-6">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">Simulasi Investasi Cepat</span>
                    <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      {selectedCampaign.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold mt-0.5">{selectedCampaign.umkm}</p>
                  </div>

                  <form onSubmit={simulateInvestment} className="space-y-6">
                    {/* Amount Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                        Jumlah Nominal Investasi (Rupiah)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-xs font-black text-slate-400 dark:text-zinc-600">Rp</span>
                        <input
                          type="number"
                          value={investAmount}
                          onChange={(e) => setInvestAmount(e.target.value)}
                          placeholder="Masukkan nominal..."
                          min="100000"
                          className="w-full bg-slate-50 border border-slate-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-slate-400 dark:focus:border-zinc-700 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Simulation Calculation Grid */}
                    <div className="bg-slate-50 dark:bg-zinc-950 p-5 rounded-2xl border border-slate-200/50 dark:border-zinc-850 space-y-3.5 text-xs font-bold">
                      <div className="flex justify-between text-slate-400 dark:text-zinc-500">
                        <span>Skor Keamanan Kredit AI:</span>
                        <span className="text-emerald-500">{selectedCampaign.skor} Verified</span>
                      </div>
                      <div className="flex justify-between text-slate-400 dark:text-zinc-500">
                        <span>Tenor Investasi:</span>
                        <span className="text-slate-700 dark:text-slate-300">{selectedCampaign.tenor}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 dark:text-zinc-500">
                        <span>Estimasi Bagi Hasil (ROI):</span>
                        <span className="text-emerald-400">+{selectedCampaign.roi}% / Th</span>
                      </div>
                      <div className="border-t border-slate-200 dark:border-zinc-800 pt-3 flex justify-between text-sm">
                        <span className="text-slate-900 dark:text-white">Estimasi Hasil Dividen:</span>
                        <span className="text-emerald-500 font-heading font-black">
                          Rp {isNaN(parseFloat(investAmount)) ? 0 : parseFloat(calculatedEarnings).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
                    >
                      Konfirmasi Salurkan Dana
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
