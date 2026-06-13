import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import Image from "../../../components/ui/Image";
import NotificationBell from "../../../components/ui/NotificationBell";
import GlobalSearch from "../../../components/ui/GlobalSearch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, Package, ClipboardList,
  DollarSign, ShieldCheck, User,
  Bell, Search, Menu, X, LogOut,
  LayoutDashboard, BarChart2
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
  raw_id: number;
  buyer: string;
  product: string;
  qty: number;
  total: number;
  status: "Pending" | "Diproses" | "Dikirim" | "Selesai" | "Cancelled" | string;
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
  updateProduct: (id: number, name: string, price: number, stock: number, category: string, img: string) => Promise<void>;
  deleteProduct: (id: number) => void;
  orders: MerchantOrder[];
  advanceOrderStatus: (orderId: string) => void;
  loans: LoanRequest[];
  submitLoanRequest: (amount: number, tenor: string) => void;
  messages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  investors: any[];
  umkmPendanaans: any[];
  umkmInvestasis: any[];
  submitPendanaan: (title: string, businessName: string, description: string, purpose: string, targetAmount: number, tenor: string, investorId: number, roi: number, proposal?: string) => Promise<void>;
  resolveInvestasi: (investmentId: number, decision: "Diterima" | "Ditolak") => Promise<void>;
  refreshUmkmData: () => void;
  financeStats: {
    wallet_balance: number;
    total_investor_funds: number;
    total_sales_revenue: number;
    total_combined: number;
  };
}

const UMKMContext = createContext<UMKMContextType | undefined>(undefined);

export function useUMKM() {
  const context = useContext(UMKMContext);
  if (!context) throw new Error("useUMKM must be used within a UMKMProvider");
  return context;
}

