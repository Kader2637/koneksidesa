"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import Image from "next/image";
import { usePembeli, Product } from "../layout";

export default function RekomendasiPage() {
  const { addToCart } = usePembeli();

  const aiRecommended: Product[] = [
    { id: 2, name: "Tas Anyam Pandan", price: 75000, desa: "Desa Karya Maju", img: "https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80", rating: 5.0, category: "Kerajinan" },
    { id: 4, name: "Madu Hutan Liar", price: 60000, desa: "Desa Tani Sari", img: "https://images.unsplash.com/photo-1549429402-99933e1ebfc6?w=600&q=80", rating: 4.9, category: "Konsumsi" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-500/10 text-blue-450 rounded-2xl border border-blue-500/20 text-blue-450">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-1">Rekomendasi AI</h1>
          <p className="text-slate-400 text-sm font-semibold">Algoritma AI menyeleksi produk lokal berdasarkan preferensi & nilai rating terbaik.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {aiRecommended.map((prod) => (
          <div key={prod.id} className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 flex flex-col md:flex-row gap-5 shadow-lg group">
            <div className="relative w-full md:w-36 h-36 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
              <Image src={prod.img} alt={prod.name} fill className="object-cover" />
            </div>
            <div className="flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black tracking-widest text-blue-450 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 block w-fit">AI Match 98%</span>
                <h3 className="font-heading font-black text-white text-lg leading-tight mt-1">{prod.name}</h3>
                <span className="text-xs text-slate-500 font-bold block">{prod.desa}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <span className="text-sm font-black text-emerald-400 font-heading">Rp {prod.price.toLocaleString("id-ID")}</span>
                <button
                  onClick={() => {
                    addToCart(prod);
                    alert(`Produk ${prod.name} berhasil ditambahkan ke keranjang!`);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-md"
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
