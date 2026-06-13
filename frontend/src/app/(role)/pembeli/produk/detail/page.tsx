"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Star, Plus, Minus, ShoppingCart,
  Store, ShieldCheck, Truck, Package, MessageSquare, ChevronRight
} from "lucide-react";
import { usePembeli, Product } from "../../layout";
import { toast } from "@/components/ui/Toast";

interface StoreDetail {
  id: number;
  name: string;
  owner: string;
  address: string;
  description: string;
  avatar: string;
}

export default function PembeliProdukDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, addToCart, updateQty, checkout } = usePembeli();

  const [product, setProduct] = useState<any | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<StoreDetail[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Local quantity for adding to cart
  const [quantity, setQuantity] = useState(1);

  // Check if product is already in cart
  const cartItem = useMemo(() => {
    if (!product) return null;
    return cart.find(item => item.id === product.id);
  }, [cart, product]);

  useEffect(() => {
    const fetchDetailData = async () => {
      setLoading(true);
      try {
        // Fetch single product detail
        const productRes = await fetch(`http://localhost:8000/api/bazar-products/${id}`);
        if (productRes.ok) {
          const prodData = await productRes.json();
          setProduct({
            id: prodData.id,
            name: prodData.name,
            price: Number(prodData.price),
            desa: prodData.desa || "Desa Mitra",
            img: prodData.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
            rating: parseFloat(prodData.rating) || 5.0,
            category: prodData.category,
            description: prodData.description || "Produk lokal unggulan desa yang diproduksi dengan kearifan lokal.",
            stock: prodData.stock || 0,
            seller: prodData.seller
          });
        }

        // Fetch other products for recommendations
        const productsRes = await fetch("http://localhost:8000/api/bazar-products");
        if (productsRes.ok) {
          const prodsData = await productsRes.json();
          const mapped = prodsData.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            desa: item.desa || "Desa Mitra",
            img: item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
            rating: parseFloat(item.rating) || 5.0,
            category: item.category
          }));
          // Filter out current product
          const filtered = mapped.filter((p: any) => String(p.id) !== id);
          setOtherProducts(filtered.slice(0, 4));
        }

        // Fetch other stores
        const storesRes = await fetch("http://localhost:8000/api/bazar-stores");
        if (storesRes.ok) {
          const storesData = await storesRes.json();
          setStores(storesData.filter((s: StoreDetail) => s.id !== product?.seller?.id));
        }

        // Fetch reviews
        const reviewsRes = await fetch(`http://localhost:8000/api/products/${id}/reviews?t=${Date.now()}`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }

      } catch (err) {
        console.error("Error fetching detail data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [id, product?.seller?.id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Add to cart multiple times based on local quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity}x ${product.name} berhasil ditambahkan ke keranjang!`);
    setQuantity(1);
  };

  const handleBuyNow = async () => {
    if (!product) return;
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
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      });

      if (!resAdd.ok) {
        toast.error("Gagal menambahkan barang ke keranjang.");
        return;
      }

      // 2. Perform checkout immediately
      const result = await checkout("midtrans");
      if (result && result.order_id) {
        toast.success("Pesanan berhasil dibuat!");
        
        // 3. Navigate straight to order details page with state parameters
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Memuat Detail Produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto space-y-4">
        <p className="text-sm text-slate-450 font-bold uppercase tracking-widest">Produk Tidak Ditemukan</p>
        <button
          onClick={() => navigate("/pembeli/produk")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition uppercase tracking-wider"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-16 text-slate-800"
    >
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate("/pembeli/produk")}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </button>
      </div>

      {/* Main product overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-5 bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm p-4">
          <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden">
            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-white/95 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-[10px] font-black text-slate-700 flex items-center gap-1 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {product.desa}
            </div>
          </div>
        </div>

        {/* Right: Product Details & Cart Widget */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="bg-slate-50 text-slate-650 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {product.rating.toFixed(1)}
                </span>
              </div>
              <h1 className="font-heading font-black text-slate-900 text-2xl md:text-3xl leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-black text-emerald-600 font-heading">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="border-t border-b border-slate-100 py-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Package className="w-4 h-4 text-slate-400" />
                <span>Stok tersedia: <strong className="text-slate-800">{product.stock} unit</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Truck className="w-4 h-4 text-slate-400" />
                <span>Pengiriman langsung dari <strong className="text-slate-800">{product.desa}</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Deskripsi Produk</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Cart Selector / Action Button */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {cartItem ? (
                /* Quantity adjustment if already in cart */
                <div className="flex-1 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900">
                  <span className="text-xs font-bold">Terdaftar di Keranjang</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(product.id, -1)}
                      className="bg-emerald-100 hover:bg-emerald-200 p-1.5 rounded-lg cursor-pointer border-none transition"
                    >
                      <Minus className="w-4 h-4 text-emerald-800" />
                    </button>
                    <span className="font-extrabold text-sm text-emerald-950">{cartItem.qty}</span>
                    <button
                      onClick={() => updateQty(product.id, 1)}
                      className="bg-emerald-100 hover:bg-emerald-200 p-1.5 rounded-lg cursor-pointer border-none transition"
                    >
                      <Plus className="w-4 h-4 text-emerald-800" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Multiplier Selector & Add to Cart if not in cart */
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
                  <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 gap-4">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer disabled:opacity-50 border-none bg-transparent"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-xs text-slate-800 w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer border-none bg-transparent"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-505 text-white font-extrabold py-3.5 px-6 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-emerald-600 tracking-wider uppercase"
                  >
                    <ShoppingCart className="w-4 h-4" /> Tambah Ke Keranjang
                  </button>
                </div>
              )}

              <button
                onClick={handleBuyNow}
                className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-6 rounded-xl text-xs transition cursor-pointer tracking-wider uppercase border border-indigo-650"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Origin Store Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Store className="w-4 h-4 text-indigo-600" /> Profil Toko Penjual
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-650 font-bold text-2xl flex-shrink-0 shadow-inner">
              {product.seller?.name ? product.seller.name.substring(0, 2).toUpperCase() : "TK"}
            </div>
            <div>
              <h4 className="font-heading font-black text-slate-900 text-lg leading-tight">
                {product.seller?.umkm?.name || product.seller?.name || "Toko Mitra Desa"}
              </h4>
              <p className="text-xs text-slate-400 font-bold mt-1">
                Pemilik: {product.seller?.umkm?.owner || product.seller?.name || "Sugeng Riyadi"}
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                📍 {product.seller?.umkm?.address || product.seller?.address || "Dusun Karya Maju"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              to="/pembeli/chat"
              className="flex-1 sm:flex-initial bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition text-center flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" /> Hubungi Penjual
            </Link>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {product.seller?.umkm?.description || "Toko Mitra UMKM ini menyuplai produk lokal unggulan kualitas teruji langsung dari desa binaan BUMDes."}
          </p>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Ulasan Produk ({reviews.length})
          </h3>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-semibold bg-slate-50/50 rounded-2xl border border-slate-200/50">
            Belum ada ulasan untuk produk ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Summary info card */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-200/60 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-heading font-black text-slate-900">{product.rating.toFixed(1)}</span>
              <div className="flex items-center gap-1 my-2 text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${
                      Math.round(product.rating) >= idx + 1 ? "fill-current" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Peringkat Kualitas</span>
            </div>

            {/* Reviews list ledger */}
            <div className="md:col-span-8 space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {reviews.map((rev) => {
                const userInitials = rev.user?.name
                  ? rev.user.name.split(" ").map((n: string) => n.charAt(0)).join("").substring(0, 2).toUpperCase()
                  : "AN";
                return (
                  <div key={rev.id} className="bg-slate-50/30 p-4 rounded-xl border border-slate-200/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {userInitials}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800">{rev.user?.name || "Pembeli Anonim"}</h4>
                          <span className="text-[9px] text-slate-400 font-bold block">{new Date(rev.created_at || Date.now()).toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed pl-10">
                      {rev.review || ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recommended products */}
      <div className="space-y-5">
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Produk Rekomendasi Lainnya
          </h3>
        </div>

        {otherProducts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-bold bg-white rounded-2xl border border-slate-200/80">
            Tidak ada produk rekomendasi lainnya.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate(`/pembeli/produk/${prod.id}`)}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-350 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-40 bg-slate-50">
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-103 transition duration-300" />
                  <div className="absolute top-2 left-2 bg-white/95 border border-slate-200/80 px-2 py-0.5 rounded-full text-[9px] font-black text-slate-600 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-emerald-600" /> {prod.desa}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs leading-tight line-clamp-1 group-hover:text-indigo-650 transition">
                      {prod.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mt-1.5">
                      <span>{prod.category}</span>
                      <span className="flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /> {prod.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-600">Rp {prod.price.toLocaleString("id-ID")}</span>
                    <span className="text-[10px] font-extrabold text-indigo-600 flex items-center gap-0.5 group-hover:underline">
                      Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended other stores */}
      <div className="space-y-5">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200/80 pb-3">
          Rekomendasi Toko UMKM Lainnya
        </h3>

        {stores.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-bold bg-white rounded-2xl border border-slate-200/80">
            Tidak ada toko rekomendasi lainnya saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((st) => (
              <div
                key={st.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start gap-4 hover:shadow-md hover:border-slate-300 transition duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-650 font-bold text-lg flex-shrink-0">
                  {st.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-2 flex-grow">
                  <div>
                    <h4 className="font-heading font-black text-slate-900 text-sm leading-tight">{st.name}</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Pemilik: {st.owner} • 📍 {st.address}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold line-clamp-2 leading-relaxed">{st.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
