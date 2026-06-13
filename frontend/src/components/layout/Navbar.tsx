import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Image from "../ui/Image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ShieldCheck, Store, TrendingUp, ShoppingBag,
  ArrowRight, Sparkles, ChevronDown, LogOut, LayoutDashboard,
  BookOpen, BarChart2, HelpCircle, MapPin, Package
} from "lucide-react";
import { toast } from "../ui/Toast";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setToken(null); setUser(null);
      }
    } else {
      setToken(null); setUser(null);
    }
  }, [pathname, showLoginModal]);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const handleLogout = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        await fetch("http://localhost:8000/api/auth/logout", {
          method: "POST",
          headers: { "Authorization": `Bearer ${currentToken}`, "Content-Type": "application/json" }
        });
      }
    } catch (err) { console.error(err); }
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null); setUser(null);
      navigate("/");
    }
  };

  const handlePortalClick = async (roleName: string, href: string) => {
    const mappedRole = roleName === "Admin Desa" ? "Admin"
      : roleName === "Toko UMKM" ? "Mitra UMKM"
      : roleName === "Portal Investor" ? "Investor"
      : "Pembeli";
    const defaultEmails: Record<string, string> = {
      "Admin": "admin@koneksidesa.com", "Mitra UMKM": "umkm@koneksidesa.com",
      "Investor": "investor@koneksidesa.com", "Pembeli": "pembeli@koneksidesa.com"
    };
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        const loggedUser = JSON.parse(storedUser);
        if (loggedUser.role === mappedRole) { navigate(href); return; }
        else { localStorage.removeItem("token"); localStorage.removeItem("user"); }
      } catch (e) { localStorage.removeItem("token"); localStorage.removeItem("user"); }
    }
    try {
      const email = defaultEmails[mappedRole];
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "password" })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user); setToken(data.access_token);
        navigate(href);
      } else {
        toast.error(`Gagal login otomatis. Pastikan database Anda telah di-seed.`);
        navigate("/login");
      }
    } catch (err) {
      toast.error(`Tidak dapat terhubung ke backend. Pastikan server aktif!`);
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (showLoginModal || isOpen) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showLoginModal, isOpen]);

  const navLinks = [
    { name: "Beranda", href: "/", icon: null },
    { name: "Katalog", href: "/katalog", icon: Package },
    { name: "Investasi", href: "/investasi", icon: TrendingUp },
    { name: "Statistik", href: "/statistik", icon: BarChart2 },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  const portals = [
    { name: "Admin Desa", desc: "Sistem Pengelola & BUMDes", icon: ShieldCheck, accent: "text-purple-600", bg: "bg-purple-50", border: "hover:border-purple-200", href: "/admin" },
    { name: "Toko UMKM", desc: "Portal Penjual Digital", icon: Store, accent: "text-emerald-600", bg: "bg-emerald-50", border: "hover:border-emerald-200", href: "/umkm" },
    { name: "Portal Investor", desc: "Sirkulasi Finansial & ROI", icon: TrendingUp, accent: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-200", href: "/investor" },
    { name: "Bazar Pembeli", desc: "Belanja Langsung Ritel", icon: ShoppingBag, accent: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-200", href: "/pembeli" },
  ];

  const dashboardHref = user?.role === "Admin" ? "/admin"
    : user?.role === "Mitra UMKM" ? "/umkm"
    : user?.role === "Investor" ? "/investor"
    : "/pembeli";

  return (
    <>
      {/* ── TOP NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-transparent backdrop-blur-none border-b border-transparent pt-4 px-4"
            : "bg-transparent backdrop-blur-none border-b border-transparent pt-0 px-0"
        }`}
      >
        <div
          className={`w-full max-w-7xl mx-auto transition-all duration-300 ${
            isScrolled
              ? "bg-white/90 backdrop-blur-md border border-slate-200/85 shadow-lg shadow-slate-100/50 rounded-2xl px-4 sm:px-6 lg:px-8"
              : "bg-transparent px-4 sm:px-6 lg:px-8"
          }`}
        >
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="relative h-9 w-36 overflow-hidden">
                <Image src="/logo1.png" alt="KoneksiDesa" fill className="object-contain" priority />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navActiveIndicator"
                        className="absolute inset-0 bg-emerald-50 rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                    {isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-3">
              {token && user ? (
                <div className="flex items-center gap-2">
                  {/* User badge */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">{user.name}</span>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md border border-emerald-200">{user.role}</span>
                  </div>
                  <button
                    onClick={() => navigate(dashboardHref)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-emerald-600/20"
                >
                  Login
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 lg:hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="relative h-8 w-32 overflow-hidden">
                  <Image src="/logo1.png" alt="KoneksiDesa" fill className="object-contain" />
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Menu</p>
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{link.name}</span>
                        {isActive && <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Portals */}
                <div className="pt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Portal Pengguna</p>
                  <div className="grid grid-cols-2 gap-2">
                    {portals.map((portal) => {
                      const Icon = portal.icon;
                      return (
                        <button
                          key={portal.name}
                          onClick={async () => { setIsOpen(false); await handlePortalClick(portal.name, portal.href); }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 ${portal.border} transition-all text-center`}
                        >
                          <div className={`p-2 rounded-lg ${portal.bg}`}>
                            <Icon className={`w-4 h-4 ${portal.accent}`} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{portal.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100">
                {token && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setIsOpen(false); navigate(dashboardHref); }}
                      className="w-full py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl"
                    >
                      Buka Dashboard
                    </button>
                    <button
                      onClick={() => { setIsOpen(false); handleLogout(); }}
                      className="w-full py-3 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsOpen(false); setShowLoginModal(true); }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    Login
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── LOGIN MODAL ── */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl z-10 p-6 relative border border-slate-200"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="relative h-9 w-36 mx-auto overflow-hidden mb-3">
                  <Image src="/logo1.png" alt="KoneksiDesa" fill className="object-contain" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Pilih Portal Masuk</h2>
                <p className="text-sm text-slate-500 mt-1">Login otomatis sebagai akun demo seeder</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {portals.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <button
                      key={portal.name}
                      onClick={async () => { setShowLoginModal(false); await handlePortalClick(portal.name, portal.href); }}
                      className={`flex flex-col gap-3 p-4 rounded-xl border border-slate-200 ${portal.border} hover:shadow-md transition-all duration-200 text-left group`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl ${portal.bg}`}>
                          <Icon className={`w-5 h-5 ${portal.accent}`} />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{portal.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{portal.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500">
                <Link to="/login" onClick={() => setShowLoginModal(false)} className="hover:text-emerald-600 font-medium transition-colors">
                  Login dengan Email
                </Link>
                <span className="text-slate-300">•</span>
                <Link to="/register" onClick={() => setShowLoginModal(false)} className="hover:text-emerald-600 font-medium transition-colors">
                  Daftar Akun Baru
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
