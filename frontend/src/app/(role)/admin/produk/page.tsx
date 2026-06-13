"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Check, X, ShieldCheck } from "lucide-react";
import { exportToCSV, exportToPDF } from "../../../../utils/exportUtils";
import { toast } from "@/components/ui/Toast";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  rating: number;
  desa: string;
  status: "approved" | "pending" | "rejected";
}

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStatus = async (id: number, status: "approved" | "rejected") => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:8000/api/admin/products/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        toast.success(`Status produk berhasil diubah menjadi ${status === "approved" ? "Disetujui" : "Ditolak"}`);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:8000/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success("Produk berhasil dihapus!");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Kelola Produk UMKM</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau, setujui, tolak, atau hapus seluruh produk komoditas desa yang terdaftar.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-wrap gap-4">
          <h2 className="font-bold text-xs text-slate-450 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Database Produk
          </h2>
          <div className="flex gap-3 text-xs font-semibold">
            <button
              onClick={() => {
                const formatted = products.map(p => ({
                  ID: p.id,
                  Nama: p.name,
                  Harga: p.price,
                  Stok: p.stock,
                  Kategori: p.category,
                  Desa: p.desa,
                  Status: p.status
                }));
                exportToCSV(formatted, "koneksidesa_products_list.csv");
              }}
              className="text-xs text-emerald-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor CSV
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={() => {
                const headers = ["ID", "Nama Produk", "Harga", "Stok", "Desa", "Status"];
                const rows = products.map(p => [
                  p.id,
                  p.name,
                  `Rp ${p.price.toLocaleString("id-ID")}`,
                  p.stock,
                  p.desa,
                  p.status
                ]);
                exportToPDF("Laporan Database Produk Koneksi Desa", headers, rows, "laporan_produk");
              }}
              className="text-xs text-blue-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <Download className="w-3.5 h-3.5" /> Cetak PDF
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-450 font-bold">Memuat data produk...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200 border-dashed m-5">
              Belum ada data produk terdaftar
            </div>
          ) : (
            <table className="w-full text-xs font-bold text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-405 uppercase text-[9px] tracking-wider bg-slate-50/50">
                  <th className="py-3 px-5">Nama Produk</th>
                  <th className="py-3 px-5">Harga</th>
                  <th className="py-3 px-5">Stok</th>
                  <th className="py-3 px-5">Desa Asal</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Moderasi / Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img src={prod.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&q=80"} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                        <div>
                          <p className="font-heading font-black text-slate-900 leading-tight">{prod.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{prod.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-900 font-black">Rp {prod.price.toLocaleString("id-ID")}</td>
                    <td className="py-3.5 px-5 text-slate-500 font-semibold">{prod.stock} Pcs</td>
                    <td className="py-3.5 px-5 text-slate-500 font-semibold">{prod.desa}</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase border ${
                        prod.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : prod.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>{prod.status}</span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        {prod.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(prod.id, "approved")}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg cursor-pointer border border-emerald-100/50"
                              title="Setujui Produk"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(prod.id, "rejected")}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer border border-rose-100/50"
                              title="Tolak Produk"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg cursor-pointer border border-slate-200"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
}
