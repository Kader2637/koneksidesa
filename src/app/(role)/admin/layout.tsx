"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Award, DollarSign, Users, 
  Activity, User, Map, LifeBuoy, LineChart, Bell, Search, 
  Sparkles, ArrowLeft
} from "lucide-react";

// Types
export interface PendingKYC {
  id: number;
  umkm: string;
  owner: string;
  nib: string;
  ktp: string;
  status: "Pending" | "Disetujui" | "Ditolak";
}

export interface ModerationCampaign {
  id: number;
  title: string;
  umkm: string;
  target: number;
  roi: number;
  status: "Pending" | "Aktif" | "Ditolak";
}

export interface UserProfile {
  id: number;
  name: string;
  role: "Pembeli" | "Investor" | "Mitra UMKM";
  status: "Aktif" | "Diblokir";
  joined: string;
}

export interface VillageWithdrawal {
  id: string;
  date: string;
  bank: string;
  amount: number;
  status: "Berhasil" | "Diproses";
}

export interface Ticket {
  id: string;
  user: string;
  subject: string;
  category: "Teknis" | "Transaksi" | "Lainnya";
  status: "Terbuka" | "Selesai";
  date: string;
}

interface AdminContextType {
  pendingKycs: PendingKYC[];
  resolveKyc: (id: number, decision: "Disetujui" | "Ditolak") => void;
  pendingCampaigns: ModerationCampaign[];
  resolveCampaign: (id: number, decision: "Aktif" | "Ditolak") => void;
  usersList: UserProfile[];
  toggleUserStatus: (id: number) => void;
  villageTreasury: number;
  setVillageTreasury: React.Dispatch<React.SetStateAction<number>>;
  withdrawals: VillageWithdrawal[];
  addWithdrawal: (amount: number) => void;
  tickets: Ticket[];
  resolveTicket: (id: string) => void;
  petaSettings: { showUmkm: boolean; showFasilitas: boolean; radius: number };
  setPetaSettings: React.Dispatch<React.SetStateAction<{ showUmkm: boolean; showFasilitas: boolean; radius: number }>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // States
  const [pendingKycs, setPendingKycs] = useState<PendingKYC[]>([
    { id: 1, umkm: "Kelompok Tani Padi Biru", owner: "Sugeng Riyadi", nib: "NIB-88231264", ktp: "3301021980051201", status: "Pending" },
    { id: 2, umkm: "Sentra Anyam Pandan Indah", owner: "Kartini Astuti", nib: "NIB-99823124", ktp: "3301021985061402", status: "Pending" }
  ]);

  const [pendingCampaigns, setPendingCampaigns] = useState<ModerationCampaign[]>([
    { id: 101, title: "Modernisasi Alat Panen Padi", umkm: "Kelompok Tani Padi Biru", target: 50000000, roi: 15, status: "Pending" },
    { id: 102, title: "Pembelian Bahan Baku Grosir", umkm: "Sentra Anyam Pandan Indah", target: 15000000, roi: 11, status: "Pending" }
  ]);

  const [usersList, setUsersList] = useState<UserProfile[]>([
    { id: 501, name: "Budi Santoso", role: "Pembeli", status: "Aktif", joined: "14 Mei 2026" },
    { id: 502, name: "Bambang Hermawan", role: "Investor", status: "Aktif", joined: "12 Mei 2026" },
    { id: 503, name: "Sugeng Riyadi", role: "Mitra UMKM", status: "Aktif", joined: "10 Mei 2026" }
  ]);

  const [villageTreasury, setVillageTreasury] = useState(42500000); // Rp 42.500.000
  
