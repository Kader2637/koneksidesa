import React, { useEffect, useState, useRef } from "react";
import { Bell, Check, ShoppingBag, CreditCard, Shield, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/notifications/read-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
      case "purchase":
        return <ShoppingBag className="w-4 h-4 text-indigo-650" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "kyc":
        return <Shield className="w-4 h-4 text-blue-600" />;
      case "success":
        return <Check className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "order":
      case "purchase":
        return "bg-indigo-50";
      case "payment":
        return "bg-emerald-50";
      case "kyc":
        return "bg-blue-50";
      case "success":
        return "bg-emerald-50";
      default:
        return "bg-slate-50";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins}m yang lalu`;
      if (diffHours < 24) return `${diffHours}j yang lalu`;
      if (diffDays < 7) return `${diffDays}h yang lalu`;
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer border-none flex items-center justify-center outline-none"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl border border-slate-250 shadow-xl z-50 overflow-hidden text-xs text-slate-800"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
              <span className="font-heading font-black text-slate-900 text-sm">Notifikasi</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider border-none bg-transparent cursor-pointer outline-none"
                >
                  Tandai Dibaca
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Tidak ada notifikasi
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 flex gap-3 transition-colors ${
                      !n.read ? "bg-slate-50/50" : "hover:bg-slate-50/30"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${getBgColor(n.type)}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5 text-left">
                      <p className={`font-bold text-slate-850 leading-tight truncate ${!n.read ? "font-black" : ""}`}>
                        {n.title}
                      </p>
                      <p className="text-slate-500 font-semibold leading-relaxed break-words text-[11px]">
                        {n.message}
                      </p>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                        {formatTime(n.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
