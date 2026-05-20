"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, Briefcase, Landmark, Wallet, 
  MessageSquare, ShieldCheck, User,
  Bell, Search, Sparkles, ArrowLeft
} from "lucide-react";

// Types
export interface Transaction {
  id: string;
  date: string;
  type: "Top Up" | "Investasi" | "Penarikan";
  amount: number;
  status: "Sukses" | "Proses";
}

export interface PortfolioItem {
  id: number;
  title: string;
  umkm: string;
  invested: number;
  roi: number;
  expectedReturn: number;
  status: "Aktif" | "Selesai";
}

export interface Campaign {
  id: number;
  title: string;
  umkm: string;
  target: number;
  current: number;
  progress: number;
  roi: number;
  tenor: string;
  risk: "Sangat Rendah" | "Rendah" | "Sedang";
  img: string;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "seller";
  text: string;
  time: string;
}

interface InvestorContextType {
  walletBalance: number;
  depositWallet: (amount: number) => void;
  withdrawWallet: (amount: number) => boolean;
  txHistory: Transaction[];
  myPortfolio: PortfolioItem[];
  catalogCampaigns: Campaign[];
  investInCampaign: (campaignId: number, amount: number) => boolean;
  messages: ChatMessage[];
  sendChatMessage: (text: string) => void;
}

const InvestorContext = createContext<InvestorContextType | undefined>(undefined);

