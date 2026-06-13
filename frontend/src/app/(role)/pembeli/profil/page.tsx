"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Save, Settings, ShieldCheck, Upload, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function PembeliProfilPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [deleteAvatar, setDeleteAvatar] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setProfile({
          name: u.name || "Budi Santoso",
          email: u.email || "budi@koneksidesa.com",
          phone_number: u.phone_number || "",
          address: u.address || "",
        });
        if (u.avatar) {
          setAvatarPreview(u.avatar);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone_number", profile.phone_number);
    formData.append("address", profile.address);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (deleteAvatar) {
      formData.append("delete_avatar", "true");
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/profile/update", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        // Sync local storage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          const updated = { ...u, ...profile, avatar: data.user.avatar };
          localStorage.setItem("user", JSON.stringify(updated));
        }
        // Emit profile-updated event
        window.dispatchEvent(new Event("profile-updated"));
        toast.success("Profil berhasil diperbarui!");
        setAvatarFile(null);
        setDeleteAvatar(false);
      } else {
        const err = await res.json();
        toast.error("Gagal memperbarui profil: " + (err.message || "kesalahan tidak diketahui"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  const userInitials = profile.name
    ? profile.name.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "PB";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 text-slate-800"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Profil & Alamat</h1>
        <p className="text-slate-500 text-xs font-semibold">Kelola rincian informasi akun, foto profil, dan alamat utama untuk pengiriman belanja produk desa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4 h-fit">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 self-start border-b border-slate-100 pb-2 w-full text-left">
            Status Akun
          </h3>
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center bg-indigo-50/50">
            {avatarPreview ? (
              <img src={avatarPreview} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-550 to-indigo-700 flex items-center justify-center text-white font-bold text-xl">
                {userInitials}
              </div>
            )}
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

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-650">
            {/* Avatar Upload UI */}
            <div className="flex items-center gap-5 pb-4 border-b border-slate-100/85">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {userInitials}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 block">Foto Profil</span>
                <div className="flex gap-2 items-center">
                  <label className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-650 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Unggah Foto
                    <input 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2048 * 1024) {
                            toast.error("Ukuran file maksimal adalah 2MB!");
                            return;
                          }
                          setAvatarFile(file);
                          setDeleteAvatar(false);
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        setDeleteAvatar(true);
                        setAvatarPreview("");
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-650 text-[10px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center gap-1 border-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 block font-semibold">Maksimal 2MB (JPG, JPEG, PNG).</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-slate-500">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500/50 transition font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-slate-500">Alamat Email</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-400 outline-none cursor-not-allowed font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-slate-500">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                required
                value={profile.phone_number}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500/50 transition font-semibold"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-slate-500">Alamat Lengkap Pengiriman</label>
              <textarea
                required
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-indigo-500/50 transition font-medium resize-none"
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
