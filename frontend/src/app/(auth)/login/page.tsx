"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Email atau password salah.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect depending on user role
      const userRole = data.user.role;
      if (userRole === "Admin") {
        navigate("/admin");
      } else if (userRole === "Mitra UMKM") {
        navigate("/umkm");
      } else if (userRole === "Investor") {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans antialiased text-slate-800">
      {/* Ambient backgrounds */}
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
        className="w-full max-w-md bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-100/60 relative"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-150 text-indigo-700 font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest text-[9px] mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Koneksi Desa Portal</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-slate-900 leading-tight">Masuk Akun</h2>
          <p className="text-slate-400 text-xs mt-2 font-bold">Masukkan kredensial Anda untuk mengakses dasbor.</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-150 text-rose-700 text-xs font-semibold p-4 rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold py-4 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-xs shadow-lg shadow-indigo-600/20 border border-indigo-600 hover:border-indigo-750 mt-2"
          >
            {loading ? "Menghubungkan..." : "Masuk Akun"} <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 font-bold">
          Belum punya akun?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
