"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Save } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminProfilPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setProfile({
          name: u.name || "Administrator",
          email: u.email || "admin@koneksidesa.com",
          phone_number: u.phone_number || "",
          address: u.address || ""
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    // Simulate API update and save to localStorage
    setTimeout(() => {
      setSavingProfile(false);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        const updated = { ...u, ...profile };
        localStorage.setItem("user", JSON.stringify(updated));
      }
      toast.success("Profil berhasil diperbarui!");
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }
    setSavingPassword(true);
    // Simulate API update
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      toast.success("Kata sandi berhasil diubah!");
    }, 1000);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Profil Pengguna</h1>
        <p className="text-slate-500 text-xs font-semibold">Kelola informasi kontak Anda dan ganti kata sandi keamanan secara berkala.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Edit Profil */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> Informasi Profil
          </h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-semibold">Nama Lengkap</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-semibold">Alamat Email</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-semibold">Nomor Telepon</label>
              <input
                type="text"
                value={profile.phone_number}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                placeholder="Contoh: 08123456789"
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-semibold">Alamat Kantor / BUMDes</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none resize-none focus:border-blue-500 focus:bg-white transition"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5 uppercase text-xs tracking-wider border-none"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </form>
        </div>

        {/* Form Ganti Password */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-500" /> Keamanan Akun
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-semibold">Kata Sandi Saat Ini</label>
              <input
                type="password"
                required
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-rose-500 focus:bg-white transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-semibold">Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-rose-500 focus:bg-white transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-semibold">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-rose-500 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5 uppercase text-xs tracking-wider border-none"
            >
              <Save className="w-4 h-4" />
              {savingPassword ? "Memproses..." : "Ganti Kata Sandi"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
