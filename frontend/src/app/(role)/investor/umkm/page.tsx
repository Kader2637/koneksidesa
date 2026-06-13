"use client";

import React from "react";
import { motion } from "framer-motion";
import { Store, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInvestor } from "../layout";

export default function InvestorUMKMPage() {
  const navigate = useNavigate();
  const { umkms } = useInvestor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 text-slate-800"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Data UMKM Desa</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau daftar badan usaha UMKM terdaftar, portofolio produk komoditas, dan proposal pendanaan aktif mereka.</p>
      </div>

      {/* Grid List of UMKMs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {umkms.length === 0 ? (
          <div className="col-span-full text-center py-12 text-sm text-slate-450 font-bold uppercase tracking-wider bg-white rounded-2xl border border-slate-200 border-dashed">
            Belum ada UMKM desa terdaftar
          </div>
        ) : (
          umkms.map((u) => (
            <div 
              key={u.id} 
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md hover:border-indigo-150 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center text-indigo-650">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-lg leading-snug">{u.business_name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pemilik: {u.owner}</p>
                </div>
                <p className="text-xs text-slate-500 font-semibold line-clamp-3 leading-relaxed pt-1">{u.description || "Tidak ada deskripsi profil usaha."}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                  📍 {u.address || "Dusun Karya Maju, Agro Rejo"}
                </p>
                <button
                  onClick={() => navigate(`/investor/umkm/${u.id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs transition cursor-pointer text-center w-full flex items-center justify-center gap-1.5 border-none uppercase tracking-wider"
                >
                  Detail Usaha & Produk
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