export function useInvestor() {
  const context = useContext(InvestorContext);
  if (!context) {
    throw new Error("useInvestor must be used within an InvestorProvider");
  }
  return context;
}

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // State
  const [walletBalance, setWalletBalance] = useState(25000000); // Rp 25.000.000

  const [txHistory, setTxHistory] = useState<Transaction[]>([
    { id: "TX-90212", date: "15 Mei 2026", type: "Top Up", amount: 10000000, status: "Sukses" },
    { id: "TX-90211", date: "12 Mei 2026", type: "Investasi", amount: 5000000, status: "Sukses" }
  ]);

  const [myPortfolio, setMyPortfolio] = useState<PortfolioItem[]>([
    { id: 102, title: "Pembelian Bahan Baku Grosir", umkm: "Sentra Anyam Pandan Indah", invested: 5000000, roi: 11, expectedReturn: 5550000, status: "Aktif" }
  ]);

  const [catalogCampaigns, setCatalogCampaigns] = useState<Campaign[]>([
    { id: 101, title: "Modernisasi Alat Panen Padi", umkm: "Kelompok Tani Padi Biru", target: 50000000, current: 42500000, progress: 85, roi: 15, tenor: "6 Bulan", risk: "Rendah", img: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&q=80" },
    { id: 102, title: "Pembelian Bahan Baku Grosir", umkm: "Sentra Anyam Pandan Indah", target: 15000000, current: 15000000, progress: 100, roi: 11, tenor: "3 Bulan", risk: "Sangat Rendah", img: "https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80" },
    { id: 103, title: "Restorasi Tambak Lele", umkm: "Kelompok Mina Lestari", target: 25000000, current: 5000000, progress: 20, roi: 18, tenor: "12 Bulan", risk: "Sedang", img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80" }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "seller", text: "Halo Pak Bambang! Laporan perkembangan panen padi biru triwulan pertama sudah kami unggah.", time: "09:00" },
    { id: 2, sender: "user", text: "Luar biasa! Terima kasih atas keterbukaannya. Sangat puas dengan transparansinya.", time: "09:05" }
  ]);

  // Actions
  const depositWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    setTxHistory((prev) => [
      {
        id: `TX-${Math.floor(Math.random() * 90000 + 10000)}`,
        date: "Hari Ini",
        type: "Top Up",
        amount,
        status: "Sukses"
      },
      ...prev
    ]);
  };

  const withdrawWallet = (amount: number): boolean => {
    if (amount > walletBalance) return false;
    setWalletBalance((prev) => prev - amount);
    setTxHistory((prev) => [
      {
        id: `TX-${Math.floor(Math.random() * 90000 + 10000)}`,
        date: "Hari Ini",
        type: "Penarikan",
        amount,
        status: "Sukses"
      },
      ...prev
    ]);
    return true;
  };

  const investInCampaign = (campaignId: number, amount: number): boolean => {
    if (amount > walletBalance) return false;

    // Check if campaign exists
    const camp = catalogCampaigns.find(c => c.id === campaignId);
    if (!camp) return false;

    // Check capacity limit
    const capacityLeft = camp.target - camp.current;
    if (amount > capacityLeft) return false;

    // Subtract from balance
    setWalletBalance((prev) => prev - amount);

    // Update catalog target progress
    setCatalogCampaigns((prev) => 
      prev.map((c) => {
        if (c.id === campaignId) {
          const nextAmt = c.current + amount;
          return {
            ...c,
            current: nextAmt,
            progress: Math.min(100, Math.round((nextAmt / c.target) * 100))
          };
        }
        return c;
      })
    );

    // Add to transaction history
    setTxHistory((prev) => [
      {
        id: `TX-${Math.floor(Math.random() * 90000 + 10000)}`,
        date: "Hari Ini",
        type: "Investasi",
        amount,
        status: "Sukses"
      },
      ...prev
    ]);

    // Add to portfolio
    const expectRet = amount + (amount * (camp.roi / 100));
    setMyPortfolio((prev) => {
      const existing = prev.find(p => p.id === campaignId);
      if (existing) {
        return prev.map(p => p.id === campaignId ? { 
          ...p, 
          invested: p.invested + amount,
          expectedReturn: p.expectedReturn + expectRet 
        } : p);
      }
      return [...prev, {
        id: campaignId,
        title: camp.title,
        umkm: camp.umkm,
        invested: amount,
        roi: camp.roi,
        expectedReturn: expectRet,
        status: "Aktif"
      }];
    });

    return true;
  };

  const sendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: Date.now() + 1,
        sender: "seller",
        text: "Terima kasih atas dukungannya Pak! Dividen triwulan kedua akan kami salurkan tepat tanggal 1 bulan depan.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1200);
  };

  const contextValue = useMemo(() => ({
    walletBalance,
    depositWallet,
    withdrawWallet,
    txHistory,
    myPortfolio,
    catalogCampaigns,
    investInCampaign,
    messages,
    sendChatMessage
  }), [walletBalance, txHistory, myPortfolio, catalogCampaigns, messages]);

  const menuItems = [
    { href: "/investor", label: "Ringkasan Dasbor", icon: TrendingUp },
    { href: "/investor/portfolio", label: "Portofolio Aktif", icon: Briefcase },
    { href: "/investor/katalog", label: "Katalog Investasi", icon: Landmark },
    { href: "/investor/wallet", label: "Dompet & Keuangan", icon: Wallet },
    { href: "/investor/chat", label: "Diskusi Mitra", icon: MessageSquare },
    { href: "/investor/scoring", label: "AI Credit Scoring", icon: ShieldCheck }
  ];

  return (
    <InvestorContext.Provider value={contextValue}>
      <div className="h-screen bg-slate-50 text-slate-700 flex flex-col font-sans antialiased overflow-hidden relative selection:bg-amber-500/20 selection:text-amber-900">
        
        {/* Soft decorative background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

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
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 font-extrabold px-3.5 py-1 rounded-full border border-amber-200/50 uppercase tracking-widest text-[9px] shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                <span>Portal Investor</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Wallet Balance Widget */}
            <div className="bg-emerald-50 border border-emerald-200/50 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 text-emerald-700 shadow-sm">
              <Wallet className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Rp {walletBalance.toLocaleString("id-ID")}</span>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/60 border border-slate-200/40 focus-within:border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-500 transition-all duration-300 w-56 shadow-inner">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari investasi..." 
                className="bg-transparent border-none outline-none text-slate-800 text-xs w-full placeholder:text-slate-400"
              />
            </div>

            {/* Notification hub */}
            <button className="relative p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-655 transition-all duration-300 cursor-pointer shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            <div className="h-6 w-[1px] bg-slate-200" />

            {/* Investor Profile Details */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 pl-2.5 pr-4.5 py-1.5 rounded-full transition-all duration-300 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center border border-white shadow-md text-white font-extrabold text-xs">
                BI
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Mitra Pemodal</p>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">Bambang Hermawan</p>
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
                <div className="relative w-14 h-14 mx-auto rounded-full bg-amber-50 p-0.5 border border-amber-200 flex items-center justify-center mb-3 shadow-inner">
                  <User className="w-6 h-6 text-amber-500" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">Pak Bambang</h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">Pemodal Ritel</p>
                
                <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-slate-500 font-extrabold tracking-wide uppercase">Koneksi Aktif</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Manajemen Portofolio</p>
                
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
                            ? "text-amber-600 border-amber-200 bg-amber-50/50 shadow-sm font-extrabold" 
                            : "text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-50"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="investorSidebarHighlight"
                            className="absolute inset-0 bg-amber-50/80 rounded-2xl border-l-2 border-amber-500 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        
                        <span className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isSelected ? "text-amber-600" : "text-slate-400 group-hover:text-slate-655"}`} />
                          <span className="tracking-wide">{item.label}</span>
                        </span>
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
    </InvestorContext.Provider>
  );
}
