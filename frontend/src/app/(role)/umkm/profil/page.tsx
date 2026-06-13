"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, ShieldCheck, Mail, Phone, MapPin, Store, Save, Upload, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function UMKMProfilPage() {
  const [profile, setProfile] = useState({
    business_name: "",
    owner_name: "",
    email: "",
    phone_number: "",
    address: "",
    description: ""
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
          business_name: u.business_name || u.name || "Toko UMKM Desa",
          owner_name: u.name || "Pemilik UMKM",
          email: u.email || "umkm@koneksidesa.com",
          phone_number: u.phone_number || "",
          address: u.address || "",
          description: u.description || "Produsen komoditas lokal desa berkualitas tinggi.",
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
    formData.append("name", profile.owner_name);
    formData.append("phone_number", profile.phone_number);
    formData.append("address", profile.address);
    formData.append("business_name", profile.business_name);
    formData.append("description", profile.description);
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
          const updated = { 
            ...u, 
            name: profile.owner_name,
            business_name: profile.business_name,
            phone_number: profile.phone_number,
            address: profile.address,
            description: profile.description,
            avatar: data.user.avatar 
          };
          localStorage.setItem("user", JSON.stringify(updated));
        }
        // Emit profile-updated event
        window.dispatchEvent(new Event("profile-updated"));
        toast.success("Profil Usaha UMKM berhasil diperbarui!");
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 text-slate-800"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Profil Usaha UMKM</h1>
        <p className="text-slate-500 text-xs font-semibold">Kelola rincian informasi usaha, kontak operasional, serta unggah logo identitas merek produk toko Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo Card */}
        <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4 h-fit">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 self-start border-b border-slate-100 pb-2 w-full text-left">
            Logo Usaha / Foto
          </h3>
          <div className="relative w-32 h-32 rounded-full overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center bg-slate-50">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Logo Usaha" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-12 h-12 text-slate-350" />
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full items-center">
            <label className="w-full px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-black uppercase tracking-wider text-slate-650 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">
              <Upload className="w-4 h-4 text-slate-600" />
              Unggah Logo File
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
                className="w-full px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-650 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1 border-none shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Logo
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">Gunakan file gambar JPG, JPEG, atau PNG (Maks 2MB) dengan rasio 1:1.</p>
        </div>

        {/* Data Usaha & Kontak Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-emerald-600 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-500" /> Informasi Data Usaha & Kontak
          </h3>

          <div className="space-y-4 text-xs font-bold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Nama Toko / Usaha</label>
                <input
                  type="text"
                  required
                  value={profile.business_name}
                  onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Nama Pemilik</label>
                <input
                  type="text"
                  required
                  value={profile.owner_name}
                  onChange={(e) => setProfile({ ...profile, owner_name: e.target.value })}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Alamat Email Kontak</label>
                <input
                  type="email"
                  required
                  disabled
                  value={profile.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed outline-none font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Nomor Telepon</label>
                <input
                  type="text"
                  required
                  value={profile.phone_number}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Alamat Fisik Usaha</label>
              <textarea
                required
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-medium resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="tracking-wide text-xs text-slate-500">Deskripsi Ringkas Usaha</label>
              <textarea
                required
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition font-medium resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-xs border-none"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Profil Usaha"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
