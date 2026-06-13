"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Plus, X, Eye, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePembeli, Product } from "../layout";
import { toast } from "@/components/ui/Toast";

export default function PembeliProdukPage() {
  const navigate = useNavigate();
  const { cart, addToCart, updateQty, checkout } = usePembeli();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBeli = async (prod: Product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Silakan login terlebih dahulu untuk melakukan pembelian.");
      navigate("/login");
      return;
    }

    try {
      // 1. Add to cart
      const resAdd = await fetch("http://localhost:8000/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ product_id: prod.id, quantity: 1 })
      });

      if (!resAdd.ok) {
        toast.error("Gagal menambahkan barang ke keranjang.");
        return;
      }

      // 2. Perform checkout immediately
      const result = await checkout("midtrans");
      if (result && result.order_id) {
        toast.success("Pesanan berhasil dibuat!");
        
        // 3. Navigate straight to order details page with state parameters
        navigate("/pembeli/pesanan", { 
          state: { 
            orderId: result.order_id, 
            snapToken: result.snap_token,
            rawId: result.raw_id,
            triggerPayment: true 
          } 
        });
      } else {
        toast.error("Gagal memproses checkout digital.");
      }
    } catch (err) {
      console.error("Quick buy error:", err);
      toast.error("Terjadi kesalahan saat memproses pembelian.");
    }
  };

  const renderProductActions = (prod: Product) => {
    const cartItem = cart.find(item => item.id === prod.id);

    return (
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 w-full">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-emerald-600">Rp {prod.price.toLocaleString("id-ID")}</span>
          
          <button
            onClick={() => handleBeli(prod)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer shadow-sm"
          >
            Beli
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {/* Detail Button */}
          <button
            onClick={() => navigate(`/pembeli/produk/${prod.id}`)}
            className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-655 border border-slate-200 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> Detail
          </button>

          {/* Keranjang Button or - 1 + Selector */}
          {cartItem ? (
            <div className="flex-1 flex items-center justify-between bg-emerald-50 border border-emerald-250 rounded-lg py-1 px-2.5 text-xs text-emerald-800">
              <button
                onClick={() => updateQty(prod.id, -1)}
                className="hover:bg-emerald-100 p-0.5 rounded cursor-pointer border-none bg-transparent"
              >
                <Minus className="w-3 h-3 text-emerald-700" />
              </button>
              <span className="font-extrabold text-xs">{cartItem.qty}</span>
              <button
                onClick={() => updateQty(prod.id, 1)}
                className="hover:bg-emerald-100 p-0.5 rounded cursor-pointer border-none bg-transparent"
              >
                <Plus className="w-3 h-3 text-emerald-700" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                addToCart(prod);
                toast.success(`Produk ${prod.name} berhasil ditambahkan ke keranjang!`);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 border border-emerald-600 hover:border-emerald-500"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Keranjang
            </button>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/bazar-products");
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            desa: item.desa || "Desa Mitra",
            img: item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
            rating: parseFloat(item.rating) || 5.0,
            category: item.category,
            description: item.description || "Produk lokal unggulan desa yang diproduksi dengan kearifan lokal."
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter categories dynamically
  const categories = useMemo(() => {
    const unique = new Set(products.map(p => p.category));
    return ["Semua", ...Array.from(unique)];
  }, [products]);

  // Filter products by search & category
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prod.desa.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Semua" || prod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Katalog Produk Desa</h1>
        <p className="text-slate-500 text-xs font-semibold">Temukan produk komoditas unggulan desa yang segar, sehat, dan diproduksi mandiri oleh UMKM lokal.</p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2.5 rounded-xl w-full md:w-80 shadow-sm">
          <Search className="w-4 h-4 text-slate-450" />
          <input 
            type="text" 
            placeholder="Cari produk atau desa asal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 w-full"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm border-none cursor-pointer"
                  : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-8 text-xs text-slate-400 font-bold">Memuat katalog produk...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-xs text-slate-400 font-bold uppercase tracking-wider bg-white rounded-2xl border border-slate-200 border-dashed">
          Tidak ada produk yang cocok dengan pencarian
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-350 transition-all duration-300"
            >
              <div className="relative h-40 bg-slate-100 cursor-pointer" onClick={() => navigate(`/pembeli/produk/${prod.id}`)}>
                <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/95 border border-slate-200/80 px-3 py-1 rounded-full text-xs font-bold text-slate-600 flex items-center gap-1 shadow-sm">
                  <MapPin className="w-3 h-3 text-emerald-600" /> {prod.desa}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 
                    onClick={() => navigate(`/pembeli/produk/${prod.id}`)}
                    className="font-extrabold text-slate-800 text-sm leading-tight group-hover:text-indigo-650 transition-colors duration-250 cursor-pointer line-clamp-2"
                  >
                    {prod.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold mt-2.5">
                    <span>{prod.category}</span>
                    <span className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full"><Star className="w-3 h-3 fill-current" /> {prod.rating.toFixed(1)}</span>
                  </div>
                </div>
                {renderProductActions(prod)}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