  const [withdrawals, setWithdrawals] = useState<VillageWithdrawal[]>([
    { id: "WD-1004", date: "01 April 2026", bank: "BUMDesa - BRI (1234xxxx)", amount: 15000000, status: "Berhasil" },
    { id: "WD-1003", date: "01 Maret 2026", bank: "BUMDesa - BRI (1234xxxx)", amount: 12500000, status: "Berhasil" }
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "TK-782", user: "Budi Santoso", subject: "Kesalahan transfer deposit", category: "Transaksi", status: "Terbuka", date: "15 Mei 2026" },
    { id: "TK-781", user: "Toko Kopi Rejo", subject: "Gagal upload gambar produk baru", category: "Teknis", status: "Selesai", date: "10 Mei 2026" }
  ]);

  const [petaSettings, setPetaSettings] = useState({
    showUmkm: true,
    showFasilitas: true,
    radius: 5
  });

  // Action handlers
  const resolveKyc = (id: number, decision: "Disetujui" | "Ditolak") => {
    setPendingKycs((prev) => 
      prev.map((k) => k.id === id ? { ...k, status: decision } : k)
    );
  };

  const resolveCampaign = (id: number, decision: "Aktif" | "Ditolak") => {
    setPendingCampaigns((prev) => 
      prev.map((c) => c.id === id ? { ...c, status: decision } : c)
    );
  };

  const toggleUserStatus = (id: number) => {
    setUsersList((prev) => 
      prev.map((u) => u.id === id ? { ...u, status: u.status === "Aktif" ? "Diblokir" : "Aktif" } : u)
    );
  };

  const addWithdrawal = (amount: number) => {
    if (amount > villageTreasury) return;
    setVillageTreasury((prev) => prev - amount);
    setWithdrawals((prev) => [
      {
        id: `WD-${Math.floor(Math.random() * 9000 + 1000)}`,
        date: "Hari Ini",
        bank: "BUMDesa - BRI (1234xxxx)",
        amount: amount,
        status: "Diproses"
      },
      ...prev
    ]);
  };

  const resolveTicket = (id: string) => {
    setTickets((prev) => 
      prev.map((t) => t.id === id ? { ...t, status: "Selesai" } : t)
    );
  };

  const contextValue = useMemo(() => ({
    pendingKycs,
    resolveKyc,
    pendingCampaigns,
    resolveCampaign,
    usersList,
    toggleUserStatus,
    villageTreasury,
    setVillageTreasury,
    withdrawals,
    addWithdrawal,
    tickets,
    resolveTicket,
    petaSettings,
    setPetaSettings
  }), [pendingKycs, pendingCampaigns, usersList, villageTreasury, withdrawals, tickets, petaSettings]);

  const activeKycsCount = pendingKycs.filter(k => k.status === "Pending").length;
  const activeCampaignsCount = pendingCampaigns.filter(c => c.status === "Pending").length;
  const openTicketsCount = tickets.filter(t => t.status === "Terbuka").length;

  const menuItems = [
    { href: "/admin", label: "Pusat Kendali", icon: Activity },
    { href: "/admin/verifikasi", label: "Verifikasi KYC", icon: ShieldCheck, badge: activeKycsCount },
    { href: "/admin/moderasi", label: "Moderasi Investasi", icon: Award, badge: activeCampaignsCount },
    { href: "/admin/laba", label: "Laporan Keuangan", icon: DollarSign },
    { href: "/admin/pengguna", label: "Manajemen Pengguna", icon: Users },
    { href: "/admin/pantau-dana", label: "Pantauan Dana", icon: LineChart },
    { href: "/admin/peta", label: "Pengaturan Peta", icon: Map },
    { href: "/admin/laporan", label: "Pusat Keluhan", icon: LifeBuoy, badge: openTicketsCount }
  ];

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="h-screen bg-slate-50 text-slate-700 flex flex-col font-sans antialiased overflow-hidden relative selection:bg-blue-500/20 selection:text-blue-900">
        
        {/* Soft decorative background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

        {/* Global HUD Header */}
        <header className="h-[80px] bg-white/70 border-b border-slate-200/80 sticky top-0 z-40 px-8 backdrop-blur-xl flex items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.02)] shrink-0">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="relative h-11 w-44 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/logo1.png" 
                  alt="KoneksiDesa" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="h-6 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 font-extrabold px-3.5 py-1 rounded-full border border-blue-200/50 uppercase tracking-widest text-[9px] shadow-sm">
                <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
                <span>Pusat Admin</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/60 border border-slate-200/40 focus-within:border-blue-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-500 transition-all duration-300 w-64 shadow-inner">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari data atau laporan..." 
                className="bg-transparent border-none outline-none text-slate-800 text-xs w-full placeholder:text-slate-400"
              />
            </div>

            {/* Notification hub */}
            <button className="relative p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-all duration-300 cursor-pointer shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            <div className="h-6 w-[1px] bg-slate-200" />

            {/* Admin Profile Details */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 pl-2.5 pr-4.5 py-1.5 rounded-full transition-all duration-300 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border border-white shadow-md text-white font-extrabold text-xs">
                AD
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">BUMDesa Mandiri</p>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">Pemerintah Desa</p>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Layout */}
        <div className="flex flex-row flex-grow h-[calc(100vh-80px)] overflow-hidden w-full max-w-[1600px] mx-auto px-6 py-6 gap-6">
          
          {/* Floating Sidebar */}
          <aside className="w-68 flex flex-col justify-between shrink-0 hidden lg:flex bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden h-full">
            
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4.5 text-center relative overflow-hidden">
                <div className="relative w-14 h-14 mx-auto rounded-full bg-blue-50 p-0.5 border border-blue-200 flex items-center justify-center mb-3 shadow-inner">
                  <User className="w-6 h-6 text-blue-500" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">Administrator</h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">Pemerintah Desa</p>
                
                <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-slate-500 font-extrabold tracking-wide uppercase">Sesi Aktif</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Manajemen Desa</p>
                
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`relative w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border cursor-pointer z-10 group ${
                          isSelected 
                            ? "text-blue-600 border-blue-200 bg-blue-50/50 shadow-sm font-extrabold" 
                            : "text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-50"
                        }`}
                      >
                        {/* Smooth active link sliding capsule (fallback for standard light, Framer highlights in layout) */}
                        {isSelected && (
                          <motion.div
                            layoutId="adminSidebarHighlight"
                            className="absolute inset-0 bg-blue-50/80 rounded-2xl border-l-2 border-blue-500 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        
                        <span className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isSelected ? "text-blue-600" : "text-slate-400 group-hover:text-slate-655"}`} />
                          <span className="tracking-wide">{item.label}</span>
                        </span>
                        
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md shadow-rose-500/10 min-w-5 text-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Logout/Back */}
            <div className="pt-4 border-t border-slate-100">
              <Link 
                href="/"
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-black text-slate-500 hover:text-rose-600 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider">Keluar Menu</span>
              </Link>
            </div>
          </aside>

          {/* Main workspace */}
          <main className="flex-grow h-full overflow-y-auto pr-1 bg-transparent min-w-0">
            {children}
          </main>

        </div>
      </div>
    </AdminContext.Provider>
  );
}
