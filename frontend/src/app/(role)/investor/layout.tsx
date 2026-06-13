import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import Image from "../../../components/ui/Image";
import NotificationBell from "../../../components/ui/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Briefcase, Landmark, Wallet,
  ShieldCheck, User, Bell, Search, Menu, X, LogOut,
  LayoutDashboard, BarChart2
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
  status: "Aktif" | "Selesai" | "Berjalan" | string;
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
  business_name?: string;
  current_amount?: number;
  status?: string;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "seller";
  text: string;
  time: string;
}

interface InvestorContextType {
  walletBalance: number;
  depositWallet: (amount: number) => Promise<boolean>;
  withdrawWallet: (amount: number) => Promise<boolean>;
  txHistory: Transaction[];
  myPortfolio: PortfolioItem[];
  catalogCampaigns: Campaign[];
  investInCampaign: (campaignId: number, amount: number) => boolean;
  messages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  umkms: any[];
  investorInvestasis: any[];
  investorPendanaans: any[];
  submitInvestasi: (umkmId: number, amount: number, message: string, tenor: string, roi: number) => Promise<boolean>;
  resolvePendanaan: (pendanaanId: number, decision: "Diterima" | "Ditolak") => Promise<boolean>;
  refreshInvestorData: () => void;
}

const InvestorContext = createContext<InvestorContextType | undefined>(undefined);

export function useInvestor() {
  const context = useContext(InvestorContext);
  if (!context) throw new Error("useInvestor must be used within an InvestorProvider");
  return context;
}

