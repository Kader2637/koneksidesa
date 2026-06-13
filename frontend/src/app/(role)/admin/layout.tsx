import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import Image from "../../../components/ui/Image";
import NotificationBell from "../../../components/ui/NotificationBell";
import GlobalSearch from "../../../components/ui/GlobalSearch";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, DollarSign, Users, Activity,
  User, LineChart, Bell, Search,
  Menu, X, LogOut, LayoutDashboard, Package
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
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}

export default function AdminLayout() {
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

  const [pendingKycs, setPendingKycs] = useState<PendingKYC[]>([]);
  const [pendingCampaigns, setPendingCampaigns] = useState<ModerationCampaign[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [villageTreasury, setVillageTreasury] = useState(42500000);
  const [withdrawals, setWithdrawals] = useState<VillageWithdrawal[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [petaSettings, setPetaSettings] = useState({ showUmkm: true, showFasilitas: true, radius: 5 });

  const fetchKycs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/admin/kyc", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setPendingKycs(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchCampaigns = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/admin/campaigns", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setPendingCampaigns(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/admin/users", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setUsersList(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchTreasury = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/admin/treasury", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setVillageTreasury(Number(data.village_treasury));
        setWithdrawals(data.withdrawals);
      }
    } catch (err) { console.error(err); }
  };

  const fetchTickets = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/admin/tickets", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setTickets(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchKycs(); fetchCampaigns(); fetchUsers(); fetchTreasury(); fetchTickets();
  }, []);

  const resolveKyc = async (id: number, decision: "Disetujui" | "Ditolak") => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/admin/kyc/${id}/resolve`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ decision })
      });
      if (res.ok) fetchKycs();
    } catch (err) { console.error(err); }
  };

  const resolveCampaign = async (id: number, decision: "Aktif" | "Ditolak") => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/admin/campaigns/${id}/resolve`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ decision })
      });
      if (res.ok) fetchCampaigns();
    } catch (err) { console.error(err); }
  };

  const toggleUserStatus = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${id}/toggle`, {
        method: "POST", headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (err) { console.error(err); }
  };

  const addWithdrawal = async (amount: number) => {
    const token = localStorage.getItem("token");
    if (!token || amount > villageTreasury) return;
    try {
      const res = await fetch("http://localhost:8000/api/admin/treasury/withdraw", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      if (res.ok) fetchTreasury();
    } catch (err) { console.error(err); }
  };

  const resolveTicket = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/admin/tickets/${id}/resolve`, {
        method: "POST", headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchTickets();
    } catch (err) { console.error(err); }
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
    pendingKycs, resolveKyc, pendingCampaigns, resolveCampaign,
    usersList, toggleUserStatus, villageTreasury, setVillageTreasury,
    withdrawals, addWithdrawal, tickets, resolveTicket, petaSettings, setPetaSettings
  }), [pendingKycs, pendingCampaigns, usersList, villageTreasury, withdrawals, tickets, petaSettings]);

  const activeKycsCount = pendingKycs.filter(k => k.status === "Pending").length;
  const activeCampaignsCount = pendingCampaigns.filter(c => c.status === "Pending").length;

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/pengguna", label: "Kelola Pengguna", icon: Users },
    { href: "/admin/produk", label: "Kelola Produk", icon: Package, badge: activeKycsCount },
    { href: "/admin/transaksi-investasi", label: "Transaksi & Investasi", icon: DollarSign, badge: activeCampaignsCount },
    { href: "/admin/laporan", label: "Laporan", icon: LineChart },
    { href: "/admin/profil", label: "Profil", icon: User },
  ];

  const userInitials = user?.name
    ? user.name.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase()
    : "AD";

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
          <ShieldCheck className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Desa</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 mx-4 mt-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover shadow-sm border border-blue-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {userInitials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "Administrator"}</p>
            <p className="text-[10px] text-blue-600 font-semibold truncate">{user?.email || "Pemerintah Desa"}</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Manajemen</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="adminSidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full"
                />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
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
    <AdminContext.Provider value={contextValue}>
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
                key="admin-overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                key="admin-drawer"
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
              <span className="font-semibold text-slate-800">Admin Desa</span>
              <span className="text-slate-300">/</span>
              <span className="capitalize">{pathname.split("/").filter(Boolean).pop() || "dashboard"}</span>
            </div>

            <div className="flex-1" />

            <div
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 cursor-pointer hover:border-blue-400/50 px-3 py-1.5 rounded-lg transition-all duration-200 w-56"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-400 font-semibold select-none">Cari...</span>
            </div>

            <NotificationBell />

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover shadow-sm border border-blue-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {userInitials}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || "Administrator"}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Admin</p>
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
    </AdminContext.Provider>
  );
}
