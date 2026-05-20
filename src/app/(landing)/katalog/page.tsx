"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Star, MapPin, PackageSearch, ArrowRight, Leaf, ShieldAlert } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

interface Product {
  id: number;
  img: string;
  desa: string;
  name: string;
  desc: string;
  kategori: string;
  rating: number;
  stockStatus: "ready" | "limited" | "seasonal";
}

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);

  const categories = [
    { name: "Semua", label: "Semua Produk" },
    { name: "Minuman", label: "Kopi & Minuman" },
    { name: "Kerajinan", label: "Kriya & Anyaman" },
    { name: "Konsumsi", label: "Pangan & Madu" },
    { name: "Dekorasi", label: "Dekorasi & Seni" },
  ];

  const products: Product[] = [
    { 
      id: 1, 
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80", 
      desa: "Desa Agro Rejo, Jateng", 
      name: "Kopi Robusta Asli", 
      desc: "Roasting tradisional dari biji kopi pilihan petani setempat yang memberikan aroma khas.", 
      kategori: "Minuman", 
      rating: 4.9,
      stockStatus: "ready"
    },
    { 
      id: 2, 
      img: "https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80", 
      desa: "Desa Karya Maju, Jabar", 
      name: "Tas Anyam Pandan", 
      desc: "Tenunan artisan lokal menggunakan 100% material organik dan ramah lingkungan.", 
      kategori: "Kerajinan", 
      rating: 5.0,
      stockStatus: "ready"
    },
    { 
      id: 3, 
      img: "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&q=80", 
      desa: "Desa Sentra Kriya, Jatim", 
      name: "Keramik Hias Dekoratif", 
      desc: "Dibakar menggunakan tungku klasik untuk hasil pola glasir yang unik setiap rincinya.", 
      kategori: "Dekorasi", 
      rating: 4.8,
      stockStatus: "seasonal"
    },
    { 
      id: 4, 
      img: "https://images.unsplash.com/photo-1549429402-99933e1ebfc6?w=600&q=80", 
      desa: "Desa Tani Sari, DIY", 
      name: "Madu Hutan Liar", 
      desc: "Dipanen langsung oleh komunitas pelestari lebah pedalaman hutan sekunder.", 
      kategori: "Konsumsi", 
      rating: 4.9,
      stockStatus: "limited"
    },
    { 
      id: 5, 
      img: "https://images.unsplash.com/photo-1553532402-b2568ce4615a?w=600&q=80", 
      desa: "Desa Sentra Ukir, Jateng", 
      name: "Pajangan Kayu Jati", 
      desc: "Ukiran tangan asli bernilai seni tinggi dari limbah kayu jati perhutani.", 
      kategori: "Dekorasi", 
      rating: 4.7,
      stockStatus: "seasonal"
    },
    { 
      id: 6, 
      img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80", 
      desa: "Desa Agro Rejo, Jateng", 
      name: "Teh Hijau Daun Premium", 
      desc: "Dipetik pada fajar hari dan disangrai untuk aroma dan khasiat relaksasi optimal.", 
      kategori: "Minuman", 
      rating: 4.8,
      stockStatus: "ready"
    },
    { 
      id: 7, 
      img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80", 
      desa: "Desa Karya Maju, Jabar", 
      name: "Piring Anyam Bambu Set", 
      desc: "Dianyam halus pengerajin untuk gaya modern alami meja makan Anda.", 
      kategori: "Kerajinan", 
      rating: 5.0,
      stockStatus: "ready"
    },
    { 
      id: 8, 
      img: "https://images.unsplash.com/photo-1621379766946-8dd33e6ce7ce?w=600&q=80", 
      desa: "Desa Cita Rasa, Banten", 
      name: "Kripik Singkong Balado", 
      desc: "Camilan favorit diproduksi skala rumahan dengan singkong renyah & rempah pedas manis otentik.", 
      kategori: "Konsumsi", 
      rating: 4.6,
      stockStatus: "ready"
    }
  ];

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat = activeCategory === "Semua" || prod.kategori === activeCategory;
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.desa.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRating = minRating === null || prod.rating >= minRating;
      
      return matchCat && matchSearch && matchRating;
    });
  }, [activeCategory, searchQuery, minRating]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans antialiased text-slate-800 dark:text-zinc-200">
      <Navbar />

      {/* 1. Hero Header Section */}
      <section className="pt-36 pb-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Ambient glows and high-tech grid */}
        <div className="absolute inset-0 grid-bg-dark opacity-35 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md"
          >
            <Leaf className="w-4 h-4 text-emerald-400 animate-spin-slow" /> 
            Kurasi Pilihan Premium
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-[1.15]"
          >
            Katalog Unggulan<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Nusantara Agro
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-semibold leading-relaxed"
          >
            Telusuri ratusan kriya pengrajin asli, komoditas segar, hingga pangan kemasan lokal yang sudah teruji standar mutu ekosistem.
          </motion.p>
        </div>
      </section>

      {/* 2. Main Content Grid (Negative Margin Overlap) */}
      <main className="flex-grow max-w-7xl mx-auto px-6 w-full relative z-20 -mt-10 pb-24 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filter (Glass Card) */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-xl border border-slate-200/50 dark:border-zinc-800/80 sticky top-28 space-y-8"
          >
            {/* Category Filter Title */}
            <div>
              <h3 className="font-heading font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 
                Filter Kategori
              </h3>
              
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black transition-all border duration-300 cursor-pointer relative flex items-center justify-between ${
                        isSelected
                          ? "text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20"
                          : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40 border-transparent"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {isSelected && (
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimum Rating Selector */}
            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/60">
              <h3 className="font-heading font-black text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                Penilaian Bintang
              </h3>
              <div className="space-y-3 font-semibold text-xs text-slate-600 dark:text-zinc-400">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === null}
                    onChange={() => setMinRating(null)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Semua Rating</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 4}
                    onChange={() => setMinRating(4)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Rating 4.0+
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 5}
                    onChange={() => setMinRating(5)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" /> Rating 5.0 Sempurna
                  </span>
                </label>
              </div>
            </div>

            {/* Informational Glass Notice */}
            <div className="p-4.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-[20px] border border-blue-100/50 dark:border-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-500" />
                <span className="font-extrabold uppercase text-[9px] tracking-wider">Akses Khusus</span>
              </div>
              <p className="leading-relaxed">
                Harga disembunyikan bagi publik. Silakan masuk sebagai <strong>Pembeli</strong> untuk memesan & melihat harga grosir desa.
              </p>
            </div>
          </motion.div>
        </aside>

        {/* Right Products Area */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Top Search bar HUD */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/60 dark:bg-zinc-900/40 backdrop-blur px-6 py-4.5 rounded-[2rem] border border-slate-200/50 dark:border-zinc-800/80 shadow-md">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
              Menemukan <span className="text-slate-900 dark:text-white font-extrabold">{filteredProducts.length}</span> Komoditas
            </p>
            
            {/* Glowing input box */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 px-4 py-2.5 rounded-full flex items-center gap-2 shadow-inner focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-300 w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari komoditas atau nama desa..."
                className="bg-transparent border-none outline-none text-xs w-full text-slate-800 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Liquid Motion Product Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-full text-center py-20 bg-white/80 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-850 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center min-h-[320px] space-y-4"
                >
                  <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800/50 text-slate-350 dark:text-zinc-650 rounded-[20px] flex items-center justify-center shadow-inner">
                    <PackageSearch className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white">
                      Komoditas Kosong
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      Ubah kata kunci pencarian atau filter Anda
                    </p>
                  </div>
                </motion.div>
              ) : (
                filteredProducts.map((prod, index) => (
                  <motion.div
                    key={prod.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                    className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-slate-200/50 dark:border-zinc-800 flex flex-col h-full hover:-translate-y-1.5"
                  >
                    {/* Glowing Image Box */}
                    <div className="relative h-56 bg-slate-100 dark:bg-zinc-800 overflow-hidden w-full">
                      <Image
                        src={prod.img}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />

                      {/* Stock Status Badge */}
                      <div className="absolute top-4 right-4 bg-slate-950/80 dark:bg-zinc-950/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-white/10 shadow-md">
                        {prod.stockStatus === "ready" && <span className="text-emerald-400">Stok Tersedia</span>}
                        {prod.stockStatus === "limited" && <span className="text-amber-400">Stok Terbatas</span>}
                        {prod.stockStatus === "seasonal" && <span className="text-blue-400">Produk Musiman</span>}
                      </div>

                      {/* Village Location Badge */}
                      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-zinc-950/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[9px] uppercase font-black shadow-md text-slate-800 dark:text-white flex items-center gap-1 border border-white/20">
                        <MapPin className="w-3 h-3 text-emerald-500" /> 
                        <span>{prod.desa}</span>
                      </div>
                    </div>

                    {/* Detailed description */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2 mb-6">
                        <h3 className="font-heading font-black text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed line-clamp-2">
                          {prod.desc}
                        </p>
                      </div>

                      {/* Rating details & category tag */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/80 pt-4">
                        <span className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">
                          {prod.kategori}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                          <span className="font-heading font-black text-slate-800 dark:text-white text-xs">{prod.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Load more button */}
          {filteredProducts.length > 0 && (
            <div className="mt-10 text-center">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-600 dark:text-zinc-300 font-black px-8 py-4 rounded-full transition shadow-sm border border-slate-200 dark:border-zinc-800 cursor-pointer text-xs uppercase tracking-wider font-heading"
              >
                Muat Lebih Banyak...
              </motion.button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
