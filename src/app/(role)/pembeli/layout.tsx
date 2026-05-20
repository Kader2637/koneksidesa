"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, ShoppingCart, Truck, Sparkles, 
  MessageSquare, Star, User, Bell, Search, ArrowLeft
} from "lucide-react";

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  desa: string;
  img: string;
  rating: number;
  category: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "seller";
  text: string;
  time: string;
}

export interface ProductReview {
  name: string;
  product: string;
  rating: number;
  text: string;
}

interface PembeliContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQty: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  messages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  reviewsList: ProductReview[];
  submitReview: (name: string, product: string, rating: number, text: string) => void;
}

const PembeliContext = createContext<PembeliContextType | undefined>(undefined);

export function usePembeli() {
  const context = useContext(PembeliContext);
  if (!context) {
    throw new Error("usePembeli must be used within a PembeliProvider");
  }
  return context;
}

export default function PembeliLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // State
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      name: "Kopi Robusta Asli",
      price: 45000,
      desa: "Desa Agro Rejo",
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
      rating: 4.9,
      category: "Minuman",
      qty: 1
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "seller", text: "Halo Kak! Ada yang bisa kami bantu mengenai pesanan Tas Anyam Pandan?", time: "10:14" },
    { id: 2, sender: "user", text: "Apakah barangnya ready stock ya?", time: "10:15" },
    { id: 3, sender: "seller", text: "Ready sekali Kak! Jika pesan sebelum jam 3 sore akan langsung kami kirim hari ini.", time: "10:15" }
  ]);

  const [reviewsList, setReviewsList] = useState<ProductReview[]>([
    { name: "Andi Saputra", product: "Tas Anyam Pandan", rating: 5, text: "Bagus sekali anyamannya rapi dan sangat kokoh untuk belanja bulanan!" },
    { name: "Rina Wijaya", product: "Kopi Robusta Asli", rating: 4, text: "Aroma kopinya kuat sekali, mantap diminum fajar hari." }
  ]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  // Chat operator send message
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
        text: "Terima kasih atas pesannya! Tim Mitra UMKM KoneksiDesa akan segera mengecek pesanan Anda dalam hitungan menit.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1200);
  };

  // Review submission
  const submitReview = (name: string, product: string, rating: number, text: string) => {
    setReviewsList((prev) => [
      { name, product, rating, text },
      ...prev
    ]);
  };

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    messages,
    sendChatMessage,
    reviewsList,
    submitReview
  }), [cart, cartCount, cartTotal, messages, reviewsList]);

  const menuItems = [
    { href: "/pembeli", label: "Bazar Belanja", icon: ShoppingBag },
    { href: "/pembeli/keranjang", label: "Keranjang", icon: ShoppingCart, badge: cartCount },
    { href: "/pembeli/lacak", label: "Lacak Pengiriman", icon: Truck },
    { href: "/pembeli/rekomendasi", label: "Rekomendasi AI", icon: Sparkles },
    { href: "/pembeli/chat", label: "Chat Penjual", icon: MessageSquare },
    { href: "/pembeli/ulasan", label: "Ulasan Produk", icon: Star }
  ];

  return (
    <PembeliContext.Provider value={contextValue}>
      <div className="h-screen bg-slate-50 text-slate-700 flex flex-col font-sans antialiased overflow-hidden relative selection:bg-indigo-500/20 selection:text-indigo-900">
        
        {/* Soft decorative background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

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
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 font-extrabold px-3.5 py-1 rounded-full border border-indigo-200/50 uppercase tracking-widest text-[9px] shadow-sm">
                <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                <span>Bazar Pembeli</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Live Shopping Cart badge */}
            <Link 
              href="/pembeli/keranjang"
              className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-slate-350 transition cursor-pointer shadow-sm"
            >
              <ShoppingCart className="w-4 h-4 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/60 border border-slate-200/40 focus-within:border-indigo-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-500 transition-all duration-300 w-56 shadow-inner">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari produk desa..." 
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

            {/* Profile Details */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 pl-2.5 pr-4.5 py-1.5 rounded-full transition-all duration-300 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center border border-white shadow-md text-white font-extrabold text-xs">
                BS
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Ritel Konsumen</p>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">Budi Santoso</p>
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
                <div className="relative w-14 h-14 mx-auto rounded-full bg-indigo-50 p-0.5 border border-indigo-200 flex items-center justify-center mb-3 shadow-inner">
                  <User className="w-6 h-6 text-indigo-500" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">Budi Santoso</h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">Pembeli Setia</p>
                
                <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-slate-500 font-extrabold tracking-wide uppercase">Konsumen Aktif</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Bazar Desa</p>
                
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
                            ? "text-indigo-600 border-indigo-200 bg-indigo-50/50 shadow-sm font-extrabold" 
                            : "text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-50"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="pembeliSidebarHighlight"
                            className="absolute inset-0 bg-indigo-50/80 rounded-2xl border-l-2 border-indigo-500 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        
                        <span className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isSelected ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-655"}`} />
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
    </PembeliContext.Provider>
  );
}
