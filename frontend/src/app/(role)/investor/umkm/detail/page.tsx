"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Store, Package, Landmark, MapPin,
  User, ShieldCheck, Mail, Send, Award, DollarSign
} from "lucide-react";
import { useInvestor } from "../../layout";
import { toast } from "@/components/ui/Toast";
import Select2 from "@/components/ui/Select2";

interface Product {
  id: number;
  seller_id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export default function InvestorUMKMDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { umkms, catalogCampaigns, submitInvestasi, refreshInvestorData } = useInvestor();

  const [umkmProducts, setUmkmProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Direct investment form state
  const [investAmount, setInvestAmount] = useState("");
  const [investRoi, setInvestRoi] = useState("");
  const [investMessage, setInvestMessage] = useState("");
  const [investTenor, setInvestTenor] = useState("6 Bulan");
  const [submitting, setSubmitting] = useState(false);

  // Find the selected UMKM from the list
  const currentUmkm = useMemo(() => {
    return umkms.find(u => String(u.id) === id);
  }, [umkms, id]);

  // Fetch products for this UMKM
  useEffect(() => {
    if (!id) return;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch("http://localhost:8000/api/bazar-products");
        if (res.ok) {
          const data = await res.json();
          // Filter products belonging to this UMKM (seller_id maps to user_id of UMKM)
          const filtered = data.filter((p: any) => String(p.seller_id) === id);
          setUmkmProducts(filtered);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [id]);

  // Filter campaigns related to this UMKM
  const umkmCampaigns = useMemo(() => {
    if (!currentUmkm) return [];
    return catalogCampaigns.filter(
      c => c.umkm === currentUmkm.business_name || c.business_name === currentUmkm.business_name
    );
  }, [currentUmkm, catalogCampaigns]);

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, "");
    if (!numberString) return "";
    return Number(numberString).toLocaleString("id-ID");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestAmount(formatRupiah(e.target.value));
  };

  const handleDirectInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUmkm || !id) return;

    const amount = Number(investAmount.replace(/\./g, ""));
    if (!amount || amount <= 0) {
      toast.error("Nominal investasi harus lebih besar dari 0");
      return;
    }

    const roiValue = Number(investRoi);
    if (!roiValue || roiValue <= 0) {
      toast.error("Bagi hasil (ROI) harus lebih besar dari 0");
      return;
    }

