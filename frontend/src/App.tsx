import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Landing Pages
import LandingPage from "./app/(landing)/page";
import KatalogPage from "./app/(landing)/katalog/page";
import InvestasiPage from "./app/(landing)/investasi/page";
import PetaPage from "./app/(landing)/peta/page";
import StatistikPage from "./app/(landing)/statistik/page";
import FaqPage from "./app/(landing)/faq/page";

// Auth Pages
import LoginPage from "./app/(auth)/login/page";
import RegisterPage from "./app/(auth)/register/page";

// Pembeli
import PembeliLayout from "./app/(role)/pembeli/layout";
import PembeliDashboard from "./app/(role)/pembeli/page";
import KeranjangPage from "./app/(role)/pembeli/keranjang/page";
import PembeliProdukPage from "./app/(role)/pembeli/produk/page";
import PembeliProdukDetailPage from "./app/(role)/pembeli/produk/detail/page";
import PembeliPesananPage from "./app/(role)/pembeli/pesanan/page";
import PembeliProfilPage from "./app/(role)/pembeli/profil/page";

// UMKM
import UMKMLayout from "./app/(role)/umkm/layout";
import MerchantDashboard from "./app/(role)/umkm/page";
import ProdukPage from "./app/(role)/umkm/produk/page";
import PesananPage from "./app/(role)/umkm/pesanan/page";
import UMKMPendanaanPage from "./app/(role)/umkm/pendanaan/page";
import DetailPendanaanUMKM from "./app/(role)/umkm/pendanaan/detail/page";
import UMKMInvestorPage from "./app/(role)/umkm/investor/page";
import UMKMLaporanPage from "./app/(role)/umkm/laporan/page";
import UMKMProfilPage from "./app/(role)/umkm/profil/page";

// Investor
import InvestorLayout from "./app/(role)/investor/layout";
import InvestorDashboard from "./app/(role)/investor/page";
import InvestorUMKMPage from "./app/(role)/investor/umkm/page";
import InvestorUMKMDetailPage from "./app/(role)/investor/umkm/detail/page";
import InvestorPersetujuanPage from "./app/(role)/investor/persetujuan/page";
import InvestorPengajuanPage from "./app/(role)/investor/pengajuan/page";
import InvestorLaporanPage from "./app/(role)/investor/laporan/page";
import InvestorProfilPage from "./app/(role)/investor/profil/page";

// Admin
import AdminLayout from "./app/(role)/admin/layout";
import AdminDashboard from "./app/(role)/admin/page";
import PenggunaPage from "./app/(role)/admin/pengguna/page";
import AdminProdukPage from "./app/(role)/admin/produk/page";
import AdminTransaksiInvestasiPage from "./app/(role)/admin/transaksi-investasi/page";
import LaporanPage from "./app/(role)/admin/laporan/page";
import AdminProfilPage from "./app/(role)/admin/profil/page";
import AdminVerifikasiPage from "./app/(role)/admin/verifikasi/page";
import AdminModerasiPage from "./app/(role)/admin/moderasi/page";

// Route Guard Component
interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

import { Toaster } from "@/components/ui/Toast";

export default function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Landing & Information Pages */}
        <Route path="/katalog" element={<KatalogPage />} />
        <Route path="/investasi" element={<InvestasiPage />} />
        <Route path="/peta" element={<PetaPage />} />
        <Route path="/statistik" element={<StatistikPage />} />
        <Route path="/faq" element={<FaqPage />} />

        {/* Pembeli Layout & Subroutes */}
        <Route element={<ProtectedRoute allowedRoles={["Pembeli", "Admin"]} />}>
          <Route path="/pembeli" element={<PembeliLayout />}>
            <Route index element={<PembeliDashboard />} />
            <Route path="keranjang" element={<KeranjangPage />} />
            <Route path="produk" element={<PembeliProdukPage />} />
            <Route path="produk/:id" element={<PembeliProdukDetailPage />} />
            <Route path="pesanan" element={<PembeliPesananPage />} />
            <Route path="profil" element={<PembeliProfilPage />} />
          </Route>
        </Route>

        {/* UMKM Layout & Subroutes */}
        <Route element={<ProtectedRoute allowedRoles={["Mitra UMKM", "Admin"]} />}>
          <Route path="/umkm" element={<UMKMLayout />}>
            <Route index element={<MerchantDashboard />} />
            <Route path="produk" element={<ProdukPage />} />
            <Route path="pesanan" element={<PesananPage />} />
            <Route path="pendanaan" element={<UMKMPendanaanPage />} />
            <Route path="pendanaan/:id" element={<DetailPendanaanUMKM />} />
            <Route path="investor" element={<UMKMInvestorPage />} />
            <Route path="laporan" element={<UMKMLaporanPage />} />
            <Route path="laba_investor" element={<Navigate to="/umkm/laporan" replace />} />
            <Route path="profil" element={<UMKMProfilPage />} />
          </Route>
        </Route>

        {/* Investor Layout & Subroutes */}
        <Route element={<ProtectedRoute allowedRoles={["Investor", "Admin"]} />}>
          <Route path="/investor" element={<InvestorLayout />}>
            <Route index element={<InvestorDashboard />} />
            <Route path="umkm" element={<InvestorUMKMPage />} />
            <Route path="umkm/:id" element={<InvestorUMKMDetailPage />} />
            <Route path="persetujuan" element={<InvestorPersetujuanPage />} />
            <Route path="pengajuan" element={<InvestorPengajuanPage />} />
            <Route path="laporan" element={<InvestorLaporanPage />} />
            <Route path="profil" element={<InvestorProfilPage />} />
          </Route>
        </Route>

        {/* Admin Layout & Subroutes */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="pengguna" element={<PenggunaPage />} />
            <Route path="produk" element={<AdminProdukPage />} />
            <Route path="transaksi-investasi" element={<AdminTransaksiInvestasiPage />} />
            <Route path="laporan" element={<LaporanPage />} />
            <Route path="profil" element={<AdminProfilPage />} />
            <Route path="verifikasi" element={<AdminVerifikasiPage />} />
            <Route path="moderasi" element={<AdminModerasiPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
