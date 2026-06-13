import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Banknote, CreditCard } from "lucide-react";
import { usePembeli } from "../layout";
import { toast } from "@/components/ui/Toast";

export default function KeranjangPage() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, cartTotal, cartCount, checkout } = usePembeli();

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "digital">("digital");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Custom Confirmation Modals State
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      removeFromCart(itemToDelete);
      toast.success("Produk berhasil dihapus dari keranjang.");
      setItemToDelete(null);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    setShowCheckoutConfirm(false);

    try {
      if (paymentMethod === "cod") {
        const result = await checkout("cod");
        if (result && result.order_id) {
          toast.success(`Pesanan COD berhasil dibuat! ID Pesanan: ${result.order_id}`);
          navigate("/pembeli/pesanan");
        } else {
          toast.error("Gagal memproses pesanan COD.");
        }
      } else {
        // Digital Midtrans
        const result = await checkout("midtrans");
        const token = localStorage.getItem("token");
        const syncStatus = async () => {
          if (token && result && result.raw_id) {
            try {
              await fetch(`http://localhost:8000/api/orders/${result.raw_id}/check-status`, {
                headers: { "Authorization": `Bearer ${token}` }
              });
            } catch (err) {
              console.error("Error syncing status:", err);
            }
          }
        };

        if (result && result.snap_token) {
          // Trigger Midtrans Snap popup modal
          (window as any).snap.pay(result.snap_token, {
            onSuccess: async function (res: any) {
              await syncStatus();
              toast.success("Pembayaran Sukses! Terima kasih.");
              navigate("/pembeli/pesanan");
            },
            onPending: async function (res: any) {
              await syncStatus();
              toast.warning("Pembayaran Pending. Harap segera bayar sesuai petunjuk.");
              navigate("/pembeli/pesanan");
            },
            onError: async function (res: any) {
              await syncStatus();
              toast.error("Pembayaran Gagal.");
              navigate("/pembeli/pesanan");
            },
            onClose: async function (res: any) {
              await syncStatus();
              toast.info("Pop-up pembayaran ditutup.");
              navigate("/pembeli/pesanan");
            }
          });
        } else if (result && result.order_id) {
          toast.info("Pesanan berhasil dibuat (Metode alternatif manual): " + result.order_id);
          navigate("/pembeli/pesanan");
        } else {
          toast.error("Checkout digital gagal diproses. Silakan hubungi admin BUMDesa.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem saat memproses checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Keranjang Belanja</h1>
        <p className="text-slate-500 text-xs font-semibold">Tinjau item belanjaan Anda sebelum checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm">
          <ShoppingCart className="w-12 h-12 text-slate-350 mb-4" />
          <h3 className="text-base font-black text-slate-800">Keranjang Anda Kosong</h3>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Silakan kunjungi Bazar Desa untuk berbelanja.</p>
          <Link
            to="/pembeli"
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-sm border-none uppercase tracking-wider"
          >
            Kunjungi Bazar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition duration-300">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-heading font-black text-slate-800 text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-slate-455 font-bold mt-0.5">{item.desa}</p>
                  <span className="text-xs font-black text-emerald-600 mt-1 block">Rp {item.price.toLocaleString("id-ID")}</span>
                </div>
                
                {/* Qty actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer"
                  >
                    <Minus className="w-3 h-3 text-slate-600" />
                  </button>
                  <span className="text-xs font-black w-6 text-center text-slate-800">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-slate-600" />
                  </button>
                </div>

                <button
                  onClick={() => setItemToDelete(item.id)}
                  className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-transparent hover:border-rose-100"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout panel with payment methods */}
          <div className="space-y-6">
            
            {/* Payment Method Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Metode Pembayaran</h3>
              
              <div className="space-y-3 font-semibold text-xs text-slate-605">
                
                {/* Digital Option */}
                <label 
                  onClick={() => setPaymentMethod("digital")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition duration-200 ${
                    paymentMethod === "digital" 
                      ? "border-indigo-650 bg-indigo-50/30 text-indigo-700 font-extrabold" 
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>Pembayaran Digital (Midtrans)</span>
                  </span>
                  <input 
                    type="radio" 
                    name="payment_method" 
                    checked={paymentMethod === "digital"}
                    onChange={() => setPaymentMethod("digital")}
                    className="accent-indigo-600 h-4 w-4 cursor-pointer" 
                  />
                </label>

                {/* COD Option */}
                <label 
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition duration-200 ${
                    paymentMethod === "cod" 
                      ? "border-emerald-600 bg-emerald-50/30 text-emerald-700 font-extrabold" 
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Banknote className="w-4 h-4 text-emerald-650" />
                    <span>COD (Bayar di Tempat)</span>
                  </span>
                  <input 
                    type="radio" 
                    name="payment_method" 
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-emerald-600 h-4 w-4 cursor-pointer" 
                  />
                </label>

              </div>
            </div>

            {/* Total bayar & Submit */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-fit space-y-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Ringkasan Pembayaran</h3>
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal ({cartCount} barang)</span>
                    <span>Rp {cartTotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Biaya Layanan</span>
                    <span className="text-emerald-600">Gratis</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between font-heading font-black text-base">
                  <span className="text-slate-800">Total Bayar</span>
                  <span className="text-emerald-600 font-black">Rp {cartTotal.toLocaleString("id-ID")}</span>
                </div>
                <button
                  onClick={() => setShowCheckoutConfirm(true)}
                  disabled={checkoutLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex justify-center items-center gap-2 text-xs uppercase tracking-wider shadow-sm border-none"
                >
                  {checkoutLoading ? "Memproses..." : "Checkout Sekarang"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-800 max-w-sm w-full space-y-4 relative"
            >
              <div>
                <h3 className="font-heading font-black text-slate-900 text-base">Hapus dari Keranjang</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Konfirmasi Tindakan</p>
              </div>
              <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                Apakah Anda yakin ingin menghapus item ini dari keranjang belanja Anda?
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-655 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {showCheckoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-800 max-w-sm w-full space-y-4 relative"
            >
              <div>
                <h3 className="font-heading font-black text-slate-900 text-base">Konfirmasi Pembelian</h3>
                <p className="text-[10px] text-indigo-650 font-bold uppercase tracking-wider mt-0.5">Proses Checkout</p>
              </div>
              <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                Anda akan melakukan pemesanan dengan total pembayaran sebesar <strong className="text-slate-900 font-extrabold">Rp {cartTotal.toLocaleString("id-ID")}</strong> melalui metode <strong className="text-slate-900 font-extrabold">{paymentMethod === "cod" ? "COD (Bayar di Tempat)" : "Digital (Midtrans)"}</strong>.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCheckoutConfirm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-655 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-none transition cursor-pointer"
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
