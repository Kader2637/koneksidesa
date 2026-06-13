"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, AlertCircle, CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePembeli } from "../layout";
import Select2 from "@/components/ui/Select2";


interface Product {
  id: number;
  name: string;
  price: number;
  desa: string;
  img: string;
  rating: number;
  category: string;
}

interface ReviewItem {
  id?: number;
  name: string;
  product: string;
  rating: number;
  text: string;
  created_at?: string;
}

export default function UlasanPage() {
  const { reviewsList, submitReview } = usePembeli();
  const location = useLocation();

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/bazar-products");
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            desa: item.desa || "Desa Mitra",
            img: item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
            rating: parseFloat(item.rating) || 5.0,
            category: item.category
          }));
          setProducts(mapped);

          // Check if there is a query param
          const searchParams = new URLSearchParams(location.search);
          const productIdParam = searchParams.get("product_id");
          if (productIdParam) {
            const parsedId = Number(productIdParam);
            const exists = mapped.some((p: any) => p.id === parsedId);
            if (exists) {
              setSelectedProductId(parsedId);
              return;
            }
          }

          if (mapped.length > 0) {
            setSelectedProductId(mapped[0].id);
          }
        }
      } catch (err) {
        console.error("Fetch products error for reviews:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [location.search]);


  // Fetch reviews when selected product changes
  const fetchReviews = async (productId: number) => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        const mappedReviews = data.map((item: any) => ({
          id: item.id,
          name: item.user?.name || "Pembeli Anonim",
          product: products.find(p => p.id === productId)?.name || "Produk",
          rating: Number(item.rating),
          text: item.review || ""
        }));
        setReviews(mappedReviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
      // Fallback: search in context reviewsList for matching product
      const currentProduct = products.find(p => p.id === productId);
      if (currentProduct) {
        const fallback = reviewsList.filter(r => r.product === currentProduct.name);
        setReviews(fallback);
      }
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      fetchReviews(Number(selectedProductId));
    } else {
      setReviews([]);
    }
  }, [selectedProductId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!selectedProductId) {
      setErrorMsg("Pilihlah salah satu produk terlebih dahulu.");
      return;
    }
    if (!reviewText.trim()) {
      setErrorMsg("Komentar ulasan tidak boleh kosong.");
      return;
    }

    const token = localStorage.getItem("token");
    const selectedProduct = products.find(p => p.id === Number(selectedProductId));

    if (!token) {
      // Offline/Local mock support
      if (selectedProduct) {
        const userName = localStorage.getItem("user") 
          ? JSON.parse(localStorage.getItem("user")!).name 
          : "Budi Santoso";

        submitReview(userName, selectedProduct.name, reviewRating, reviewText);
        
        // Add to local state list immediately
        setReviews(prev => [
          {
            name: userName,
            product: selectedProduct.name,
            rating: reviewRating,
            text: reviewText
          },
          ...prev
        ]);
        setReviewText("");
        setSuccessMsg("Ulasan berhasil dikirim (mode offline).");
      }
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/products/${selectedProductId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          review: reviewText
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal mengirim ulasan.");
      }

      setReviewText("");
      setSuccessMsg("Terima kasih atas ulasan produk Anda! Penilaian Anda membantu menaikkan skor kualitas Mitra UMKM.");
      
      // Reload reviews for this product
      fetchReviews(Number(selectedProductId));
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungi server.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 animate-in"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-2">Ulasan Produk</h1>
        <p className="text-slate-500 text-sm font-semibold">Tinggalkan umpan balik berupa ulasan berbintang untuk membantu UMKM meningkatkan kualitas mutu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Review writer form */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-indigo-100/80 h-fit shadow-sm shadow-indigo-100/5 hover:shadow-md transition-all duration-300">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 mb-6 pb-3 border-b border-slate-100">Tulis Ulasan</h3>
          
          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-2xl flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-4 rounded-2xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-500">
            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide">Pilih Produk</label>
              {loadingProducts ? (
                <div className="text-slate-400 py-2 animate-pulse">Memuat produk...</div>
              ) : (
                <Select2
                  options={products.map((prod) => ({
                    value: prod.id,
                    label: prod.name,
                    sublabel: prod.desa,
                  }))}
                  value={selectedProductId}
                  onChange={(val) => setSelectedProductId(val ? Number(val) : "")}
                  placeholder="-- Pilih Produk --"
                  isSearchable={true}
                  isClearable={true}
                />
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide">Peringkat Ulasan</label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-amber-400 hover:scale-110 transition cursor-pointer"
                  >
                    <Star className={`w-5 h-5 ${reviewRating >= star ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide">Komentar / Ulasan</label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tulis ulasan produk Anda di sini..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 font-semibold placeholder:text-slate-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-[11px] shadow-md shadow-indigo-500/10 disabled:opacity-55"
            >
              {submitLoading ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </form>
        </div>

        {/* Existing critiques ledger */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Ulasan Pembeli Lain</h3>
          <div className="space-y-4">
            {loadingReviews ? (
              <div className="text-center py-8 text-slate-400 font-semibold animate-pulse">Memuat ulasan produk...</div>
            ) : reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-indigo-50/50 text-center text-slate-400 font-semibold text-xs">
                Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan penilaian!
              </div>
            ) : (
              reviews.map((rev, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-indigo-100/60 space-y-3.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-slate-850">{rev.name}</h4>
                      <span className="text-[10px] text-slate-450 font-bold block mt-0.5">{rev.product}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {rev.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
