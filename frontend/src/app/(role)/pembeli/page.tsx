"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, ShoppingBag, ArrowRight, Eye, ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePembeli, Product } from "./layout";
import { toast } from "@/components/ui/Toast";

export default function PembeliDashboard() {
  const navigate = useNavigate();
  const { cart, addToCart, updateQty } = usePembeli();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Details Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // Fetch products
        const prodRes = await fetch("http://localhost:8000/api/bazar-products");
        if (prodRes.ok) {
          const data = await prodRes.json();
          const mapped = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            desa: item.desa || "Desa Mitra",
            img: item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
            rating: parseFloat(item.rating) || 5.0,
            category: item.category,
            description: item.description || "Komoditas lokal asli berkualitas tinggi."
          }));
          setProducts(mapped);
        }

        // Fetch orders
        if (token) {
          const ordRes = await fetch("http://localhost:8000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (ordRes.ok) {
            const data = await ordRes.json();
            setOrders(data);
          }
        }
      } catch (err) {
        console.error("Fetch dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute products
  const latestProducts = useMemo(() => {
    return [...products].sort((a, b) => b.id - a.id).slice(0, 3);
  }, [products]);

  const popularProducts = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [products]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 3);
  }, [orders]);

  // Aggregate Metrics for Statistics Row
  const totalSpend = useMemo(() => {
    return orders
      .filter(o => o.status === "Selesai" || o.status === "Diproses" || o.status === "Dikirim")
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === "Pending" || o.status === "Diproses" || o.status === "Dikirim").length;
  }, [orders]);

  const totalItemsInCart = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  // Handle Beli action (add and redirect)
  const handleBeli = async (prod: Product) => {
    const alreadyInCart = cart.some(item => item.id === prod.id);
    if (!alreadyInCart) {
      await addToCart(prod);
    }
    navigate("/pembeli/keranjang");
  };

  // Render product action buttons (Detail, Keranjang/-1+, Beli)
  const renderProductActions = (prod: Product) => {
    const cartItem = cart.find(item => item.id === prod.id);

    return (
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 w-full">
        <div className="flex items-center justify-between">
          <span className="text-base font-black text-emerald-600">Rp {prod.price.toLocaleString("id-ID")}</span>
          
          <button
            onClick={() => handleBeli(prod)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer shadow-sm shadow-indigo-500/10 border-none"
          >
            Beli
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {/* Detail Button */}
          <button
            onClick={() => setSelectedProduct(prod)}
            className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Detail
          </button>

          {/* Keranjang Button or - 1 + Selector */}
          {cartItem ? (
            <div className="flex-1 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg py-1.5 px-3 text-sm text-emerald-800">
              <button
                onClick={() => updateQty(prod.id, -1)}
                className="hover:bg-emerald-100 p-0.5 rounded cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 text-emerald-700" />
              </button>
              <span className="font-extrabold text-xs">{cartItem.qty}</span>
              <button
                onClick={() => updateQty(prod.id, 1)}
                className="hover:bg-emerald-100 p-0.5 rounded cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(prod)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-600 hover:border-emerald-700"
            >
              <ShoppingCart className="w-4 h-4" /> Keranjang
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Bazar Pembeli</h1>
          <p className="text-slate-500 text-sm font-semibold font-sans">Selamat datang di ritel komoditas desa, berbelanja langsung dari petani & pengrajin lokal.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-slate-400 font-bold">Memuat dasbor...</div>
      ) : (
        <>
          {/* Statistics metrics banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-32 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Belanjaan</span>
              <h3 className="text-2xl font-black text-slate-900">Rp {totalSpend.toLocaleString("id-ID")}</h3>
              <span className="text-xs text-emerald-700 font-bold uppercase bg-emerald-50 w-fit px-2.5 py-1 rounded-md border border-emerald-100">Sirkulasi Kas Sukses</span>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-32 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pesanan Sedang Dikirim</span>
              <h3 className="text-2xl font-black text-slate-900">{activeOrdersCount} Paket</h3>
              <span className="text-xs text-indigo-700 font-bold uppercase bg-indigo-50 w-fit px-2.5 py-1 rounded-md border border-indigo-100">Proses Logistik</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-32 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Keranjang Aktif</span>
              <h3 className="text-2xl font-black text-slate-900">{totalItemsInCart} Item</h3>
              <span className="text-xs text-amber-700 font-bold uppercase bg-amber-50 w-fit px-2.5 py-1 rounded-md border border-amber-100">Siap Checkout</span>
            </div>
          </div>

          {/* 1. Produk Terbaru */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Produk Terbaru Rilis</h3>
              <Link to="/pembeli/produk" className="text-sm text-indigo-600 font-extrabold hover:underline flex items-center gap-0.5">
                Lihat Semua Produk <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestProducts.length === 0 ? (
                <div className="col-span-full text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-white rounded-2xl border border-slate-200/80 border-dashed">
                  Belum ada produk rilis terbaru
                </div>
              ) : (
                latestProducts.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="relative h-44 bg-slate-100">
                      <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-white/95 border border-slate-200/80 px-3 py-1 rounded-full text-xs font-bold text-slate-600 flex items-center gap-1 shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {prod.desa}
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors duration-200">{prod.name}</h4>
                        <p className="text-xs text-slate-400 font-bold mt-1">{prod.category}</p>
                      </div>
                      
                      {renderProductActions(prod)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Produk Populer */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Produk Populer Terlaris</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularProducts.length === 0 ? (
                <div className="col-span-full text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-white rounded-2xl border border-slate-200/80 border-dashed">
                  Belum ada produk terpopuler
                </div>
              ) : (
                popularProducts.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="relative h-44 bg-slate-100">
                      <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-white/95 border border-slate-200/80 px-3 py-1 rounded-full text-xs font-bold text-slate-600 flex items-center gap-1 shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {prod.desa}
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors duration-200">{prod.name}</h4>
                          <p className="text-xs text-slate-400 font-bold mt-1">{prod.category}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" /> {prod.rating.toFixed(1)}
                        </span>
                      </div>
                      
                      {renderProductActions(prod)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. Riwayat Pembelian */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-slate-400" /> Riwayat Pembelian Terakhir
              </h3>
              <Link to="/pembeli/pesanan" className="text-sm text-indigo-600 font-extrabold hover:underline flex items-center gap-0.5">
                Lihat Semua Pesanan
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200/60 border-dashed">
                  Belum ada transaksi pembelian
                </div>
              ) : (
                recentOrders.map((ord) => (
                  <div key={ord.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">No. Transaksi: #{ord.id}</h4>
                      <span className="text-xs text-slate-400 font-bold mt-0.5 block">Produk: {ord.product} • Kuantitas: {ord.qty}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-600 block">Rp {ord.total.toLocaleString("id-ID")}</span>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded mt-1.5 inline-block ${
                        ord.status === "Selesai" || ord.status === "Diproses" || ord.status === "Dikirim"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>{ord.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Product Detail Modal Dialog */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10"
            >
              {/* Close trigger */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-200 text-slate-450 rounded-full cursor-pointer border border-slate-200 z-20 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-60 bg-slate-100">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200/80 px-3 py-1.5 rounded-full text-xs font-bold text-slate-650 flex items-center gap-1 shadow-sm">
                  <MapPin className="w-4 h-4 text-emerald-600" /> {selectedProduct.desa}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-lg leading-tight">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-450 mt-2">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-500 font-extrabold uppercase">{selectedProduct.category}</span>
                    <span className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /> {selectedProduct.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-450">Deskripsi Produk</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-slate-400 block tracking-wider">Harga Satuan</span>
                    <span className="text-xl font-black text-emerald-600">Rp {selectedProduct.price.toLocaleString("id-ID")}</span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      toast.success(`Produk ${selectedProduct.name} berhasil ditambahkan ke keranjang!`);
                      setSelectedProduct(null);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition cursor-pointer shadow-md shadow-indigo-500/10 uppercase tracking-wider font-heading border border-indigo-600 hover:border-indigo-750"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
