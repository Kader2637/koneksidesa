"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Save, Trash2, Upload } from "lucide-react";
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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [deleteAvatar, setDeleteAvatar] = useState(false);

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
        if (u.avatar) {
          setAvatarPreview(u.avatar);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      setSavingProfile(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone_number", profile.phone_number || "");
    formData.append("address", profile.address || "");
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
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }
    setSavingPassword(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      setSavingPassword(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone_number", profile.phone_number || "");
    formData.append("address", profile.address || "");
    formData.append("password", passwordForm.new_password);

    try {
      const res = await fetch("http://localhost:8000/api/auth/profile/update", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
        toast.success("Kata sandi berhasil diubah!");
      } else {
        const err = await res.json();
        toast.error("Gagal mengubah kata sandi: " + (err.message || "kesalahan tidak diketahui"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan kata sandi.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-slate-800"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Profil Pengguna</h1>
        <p className="text-slate-500 text-xs font-semibold">Kelola informasi kontak Anda, foto profil, dan ganti kata sandi keamanan secara berkala.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Edit Profil */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-heading font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-500" /> Informasi Profil
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs font-bold text-slate-700">
            {/* Avatar Upload UI */}
            <div className="flex items-center gap-5 pb-4 border-b border-slate-100/80">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {profile.name ? profile.name.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase() : "AD"}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 block">Foto Profil</span>
                <div className="flex gap-2 items-center">
                  <label className="px-3 py-1.5 bg-slate-55 border border-slate-250 hover:bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-650 transition cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-slate-600" />
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
                disabled
                value={profile.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 outline-none cursor-not-allowed"
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
          <h2 className="font-heading font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
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
