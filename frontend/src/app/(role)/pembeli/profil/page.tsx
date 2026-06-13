"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Save, Settings, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function PembeliProfilPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setProfile({
          name: u.name || "Budi Santoso",
          email: u.email || "budi@koneksidesa.com",
          phone_number: u.phone_number || "081234567890",
          address: u.address || "Jl. Makmur No. 12, RT 02/05, Desa Agro Rejo",
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          const updated = {
            ...u,
            name: profile.name,
            phone_number: profile.phone_number,
            address: profile.address,
          };
          localStorage.setItem("user", JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }
      }
      toast.success("Profil dan Alamat Pengiriman berhasil diperbarui!");
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Profil & Alamat</h1>
        <p className="text-slate-500 text-xs font-semibold">Kelola rincian informasi akun, nomor kontak aktif, dan alamat utama untuk pengiriman belanja produk desa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4 h-fit">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 self-start border-b border-slate-100 pb-2 w-full text-left">
            Status Akun
          </h3>
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center bg-indigo-50/50">
            <User className="w-10 h-10 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-800">{profile.name}</h4>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-black mt-1">Konsumen Bazar</p>
          </div>
          <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-555 font-extrabold tracking-wide uppercase">Terverifikasi</span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-indigo-650 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-500" /> Pengaturan Informasi Pribadi
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500/50 transition font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide">Alamat Email</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-400 outline-none cursor-not-allowed font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                required
                value={profile.phone_number}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500/50 transition font-semibold"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide">Alamat Lengkap Pengiriman</label>
              <textarea
                required
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-indigo-500/50 transition font-medium resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-xs shadow-sm border-none"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
