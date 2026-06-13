import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import Image from "../../../components/ui/Image";
import NotificationBell from "../../../components/ui/NotificationBell";
import GlobalSearch from "../../../components/ui/GlobalSearch";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, ShoppingCart, Truck, Sparkles,
  MessageSquare, Star, User, Bell, Search, ArrowLeft, Menu, X,
  LayoutDashboard, Package, LogOut
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
  description?: string;
  stock?: number;
  seller_id?: number;
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
  checkout: (paymentMethod: string) => Promise<any>;
}

const PembeliContext = createContext<PembeliContextType | undefined>(undefined);

export function usePembeli() {
  const context = useContext(PembeliContext);
  if (!context) {
    throw new Error("usePembeli must be used within a PembeliProvider");
  }
  return context;
}

export default function PembeliLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:8000/api/auth/logout", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });
      }
    } catch (err) { console.error(err); }
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{ name: string; role: string; email: string; avatar?: string } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Parse user error:", e);
        }
      }
    };
    loadUser();
    window.addEventListener("profile-updated", loadUser);
    return () => window.removeEventListener("profile-updated", loadUser);
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "seller", text: "Halo Kak! Ada yang bisa kami bantu mengenai pesanan Tas Anyam Pandan?", time: "10:14" },
    { id: 2, sender: "user", text: "Apakah barangnya ready stock ya?", time: "10:15" },
    { id: 3, sender: "seller", text: "Ready sekali Kak! Jika pesan sebelum jam 3 sore akan langsung kami kirim hari ini.", time: "10:15" }
  ]);

  const [reviewsList, setReviewsList] = useState<ProductReview[]>([
    { name: "Andi Saputra", product: "Tas Anyam Pandan", rating: 5, text: "Bagus sekali anyamannya rapi dan sangat kokoh untuk belanja bulanan!" },
    { name: "Rina Wijaya", product: "Kopi Robusta Asli", rating: 4, text: "Aroma kopinya kuat sekali, mantap diminum fajar hari." }
  ]);

  // Fetch cart on load
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8000/api/carts", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Cart operations
  const addToCart = async (product: Product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
        }
        return [...prev, { ...product, qty: 1 }];
      });
      return;
    }
    try {
      await fetch("http://localhost:8000/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      });
      await fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const updateQty = async (id: number, delta: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCart((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : item;
          }
          return item;
        })
      );
      return;
    }
    try {
      await fetch(`http://localhost:8000/api/carts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ delta })
      });
      await fetchCart();
    } catch (err) {
      console.error("Update qty error:", err);
    }
  };

  const removeFromCart = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    try {
      await fetch(`http://localhost:8000/api/carts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {
      console.error("Remove cart error:", err);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCart([]);
      return;
    }
    try {
      await fetch("http://localhost:8000/api/carts", {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setCart([]);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const checkout = async (paymentMethod: string) => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ payment_method: paymentMethod })
      });
      if (response.ok) {
        const data = await response.json();
        setCart([]);
        return data;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
    return null;
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.qty), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

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

  const submitReview = (name: string, product: string, rating: number, text: string) => {
    setReviewsList((prev) => [{ name, product, rating, text }, ...prev]);
  };

  const contextValue = useMemo(() => ({
    cart, addToCart, updateQty, removeFromCart, clearCart,
    cartCount, cartTotal, messages, sendChatMessage, reviewsList, submitReview, checkout
  }), [cart, cartCount, cartTotal, messages, reviewsList]);

  const menuItems = [
    { href: "/pembeli", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pembeli/produk", label: "Produk", icon: Package },
    { href: "/pembeli/pesanan", label: "Pesanan", icon: Truck },
    { href: "/pembeli/keranjang", label: "Keranjang", icon: ShoppingCart, badge: cartCount },
    { href: "/pembeli/profil", label: "Profil", icon: User },
  ];

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "BS";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-8 w-32 overflow-hidden">
            <Image src="/logo1.png" alt="KoneksiDesa" fill className="object-contain" />
          </div>
        </Link>
        <div className="mt-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Pembeli</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 mx-4 mt-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover shadow-sm border border-emerald-250"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {userInitials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "Budi Santoso"}</p>
            <p className="text-[10px] text-emerald-600 font-semibold truncate">{user?.email || "Konsumen Setia"}</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-sm shadow-emerald-300" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Menu Utama</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="pembeliSidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-500 rounded-r-full"
                />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-slate-100 pt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <PembeliContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-50 flex font-sans antialiased">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-60 xl:w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30 shadow-sm">
          <SidebarContent />
        </aside>

        {/* ── Mobile Sidebar Overlay ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                key="mobile-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                key="mobile-sidebar"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 lg:hidden shadow-xl"
              >
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main Content Area ── */}
        <div className="flex-1 flex flex-col lg:ml-60 xl:ml-64 min-h-screen">

          {/* Top Header */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-4 shadow-sm">

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex-shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Page Context */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-800">Portal Pembeli</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 capitalize">
                {pathname.split("/").filter(Boolean).pop() || "dashboard"}
              </span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search */}
            <div 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 cursor-pointer hover:border-emerald-400/50 px-3 py-1.5 rounded-lg transition-all duration-200 w-52"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-400 font-semibold select-none">Cari produk desa...</span>
            </div>

            {/* Cart Badge */}
            <Link
              to="/pembeli/keranjang"
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Notification */}
            <NotificationBell />

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover shadow-sm border border-slate-250"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {userInitials}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || "Budi Santoso"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pembeli</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <AnimatePresence>
        {isSearchOpen && (
          <GlobalSearch onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </PembeliContext.Provider>
  );
}
