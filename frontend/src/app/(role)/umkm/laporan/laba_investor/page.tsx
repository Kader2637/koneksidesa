"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Users, Calendar, ArrowRightLeft, DollarSign, X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useUMKM } from "../../layout";
import { toast } from "@/components/ui/Toast";

export default function LabaInvestorPage() {
  const { umkmInvestasis, refreshUmkmData } = useUMKM();

  // Active investments (Diterima or Aktif)
  const activeInvestments = useMemo(() => {
    return umkmInvestasis.filter(i => i.status === "Aktif" || i.status === "Diterima");
  }, [umkmInvestasis]);

  // Selected Investment for Monthly Details View
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const selectedInvestment = useMemo(() => {
    return activeInvestments.find(i => i.id === selectedInvestmentId);
  }, [activeInvestments, selectedInvestmentId]);

  // 1. Total Investors
  const totalInvestorsCount = activeInvestments.length;

  // 2. Total Dana Terkumpul
  const totalFundCollected = useMemo(() => {
    return activeInvestments.reduce((sum, i) => sum + Number(i.amount), 0);
  }, [activeInvestments]);

  // Gather all ROI payment schedule records
  const allSchedules = useMemo(() => {
    const list: any[] = [];
    activeInvestments.forEach(i => {
      if (Array.isArray(i.roi_payments)) {
        i.roi_payments.forEach((p: any) => {
          list.push(p);
        });
      }
    });
    return list;
  }, [activeInvestments]);

  // 3. Total ROI Dibayarkan
  const totalRoiPaid = useMemo(() => {
    return allSchedules
      .filter(s => s.status === "Lunas")
      .reduce((sum, s) => sum + Number(s.nominal), 0);
  }, [allSchedules]);

  // 4. Total ROI Belum Dibayarkan
  const totalRoiUnpaid = useMemo(() => {
    return allSchedules
      .filter(s => s.status !== "Lunas")
      .reduce((sum, s) => sum + Number(s.nominal), 0);
  }, [allSchedules]);

  // 5. Late Schedules Count (status === 'Menunggak')
  const lateSchedulesCount = useMemo(() => {
    return allSchedules.filter(s => s.status === "Menunggak").length;
  }, [allSchedules]);

  // Handlers
  const handlePayManual = async (paymentId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      return;
    }

    setActionLoadingId(paymentId);
    try {
      const res = await fetch(`http://localhost:8000/api/umkm/roi-payment/${paymentId}/pay`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        toast.success("Setoran ROI manual berhasil diselesaikan!");
        refreshUmkmData();
      } else {
        const err = await res.json();
        toast.error("Gagal menyetor: " + (err.message || "kesalahan tidak diketahui"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem saat memproses setoran.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 text-slate-800"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Laporan Laba & Investor</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau bagi hasil ROI bulanan yang dibagikan ke investor. Lakukan penyelesaian setoran secara manual.</p>
      </div>

      {/* Late Payout Warning Banner */}
      {lateSchedulesCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-650 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">Perhatian: Tunggakan ROI Terdeteksi</h4>
            <p className="text-xs text-rose-700 font-semibold mt-1">
              Ada <strong className="font-extrabold">{lateSchedulesCount}</strong> jadwal bagi hasil yang terlambat bayar (Menunggak). Silakan selesaikan pembayaran agar penilaian kepatuhan toko Anda tetap terjaga baik.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Investor Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-32 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Investor Aktif</p>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900">{totalInvestorsCount} Investor</h3>
          <span className="text-[9px] font-bold text-slate-400">Pemberi Modal Usaha</span>
        </div>

        {/* Total Dana Terkumpul */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-32 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Dana Terkumpul</p>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Landmark className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-emerald-600">Rp {totalFundCollected.toLocaleString("id-ID")}</h3>
          <span className="text-[9px] font-bold text-slate-400">Total Kredit Masuk</span>
        </div>

        {/* Total ROI Dibayarkan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-32 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total ROI Dibayarkan</p>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-blue-600 font-heading">Rp {totalRoiPaid.toLocaleString("id-ID")}</h3>
          <span className="text-[9px] font-bold text-slate-400">Sudah Didistribusikan</span>
        </div>

        {/* Total ROI Belum Dibayarkan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-32 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">ROI Belum Dibayar</p>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <h3 className="text-xl font-black text-amber-650">Rp {totalRoiUnpaid.toLocaleString("id-ID")}</h3>
          <span className="text-[9px] font-bold text-slate-400">Kewajiban Bagi Hasil</span>
        </div>
      </div>

      {/* Active Investor & Investment List */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Daftar Kontrak Investasi Aktif & Pembayaran ROI
        </h3>

        <div className="overflow-x-auto">
          {activeInvestments.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-55 rounded-2xl border border-slate-100 border-dashed">
              Belum ada modal investasi masuk aktif
            </div>
          ) : (
            <table className="w-full text-xs font-bold text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Nama Investor</th>
                  <th className="py-3 px-4">Dana Investasi</th>
                  <th className="py-3 px-4">Jangka Tenor</th>
                  <th className="py-3 px-4">Bagi Hasil / ROI</th>
                  <th className="py-3 px-4">Progres Payout</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {activeInvestments.map((inv) => {
                  const investorName = inv.user?.name || `Investor ID ${inv.user_id}`;
                  const payments = Array.isArray(inv.roi_payments) ? inv.roi_payments : [];
                  const paidCount = payments.filter((p: any) => p.status === "Lunas").length;
                  const totalCount = payments.length;

                  return (
                    <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-slate-700 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-heading font-black text-slate-900 block">{investorName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{inv.user?.email || "-"}</span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-800">
                        Rp {Number(inv.amount).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">{inv.tenor || "12 Bulan"}</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-black">+{inv.roi || 0}% / Bulan</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500" 
                              style={{ width: totalCount > 0 ? `${(paidCount / totalCount) * 100}%` : "0%" }}
                            />
                          </div>
                          <span>{paidCount} / {totalCount} Bulan</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedInvestmentId(inv.id)}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition border border-indigo-150 cursor-pointer"
                        >
                          Rincian Bulanan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Monthly ROI Payments Modal */}
      <AnimatePresence>
        {selectedInvestment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 max-w-2xl w-full space-y-5 relative"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-base">
                    Rincian Omset & ROI Bulanan
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    Investor: {selectedInvestment.user?.name || `ID ${selectedInvestment.user_id}`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInvestmentId(null)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Investment stats summary */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block tracking-wider">Nilai Modal</span>
                  <span className="font-black text-slate-800">Rp {Number(selectedInvestment.amount).toLocaleString("id-ID")}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block tracking-wider">ROI</span>
                  <span className="font-black text-emerald-600">+{selectedInvestment.roi}% / Bulan</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block tracking-wider">Tenor Jangka Waktu</span>
                  <span className="font-black text-slate-800">{selectedInvestment.tenor || "12 Bulan"}</span>
                </div>
              </div>

              {/* Monthly Schedules Table */}
              <div className="overflow-y-auto max-h-[250px] border border-slate-200 rounded-2xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px] tracking-wider bg-slate-50 sticky top-0">
                      <th className="py-2.5 px-3">Bulan</th>
                      <th className="py-2.5 px-3">Jatuh Tempo</th>
                      <th className="py-2.5 px-3 text-right">Omset UMKM</th>
                      <th className="py-2.5 px-3 text-right">ROI Investor</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(selectedInvestment.roi_payments) && selectedInvestment.roi_payments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                          Belum ada jadwal pembayaran digenerate
                        </td>
                      </tr>
                    ) : (
                      selectedInvestment.roi_payments.map((p: any) => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-slate-700 transition">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Bulan ke-{p.bulan_ke}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-500">
                            {new Date(p.jatuh_tempo).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-800">
                            Rp {Number(p.omset).toLocaleString("id-ID")}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-emerald-600">
                            Rp {Number(p.nominal).toLocaleString("id-ID")}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                              p.status === "Lunas"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                                : p.status === "Menunggak"
                                ? "bg-rose-50 text-rose-700 border-rose-150"
                                : "bg-amber-50 text-amber-700 border-amber-150"
                            }`}>{p.status}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {p.status !== "Lunas" ? (
                              <button
                                disabled={actionLoadingId !== null}
                                onClick={() => handlePayManual(p.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-[8px] font-black uppercase tracking-wider rounded transition cursor-pointer border-none shadow-sm flex items-center justify-center gap-1 mx-auto min-w-[70px]"
                              >
                                {actionLoadingId === p.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : "Bayar"}
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold italic">Lunas</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Notice text */}
              <p className="text-[9px] text-slate-400 leading-normal font-semibold">
                * Note: Dana ROI yang Anda bayar akan otomatis ditarik dari saldo Dompet Merchant Anda. Pastikan saldo Anda cukup sebelum menyetor. Sistem otomatis mendistribusikan ROI secara periodik di akhir bulan, tombol di atas berfungsi untuk setoran darurat / penunggakan manual.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
