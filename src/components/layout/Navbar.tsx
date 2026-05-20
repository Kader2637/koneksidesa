"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, Menu, X, ShieldCheck, Store,
  TrendingUp, ShoppingBag, ArrowRight, Sparkles
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when login modal or mobile menu is open
  useEffect(() => {
    if (showLoginModal || isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLoginModal, isOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Katalog Desa", href: "/katalog" },
    { name: "Peluang Investasi", href: "/investasi" },
    { name: "Peta UMKM", href: "/peta" },
    { name: "Statistik Desa", href: "/statistik" },
    { name: "FAQ", href: "/faq" },
  ];

  const portals = [
    {
      name: "Admin Desa",
      desc: "Sistem Pengelola & BUMDes",
      icon: ShieldCheck,
      color: "text-purple-500 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
      iconBg: "bg-purple-50 dark:bg-purple-950/40",
      href: "/admin",
    },
    {
      name: "Toko UMKM",
      desc: "Portal Penjual Digital",
      icon: Store,
      color: "text-emerald-500 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      href: "/umkm",
    },
    {
      name: "Portal Investor",
      desc: "Sirkulasi Finansial & ROI",
      icon: TrendingUp,
      color: "text-amber-500 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      href: "/investor",
    },
    {
      name: "Bazar Pembeli",
      desc: "Belanja Langsung Ritel",
      icon: ShoppingBag,
      color: "text-blue-500 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      href: "/pembeli",
    },
  ];

  return (
    <>
      {/* Floating Pill Navbar Wrapper */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300">
        <motion.nav
          className={`max-w-7xl mx-auto transition-all duration-300 rounded-full border ${isScrolled
            ? "px-8 py-3.5 shadow-xl bg-white/60 dark:bg-zinc-950/60 border-slate-200/50 dark:border-zinc-800/80 backdrop-blur-xl shadow-[0_15px_40px_rgb(0,0,0,0.06)]"
            : "px-6 py-4 shadow-sm bg-white/30 dark:bg-zinc-950/30 border-white/40 dark:border-zinc-800/40 backdrop-blur-md"
            }`}
        >
          <div className="flex justify-between items-center gap-8">
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-[68px] w-[272px] overflow-hidden">
                <Image
                  src="/logo1.png"
                  alt="KoneksiDesa"
                  fill
                  className="object-contain mix-blend-multiply dark:mix-blend-screen dark:brightness-0 dark:invert transition-all duration-300 scale-105"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links with sliding background capsule */}
            <div
              className="hidden lg:flex space-x-2 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 relative py-1 px-1 bg-slate-100/50 dark:bg-zinc-900/30 rounded-full border border-slate-200/30 dark:border-zinc-850"
              onMouseLeave={() => setHoveredPath(null)}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredPath(link.href)}
                    className={`relative px-4 py-2.5 rounded-full transition-colors duration-300 z-10 whitespace-nowrap ${isActive
                      ? "text-emerald-700 dark:text-emerald-300 font-extrabold"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    {/* Active Link Dot */}
                    {isActive && (
                      <motion.span
                        layoutId="activeDot"
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}

                    {/* Hover Capsule sliding backdrops */}
                    {hoveredPath === link.href && (
                      <motion.div
                        layoutId="navHoverHighlight"
                        className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm border border-slate-200/50 dark:border-zinc-700/50 rounded-full -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Main Action Button */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -0.5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLoginModal(true)}
                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6.5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex items-center gap-1.5 border border-slate-950 dark:border-white"
              >
                <span>Mulai</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-500 animate-pulse" />
              </motion.button>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[73px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl z-40 p-6 flex flex-col gap-6 lg:hidden border-t border-slate-100 dark:border-zinc-900 mt-6"
          >
            <div className="flex flex-col gap-3 mt-4">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={link.href}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-bold block py-3 border-b border-slate-50 dark:border-zinc-900/60 transition-colors ${isActive
                        ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                        : "text-slate-700 dark:text-zinc-300 hover:text-slate-900"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                setIsOpen(false);
                setShowLoginModal(true);
              }}
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-4.5 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg text-center mt-auto border border-slate-950 dark:border-white"
            >
              Mulai
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login / Portal Modal with Glowing HUD Grid */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Box Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl z-10 p-8 relative overflow-hidden border border-slate-200/50 dark:border-zinc-800 text-slate-800 dark:text-zinc-200"
            >
              {/* Glowing Ambient Glow Blobs inside Modal */}
              <div className="absolute -top-10 -left-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition bg-slate-50 dark:bg-zinc-800 p-2.5 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-8 relative z-10 flex flex-col items-center">
                <div className="relative h-16 w-64 overflow-hidden mb-2">
                  <Image
                    src="/logo1.png"
                    alt="KoneksiDesa"
                    fill
                    className="object-contain mix-blend-multiply dark:mix-blend-screen dark:brightness-0 dark:invert transition-all duration-300"
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1.5 uppercase tracking-widest font-black">
                  Gerbang Utama Ekosistem Digital
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {portals.map((portal) => {
                  const IconComponent = portal.icon;
                  return (
                    <Link
                      key={portal.name}
                      href={portal.href}
                      onClick={() => setShowLoginModal(false)}
                      className={`w-full flex flex-col justify-between p-5 border border-slate-200/60 dark:border-zinc-800/80 rounded-[2rem] transition-all duration-300 group ${portal.color} bg-white dark:bg-zinc-900/40`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 dark:bg-zinc-800 ${portal.iconBg} group-hover:scale-110`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-zinc-700 group-hover:translate-x-1 transition-transform" />
                      </div>

                      <div className="text-left mt-4">
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white transition-colors">
                          {portal.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-0.5 leading-relaxed">
                          {portal.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
