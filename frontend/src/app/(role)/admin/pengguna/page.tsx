"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAdmin } from "../layout";
import { Download } from "lucide-react";
import { exportToCSV, exportToPDF } from "../../../../utils/exportUtils";

export default function PenggunaPage() {
  const { usersList, toggleUserStatus } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Manajemen Akun Pengguna</h1>
        <p className="text-slate-500 text-xs font-semibold">Lihat database pembeli, investor, dan mitra UMKM serta blokir akun jika melanggar ketentuan.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-wrap gap-4">
          <h2 className="font-bold text-xs text-slate-450 uppercase tracking-widest">
            Database Akun Pengguna
          </h2>
          <div className="flex gap-3 text-xs font-semibold">
            <button 
              onClick={() => {
                const formatted = usersList.map(u => ({
                  ID: u.id,
                  Nama: u.name,
                  Role: u.role,
                  Tanggal_Gabung: u.joined,
                  Status: u.status
                }));
                exportToCSV(formatted, "koneksidesa_users_list.csv");
              }}
              className="text-xs text-emerald-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor CSV
            </button>
            <span className="text-slate-200">|</span>
            <button 
              onClick={() => {
                const headers = ["ID Akun", "Nama Pengguna", "Role", "Tanggal Gabung", "Status"];
                const rows = usersList.map(u => [
                  u.id,
                  u.name,
                  u.role,
                  u.joined,
                  u.status
                ]);
                exportToPDF("Laporan Database Pengguna Koneksi Desa", headers, rows, "laporan_pengguna");
              }}
              className="text-xs text-blue-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
            >
              <Download className="w-3.5 h-3.5" /> Cetak PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-bold text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-wider bg-slate-50/50">
                <th className="py-3 px-5">Nama Akun</th>
                <th className="py-3 px-5">Role Pengguna</th>
                <th className="py-3 px-5">Tanggal Gabung</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-heading font-black text-slate-900">{usr.name}</td>
                  <td className="py-3.5 px-5 text-slate-500 font-semibold">{usr.role}</td>
                  <td className="py-3.5 px-5 text-slate-500 font-semibold">{usr.joined}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      usr.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}>{usr.status}</span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => toggleUserStatus(usr.id)}
                      className={`font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                        usr.status === "Aktif" 
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200" 
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {usr.status === "Aktif" ? "Blokir" : "Aktifkan"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
