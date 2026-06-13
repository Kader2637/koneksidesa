"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Star, MapPin, PackageSearch, ArrowRight, 
  Leaf, ShieldAlert, X, Sparkles, Store, ShoppingBag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "@/components/ui/Image";

interface Product {
  id: number;
  img: string;
  desa: string;
  name: string;
  desc: string;
  kategori: string;
  rating: number;
  stockStatus: "ready" | "limited" | "seasonal";
  description?: string;
  seller?: {
    name: string;
    umkm?: {
      name: string;
      owner: string;
      address: string;
      description: string;
    }
  }
}

export default function Catalog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  
  // Selected product for public detail modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { name: "Semua", label: "Semua Produk" },
    { name: "Minuman", label: "Kopi & Minuman" },
    { name: "Kerajinan", label: "Kriya & Anyaman" },
    { name: "Konsumsi", label: "Pangan & Madu" },
    { name: "Dekorasi", label: "Dekorasi & Seni" },
  ];

  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchBazarProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/bazar-products");
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((prod: any) => ({
            id: prod.id,
            img: prod.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
            desa: prod.desa || "Desa Agro Rejo, Jateng",
            name: prod.name,
            desc: prod.description || "Produk unggulan desa dengan standar kualitas tinggi.",
            kategori: prod.category || "Semua",
            rating: Number(prod.rating || 5.0),
            stockStatus: prod.stock > 50 ? "ready" : (prod.stock > 0 ? "limited" : "seasonal"),
            description: prod.description,
            seller: prod.seller
          }));
          setDbProducts(mapped);
        }
      } catch (err) {
        console.error("Error fetching public products:", err);
      }
    };
    fetchBazarProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return dbProducts.filter((prod) => {
      const matchCat = activeCategory === "Semua" || prod.kategori === activeCategory;
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.desa.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRating = minRating === null || prod.rating >= minRating;
      
      return matchCat && matchSearch && matchRating;
    });
  }, [dbProducts, activeCategory, searchQuery, minRating]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/50 flex flex-col font-sans antialiased text-slate-800">
      <Navbar />

      {/* 1. Hero Header Section */}
      <section className="pt-40 pb-28 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 border-b border-slate-200/60 relative overflow-hidden">
        {/* Ambient glows and grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> 
            Kurasi Pilihan Premium
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-[1.12] text-slate-900"
          >
            Katalog Unggulan<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-650 to-teal-500">
              Nusantara Agro
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto font-semibold leading-relaxed"
          >
            Temukan kriya anyaman pengrajin asli, komoditas panen segar, hingga pangan lokal olahan dari klaster UMKM desa yang teruji standar mutu ekosistem BUMDesa.
          </motion.p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-6 w-full relative z-20 -mt-12 pb-24 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filter (Glass Card) */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-xl shadow-slate-100/60 border border-slate-200/80 sticky top-28 space-y-8"
          >
            {/* Category Filter Title */}
            <div>
              <h3 className="font-heading font-black text-slate-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
                <Filter className="w-4 h-4 text-emerald-600" /> 
                Kategori Produk
              </h3>
              
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border duration-200 cursor-pointer relative flex items-center justify-between ${
                        isSelected
                          ? "text-emerald-800 border-emerald-200 bg-emerald-50/50 font-extrabold shadow-sm"
                          : "text-slate-550 border-transparent hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {isSelected && (
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimum Rating Selector */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="font-heading font-black text-slate-900 mb-4 text-xs uppercase tracking-wider">
                Penilaian Produk
              </h3>
              <div className="space-y-3 font-semibold text-xs text-slate-600">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === null}
                    onChange={() => setMinRating(null)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="group-hover:text-slate-900 transition-colors">Semua Rating</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 4}
                    onChange={() => setMinRating(4)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-1 group-hover:text-slate-900 transition-colors">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Rating 4.0+
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 5}
                    onChange={() => setMinRating(5)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-1 group-hover:text-slate-900 transition-colors">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" /> Rating 5.0 Sempurna
                  </span>
                </label>
              </div>
            </div>

            {/* Informational Glass Notice */}
            <div className="p-4 bg-blue-50 border border-blue-100 text-blue-800 rounded-2xl text-xs font-semibold space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span className="font-extrabold uppercase text-[9px] tracking-wider">Akses Pembeli</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Harga grosir & pemesanan disembunyikan bagi publik. Silakan masuk sebagai <strong>Pembeli</strong> untuk melihat harga & berbelanja.
              </p>
            </div>
          </motion.div>
        </aside>

        {/* Right Products Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Top Search bar HUD */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-md shadow-slate-100/40">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Menampilkan <span className="text-slate-800 font-extrabold">{filteredProducts.length}</span> Komoditas Unggulan
            </p>
            
            {/* search input box */}
            <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-inner focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all duration-300 w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari komoditas atau nama desa..."
                className="bg-transparent border-none outline-none text-xs w-full text-slate-800 font-semibold placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Liquid Motion Product Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-full text-center py-20 bg-white border border-slate-200/85 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[320px] space-y-4"
                >
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shadow-inner border border-slate-200">
                    <PackageSearch className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-heading font-black text-slate-900">
                      Komoditas Tidak Ditemukan
                    </h3>
                    <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">
                      Ubah kata kunci pencarian atau filter Anda
                    </p>
                  </div>
                </motion.div>
              ) : (
                filteredProducts.map((prod, index) => (
                  <motion.div
                    key={prod.id}
                    layout
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: (index % 6) * 0.04 }}
                    onClick={() => setSelectedProduct(prod)}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-300 border border-slate-200/80 transition-all duration-300 group overflow-hidden flex flex-col h-full hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Image Box */}
                    <div className="relative h-48 bg-slate-50 overflow-hidden w-full">
                      <Image
                        src={prod.img}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
                        className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-50" />

                      {/* Stock Status Badge */}
                      <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-white/10 shadow-md">
                        {prod.stockStatus === "ready" && <span className="text-emerald-400">Stok Tersedia</span>}
                        {prod.stockStatus === "limited" && <span className="text-amber-400">Stok Terbatas</span>}
                        {prod.stockStatus === "seasonal" && <span className="text-blue-400">Musiman</span>}
                      </div>

                      {/* Village Location Badge */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase font-black shadow-md text-slate-700 flex items-center gap-1 border border-slate-200/60">
                        <MapPin className="w-3 h-3 text-emerald-600" /> 
                        <span>{prod.desa}</span>
                      </div>
                    </div>

                    {/* Description info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="font-heading font-black text-slate-900 text-base group-hover:text-emerald-655 transition-colors duration-300 leading-snug">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                          {prod.desc}
                        </p>
                      </div>

                      {/* Rating & category tag */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100/50 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {prod.kategori}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-heading font-black text-slate-800 text-xs">{prod.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* 3. Public Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 text-slate-850"
            >
              {/* Close trigger */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer border border-slate-200 z-20 shadow-sm transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-56 bg-slate-100">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200/80 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {selectedProduct.desa}
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] text-slate-600 font-extrabold uppercase">{selectedProduct.kategori}</span>
                    <span className="flex items-center gap-1 text-xs text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-amber-500" /> {selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <h3 className="font-heading font-black text-slate-950 text-xl leading-tight mt-2">{selectedProduct.name}</h3>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deskripsi Produk</h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">{selectedProduct.desc}</p>
                </div>

                {/* Seller Store Info */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Toko Asal</span>
                      <strong className="text-slate-800 text-xs mt-1 block">{selectedProduct.seller?.umkm?.name || selectedProduct.seller?.name || "UMKM Desa"}</strong>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest bg-white border border-slate-200/60 px-2 py-0.5 rounded">BUMDesa Mitra</span>
                </div>

                {/* Warning notice & login buttons */}
                <div className="bg-amber-50/80 border border-amber-100 p-4 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Harga & Pembelian Dikunci</span>
                  </div>
                  <p className="text-[11px] text-amber-700 font-semibold leading-relaxed">
                    Untuk melihat harga grosir desa dan melakukan pemesanan, Anda harus login sebagai <strong>Pembeli</strong> terlebih dahulu.
                  </p>
                  
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        navigate("/login");
                      }}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 py-2 rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer"
                    >
                      Masuk
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        navigate("/register");
                      }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wider transition cursor-pointer border border-indigo-600"
                    >
                      Daftar Pembeli
                    </button>
                  </div>
                </div>              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
