"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, ShieldCheck, Mail, Phone, CreditCard, Wallet, Plus, ArrowDownLeft, Save } from "lucide-react";
import { useInvestor } from "../layout";
import { toast } from "@/components/ui/Toast";
import Select2 from "@/components/ui/Select2";

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [deleteAvatar, setDeleteAvatar] = useState(false);

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
        if (u.avatar) {
          setAvatarPreview(u.avatar);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      setSavingProfile(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone_number", profile.phone_number);
    formData.append("address", profile.address);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (deleteAvatar) {
      formData.append("delete_avatar", "true");
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/profile/update", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        // Sync local storage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          const updated = { ...u, ...profile, avatar: data.user.avatar };
          localStorage.setItem("user", JSON.stringify(updated));
        }
        // Emit profile-updated event
        window.dispatchEvent(new Event("profile-updated"));
        toast.success("Profil berhasil diperbarui!");
        setAvatarFile(null);
        setDeleteAvatar(false);
      } else {
        const err = await res.json();
        toast.error("Gagal memperbarui profil: " + (err.message || "kesalahan tidak diketahui"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setSavingProfile(false);
    }
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
            {/* Avatar Upload Section */}
            <div className="flex items-center gap-5 pb-4 border-b border-slate-100/80">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {profile.name ? profile.name.split(" ").map(n => n.charAt(0)).join("").substring(0, 2).toUpperCase() : "IV"}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 block">Foto Profil</span>
                <div className="flex gap-2 items-center">
                  <label className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-650 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5">
                    Unggah Foto
                    <input 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2048 * 1024) {
                            toast.error("Ukuran file maksimal adalah 2MB!");
                            return;
                          }
                          setAvatarFile(file);
                          setDeleteAvatar(false);
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        setDeleteAvatar(true);
                        setAvatarPreview("");
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-650 text-[10px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 block">Maksimal 2MB (JPG, JPEG, PNG).</span>
              </div>
            </div>
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
                <Select2
                  options={[
                    { value: "Bank Mandiri", label: "Bank Mandiri" },
                    { value: "Bank BRI", label: "Bank BRI" },
                    { value: "Bank BCA", label: "Bank BCA" },
                    { value: "Bank BNI", label: "Bank BNI" }
                  ]}
                  value={profile.bank_name}
                  onChange={(val) => setProfile({ ...profile, bank_name: val || "Bank Mandiri" })}
                  isClearable={false}
                  isSearchable={true}
                />
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