export default function InvestorLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const [walletBalance, setWalletBalance] = useState(25000000);
  const [txHistory, setTxHistory] = useState<Transaction[]>([
    { id: "TX-90212", date: "15 Mei 2026", type: "Top Up", amount: 10000000, status: "Sukses" },
    { id: "TX-90211", date: "12 Mei 2026", type: "Investasi", amount: 5000000, status: "Sukses" }
  ]);
  const [myPortfolio, setMyPortfolio] = useState<PortfolioItem[]>([]);
  const [catalogCampaigns, setCatalogCampaigns] = useState<Campaign[]>([]);
  const [umkms, setUmkms] = useState<any[]>([]);
  const [investorInvestasis, setInvestorInvestasis] = useState<any[]>([]);
  const [investorPendanaans, setInvestorPendanaans] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "seller", text: "Halo Pak! Laporan perkembangan panen padi biru triwulan pertama sudah kami unggah.", time: "09:00" },
    { id: 2, sender: "user", text: "Luar biasa! Terima kasih atas keterbukaannya.", time: "09:05" }
  ]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/auth/profile", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) { const u = await res.json(); setWalletBalance(Number(u.wallet_balance)); }
    } catch (err) { console.error(err); }
  };

  const fetchCampaigns = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/investor/campaigns", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setCatalogCampaigns(data.map((c: any) => ({
          id: c.id, title: c.title, umkm: c.umkm, target: Number(c.target), current: Number(c.current),
          progress: c.progress, roi: c.roi, tenor: c.tenor, risk: c.risk,
          img: c.image || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&q=80"
        })));
      }
    } catch (err) { console.error(err); }
  };

  const fetchPortfolio = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/investor/portfolio", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setMyPortfolio(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchUmkms = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/investor/umkms", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setUmkms(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchInvestorInvestasis = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/investor/investasi", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setInvestorInvestasis(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchInvestorPendanaans = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/investor/pendanaan", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setInvestorPendanaans(await res.json());
    } catch (err) { console.error(err); }
  };

  const refreshInvestorData = () => {
    fetchProfile(); fetchCampaigns(); fetchPortfolio();
    fetchUmkms(); fetchInvestorInvestasis(); fetchInvestorPendanaans();
  };

  useEffect(() => { refreshInvestorData(); }, []);

  const depositWallet = async (amount: number): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const res = await fetch("http://localhost:8000/api/investor/wallet/deposit", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.wallet_balance);
        setTxHistory(prev => [{ id: `TX-${Math.floor(Math.random() * 90000 + 10000)}`, date: "Hari Ini", type: "Top Up", amount, status: "Sukses" }, ...prev]);
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const withdrawWallet = async (amount: number): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token || amount > walletBalance) return false;
    try {
      const res = await fetch("http://localhost:8000/api/investor/wallet/withdraw", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.wallet_balance);
        setTxHistory(prev => [{ id: `TX-${Math.floor(Math.random() * 90000 + 10000)}`, date: "Hari Ini", type: "Penarikan", amount, status: "Sukses" }, ...prev]);
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const investInCampaign = async (campaignId: number, amount: number): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token || amount > walletBalance) return false;
    try {
      const res = await fetch("http://localhost:8000/api/investor/invest", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ campaign_id: campaignId, amount })
      });
      if (res.ok) {
        fetchProfile(); fetchCampaigns(); fetchPortfolio();
        setTxHistory(prev => [{ id: `TX-${Math.floor(Math.random() * 90000 + 10000)}`, date: "Hari Ini", type: "Investasi", amount, status: "Sukses" }, ...prev]);
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const submitInvestasi = async (umkmId: number, amount: number, message: string, tenor: string, roi: number): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const res = await fetch("http://localhost:8000/api/investor/investasi", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ umkm_id: umkmId, amount, message, tenor, roi })
      });
      if (res.ok) { refreshInvestorData(); return true; }
    } catch (err) { console.error(err); }
    return false;
  };

  const resolvePendanaan = async (pendanaanId: number, decision: "Diterima" | "Ditolak"): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const res = await fetch(`http://localhost:8000/api/investor/pendanaan/${pendanaanId}/resolve`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ decision })
      });
      if (res.ok) { refreshInvestorData(); return true; }
    } catch (err) { console.error(err); }
    return false;
  };

  const sendChatMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: "user", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: "seller",
        text: "Terima kasih atas dukungannya! Dividen triwulan kedua akan kami salurkan tepat tanggal 1 bulan depan.",
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
    walletBalance, depositWallet, withdrawWallet, txHistory, myPortfolio, catalogCampaigns,
    investInCampaign, messages, sendChatMessage, umkms, investorInvestasis, investorPendanaans,
    submitInvestasi, resolvePendanaan, refreshInvestorData
  }), [walletBalance, txHistory, myPortfolio, catalogCampaigns, messages, umkms, investorInvestasis, investorPendanaans]);

  const menuItems = [
    { href: "/investor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/investor/umkm", label: "Data UMKM", icon: Briefcase },
    { href: "/investor/persetujuan", label: "Terima / Tolak Investasi", icon: ShieldCheck },
    { href: "/investor/pengajuan", label: "Pengajuan Investasi", icon: Landmark },
    { href: "/investor/laporan", label: "Laporan Investasi", icon: BarChart2 },
    { href: "/investor/profil", label: "Profil", icon: User },
  ];

  const userInitials = user?.name
    ? user.name.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "IV";

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
          <TrendingUp className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Investor</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 mx-4 mt-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "Bambang Hermawan"}</p>
            <p className="text-[10px] text-amber-600 font-semibold truncate">{user?.email || "Mitra Pemodal"}</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        </div>
        {/* Wallet */}
        <div className="mt-3 flex items-center gap-2 bg-white/70 rounded-lg px-3 py-2 border border-amber-100">
          <Wallet className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-slate-700">Rp {walletBalance.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Portofolio</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                  ? "bg-amber-50 text-amber-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="investorSidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-500 rounded-r-full"
                />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-amber-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span>{item.label}</span>
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
    <InvestorContext.Provider value={contextValue}>
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
                key="investor-overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                key="investor-drawer"
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
              <span className="font-semibold text-slate-800">Portal Investor</span>
              <span className="text-slate-300">/</span>
              <span className="capitalize">{pathname.split("/").filter(Boolean).pop() || "dashboard"}</span>
            </div>

            <div className="flex-1" />

            {/* Wallet widget in header */}
            <div className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700">
              <Wallet className="w-3.5 h-3.5" />
              <span>Rp {walletBalance.toLocaleString("id-ID")}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 focus-within:border-amber-400 focus-within:bg-white px-3 py-1.5 rounded-lg transition-all duration-200 w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input type="text" placeholder="Cari investasi..." className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 w-full" />
            </div>

            <NotificationBell />

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {userInitials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || "Bambang Hermawan"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Investor</p>
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
    </InvestorContext.Provider>
  );
}
