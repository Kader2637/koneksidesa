"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { usePembeli } from "../layout";

export default function UlasanPage() {
  const { reviewsList, submitReview } = usePembeli();

  // Form states
  const [reviewName, setReviewName] = useState("");
  const [reviewProduct, setReviewProduct] = useState("Kopi Robusta Asli");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    submitReview(reviewName, reviewProduct, reviewRating, reviewText);
    setReviewName("");
    setReviewText("");
    alert("Terima kasih atas ulasan produk Anda! Penilaian Anda membantu menaikkan skor kualitas Mitra UMKM.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 mb-2">Ulasan Produk</h1>
        <p className="text-slate-500 text-sm font-semibold">Tinggalkan umpan balik berupa ulasan berbintang untuk membantu UMKM meningkatkan kualitas mutu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Review writer form */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-indigo-100/80 h-fit shadow-sm shadow-indigo-100/5 hover:shadow-md transition-all duration-300">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 mb-6 pb-3 border-b border-slate-100">Tulis Ulasan</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-500">
            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide">Nama Anda</label>
              <input
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Masukkan nama lengkap..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 font-semibold"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide">Pilih Produk</label>
              <select
                value={reviewProduct}
                onChange={(e) => setReviewProduct(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 font-extrabold cursor-pointer"
              >
                <option>Kopi Robusta Asli</option>
                <option>Tas Anyam Pandan</option>
                <option>Keramik Hias Dekoratif</option>
                <option>Madu Hutan Liar</option>
              </select>
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
              className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-[11px] shadow-md shadow-indigo-500/10"
            >
              Kirim Ulasan
            </button>
          </form>
        </div>

        {/* Existing critiques ledger */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Ulasan Pembeli Lain</h3>
          <div className="space-y-4">
            {reviewsList.map((rev, idx) => (
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
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
