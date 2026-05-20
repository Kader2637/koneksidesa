"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Search, Crosshair, Plus, Minus, Check, MapPin, Leaf, ShieldCheck, Activity } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface UmkmPoint {
  lat: number;
  lng: number;
  name: string;
  desa: string;
  color: string;
  icon: string;
  stats: string;
  desc: string;
  sektor: string; // 'tani', 'kriya', 'wisata'
}

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSektors, setSelectedSektors] = useState({
    tani: true,
    kriya: true,
    wisata: true,
  });
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<any>(null);
  const markersGroupRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const umkms: UmkmPoint[] = [
    { 
      lat: -6.89, 
      lng: 109.13, 
      name: "Sektor Kerajinan Anyaman", 
      desa: "Desa Karya Maju, Jabar", 
      color: "#3b82f6", 
      icon: "truck", 
      stats: "24 UMKM", 
      desc: "Pusat produksi bambu artisan & tenunan pandan organik.", 
      sektor: "kriya" 
    },
    { 
      lat: -7.50, 
      lng: 110.22, 
      name: "Pertanian & Perkebunan", 
      desa: "Desa Agro Rejo, Jateng", 
      color: "#10b981", 
      icon: "tractor", 
      stats: "82 UMKM", 
      desc: "Produksi panen kopi Robusta unggul dan teh fajar premium.", 
      sektor: "tani" 
    },
    { 
      lat: -7.00, 
      lng: 110.82, 
      name: "Taman Kriya Keramik", 
      desa: "Desa Sentra Kriya, Jatim", 
      color: "#3b82f6", 
      icon: "palette", 
      stats: "15 UMKM", 
      desc: "Pengrajin keramik hias dekoratif halus dengan tungku klasik.", 
      sektor: "kriya" 
    },
    { 
      lat: -7.80, 
      lng: 112.01, 
      name: "Lumbung Madu Hutan", 
      desa: "Desa Tani Sari, DIY", 
      color: "#10b981", 
      icon: "shopping-bag", 
      stats: "40 UMKM", 
      desc: "Penangkaran lebah madu konservasi hutan pedalaman.", 
      sektor: "tani" 
    },
    { 
      lat: -8.11, 
      lng: 113.20, 
      name: "Pariwisata Alam", 
      desa: "Desa Curug Berkah, Jatim", 
      color: "#f59e0b", 
      icon: "image", 
      stats: "10 UMKM", 
      desc: "Area pariwisata terpadu berbasis kearifan lokal pedesaan.", 
      sektor: "wisata" 
    },
    { 
      lat: -6.50, 
      lng: 107.50, 
      name: "Sentra Kuliner Olahan", 
      desa: "Desa Cita Rasa, Banten", 
      color: "#10b981", 
      icon: "coffee", 
      stats: "33 UMKM", 
      desc: "Industri makanan olahan & kripik singkong balado renyah.", 
      sektor: "tani" 
    }
  ];

  // Injeksi Script Leaflet dinamis
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).L) {
        initMap();
      }
    };

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
      if (script.parentNode) script.parentNode.removeChild(script);
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;
    const L = (window as any).L;

    const map = L.map(mapRef.current, { zoomControl: false }).setView([-7.2509, 110.1402], 8);
    leafletMapInstance.current = map;

    // Tile satelit premium moderen Voyager CARTO
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    setIsMapLoaded(true);
  };

  // Re-run markers creation
  useEffect(() => {
    if (!isMapLoaded || !leafletMapInstance.current) return;
    const L = (window as any).L;
    const map = leafletMapInstance.current;

    markersGroupRef.current.forEach((marker) => map.removeLayer(marker));
    markersGroupRef.current = [];

    const filteredPoints = umkms.filter((spot) => {
      const matchSearch =
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.desa.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isSektorEnabled = selectedSektors[spot.sektor as keyof typeof selectedSektors];
      return matchSearch && isSektorEnabled;
    });

    filteredPoints.forEach((point) => {
      const htmlSnippet = `
        <div class="relative w-10 h-10 flex items-center justify-center transform hover:scale-115 transition duration-300">
          <div class="absolute inset-0 rounded-full animate-ping opacity-35" style="background-color: ${point.color}"></div>
          <div class="relative z-10 w-5 h-5 border-2 border-white rounded-full shadow-lg" style="background-color: ${point.color}"></div>
        </div>
      `;
      
      const pinIcon = L.divIcon({
        className: "bg-transparent",
        iconAnchor: [20, 20],
        popupAnchor: [0, -16],
        html: htmlSnippet,
      });

      const popupHtml = `
        <div class="overflow-hidden bg-white text-slate-800 flex flex-col rounded-[24px] shadow-2xl border border-slate-100">
          <div class="p-5 text-white font-heading" style="background: linear-gradient(135deg, ${point.color}, #0f172a)">
            <p class="text-[9px] font-black uppercase tracking-wider mb-1 opacity-80">${point.desa}</p>
            <h4 class="font-black text-sm leading-tight">${point.name}</h4>
          </div>
          <div class="p-5 bg-white space-y-4">
            <p class="text-xs text-slate-500 font-semibold leading-relaxed">${point.desc}</p>
            <div class="flex items-center gap-2 border-t border-slate-100 pt-4 text-[10px] font-black uppercase">
              <div class="px-3 py-2 bg-slate-100 rounded-xl text-slate-600 flex-1 text-center">${point.stats}</div>
              <a href="/katalog" class="px-3 py-2 text-white rounded-xl hover:opacity-90 transition inline-block text-center flex-1" style="background-color: ${point.color}">Katalog</a>
            </div>
          </div>
        </div>
      `;

      const marker = L.marker([point.lat, point.lng], { icon: pinIcon })
        .bindPopup(popupHtml, { closeButton: false, minWidth: 240 })
        .addTo(map);

      markersGroupRef.current.push(marker);
    });
  }, [isMapLoaded, searchQuery, selectedSektors]);

  const zoomIn = () => leafletMapInstance.current?.zoomIn();
  const zoomOut = () => leafletMapInstance.current?.zoomOut();
  
  const setSelfLocation = () => {
    if (!leafletMapInstance.current) return;
    leafletMapInstance.current.setView([-7.2509, 110.1402], 9);
  };

  const handleCheckboxChange = (sektor: keyof typeof selectedSektors) => {
    setSelectedSektors((prev) => ({
      ...prev,
      [sektor]: !prev[sektor],
    }));
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100 relative">
      <Navbar />

      {/* 1. Fullscreen Map Canvas */}
      <main className="flex-1 w-full h-full relative pt-[73px]">
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-10" />

        {/* 2. Floating Overlays (HUD control) */}
        <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-8 flex flex-col justify-between mt-[73px]">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            {/* HUD Sidebar Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-200/50 dark:border-zinc-800 shadow-2xl max-w-sm pointer-events-auto w-full space-y-6"
            >
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full border border-blue-100/50 dark:border-blue-900/30">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Satellite HUD Active
                </span>
                <h1 className="text-2xl font-heading font-black tracking-tight text-slate-900 dark:text-white mt-3">
                  Peta Satelit UMKM
                </h1>
                <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold leading-relaxed">
                  Geser dan klik pin lokasi sentra di Pulau Jawa untuk melihat aktivitas pengiriman komoditas.
                </p>
              </div>

              {/* Glowing Search HUD input */}
              <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 px-4 py-2.5 rounded-full flex items-center gap-2 shadow-inner focus-within:border-emerald-500 transition-all duration-300">
                <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari sentra komoditas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-semibold w-full text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder:text-zinc-650"
                />
              </div>

              {/* Checkboxes HUD Sector Filters */}
              <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                <p className="text-[10px] uppercase font-black text-slate-400 dark:text-zinc-500 tracking-wider">
                  Filter Sektor
                </p>
                
                <div className="space-y-2.5 text-xs font-bold">
                  {/* Sektor Tani */}
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedSektors.tani}
                        onChange={() => handleCheckboxChange("tani")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                        selectedSektors.tani 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      }`}>
                        {selectedSektors.tani && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-slate-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" /> 
                      Konsumsi & Pertanian
                    </span>
                  </label>

                  {/* Sektor Kriya */}
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedSektors.kriya}
                        onChange={() => handleCheckboxChange("kriya")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                        selectedSektors.kriya 
                          ? "bg-blue-500 border-blue-500 text-white" 
                          : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      }`}>
                        {selectedSektors.kriya && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-slate-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" /> 
                      Kriya & Kerajinan Alam
                    </span>
                  </label>

                  {/* Sektor Wisata */}
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedSektors.wisata}
                        onChange={() => handleCheckboxChange("wisata")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                        selectedSektors.wisata 
                          ? "bg-amber-500 border-amber-500 text-white" 
                          : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      }`}>
                        {selectedSektors.wisata && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-slate-700 dark:text-zinc-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" /> 
                      Pariwisata Desa
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Custom Control HUD Button group */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-auto flex flex-col gap-3"
            >
              <button
                onClick={setSelfLocation}
                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-slate-700 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-800 cursor-pointer"
              >
                <Crosshair className="w-4 h-4" />
              </button>
              
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-xl flex flex-col border border-slate-200/50 dark:border-zinc-800 overflow-hidden">
                <button 
                  onClick={zoomIn} 
                  className="p-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-slate-700 dark:text-zinc-300 border-b border-slate-100 dark:border-zinc-800 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={zoomOut} 
                  className="p-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-slate-700 dark:text-zinc-300 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Glowing Satellites active tag */}
          <div className="self-start lg:self-end mt-4 pointer-events-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur px-5 py-3 rounded-full shadow-lg border border-slate-200/50 dark:border-zinc-800 flex items-center gap-2.5 select-none">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black text-slate-700 dark:text-zinc-300 uppercase tracking-widest">
              Live Satellites API Linked
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
