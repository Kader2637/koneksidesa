"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, User, ChevronRight, Users, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAdmin } from "./layout";

export default function AdminDashboard() {
  const { pendingKycs, pendingCampaigns, usersList, villageTreasury } = useAdmin();

  // Metrics computing
  const activeKycsCount = pendingKycs.filter(k => k.status === "Pending").length;
  const activeCampaignsCount = pendingCampaigns.filter(c => c.status === "Pending").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Pusat Kendali Admin</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau sirkulasi kas operasional desa, daftar tunggu verifikasi, serta jumlah pengguna aktif ekosistem BUMDesa.</p>
      </div>

      {/* KPI metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Treasury Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm shadow-slate-100/40 hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Kas Operasional Desa</p>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">Rp {villageTreasury.toLocaleString("id-ID")}</h3>
          <span className="text-[9px] text-emerald-700 font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-50 w-fit px-2.5 py-0.5 rounded-md border border-emerald-100">
            <ShieldCheck className="w-3 h-3" /> Terverifikasi Kas
          </span>
        </div>

        {/* KYC Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm shadow-slate-100/40 hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Tunggu Verifikasi KYC</p>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center border border-rose-100">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">{activeKycsCount} UMKM</h3>
          <span className="text-[9px] text-rose-700 font-black uppercase tracking-wider flex items-center gap-1 bg-rose-50 w-fit px-2.5 py-0.5 rounded-md border border-rose-100">
            Butuh Keputusan
          </span>
        </div>

        {/* Users Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-32 shadow-sm shadow-slate-100/40 hover:shadow-md hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Pengguna Terdaftar</p>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">{usersList.length} Akun</h3>
          <span className="text-[9px] text-blue-700 font-black uppercase tracking-wider flex items-center gap-1 bg-blue-50 w-fit px-2.5 py-0.5 rounded-md border border-blue-100">
            Database Aktif
          </span>
        </div>
      </div>

      {/* Latest KYC list preview */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> Daftar KYC Menunggu Verifikasi
          </h3>
          <Link href="/admin/verifikasi" className="text-xs text-blue-600 font-extrabold hover:underline flex items-center gap-0.5">
            Lihat semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {pendingKycs.filter(k => k.status === "Pending").length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200/60 border-dashed">
              Tidak ada pendaftaran KYC yang menunggu
            </div>
          ) : (
            pendingKycs.filter(k => k.status === "Pending").map((kyc) => (
              <div key={kyc.id} className="flex justify-between items-center bg-slate-55 p-4 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 leading-tight">{kyc.umkm}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">Pemilik: {kyc.owner} • NIB: {kyc.nib}</span>
                </div>
                <Link
                  href="/admin/verifikasi"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-2 rounded-lg text-[10px] transition cursor-pointer uppercase tracking-wider shadow-sm"
                >
                  Verifikasi
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Moderation preview */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Moderasi Pengajuan Investasi
          </h3>
          <Link href="/admin/moderasi" className="text-xs text-blue-600 font-extrabold hover:underline flex items-center gap-0.5">
            Lihat semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {pendingCampaigns.filter(c => c.status === "Pending").length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-xl border border-slate-200/60 border-dashed">
              Tidak ada kampanye modal yang menunggu moderasi
            </div>
          ) : (
            pendingCampaigns.filter(c => c.status === "Pending").slice(0, 2).map((camp) => (
              <div key={camp.id} className="flex justify-between items-center bg-slate-55 p-4 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 leading-tight">{camp.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">UMKM: {camp.umkm} • Target: Rp {camp.target.toLocaleString("id-ID")}</span>
                </div>
                <Link
                  href="/admin/moderasi"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-2 rounded-lg text-[10px] transition cursor-pointer uppercase tracking-wider shadow-sm"
                >
                  Tinjau
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
