"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, User, Phone, MapPin, Shield, Check, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/Toast";

type Role = "Pembeli" | "Investor" | "Mitra UMKM";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("Pembeli");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // UMKM specific details
  const [umkmName, setUmkmName] = useState("");
  const [umkmOwner, setUmkmOwner] = useState("");
  const [umkmNib, setUmkmNib] = useState("");
  const [umkmKtp, setUmkmKtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload: any = {
      name,
      email,
      password,
      role,
      phone_number: phoneNumber,
      address,
    };

    if (role === "Mitra UMKM") {
      payload.umkm_name = umkmName;
      payload.umkm_owner = umkmOwner;
      payload.umkm_nib = umkmNib;
      payload.umkm_ktp = umkmKtp;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Registrasi gagal. Cek kembali data Anda.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Registrasi sukses! Selamat bergabung.");

      // Redirect depending on user role
      if (role === "Mitra UMKM") {
        navigate("/umkm");
      } else if (role === "Investor") {
        navigate("/investor");
      } else {
        navigate("/pembeli");
      }
    } catch (err: any) {
      setError(err.message || "Koneksi ke server gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-12 px-6 relative overflow-hidden flex flex-col justify-center items-center font-sans antialiased text-slate-800">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-8 left-8 text-xs font-black text-slate-500 hover:text-slate-800 uppercase tracking-wider flex items-center gap-1.5 transition duration-200"
      >
        <ArrowLeft className="w-4 h-4 text-slate-500" /> Kembali ke Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-100/60 relative"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-150 text-indigo-700 font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest text-[9px] mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Koneksi Desa Pendaftaran</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-slate-900 leading-tight">Buat Akun Baru</h2>
          <p className="text-slate-400 text-xs mt-2 font-bold">Pilih peran Anda dan daftarkan diri Anda di sistem desa.</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-150 text-rose-700 text-xs font-semibold p-4 rounded-2xl">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl mb-8">
          {(["Pembeli", "Investor", "Mitra UMKM"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer text-center ${
                role === r
                  ? "bg-white text-indigo-700 shadow-md border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {r === "Mitra UMKM" ? "Toko UMKM" : r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Nomor Telepon</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0812xxxxxx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Alamat Tinggal</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat Lengkap Desa"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Dynamic UMKM Fields */}
          <AnimatePresence mode="wait">
            {role === "Mitra UMKM" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 overflow-hidden border-t border-slate-100 pt-5"
              >
                <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Informasi Toko UMKM (KYC)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-550 font-bold uppercase tracking-wider block">Nama Toko/Usaha</label>
                    <input
                      type="text"
                      required
                      value={umkmName}
                      onChange={(e) => setUmkmName(e.target.value)}
                      placeholder="Contoh: Toko Jaya Makmur"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-550 font-bold uppercase tracking-wider block">Nama Pemilik Usaha</label>
                    <input
                      type="text"
                      required
                      value={umkmOwner}
                      onChange={(e) => setUmkmOwner(e.target.value)}
                      placeholder="Nama Sesuai KTP"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-550 font-bold uppercase tracking-wider block">NIB (Nomor Induk Berusaha)</label>
                    <input
                      type="text"
                      required
                      value={umkmNib}
                      onChange={(e) => setUmkmNib(e.target.value)}
                      placeholder="13-digit NIB"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-550 font-bold uppercase tracking-wider block">Nomor KTP Pemilik</label>
                    <input
                      type="text"
                      required
                      value={umkmKtp}
                      onChange={(e) => setUmkmKtp(e.target.value)}
                      placeholder="16-digit NIK KTP"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold py-4.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-xs shadow-lg shadow-indigo-600/20 border border-indigo-600 mt-4"
          >
            {loading ? "Mendaftarkan..." : "Daftar Akun"} <Check className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 font-bold">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Masuk Di Sini
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
