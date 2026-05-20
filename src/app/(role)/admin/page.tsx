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
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Pusat Kendali Admin</h1>
        <p className="text-slate-500 text-sm font-semibold">Tinjau sirkulasi kas operasional desa, daftar tunggu verifikasi, serta jumlah pengguna aktif ekosistem BUMDesa.</p>
      </div>

      {/* KPI metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Treasury Card */}
        <div className="bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-white p-6 rounded-[2rem] border border-emerald-200/50 flex flex-col justify-between h-40 shadow-sm shadow-emerald-100/10 hover:shadow-md hover:border-emerald-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kas Operasional Desa</p>
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/25">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-emerald-700">Rp {villageTreasury.toLocaleString("id-ID")}</h3>
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-100/60 w-fit px-2.5 py-0.5 rounded-full border border-emerald-200/50">
            <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Kas
          </span>
        </div>

        {/* KYC Card */}
        <div className="bg-gradient-to-tr from-rose-500/10 via-amber-500/5 to-white p-6 rounded-[2rem] border border-rose-200/50 flex flex-col justify-between h-40 shadow-sm shadow-rose-100/10 hover:shadow-md hover:border-rose-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tunggu Verifikasi KYC</p>
            <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center border border-rose-500/25">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">{activeKycsCount} UMKM</h3>
          <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1 bg-rose-100/60 w-fit px-2.5 py-0.5 rounded-full border border-rose-200/50">
            Butuh Keputusan
          </span>
        </div>

        {/* Users Card */}
        <div className="bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-white p-6 rounded-[2rem] border border-blue-200/50 flex flex-col justify-between h-40 shadow-sm shadow-blue-100/10 hover:shadow-md hover:border-blue-300 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Pengguna Terdaftar</p>
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center border border-blue-500/25">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">{usersList.length} Akun</h3>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-wider flex items-center gap-1 bg-blue-100/60 w-fit px-2.5 py-0.5 rounded-full border border-blue-200/50">
            Database Aktif
          </span>
        </div>
      </div>

      {/* Latest KYC list preview */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> Daftar KYC Menunggu Verifikasi
          </h3>
          <Link href="/admin/verifikasi" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5">
            Lihat semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {pendingKycs.filter(k => k.status === "Pending").length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Tidak ada pendaftaran KYC yang menunggu
            </div>
          ) : (
            pendingKycs.filter(k => k.status === "Pending").map((kyc) => (
              <div key={kyc.id} className="flex justify-between items-center bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 leading-tight">{kyc.umkm}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">Pemilik: {kyc.owner} • NIB: {kyc.nib}</span>
                </div>
                <Link
                  href="/admin/verifikasi"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4.5 py-2.5 rounded-xl text-[10px] transition cursor-pointer uppercase tracking-wider shadow-sm hover:shadow shadow-blue-500/10"
                >
                  Verifikasi
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Moderation preview */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Moderasi Pengajuan Investasi
          </h3>
          <Link href="/admin/moderasi" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5">
            Lihat semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-4">
          {pendingCampaigns.filter(c => c.status === "Pending").length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              Tidak ada kampanye modal yang menunggu moderasi
            </div>
          ) : (
            pendingCampaigns.filter(c => c.status === "Pending").slice(0, 2).map((camp) => (
              <div key={camp.id} className="flex justify-between items-center bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-850 leading-tight">{camp.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">UMKM: {camp.umkm} • Target: Rp {camp.target.toLocaleString("id-ID")}</span>
                </div>
                <Link
                  href="/admin/moderasi"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4.5 py-2.5 rounded-xl text-[10px] transition cursor-pointer uppercase tracking-wider shadow-sm hover:shadow shadow-emerald-500/10"
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
