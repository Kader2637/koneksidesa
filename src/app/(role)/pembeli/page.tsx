"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Plus } from "lucide-react";
import Image from "next/image";
import { usePembeli, Product } from "./layout";

export default function PembeliDashboard() {
  const { addToCart } = usePembeli();

  const bazarProducts: Product[] = [
    { id: 1, name: "Kopi Robusta Asli", price: 45000, desa: "Desa Agro Rejo", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80", rating: 4.9, category: "Minuman" },
    { id: 2, name: "Tas Anyam Pandan", price: 75000, desa: "Desa Karya Maju", img: "https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80", rating: 5.0, category: "Kerajinan" },
    { id: 3, name: "Keramik Hias Dekoratif", price: 125000, desa: "Desa Sentra Kriya", img: "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&q=80", rating: 4.8, category: "Dekorasi" },
    { id: 4, name: "Madu Hutan Liar", price: 60000, desa: "Desa Tani Sari", img: "https://images.unsplash.com/photo-1549429402-99933e1ebfc6?w=600&q=80", rating: 4.9, category: "Konsumsi" },
    { id: 5, name: "Pajangan Kayu Jati", price: 180000, desa: "Desa Sentra Ukir", img: "https://images.unsplash.com/photo-1553532402-b2568ce4615a?w=600&q=80", rating: 4.7, category: "Dekorasi" },
    { id: 6, name: "Teh Hijau Daun Premium", price: 32000, desa: "Desa Agro Rejo", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80", rating: 4.8, category: "Minuman" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Bazar Desa</h1>
        <p className="text-slate-500 text-sm font-semibold">Beli produk kerajinan alam & pangan segar langsung dari produsen lokal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bazarProducts.map((prod) => (
          <div key={prod.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-350 transition-all duration-300">
            <div className="relative h-48 bg-slate-100">
              <Image 
                src={prod.img} 
                alt={prod.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-3 left-3 bg-white/95 border border-slate-200/80 px-3 py-1 rounded-full text-[9px] font-extrabold text-slate-655 flex items-center gap-1 shadow-sm">
                <MapPin className="w-3 h-3 text-emerald-600" /> {prod.desa}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors duration-250">{prod.name}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mt-2.5">
                  <span>{prod.category}</span>
                  <span className="flex items-center gap-1 text-amber-500 bg-amber-50 border border-amber-200/40 px-2 py-0.5 rounded-full"><Star className="w-3 h-3 fill-current" /> {prod.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-base font-black text-emerald-600">Rp {prod.price.toLocaleString("id-ID")}</span>
                <button
                  onClick={() => {
                    addToCart(prod);
                    alert(`Produk ${prod.name} berhasil ditambahkan ke keranjang!`);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-4.5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-indigo-500/10"
                >
                  <Plus className="w-3.5 h-3.5" /> Beli
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