export default function UMKMLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; email: string; avatar?: string } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
      }
    };
    loadUser();
    window.addEventListener("profile-updated", loadUser);
    return () => window.removeEventListener("profile-updated", loadUser);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const [products, setProducts] = useState<MerchantProduct[]>([]);
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [umkmPendanaans, setUmkmPendanaans] = useState<any[]>([]);
  const [umkmInvestasis, setUmkmInvestasis] = useState<any[]>([]);
  const [financeStats, setFinanceStats] = useState({
    wallet_balance: 0,
    total_investor_funds: 0,
    total_sales_revenue: 0,
    total_combined: 0
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "user", text: "Halo Mitra UMKM! Apakah saya bisa memesan kustom anyaman dengan inisial nama?", time: "13:40" },
    { id: 2, sender: "seller", text: "Tentu bisa Kak! Ingin inisial huruf apa saja ya?", time: "13:42" },
    { id: 3, sender: "user", text: "Inisial B.S ya Kak, warna emas halus.", time: "13:43" }
  ]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/products", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.map((item: any) => ({
          id: item.id, name: item.name, price: Number(item.price),
          stock: item.stock, category: item.category,
          img: item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
        })));
      }
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/orders", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setOrders(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchLoans = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/loans", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setLoans(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchInvestors = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/investors", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setInvestors(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchUmkmPendanaans = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/pendanaan", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setUmkmPendanaans(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchUmkmInvestasis = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/investasi", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setUmkmInvestasis(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchFinanceStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/finance-stats", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setFinanceStats(await res.json());
    } catch (err) { console.error(err); }
  };

  const refreshUmkmData = () => {
    fetchProducts(); fetchOrders(); fetchLoans();
    fetchInvestors(); fetchUmkmPendanaans(); fetchUmkmInvestasis();
    fetchFinanceStats();
  };

  useEffect(() => { refreshUmkmData(); }, []);

  const addProduct = async (name: string, price: number, stock: number, category: string, img: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name, price, stock, category, image: img })
      });
      if (res.ok) fetchProducts();
    } catch (err) { console.error(err); }
  };

  const deleteProduct = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/umkm/products/${id}`, {
        method: "DELETE", headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchProducts();
    } catch (err) { console.error(err); }
  };

  const updateProduct = async (id: number, name: string, price: number, stock: number, category: string, img: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/umkm/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name, price, stock, category, image: img })
      });
      if (res.ok) fetchProducts();
    } catch (err) { console.error("Update product error:", err); }
  };

  const advanceOrderStatus = async (orderId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const ordObj = orders.find(o => o.id === orderId);
    if (!ordObj) return;
    try {
      const res = await fetch(`http://localhost:8000/api/umkm/orders/${ordObj.raw_id}/status`, {
        method: "PUT", headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchOrders();
    } catch (err) { console.error(err); }
  };

  const submitLoanRequest = async (amount: number, tenor: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ amount, tenor })
      });
      if (res.ok) fetchLoans();
    } catch (err) { console.error(err); }
  };

  const submitPendanaan = async (title: string, businessName: string, description: string, purpose: string, targetAmount: number, tenor: string, investorId: number, roi: number, proposal?: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/umkm/pendanaan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title, business_name: businessName, description, purpose, target_amount: targetAmount, tenor, investor_id: investorId, roi, proposal })
      });
      if (res.ok) fetchUmkmPendanaans();
    } catch (err) { console.error(err); }
  };

  const resolveInvestasi = async (investmentId: number, decision: "Diterima" | "Ditolak") => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/umkm/investasi/${investmentId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ decision })
      });
      if (res.ok) fetchUmkmInvestasis();
    } catch (err) { console.error(err); }
  };

  const sendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now(), sender: "seller", text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: "user",
        text: "Baik Kak, terima kasih atas respons cepatnya!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

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

  const contextValue = useMemo(() => ({
    products, addProduct, updateProduct, deleteProduct,
    orders, advanceOrderStatus, loans, submitLoanRequest,
    messages, sendChatMessage, investors, umkmPendanaans, umkmInvestasis,
    submitPendanaan, resolveInvestasi, refreshUmkmData, financeStats
  }), [products, orders, loans, messages, investors, umkmPendanaans, umkmInvestasis, financeStats]);

  const pendingOrdersCount = orders.filter(o => o.status === "Pending").length;

  const menuItems = [
    { href: "/umkm", label: "Dashboard", icon: LayoutDashboard },
    { href: "/umkm/produk", label: "Kelola Produk", icon: Package },
    { href: "/umkm/pesanan", label: "Kelola Pesanan", icon: ClipboardList, badge: pendingOrdersCount },
    { href: "/umkm/pendanaan", label: "Pengajuan Pendanaan", icon: DollarSign },
    { href: "/umkm/investor", label: "Terima / Tolak Investor", icon: ShieldCheck },
    { href: "/umkm/laporan", label: "Laporan Investasi & ROI", icon: BarChart2 },
    { href: "/umkm/profil", label: "Profil", icon: User },
  ];

  const userInitials = user?.name
    ? user.name.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "UM";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative h-8 w-32 overflow-hidden">
            <Image src="/logo1.png" alt="KoneksiDesa" fill className="object-contain" />
          </div>
        </Link>
        <div className="mt-2 flex items-center gap-1.5">
          <Store className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mitra UMKM</span>
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
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "Toko Karya Maju"}</p>
            <p className="text-[10px] text-emerald-600 font-semibold truncate">{user?.email || "Mitra UMKM"}</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Manajemen Toko</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="umkmSidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-500 rounded-r-full"
                />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
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
    <UMKMContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-50 flex font-sans antialiased">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 xl:w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30 shadow-sm">
          <SidebarContent />
        </aside>

        {/* Mobile Overlay + Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                key="umkm-overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                key="umkm-drawer"
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
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

        {/* Main Area */}
        <div className="flex-1 flex flex-col lg:ml-60 xl:ml-64 min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-4 shadow-sm">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex-shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-800">Mitra UMKM</span>
              <span className="text-slate-300">/</span>
              <span className="capitalize">{pathname.split("/").filter(Boolean).pop() || "dashboard"}</span>
            </div>

            <div className="flex-1" />

            <div 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 cursor-pointer hover:border-emerald-400/50 px-3 py-1.5 rounded-lg transition-all duration-200 w-52"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-400 font-semibold select-none">Cari...</span>
            </div>

            {pendingOrdersCount > 0 && (
              <Link to="/umkm/pesanan" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>{pendingOrdersCount} Pesanan</span>
              </Link>
            )}

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
                <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || "Toko Karya Maju"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">UMKM</p>
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
    </UMKMContext.Provider>
  );
}
