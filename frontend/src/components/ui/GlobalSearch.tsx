import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, ArrowRight, User, Package, Briefcase, Landmark, ShoppingBag, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalSearchProps {
  onClose?: () => void;
}

export default function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // Debounced Search Request
  useEffect(() => {
    if (!query.trim()) {
      setResults({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          // Auto select first non-empty tab
          const keys = Object.keys(data).filter(k => Array.isArray(data[k]) && data[k].length > 0);
          if (keys.length > 0) {
            setActiveTab(keys[0]);
          } else {
            setActiveTab("");
          }
        }
      } catch (err) {
        console.error("Search API error:", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (onClose) onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Get human readable tab names
  const getTabLabel = (key: string) => {
    const labels: Record<string, string> = {
      users: "Pengguna",
      umkms: "UMKM Mitra",
      investors: "Investor",
      pembelis: "Pembeli",
      produks: "Produk",
      investasis: "Investasi",
      pesanans: "Pesanan",
      laporans: "Laporan ROI",
      roi_history: "Riwayat ROI"
    };
    return labels[key] || key;
  };

  // Get icons for each tab type
  const getResultIcon = (key: string) => {
    switch (key) {
      case "users":
      case "pembelis":
      case "investors":
        return <User className="w-4 h-4 text-indigo-500" />;
      case "umkms":
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case "produks":
        return <Package className="w-4 h-4 text-amber-500" />;
      case "investasis":
        return <Landmark className="w-4 h-4 text-purple-500" />;
      case "pesanans":
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      default:
        return <BarChart2 className="w-4 h-4 text-rose-500" />;
    }
  };

  // Handle result item click
  const handleItemClick = (type: string, item: any) => {
    if (onClose) onClose();

    const storedUser = localStorage.getItem("user");
    const userRole = storedUser ? JSON.parse(storedUser).role : "";

    switch (type) {
      case "produks":
        if (userRole === "Pembeli") {
          navigate(`/pembeli/produk`);
        } else if (userRole === "Mitra UMKM") {
          navigate(`/umkm/produk`);
        } else {
          navigate(`/admin/produk`);
        }
        break;
      case "umkms":
        if (userRole === "Investor") {
          navigate(`/investor/umkm`);
        } else {
          navigate(`/katalog`);
        }
        break;
      case "investasis":
        if (userRole === "Investor") {
          navigate(`/investor/portfolio`);
        } else if (userRole === "Mitra UMKM") {
          navigate(`/umkm/investor`);
        } else {
          navigate(`/admin/transaksi-investasi`);
        }
        break;
      case "pesanans":
        if (userRole === "Pembeli") {
          navigate(`/pembeli/pesanan`);
        } else if (userRole === "Mitra UMKM") {
          navigate(`/umkm/pesanan`);
        } else {
          navigate(`/admin/laporan`);
        }
        break;
      case "users":
      case "investors":
      case "pembelis":
        if (userRole === "Admin") {
          navigate(`/admin/pengguna`);
        }
        break;
      case "laporans":
      case "roi_history":
        if (userRole === "Investor") {
          navigate(`/investor/laporan`);
        } else if (userRole === "Mitra UMKM") {
          navigate(`/umkm/laporan`);
        } else {
          navigate(`/admin/laporan`);
        }
        break;
      default:
        break;
    }
  };

  const tabsWithData = Object.keys(results).filter(
    key => Array.isArray(results[key]) && results[key].length > 0
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-950/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        ref={modalRef}
        className="relative bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
      >
        {/* Search header input */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari data real-time desa (produk, investor, investasi, pesanan...)"
            className="w-full bg-transparent border-none outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400"
          />
          {loading ? (
            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin flex-shrink-0" />
          ) : query ? (
            <X 
              className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer flex-shrink-0" 
              onClick={() => setQuery("")}
            />
          ) : null}
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer text-xs font-bold uppercase tracking-wider px-2"
            >
              Tutup
            </button>
          )}
        </div>

        {/* Search body result details */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row min-h-[250px]">
          {/* If query is empty */}
          {!query.trim() && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <Search className="w-10 h-10 text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Pencarian Global Desa</p>
              <p className="text-xs max-w-xs leading-relaxed text-slate-400">Ketik kata kunci untuk mencari data riil dari database. Hasil pencarian disesuaikan otomatis dengan hak akses Anda.</p>
            </div>
          )}

          {/* If query has search string and loaded */}
          {query.trim() && !loading && (
            <>
              {tabsWithData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-2">
                  <span className="text-base font-black uppercase tracking-wider text-slate-500">Hasil Tidak Ditemukan</span>
                  <span className="text-xs text-slate-400 max-w-xs font-medium">Tidak dapat menemukan data riil matching dengan "{query}". Silakan coba kata kunci lain.</span>
                </div>
              ) : (
                <>
                  {/* Left Column Tabs Category */}
                  <div className="w-full md:w-48 bg-slate-50 border-r border-slate-100 p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                    {tabsWithData.map((tabKey) => (
                      <button
                        key={tabKey}
                        onClick={() => setActiveTab(tabKey)}
                        className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-left flex items-center justify-between transition gap-2 whitespace-nowrap cursor-pointer ${
                          activeTab === tabKey 
                            ? "bg-indigo-650 text-white shadow-sm" 
                            : "text-slate-650 hover:bg-slate-200/50"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {getResultIcon(tabKey)}
                          {getTabLabel(tabKey)}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          activeTab === tabKey ? "bg-white text-indigo-700" : "bg-slate-200 text-slate-600"
                        }`}>
                          {results[tabKey].length}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right Column Items List details */}
                  <div className="flex-1 p-4 space-y-3">
                    <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-2">
                      Hasil Opsi Kategori: {getTabLabel(activeTab)}
                    </h4>

                    <div className="space-y-2">
                      {activeTab && Array.isArray(results[activeTab]) && (
                        results[activeTab].map((item: any, index: number) => (
                          <div
                            key={index}
                            onClick={() => handleItemClick(activeTab, item)}
                            className="group flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-white hover:border-indigo-400/50 hover:shadow-sm cursor-pointer transition duration-150"
                          >
                            <div className="min-w-0 pr-4">
                              <p className="text-xs font-extrabold text-slate-800 truncate group-hover:text-indigo-600 transition">
                                {item.name || item.title || `Pesanan #ORD-${item.id}`}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate font-semibold">
                                {item.email || item.owner || item.description || (item.amount ? `Rp ${Number(item.amount).toLocaleString("id-ID")}` : "") || (item.status ? `Status: ${item.status}` : "")}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition flex items-center gap-1 uppercase flex-shrink-0">
                              Lihat <ArrowRight className="w-3 h-3 transition group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
