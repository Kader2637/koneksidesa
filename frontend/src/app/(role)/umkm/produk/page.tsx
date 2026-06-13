"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, X, Sparkles, Image as ImageIcon } from "lucide-react";
import { useUMKM } from "../layout";
import { toast } from "@/components/ui/Toast";

export default function ProdukPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useUMKM();

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategory, setProdCategory] = useState("Minuman");
  const [prodImg, setProdImg] = useState("");

  // Quick select mock images
  const sampleImages = [
    { name: "Kopi", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" },
    { name: "Tas Anyam", url: "https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80" },
    { name: "Keramik Hias", url: "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&q=80" },
    { name: "Madu Hutan", url: "https://images.unsplash.com/photo-1549429402-99933e1ebfc6?w=600&q=80" }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8000/api/umkm/products/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProdImg(data.url);
        toast.success("Gambar berhasil diunggah!");
      } else {
        const err = await response.json();
        toast.error("Gagal mengunggah gambar: " + (err.message || "kesalahan tidak diketahui"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat mengunggah gambar.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice.trim() || !prodStock.trim()) {
      toast.warning("Harap isi semua kolom!");
      return;
    }

    const priceNum = parseFloat(prodPrice);
    const stockNum = parseInt(prodStock);
    const imgUrl = prodImg.trim() || sampleImages[0].url;

    if (isEditing && editingId !== null) {
      await updateProduct(editingId, prodName, priceNum, stockNum, prodCategory, imgUrl);
      toast.success(`Produk ${prodName} berhasil diperbarui!`);
      resetForm();
    } else {
      await addProduct(prodName, priceNum, stockNum, prodCategory, imgUrl);
      toast.success(`Produk ${prodName} berhasil ditambahkan!`);
      resetForm();
    }
  };

  const handleEditClick = (prod: any) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setProdName(prod.name);
    setProdPrice(prod.price.toString());
    setProdStock(prod.stock.toString());
    setProdCategory(prod.category);
    setProdImg(prod.img || "");
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setProdName("");
    setProdPrice("");
    setProdStock("");
    setProdCategory("Minuman");
    setProdImg("");
  };

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteProduct(deleteConfirm.id);
      toast.success(`Produk ${deleteConfirm.name} berhasil dihapus!`);
      setDeleteConfirm(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Manajemen Produk Toko</h1>
        <p className="text-slate-500 text-xs font-semibold font-sans">Tambah produk baru, kelola kuantitas stok barang, unggah gambar, dan edit informasi produk toko Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Column */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 h-fit shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400">
              {isEditing ? "Edit Produk Usaha" : "Tambah Produk Baru"}
            </h3>
            {isEditing && (
              <button 
                onClick={resetForm}
                className="text-xs font-black text-rose-500 hover:text-rose-650 flex items-center gap-1 uppercase tracking-wider cursor-pointer border-none bg-transparent"
              >
                <X className="w-3.5 h-3.5" /> Batal
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-2 flex flex-col">
              <label className="text-slate-500 tracking-wide text-xs">Nama Produk</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="Masukkan nama produk..."
                className="w-full bg-slate-50 border border-slate-250 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500 transition-all font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="text-slate-500 tracking-wide text-xs">Harga (Rupiah)</label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  placeholder="Contoh: 45000"
                  className="w-full bg-slate-50 border border-slate-255 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500 transition-all font-semibold"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label className="text-slate-500 tracking-wide text-xs">Stok Barang</label>
                <input
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  placeholder="Contoh: 100"
                  className="w-full bg-slate-50 border border-slate-255 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-slate-500 tracking-wide text-xs">Kategori</label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-255 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold cursor-pointer"
              >
                <option>Minuman</option>
                <option>Kerajinan</option>
                <option>Konsumsi</option>
                <option>Dekorasi</option>
              </select>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-slate-500 tracking-wide text-xs">Gambar Produk (Tautan / Unggah)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prodImg}
                  onChange={(e) => setProdImg(e.target.value)}
                  placeholder="https://tautan-gambar-produk.jpg..."
                  className="flex-grow bg-slate-50 border border-slate-255 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500 transition-all font-semibold"
                />
                <label className="bg-slate-100 hover:bg-slate-200 border border-slate-255 p-3 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5 text-slate-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Quick Image Selection */}
            <div className="space-y-2">
              <label className="text-slate-400 text-[10px] tracking-wide block uppercase font-bold">Pilih Cepat Contoh Gambar</label>
              <div className="flex gap-2 flex-wrap">
                {sampleImages.map((img) => (
                  <button
                    type="button"
                    key={img.name}
                    onClick={() => setProdImg(img.url)}
                    className={`px-3 py-1.5 rounded-full border text-[10px] uppercase font-bold tracking-wider transition cursor-pointer ${
                      prodImg === img.url 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300" 
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {img.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-xs shadow-md shadow-emerald-500/10 mt-4 border-none"
            >
              {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
              {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400">
              Daftar Produk Aktif ({products.length})
            </h3>
          </div>
          
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400 font-bold uppercase tracking-wider bg-white rounded-2xl border border-slate-200 border-dashed">
                Belum ada produk aktif terdaftar.
              </div>
            ) : (
              products.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-center gap-5 shadow-sm hover:shadow-md hover:border-emerald-100/60 transition-all duration-300 group"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-55 flex-shrink-0 border border-slate-200">
                    <img 
                      src={prod.img || "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&q=80"} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="font-heading font-black text-slate-900 text-base truncate leading-tight">{prod.name}</h3>
                    <div className="flex gap-4 text-xs font-semibold text-slate-400 mt-1">
                      <span>Kategori: <strong className="text-slate-650 font-bold">{prod.category}</strong></span>
                      <span>Stok: <strong className="text-slate-650 font-bold">{prod.stock} unit</strong></span>
                    </div>
                    <span className="text-sm font-black text-emerald-600 block mt-1.5">Rp {prod.price.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="p-2.5 text-slate-500 hover:text-indigo-650 hover:bg-indigo-50 rounded-xl transition cursor-pointer border border-transparent hover:border-indigo-100"
                      title="Edit Produk"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: prod.id, name: prod.name })}
                      className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-transparent hover:border-rose-100"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-800 max-w-sm w-full space-y-4 relative"
          >
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base">Konfirmasi Hapus Produk</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tindakan Tidak Dapat Dibatalkan</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin menghapus produk <strong className="text-slate-800">{deleteConfirm.name}</strong> secara permanen dari etalase toko Anda?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-rose-650 hover:bg-rose-700 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
