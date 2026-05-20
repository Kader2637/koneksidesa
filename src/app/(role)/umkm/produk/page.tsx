"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useUMKM } from "../layout";

export default function ProdukPage() {
  const { products, addProduct, deleteProduct } = useUMKM();

  // Form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Minuman");
  const [newProdImg] = useState("https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&q=80");

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice.trim() || !newProdStock.trim()) return;

    addProduct(
      newProdName,
      parseFloat(newProdPrice),
      parseInt(newProdStock),
      newProdCategory,
      newProdImg
    );

    setNewProdName("");
    setNewProdPrice("");
    setNewProdStock("");
    alert(`Produk ${newProdName} berhasil ditambahkan ke inventori toko Anda!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-2">Manajemen Produk Toko</h1>
        <p className="text-slate-500 text-sm font-semibold">Tambah produk baru, kelola kuantitas stok barang, dan atur harga jual.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form to add product */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-100/80 h-fit shadow-sm shadow-emerald-100/5 hover:shadow-md transition-all duration-300">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 mb-6 pb-3 border-b border-slate-100">Tambah Produk Baru</h3>
          <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs font-bold">
            <div className="space-y-2 flex flex-col">
              <label className="text-slate-500 tracking-wide">Nama Produk</label>
              <input
                type="text"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="Masukkan nama produk..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="text-slate-500 tracking-wide">Harga (Rupiah)</label>
                <input
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="Contoh: 45000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-semibold"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label className="text-slate-500 tracking-wide">Stok Barang</label>
                <input
                  type="number"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  placeholder="Contoh: 100"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-semibold"
                />
              </div>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-slate-500 tracking-wide">Kategori</label>
              <select
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 font-extrabold cursor-pointer"
              >
                <option>Minuman</option>
                <option>Kerajinan</option>
                <option>Konsumsi</option>
                <option>Dekorasi</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-[11px] shadow-md shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4" /> Tambah Produk
            </button>
          </form>
        </div>

        {/* Products list table */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Daftar Produk Aktif</h3>
          <div className="space-y-4">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white p-5 rounded-3xl border border-emerald-100/60 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-150">
                  <Image src={prod.img} alt={prod.name} fill className="object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-heading font-black text-slate-850 text-base truncate">{prod.name}</h3>
                  <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1">
                    <span>Kategori: <strong className="text-slate-600">{prod.category}</strong></span>
                    <span>Stok: <strong className="text-slate-600">{prod.stock} unit</strong></span>
                  </div>
                  <span className="text-sm font-black text-emerald-600 block mt-1.5">Rp {prod.price.toLocaleString("id-ID")}</span>
                </div>
                <button
                  onClick={() => deleteProduct(prod.id)}
                  className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer flex-shrink-0 border border-transparent hover:border-rose-100"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
