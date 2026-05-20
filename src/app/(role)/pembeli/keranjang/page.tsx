"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePembeli } from "../layout";

export default function KeranjangPage() {
  const router = useRouter();
  const { cart, updateQty, removeFromCart, clearCart, cartTotal, cartCount } = usePembeli();

  const handleCheckout = () => {
    alert("Simulasi checkout berhasil! Pesanan Anda sedang dipersiapkan oleh Mitra UMKM.");
    clearCart();
    router.push("/pembeli/lacak");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Keranjang Belanja</h1>
        <p className="text-slate-400 text-sm font-semibold">Tinjau item belanjaan Anda sebelum checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-slate-950/45 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-slate-700 mb-4" />
          <h3 className="text-lg font-heading font-bold">Keranjang Anda Kosong</h3>
          <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">Silakan kunjungi Bazar Desa untuk berbelanja.</p>
          <Link
            href="/pembeli"
            className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full text-xs transition flex items-center gap-2 cursor-pointer shadow-lg"
          >
            Kunjungi Bazar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                  <Image src={item.img} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-heading font-black text-white text-base truncate">{item.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold">{item.desa}</p>
                  <span className="text-xs font-black text-emerald-450 mt-1 block">Rp {item.price.toLocaleString("id-ID")}</span>
                </div>
                
                {/* Qty actions */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer"
                  >
                    <Minus className="w-3 h-3 text-white" />
                  </button>
                  <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout aggregate summary panel */}
          <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 flex flex-col justify-between h-fit space-y-6 shadow-xl">
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-black border-b border-slate-900 pb-3">Ringkasan Pembayaran</h3>
              <div className="space-y-2 text-xs font-bold">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cartCount} barang)</span>
                  <span>Rp {cartTotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Biaya Layanan</span>
                  <span className="text-emerald-450">Gratis</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-900 pt-4">
              <div className="flex justify-between font-heading font-black text-base">
                <span>Total Bayar</span>
                <span className="text-emerald-405 text-emerald-400">Rp {cartTotal.toLocaleString("id-ID")}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10"
              >
                Checkout Sekarang
              </button>
            </div>
          </div>

        </div>
      )}
    </motion.div>
  );
}
