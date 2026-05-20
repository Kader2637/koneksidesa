"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, Package, ClipboardList, Sparkles, 
  DollarSign, MessageSquare, ShieldCheck, User,
  Bell, Search, ArrowLeft
} from "lucide-react";

// Types
export interface MerchantProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  img: string;
}

export interface MerchantOrder {
  id: string;
  buyer: string;
  product: string;
  qty: number;
  total: number;
  status: "Pending" | "Diproses" | "Dikirim";
  date: string;
}

export interface LoanRequest {
  id: string;
  amount: number;
  tenor: string;
  status: "Pending" | "Aktif";
  paymentProgress: number;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "seller";
  text: string;
  time: string;
}

interface UMKMContextType {
  products: MerchantProduct[];
  addProduct: (name: string, price: number, stock: number, category: string, img: string) => void;
  deleteProduct: (id: number) => void;
  orders: MerchantOrder[];
  advanceOrderStatus: (orderId: string) => void;
  loans: LoanRequest[];
  submitLoanRequest: (amount: number, tenor: string) => void;
  messages: ChatMessage[];
  sendChatMessage: (text: string) => void;
}

const UMKMContext = createContext<UMKMContextType | undefined>(undefined);

export function useUMKM() {
  const context = useContext(UMKMContext);
  if (!context) {
    throw new Error("useUMKM must be used within a UMKMProvider");
  }
  return context;
}

export default function UMKMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // State Management
  const [products, setProducts] = useState<MerchantProduct[]>([
    { id: 1, name: "Kopi Robusta Asli", price: 45000, stock: 120, category: "Minuman", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" },
    { id: 2, name: "Tas Anyam Pandan", price: 75000, stock: 45, category: "Kerajinan", img: "https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80" }
  ]);

  const [orders, setOrders] = useState<MerchantOrder[]>([
    { id: "TX-10023", buyer: "Budi Santoso", product: "Kopi Robusta Asli", qty: 2, total: 90000, status: "Pending", date: "Hari Ini" },
    { id: "TX-10022", buyer: "Siti Rahma", product: "Tas Anyam Pandan", qty: 1, total: 75000, status: "Diproses", date: "Kemarin" }
  ]);

  const [loans, setLoans] = useState<LoanRequest[]>([
    { id: "LN-9821", amount: 15000000, tenor: "6 Bulan", status: "Aktif", paymentProgress: 42 }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "user", text: "Halo Mitra UMKM! Apakah saya bisa memesan kustom anyaman dengan inisial nama?", time: "13:40" },
    { id: 2, sender: "seller", text: "Tentu bisa Kak! Ingin inisial huruf apa saja ya?", time: "13:42" },
    { id: 3, sender: "user", text: "Inisial B.S ya Kak, warna emas halus.", time: "13:43" }
  ]);

  // Actions
  const addProduct = (name: string, price: number, stock: number, category: string, img: string) => {
    const newProd: MerchantProduct = {
      id: Date.now(),
      name,
      price,
      stock,
      category,
      img
    };
    setProducts((prev) => [...prev, newProd]);
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) => 
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (ord.status === "Pending") return { ...ord, status: "Diproses" };
          if (ord.status === "Diproses") return { ...ord, status: "Dikirim" };
        }
        return ord;
      })
    );
  };

  const submitLoanRequest = (amount: number, tenor: string) => {
    const newLoan: LoanRequest = {
      id: `LN-${Math.floor(Math.random() * 9000 + 1000)}`,
      amount,
      tenor,
      status: "Pending",
      paymentProgress: 0
    };
    setLoans((prev) => [newLoan, ...prev]);
  };

  const sendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "seller",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulate auto buyer reply
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: Date.now() + 1,
        sender: "user",
        text: "Baik Kak, terima kasih atas respons cepatnya! Saya akan langsung melakukan checkout sekarang.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1200);
  };

  const contextValue = useMemo(() => ({
    products,
    addProduct,
    deleteProduct,
    orders,
    advanceOrderStatus,
    loans,
    submitLoanRequest,
    messages,
    sendChatMessage
  }), [products, orders, loans, messages]);

  const pendingOrdersCount = orders.filter(o => o.status === "Pending").length;

  const menuItems = [
    { href: "/umkm", label: "Ringkasan Dasbor", icon: Store },
    { href: "/umkm/produk", label: "Kelola Produk", icon: Package },
    { href: "/umkm/pesanan", label: "Pesanan Masuk", icon: ClipboardList, badge: pendingOrdersCount },
    { href: "/umkm/ai-harga", label: "AI Analisis Harga", icon: Sparkles },
    { href: "/umkm/pinjaman", label: "Pinjaman Modal", icon: DollarSign },
    { href: "/umkm/chat", label: "Chat Pelanggan", icon: MessageSquare },
    { href: "/umkm/skor", label: "Skor Kualitas AI", icon: ShieldCheck }
  ];

  return (
    <UMKMContext.Provider value={contextValue}>
      <div className="h-screen bg-slate-50 text-slate-700 flex flex-col font-sans antialiased overflow-hidden relative selection:bg-emerald-500/20 selection:text-emerald-900">
        
        {/* Soft decorative background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

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
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 font-extrabold px-3.5 py-1 rounded-full border border-emerald-200/50 uppercase tracking-widest text-[9px] shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Mitra UMKM</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/60 border border-slate-200/40 focus-within:border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-500 transition-all duration-300 w-64 shadow-inner">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari produk atau pesanan..." 
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

            {/* Merchant Profile Details */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 pl-2.5 pr-4.5 py-1.5 rounded-full transition-all duration-300 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center border border-white shadow-md text-white font-extrabold text-xs">
                UM
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Toko Jaya Makmur</p>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">Mitra Karya Maju</p>
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
                <div className="relative w-14 h-14 mx-auto rounded-full bg-emerald-50 p-0.5 border border-emerald-200 flex items-center justify-center mb-3 shadow-inner">
                  <User className="w-6 h-6 text-emerald-500" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">Toko Karya Maju</h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">Status: Terverifikasi</p>
                
                <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-slate-500 font-extrabold tracking-wide uppercase">Toko Buka</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Manajemen Toko</p>
                
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
                            ? "text-emerald-600 border-emerald-200 bg-emerald-50/50 shadow-sm font-extrabold" 
                            : "text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-50"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="umkmSidebarHighlight"
                            className="absolute inset-0 bg-emerald-50/80 rounded-2xl border-l-2 border-emerald-500 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        
                        <span className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-655"}`} />
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
    </UMKMContext.Provider>
  );
}
