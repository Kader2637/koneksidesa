import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "@/components/ui/Image";
import {
  ArrowRight, TrendingUp, Store, Users, ShieldCheck,
  Sparkles, Check, Star, ChevronRight, BarChart2,
  Leaf, Wallet, Package, Activity, ShoppingBag, Truck,
  HelpCircle, BookOpen, MapPin, Bell, Zap
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "@/components/ui/Toast";
import Counter from "@/components/ui/Counter";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: any = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeTxIndex, setActiveTxIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
        const u = JSON.parse(storedUser);
        if (u.role === mappedRole) { navigate(href); return; }
        else { localStorage.removeItem("token"); localStorage.removeItem("user"); }
      } catch (e) { localStorage.removeItem("token"); localStorage.removeItem("user"); }
    }
    try {
      const email = defaultEmails[mappedRole];
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "password" })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(href);
      } else {
        toast.error("Gagal login otomatis. Pastikan database telah di-seed.");
        navigate("/login");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke backend. Pastikan server aktif!");
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/bazar-products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.slice(0, 6).map((p: any) => ({
            id: p.id, name: p.name,
            img: p.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
            category: p.category, desa: p.desa || "Desa Agro Rejo",
            price: Number(p.price)
          })));
        }
      } catch (err) { console.error(err); }
    };
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/bazar-campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.slice(0, 3).map((c: any, i: number) => ({
            id: c.id, title: c.title,
            umkm: c.umkm || c.business_name || "Mitra UMKM Desa",
            target: Number(c.target), current: Number(c.current || 0),
            roi: Number(c.roi), tenor: c.tenor,
            progress: Number(c.progress || 0),
            risk: c.risk || "Rendah",
            color: ["from-emerald-500 to-teal-500", "from-blue-500 to-indigo-500", "from-amber-500 to-orange-500"][i % 3]
          })));
        }
      } catch (err) { console.error(err); }
    };
    fetchProducts();
    fetchCampaigns();
  }, []);

  const liveTransactions = [
    { name: "Andi S.", action: "Membeli Tas Anyam Pandan", value: "Rp 185.000", time: "Baru saja" },
    { name: "Farhan H.", action: "Investasi Siklus Penggilingan", value: "Rp 5.000.000", time: "2 menit lalu" },
    { name: "Siti Rahma", action: "Membeli Madu Fajar Asli", value: "Rp 95.000", time: "5 menit lalu" },
    { name: "Dewi L.", action: "Investasi Lahan Bambu", value: "Rp 2.000.000", time: "10 menit lalu" },
  ];

  useEffect(() => {
    const iv = setInterval(() => setActiveTxIndex(p => (p + 1) % liveTransactions.length), 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setActiveTestimonial(p => (p + 1) % 3), 5000);
    return () => clearInterval(iv);
  }, []);

  const stats = [
    { value: 2400, suffix: "+", label: "Produk UMKM", icon: Package },
    { value: 180, suffix: "+", label: "Desa Bergabung", icon: MapPin },
    { value: 98, suffix: "%", label: "Kepuasan Pembeli", icon: Star },
    { value: 12, prefix: "Rp", suffix: "M+", label: "Total Transaksi", icon: Wallet },
  ];

  const features = [
    { icon: ShoppingBag, title: "Bazar Digital Desa", desc: "Belanja langsung dari pengrajin UMKM tanpa perantara. Harga transparan, kualitas terjamin, dan pengiriman ke seluruh Indonesia.", color: "text-emerald-600", bg: "bg-emerald-50", href: "/katalog" },
    { icon: TrendingUp, title: "Investasi Berbunga", desc: "Tanamkan modal ke UMKM terverifikasi dan dapatkan dividen ROI bulanan dengan sistem Credit Scoring berbasis AI.", color: "text-amber-600", bg: "bg-amber-50", href: "/investasi" },
    { icon: Store, title: "Portal Mitra UMKM", desc: "Kelola toko, terima pesanan, dan akses pendanaan modal kerja langsung dari investor terverifikasi platform.", color: "text-blue-600", bg: "bg-blue-50", href: "/umkm" },
    { icon: ShieldCheck, title: "Tata Kelola Desa", desc: "Dashboard BUMDes terintegrasi untuk memantau transaksi, mengelola kas desa, dan memverifikasi UMKM secara digital.", color: "text-purple-600", bg: "bg-purple-50", href: "/admin" },
  ];

  const portals = [
    { name: "Admin Desa", desc: "Pemerintah Desa & BUMDes", icon: ShieldCheck, accent: "bg-purple-600", href: "/admin", badge: "Kelola" },
    { name: "Mitra UMKM", desc: "Pedagang & Pengrajin Desa", icon: Store, accent: "bg-emerald-600", href: "/umkm", badge: "Jual" },
    { name: "Investor", desc: "Pemodal & Mitra Finansial", icon: TrendingUp, accent: "bg-amber-500", href: "/investor", badge: "Invest" },
    { name: "Pembeli", desc: "Konsumen Bazar Digital", icon: ShoppingBag, accent: "bg-blue-600", href: "/pembeli", badge: "Beli" },
  ];

  const testimonials = [
    { quote: "KoneksiDesa memotong rantai tengkulak yang menekan harga. Sekarang omzet kami naik tiga kali lipat!", author: "Ibu Kartini", role: "Ketua Koperasi Kerajinan", desa: "Desa Karya Maju, Magelang", rating: 5 },
    { quote: "Transparansi AI Credit Scoring sangat membantu. Dividen terkirim otomatis tepat waktu setiap bulan.", author: "Hendra Wijaya", role: "Investor Ritel", desa: "Tangerang Selatan, Banten", rating: 5 },
    { quote: "SKT berbasis mobile memudahkan seluruh petani kami melacak pesanan dan memantau stok secara real-time.", author: "Pak Kades Mulyono", role: "Kepala Desa & Penasihat BUMDes", desa: "Desa Agro Rejo, Pekalongan", rating: 5 },
  ];

  const faqs = [
    { q: "Apakah pendaftaran UMKM dipungut biaya?", a: "Tidak ada biaya bulanan. Pendaftaran dan penggunaan SKT gratis. Hanya ada potongan administrasi 2% per transaksi selesai." },
    { q: "Siapa penjamin risiko investasi?", a: "Algoritma AI menyaring data cash-flow riil setiap UMKM untuk menghasilkan Credit Scoring yang akurat, disertai dana jaminan perlindungan modal bersama." },
    { q: "Apakah produk bisa dikirim ke seluruh Indonesia?", a: "Ya. Kami terintegrasi dengan berbagai mitra logistik nasional. Pembeli di seluruh wilayah Indonesia dapat memesan dari UMKM desa manapun." },
    { q: "Bagaimana cara mendaftar sebagai UMKM?", a: "Daftar akun, lengkapi profil toko, upload dokumen KTP dan NIB, lalu tunggu verifikasi dari Admin Desa atau BUMDes setempat." },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-16">

        {/* ══════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden">
          {/* Background accents */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)", backgroundSize: "32px 32px" }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left */}
              <div className="space-y-8">
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                  </span>
                  Pusat Integrasi Ekonomi Pedesaan Indonesia
                </motion.div>

                <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900"
                >
                  Ekonomi Desa{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    Terhubung
                  </span>
                  <br />
                  <span className="text-slate-900">Dunia.</span>
                </motion.h1>

                <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                  className="text-lg text-slate-500 leading-relaxed max-w-xl"
                >
                  Platform digital yang menghubungkan pembeli, investor, dan UMKM desa dalam satu ekosistem terintegrasi — bebas tengkulak, transparan, dan berkelanjutan.
                </motion.p>

                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/katalog"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5"
                  >
                    Jelajahi Katalog
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/investasi"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-200 shadow-sm hover:-translate-y-0.5"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Mulai Investasi
                  </Link>
                </motion.div>

                {/* Live transaction ticker */}
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                  className="flex items-center gap-3 pt-2"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeTxIndex}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="text-xs text-slate-600 font-medium"
                    >
                      <span className="font-bold text-slate-800">{liveTransactions[activeTxIndex].name}</span>{" "}
                      {liveTransactions[activeTxIndex].action} —{" "}
                      <span className="text-emerald-600 font-bold">{liveTransactions[activeTxIndex].value}</span>
                      <span className="text-slate-400 ml-1">· {liveTransactions[activeTxIndex].time}</span>
                    </motion.p>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Right — Product mockup cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative flex items-center justify-center min-h-[480px]"
              >
                {/* Main card */}
                <div className="w-72 h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative">
                  <Image src="/madu.png" alt="Produk Desa" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">
                      <Star className="w-3 h-3 fill-white" /> Produk Unggulan
                    </span>
                    <h3 className="text-xl font-black">Madu Fajar Asli</h3>
                    <p className="text-sm text-white/70 mt-0.5">BUMDes Desa Tani Sari</p>
                  </div>
                </div>

                {/* Floating stat card */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute -left-8 top-16 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 w-48"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium">ROI Rata-rata</p>
                      <p className="text-sm font-black text-slate-900">12.5% / tahun</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className="h-1.5 bg-emerald-500 rounded-full w-3/4" />
                  </div>
                </motion.div>

                {/* Floating verified card */}
                <motion.div
                  animate={{ y: [8, -8, 8] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-6 bottom-24 bg-white border border-slate-200 shadow-xl rounded-2xl p-3 w-40"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-50 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500">Terverifikasi</p>
                      <p className="text-xs font-black text-slate-800">2.400+ Produk</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 2 — STATS
        ══════════════════════════════════════ */}
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                    className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-xl mb-4">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                      {stat.prefix}<Counter end={stat.value} />{stat.suffix}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 3 — FITUR UTAMA
        ══════════════════════════════════════ */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full mb-4">
                <Zap className="w-3.5 h-3.5" />
                Ekosistem Lengkap
              </span>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Satu Platform,<br />Semua Kebutuhan</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                KoneksiDesa menghadirkan ekosistem terintegrasi untuk pembeli, investor, pelaku UMKM, dan pengelola BUMDes.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                    className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${feat.bg} rounded-2xl mb-5`}>
                      <Icon className={`w-6 h-6 ${feat.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                    <p className="text-slate-500 leading-relaxed mb-5">{feat.desc}</p>
                    <Link to={feat.href}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${feat.color} hover:gap-2.5 transition-all duration-200`}
                    >
                      Selengkapnya <ChevronRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 4 — PORTAL PENGGUNA
        ══════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full mb-4">
                <Users className="w-3.5 h-3.5" />
                Multi-Role Platform
              </span>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Masuk Sesuai<br />Peran Anda</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Pilih portal yang sesuai dengan peran Anda dalam ekosistem KoneksiDesa.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {portals.map((portal, i) => {
                const Icon = portal.icon;
                return (
                  <motion.button
                    key={portal.name}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                    onClick={() => handlePortalClick(portal.name, portal.href)}
                    className="group flex flex-col items-center text-center gap-4 p-6 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`w-14 h-14 ${portal.accent} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-800">{portal.name}</span>
                      <span className="block text-xs text-slate-500 mt-1">{portal.desc}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full group-hover:bg-slate-50 transition-colors">
                      {portal.badge} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 5 — PRODUK KATALOG
        ══════════════════════════════════════ */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full mb-3"
                >
                  <Package className="w-3.5 h-3.5" />
                  Bazar Desa
                </motion.span>
                <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                  className="text-3xl font-black text-slate-900"
                >
                  Produk Unggulan UMKM
                </motion.h2>
              </div>
              <Link to="/katalog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[9px] font-bold px-2 py-1 rounded-full border border-slate-200">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{product.desa}</p>
                      <p className="text-xs font-black text-emerald-600 mt-1.5">Rp {product.price.toLocaleString("id-ID")}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-36 bg-slate-100" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-3/4" />
                      <div className="h-2 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 6 — INVESTASI
        ══════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold rounded-full mb-3"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Peluang Investasi
                </motion.span>
                <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                  className="text-3xl font-black text-slate-900"
                >
                  Kampanye Investasi Aktif
                </motion.h2>
              </div>
              <Link to="/investasi"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.length > 0 ? campaigns.map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`h-2 rounded-full bg-gradient-to-r ${campaign.color} mb-5`} />
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{campaign.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{campaign.umkm}</p>
                    </div>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-200 flex-shrink-0 ml-2">
                      {campaign.risk}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 font-medium">ROI</p>
                      <p className="text-lg font-black text-slate-900">{campaign.roi}%</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 font-medium">Tenor</p>
                      <p className="text-lg font-black text-slate-900">{campaign.tenor}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Progress</span>
                      <span className="font-semibold">{campaign.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className={`h-2 bg-gradient-to-r ${campaign.color} rounded-full transition-all duration-500`}
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handlePortalClick("Portal Investor", "/investor")}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all duration-200"
                  >
                    Investasi Sekarang
                  </button>
                </motion.div>
              )) : (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 animate-pulse space-y-4">
                    <div className="h-2 bg-slate-100 rounded-full" />
                    <div className="h-5 bg-slate-100 rounded w-3/4" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-slate-100 rounded-xl" />
                      <div className="h-16 bg-slate-100 rounded-xl" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 7 — TESTIMONI
        ══════════════════════════════════════ */}
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-xs font-semibold rounded-full border border-white/20 mb-4">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Testimoni Pengguna
              </span>
              <h2 className="text-4xl font-black text-white">Dipercaya Ribuan<br />Pengguna Aktif</h2>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                <div>
                  <p className="text-white font-bold">{testimonials[activeTestimonial].author}</p>
                  <p className="text-white/60 text-sm mt-1">{testimonials[activeTestimonial].role}</p>
                  <p className="text-emerald-400 text-xs mt-0.5 font-medium">{testimonials[activeTestimonial].desa}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeTestimonial ? "w-6 h-2 bg-emerald-400" : "w-2 h-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 8 — FAQ
        ══════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold rounded-full mb-4">
                <HelpCircle className="w-3.5 h-3.5" />
                FAQ
              </span>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Pertanyaan<br />yang Sering Ditanyakan</h2>
              <Link to="/faq" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
                Lihat FAQ lengkap <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.details
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-800 hover:text-emerald-700 transition-colors list-none">
                    <span>{faq.q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform duration-200 flex-shrink-0 ml-3" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-500 leading-relaxed text-sm border-t border-slate-200 pt-4">
                    {faq.a}
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 9 — CTA
        ══════════════════════════════════════ */}
        <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Bergabung Sekarang
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Jadilah Bagian dari<br />Revolusi Desa Digital
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto">
                Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat ekosistem digital KoneksiDesa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link to="/katalog"
                  className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Mulai Belanja
                </Link>
                <Link to="/investasi"
                  className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/40 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  Mulai Investasi
                </Link>
              </div>

              {/* Features checklist */}
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                {["Gratis daftar", "Tanpa biaya bulanan", "Dukungan 24/7", "Transaksi aman"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                    <Check className="w-4 h-4 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
