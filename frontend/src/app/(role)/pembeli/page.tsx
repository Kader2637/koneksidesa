"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, ShoppingBag, ArrowRight, Eye, 
  ShoppingCart, Plus, Minus, X, Tag, ClipboardList, 
  Layers, Package, Calendar, CreditCard, User, Info, Loader2 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePembeli, Product } from "./layout";
import { toast } from "@/components/ui/Toast";

export default function PembeliDashboard() {
  const navigate = useNavigate();
  const { cart, addToCart, updateQty, checkout } = usePembeli();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  // Details Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailedProduct, setDetailedProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);



  // Categories list computed dynamically from products
  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((prod) => {
      if (prod.category) {
        cats.add(prod.category);
      }
    });
    return ["Semua", ...Array.from(cats)];
  }, [products]);

  const fetchDashboardData = async () => {
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
          img: item.image || "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&q=80",
          rating: parseFloat(item.rating) || 5.0,
          category: item.category || "Umum",
          description: item.description || "Komoditas lokal asli berkualitas tinggi.",
          stock: item.stock ?? 10,
          seller_id: item.seller_id
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch details & reviews when a product is selected
  useEffect(() => {
    if (!selectedProduct) {
      setDetailedProduct(null);
      setReviews([]);
      return;
    }
    const fetchDetails = async () => {
      setLoadingDetails(true);
      setActiveGalleryIndex(0);
      try {
        const res = await fetch(`http://localhost:8000/api/bazar-products/${selectedProduct.id}`);
        if (res.ok) {
          const data = await res.json();
          setDetailedProduct(data);
        }
        const revRes = await fetch(`http://localhost:8000/api/products/${selectedProduct.id}/reviews`);
        if (revRes.ok) {
          const data = await revRes.json();
          setReviews(data);
        }
      } catch (e) {
        console.error("Error fetching detailed product info:", e);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [selectedProduct]);

  // Gallery images from database (single image)
  const galleryImages = useMemo(() => {
    if (!selectedProduct) return [];
    return [selectedProduct.img];
  }, [selectedProduct]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Semua") return products;
    return products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  const latestProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.id - a.id);
  }, [filteredProducts]);

  const popularProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [filteredProducts]);

  // Similar Products computed from same category
  const similarProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
      .slice(0, 4);
  }, [products, selectedProduct]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 3);
  }, [orders]);

  // Aggregate Metrics
  const totalSpend = useMemo(() => {
    return orders
      .filter(o => o.status === "Selesai" || o.status === "Diproses" || o.status === "Dikirim" || o.status === "success" || o.status === "completed")
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => ["Pending", "Diproses", "Dikirim", "pending", "processing", "shipped"].includes(o.status)).length;
  }, [orders]);

  const totalItemsInCart = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const handleBeli = async (prod: Product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Silakan login terlebih dahulu untuk melakukan pembelian.");
      navigate("/login");
      return;
    }

    try {
      // 1. Add to cart
      const resAdd = await fetch("http://localhost:8000/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ product_id: prod.id, quantity: 1 })
      });

      if (!resAdd.ok) {
        toast.error("Gagal menambahkan barang ke keranjang.");
        return;
      }

      // 2. Perform checkout immediately
      const result = await checkout("midtrans");
      if (result && result.order_id) {
        toast.success("Pesanan berhasil dibuat!");
        setSelectedProduct(null); // Close details modal
        
        // 3. Navigate to order details page, passing order details to auto-trigger Midtrans Snap
        navigate("/pembeli/pesanan", { 
          state: { 
            orderId: result.order_id, 
            snapToken: result.snap_token,
            rawId: result.raw_id,
            triggerPayment: true 
          } 
        });
      } else {
        toast.error("Gagal memproses checkout digital.");
      }
    } catch (err) {
      console.error("Quick buy error:", err);
      toast.error("Terjadi kesalahan saat memproses pembelian.");
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation(); // Prevent opening details modal
    addToCart(prod);
    toast.success(`${prod.name} dimasukkan ke keranjang belanja!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-16 text-slate-800 max-w-[1600px] mx-auto font-sans"
    >
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Bazar Mitra Desa</h1>
          <p className="text-slate-500 text-xs font-medium mt-1">
            Beli produk komoditas pertanian, olahan makanan, batik, dan kerajinan tangan langsung dari desa-desa Indonesia.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Memuat Katalog Bazar...</span>
        </div>
      ) : (
        <>
          {/* Marketplace Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Belanja</span>
                <h3 className="text-lg font-extrabold text-slate-900">Rp {totalSpend.toLocaleString("id-ID")}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-55 flex items-center justify-center text-emerald-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Transaksi Aktif</span>
                <h3 className="text-lg font-extrabold text-slate-900">{activeOrdersCount} Pesanan</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Keranjang Anda</span>
                <h3 className="text-lg font-extrabold text-slate-900">{totalItemsInCart} Barang</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Kategori Belanja
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer border shadow-sm ${
                    selectedCategory === cat
                      ? "bg-slate-900 border-slate-950 text-white"
                      : "bg-white hover:bg-slate-50 text-slate-650 border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Main Products Grid Section (6-Columns Professional Marketplace layout) */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" /> Katalog Semua Produk
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                Menampilkan {latestProducts.length} Produk
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {latestProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider bg-white rounded-xl border border-slate-200 border-dashed">
                  Belum ada produk rilis untuk kategori "{selectedCategory}"
                </div>
              ) : (
                latestProducts.map((prod) => {
                  const cartItem = cart.find(item => item.id === prod.id);
                  return (
                    <div 
                      key={prod.id} 
                      onClick={() => setSelectedProduct(prod)}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer relative"
                    >
                      {/* Square product Image */}
                      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                        <img 
                          src={prod.img} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" 
                        />
                        {/* Rating Floating Tag */}
                        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-bold text-white flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> 
                          {prod.rating.toFixed(1)}
                        </div>
                      </div>

                      {/* Product Content Details */}
                      <div className="p-3 flex-grow flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <span className="text-[8px] bg-slate-100 text-slate-500 font-bold uppercase px-1.5 py-0.5 rounded w-fit block">
                            {prod.category}
                          </span>
                          <h4 className="font-semibold text-slate-800 text-[11px] leading-relaxed line-clamp-2 h-8 group-hover:text-emerald-700 transition">
                            {prod.name}
                          </h4>
                        </div>
                        
                        <div className="space-y-1 pt-1.5 border-t border-slate-100">
                          {/* Price */}
                          <div className="text-[13px] font-extrabold text-slate-900">
                            Rp {prod.price.toLocaleString("id-ID")}
                          </div>
                          
                          {/* Origin Desa & Stock */}
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
                            <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                              <MapPin className="w-2.5 h-2.5 text-slate-450 flex-shrink-0" /> {prod.desa}
                            </span>
                            <span>Stok: {prod.stock}</span>
                          </div>
                        </div>
                      </div>

                      {/* Floating Add to Cart Button for instant purchase */}
                      <button
                        onClick={(e) => handleQuickAdd(e, prod)}
                        className="absolute bottom-11 right-3 bg-emerald-600 hover:bg-emerald-700 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md border-none transition transform hover:scale-105 active:scale-95"
                        title="Masukkan Keranjang"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* User Shop ledger */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-slate-450" /> Pembelian Terakhir Anda
              </h3>
            </div>

            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-450 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                  Belum ada transaksi pembelian terdaftar di akun Anda.
                </div>
              ) : (
                recentOrders.map((ord) => (
                  <div 
                    key={ord.id} 
                    className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-50/50 p-4 rounded-xl border border-slate-200 gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{ord.id}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{ord.date}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold mt-1 block">
                        Barang: {ord.product} {ord.qty > 1 && `dan ${ord.qty - 1} produk lainnya`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="sm:text-right">
                        <span className="text-xs font-bold text-slate-950 block">Rp {ord.total.toLocaleString("id-ID")}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded mt-1 inline-block border ${
                          ["Selesai", "success", "completed"].includes(ord.status)
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ["Batal", "failed", "cancelled"].includes(ord.status)
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>{ord.status}</span>
                      </div>
                      
                      <button
                        onClick={() => navigate("/pembeli/pesanan", { state: { orderId: ord.id } })}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase rounded-lg transition cursor-pointer"
                      >
                        Invoice
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer transition border-none z-10 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column: Gallery Images */}
              <div className="w-full md:w-1/2 p-5 flex flex-col gap-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner">
                  <img src={galleryImages[activeGalleryIndex]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 px-3 py-1 rounded-full text-[9px] font-black uppercase text-slate-655 flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-emerald-600" /> {selectedProduct.desa}
                  </div>
                </div>
                
                {/* Thumbnails grid */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-2.5">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border-2 transition ${
                          activeGalleryIndex === idx ? "border-emerald-500 scale-95" : "border-slate-200 hover:border-slate-350"
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Info and Reviews */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4 max-h-[500px] overflow-y-auto">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-heading font-black text-slate-900 text-base leading-snug">{selectedProduct.name}</h3>
                    <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-bold text-slate-450 mt-1.5">
                      <span className="bg-slate-100 text-slate-600 font-bold uppercase px-2.5 py-0.5 rounded">
                        {selectedProduct.category}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" /> {selectedProduct.rating.toFixed(1)}
                      </span>
                      <span className="text-slate-400">• Stok: {selectedProduct.stock} unit</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Merchant UMKM Desa</span>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold">
                      <User className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="text-slate-800 block leading-tight">
                          {detailedProduct?.seller?.umkm?.name || detailedProduct?.seller?.name || "Toko Mitra Desa"}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Pemilik: {detailedProduct?.seller?.umkm?.owner || "Pengusaha Desa"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Deskripsi Produk</span>
                    <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">{selectedProduct.description}</p>
                  </div>

                  {/* Reviews Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-150">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Review Pembeli ({reviews.length})</span>
                    {loadingDetails ? (
                      <span className="text-[10px] text-slate-400 font-semibold block">Memuat ulasan...</span>
                    ) : reviews.length === 0 ? (
                      <span className="text-[10px] text-slate-400 font-semibold italic block bg-slate-50 p-2 rounded-lg text-center">Belum ada ulasan untuk produk ini</span>
                    ) : (
                      <div className="space-y-2 max-h-24 overflow-y-auto pr-1">
                        {reviews.map((r, idx) => (
                          <div key={idx} className="bg-slate-50 p-2 border border-slate-150 rounded-xl text-[10px] font-bold text-slate-600 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-900 font-black">{r.user?.name || "Anonim"}</span>
                              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                <Star className="w-2.5 h-2.5 fill-current" /> {r.rating}
                              </span>
                            </div>
                            <p className="font-semibold leading-normal text-slate-500">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Similar Products */}
                  {similarProducts.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-150">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Produk Serupa</span>
                      <div className="grid grid-cols-4 gap-2">
                        {similarProducts.map((p) => (
                          <div 
                            key={p.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(p);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-1.5 cursor-pointer transition flex flex-col items-center text-center gap-1"
                          >
                            <img src={p.img} alt={p.name} className="w-8 h-8 object-cover rounded-md border border-slate-200" />
                            <span className="text-[8px] font-bold text-slate-800 line-clamp-1 leading-tight">{p.name}</span>
                            <span className="text-[8px] text-emerald-600 font-bold block">Rp {p.price.toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Harga Barang</span>
                    <span className="text-base font-extrabold text-emerald-600 leading-tight">Rp {selectedProduct.price.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        toast.success(`Barang ${selectedProduct.name} dimasukkan ke keranjang!`);
                        setSelectedProduct(null);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-[10px] transition cursor-pointer border-none shadow-sm uppercase tracking-wider"
                    >
                      + Keranjang
                    </button>
                    <button
                      onClick={() => {
                        handleBeli(selectedProduct);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-[10px] transition cursor-pointer border-none shadow-sm uppercase tracking-wider"
                    >
                      Beli
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </motion.div>
  );
}
