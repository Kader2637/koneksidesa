"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, ShieldCheck, Mail, Phone, CreditCard, Wallet, Plus, ArrowDownLeft, Save } from "lucide-react";
import { useInvestor } from "../layout";
import { toast } from "@/components/ui/Toast";

export default function InvestorProfilPage() {
  const { 
    walletBalance, 
    depositWallet, 
    withdrawWallet, 
    refreshInvestorData 
  } = useInvestor();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    bank_name: "Bank Mandiri",
    bank_account: ""
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setProfile({
          name: u.name || "Bambang Hermawan",
          email: u.email || "investor@koneksidesa.com",
          phone_number: u.phone_number || "081234567892",
          address: u.address || "Perumahan Lestari Blok C1",
          bank_name: u.bank_name || "Bank Mandiri",
          bank_account: u.bank_account || "137-00-1234567-8"
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          const updated = { ...u, ...profile };
          localStorage.setItem("user", JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }
      }
      toast.success("Profil dan data rekening investor berhasil disimpan!");
    }, 800);
  };

  const handleDeposit = async () => {
    const amt = parseFloat(walletAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.warning("Masukkan nominal transaksi yang valid!");
      return;
    }
    setWalletLoading(true);
    const success = await depositWallet(amt);
    setWalletLoading(false);
    if (success) {
      toast.success(`Berhasil deposit Rp ${amt.toLocaleString("id-ID")} ke saldo dompet!`);
      setWalletAmount("");
      refreshInvestorData();
    } else {
      toast.error("Gagal melakukan deposit.");
    }
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(walletAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.warning("Masukkan nominal transaksi yang valid!");
      return;
    }
    if (amt > walletBalance) {
      toast.error("Saldo tidak mencukupi untuk melakukan penarikan.");
      return;
    }
    setWalletLoading(true);
    const success = await withdrawWallet(amt);
    setWalletLoading(false);
    if (success) {
      toast.success(`Berhasil menarik dana sebesar Rp ${amt.toLocaleString("id-ID")} ke rekening terdaftar!`);
      setWalletAmount("");
      refreshInvestorData();
    } else {
      toast.error("Gagal melakukan penarikan.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Profil Investor & Dompet</h1>
        <p className="text-slate-500 text-xs font-semibold">Kelola rincian data diri, informasi rekening bank pengembalian dividen, serta deposit/withdraw saldo investasi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Wallet Dashboard Widget */}
        <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 h-fit text-slate-800">
          <div className="space-y-2">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-amber-500" /> Dompet Finansial
            </h3>
            <div className="pt-2">
              <span className="text-xs text-slate-400 font-bold block uppercase">Saldo Dompet Tersedia</span>
              <span className="text-2xl font-black text-indigo-600">Rp {walletBalance.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Nominal Transaksi (Rp)</label>
              <input
                type="number"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                placeholder="Contoh: 1000000"
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-all focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                disabled={walletLoading}
                onClick={handleDeposit}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition cursor-pointer flex justify-center items-center gap-1 border-none shadow-sm"
              >
                <Plus className="w-4 h-4" /> Deposit
              </button>
              <button
                type="button"
                disabled={walletLoading}
                onClick={handleWithdraw}
                className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition cursor-pointer flex justify-center items-center gap-1 border-none shadow-sm"
              >
                <ArrowDownLeft className="w-4 h-4" /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Data Diri Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest text-indigo-600 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" /> Informasi Data Diri & Rekening
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Nomor Telepon</label>
                <input
                  type="text"
                  required
                  value={profile.phone_number}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-semibold"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Alamat Fisik</label>
                <input
                  type="text"
                  required
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Nama Bank</label>
                <select
                  value={profile.bank_name}
                  onChange={(e) => setProfile({ ...profile, bank_name: e.target.value })}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-extrabold cursor-pointer"
                >
                  <option>Bank Mandiri</option>
                  <option>Bank BRI</option>
                  <option>Bank BCA</option>
                  <option>Bank BNI</option>
                </select>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="tracking-wide text-xs text-slate-500">Nomor Rekening</label>
                <input
                  type="text"
                  required
                  value={profile.bank_account}
                  onChange={(e) => setProfile({ ...profile, bank_account: e.target.value })}
                  placeholder="Contoh: 123-456-789-0"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-indigo-600 hover:bg-indigo-755 text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex justify-center items-center gap-2 uppercase tracking-wider text-xs border-none"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? "Menyimpan..." : "Simpan Pengaturan Profil"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