    setSubmitting(true);
    try {
      const success = await submitInvestasi(
        Number(id),
        amount,
        investMessage || "Penawaran investasi kemitraan langsung.",
        investTenor,
        roiValue
      );

      if (success) {
        toast.success(`Berhasil mengirim penawaran investasi sebesar Rp ${amount.toLocaleString("id-ID")} dengan ROI ${roiValue}%!`);
        setInvestAmount("");
        setInvestRoi("");
        setInvestMessage("");
        refreshInvestorData();
      } else {
        toast.error("Gagal mengirim penawaran. Pastikan saldo Anda mencukupi.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem saat mengirim penawaran.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUmkm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Memuat Profil Toko...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-16 text-slate-800"
    >
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate("/investor/umkm")}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Data UMKM
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: UMKM Profile Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-2xl shadow-inner">
                {currentUmkm.business_name ? currentUmkm.business_name.substring(0, 2).toUpperCase() : "TK"}
              </div>
              <div>
                <span className="bg-amber-50 text-amber-800 border border-amber-100 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  UMKM Binaan BUMDesa
                </span>
                <h1 className="font-heading font-black text-slate-900 text-2xl mt-1 leading-tight">
                  {currentUmkm.business_name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-bold mt-1.5">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Pemilik: {currentUmkm.owner}</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> NIB: {currentUmkm.nib || "Tervalidasi"}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deskripsi Usaha</h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {currentUmkm.description || "UMKM ini terdaftar dalam kemitraan desa KoneksiDesa dan menyuplai komoditas pangan lokal unggulan."}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-500">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Alamat Operasional: <strong className="text-slate-800">{currentUmkm.address || "Dusun Karya Maju"}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Email Kontak: <strong className="text-slate-800">{currentUmkm.email}</strong></span>
              </div>
            </div>
          </div>

          {/* Product Catalogue of the Store */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" /> Katalog Produk UMKM
            </h3>

            {loadingProducts ? (
              <div className="text-xs text-slate-400 font-bold">Memuat produk toko...</div>
            ) : umkmProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-450 font-bold bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                Belum ada produk yang diunggah oleh toko ini di database.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {umkmProducts.map((p) => (
                  <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition duration-200 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm flex-shrink-0" />
                    <div>
                      <h4 className="font-heading font-black text-slate-800 text-xs">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{p.category}</p>
                      <p className="text-xs font-black text-emerald-600 mt-1">Rp {p.price.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Funding Proposals & Progress */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-500" /> Penggalangan Dana Aktif
            </h3>

            {umkmCampaigns.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-450 font-bold bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                Toko ini tidak memiliki kampanye penggalangan dana aktif saat ini.
              </div>
            ) : (
              <div className="space-y-4">
                {umkmCampaigns.map((c) => {
                  const progressPct = Math.round((Number(c.current || c.current_amount || 0) / Number(c.target)) * 100) || 0;
                  return (
                    <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <h4 className="font-heading font-black text-slate-900 text-sm">{c.title}</h4>
                        <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{c.status}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>Kemajuan: {progressPct}%</span>
                          <span>Target Modal: Rp {Number(c.target).toLocaleString("id-ID")}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, progressPct)}%` }} />
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold border-t border-slate-200/60 pt-3">
                        <span>Bagi Hasil (ROI): <strong className="text-emerald-600">+{c.roi}% / Tahun</strong></span>
                        <span>Tenor: <strong className="text-slate-700">{c.tenor}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Direct Investment Proposal Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 sticky top-28">
          <div>
            <h3 className="font-heading font-black text-slate-950 text-base flex items-center gap-1.5">
              <Award className="w-5 h-5 text-amber-500" /> Penawaran Investasi
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Ajukan kemitraan langsung</p>
          </div>

          <form onSubmit={handleDirectInvest} className="space-y-4 text-xs font-bold text-slate-650">
            {/* Amount input */}
            <div className="space-y-1.5">
              <label htmlFor="amount" className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Nominal Investasi (Rupiah)</label>
              <div className="relative rounded-xl border border-slate-200/80 bg-slate-50 flex items-center px-3 focus-within:border-amber-400 focus-within:bg-white shadow-inner">
                <span className="text-slate-400 pr-1.5 border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="text"
                  id="amount"
                  placeholder="Contoh: 5.000.000"
                  value={investAmount}
                  onChange={handleAmountChange}
                  className="bg-transparent border-none outline-none py-2.5 px-2 text-slate-800 w-full placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* ROI input */}
            <div className="space-y-1.5">
              <label htmlFor="roi" className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Bagi Hasil / ROI (%)</label>
              <div className="relative rounded-xl border border-slate-200/80 bg-slate-50 flex items-center px-3 focus-within:border-amber-400 focus-within:bg-white shadow-inner">
                <input
                  type="number"
                  id="roi"
                  placeholder="Contoh: 12"
                  value={investRoi}
                  onChange={(e) => setInvestRoi(e.target.value)}
                  className="bg-transparent border-none outline-none py-2.5 px-2 text-slate-800 w-full placeholder:text-slate-400"
                  required
                />
                <span className="text-slate-400 pl-1.5 border-l border-slate-200 text-xs">%</span>
              </div>
            </div>

            {/* Tenor input */}
            <div className="space-y-1.5">
              <label htmlFor="tenor" className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Tenor Pembiayaan</label>
              <Select2
                options={[
                  { value: "3 Bulan", label: "3 Bulan" },
                  { value: "6 Bulan", label: "6 Bulan" },
                  { value: "12 Bulan", label: "12 Bulan" },
                  { value: "24 Bulan", label: "24 Bulan" }
                ]}
                value={investTenor}
                onChange={(val) => setInvestTenor(val || "6 Bulan")}
                isClearable={false}
                isSearchable={false}
              />
            </div>

            {/* Message input */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Pesan Kemitraan (Opsional)</label>
              <textarea
                id="message"
                placeholder="Tuliskan catatan kerja sama..."
                value={investMessage}
                onChange={(e) => setInvestMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-slate-800 outline-none focus:border-amber-400 focus:bg-white min-h-[80px] shadow-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border-none shadow-sm uppercase tracking-wider"
            >
              <Send className="w-4 h-4" /> {submitting ? "Mengirim..." : "Kirim Penawaran"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
