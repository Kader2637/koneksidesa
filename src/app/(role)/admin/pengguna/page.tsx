"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAdmin } from "../layout";

export default function PenggunaPage() {
  const { usersList, toggleUserStatus } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Manajemen Akun Pengguna</h1>
        <p className="text-slate-400 text-sm font-semibold">Lihat database pembeli, investor, dan mitra UMKM serta blokir akun jika melanggar ketentuan.</p>
      </div>

      <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-bold text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase text-[9px] tracking-wider bg-slate-950/40">
                <th className="py-4 px-4">Nama Akun</th>
                <th className="py-4 px-4">Role Pengguna</th>
                <th className="py-4 px-4">Tanggal Gabung</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id} className="border-b border-slate-900/60 hover:bg-slate-900/30">
                  <td className="py-4 px-4 font-heading font-black text-white">{usr.name}</td>
                  <td className="py-4 px-4 text-slate-400">{usr.role}</td>
                  <td className="py-4 px-4 text-slate-400">{usr.joined}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      usr.status === "Aktif" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    }`}>{usr.status}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(usr.id)}
                      className={`font-black text-[10px] px-3.5 py-1.5 rounded-lg border transition cursor-pointer ${
                        usr.status === "Aktif" 
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
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
