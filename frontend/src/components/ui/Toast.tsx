import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Simple event store for toast alerts
type Listener = (toasts: ToastItem[]) => void;
let listeners: Listener[] = [];
let toastsStore: ToastItem[] = [];

const notify = () => {
  listeners.forEach((listener) => listener([...toastsStore]));
};

export const toast = {
  show: (type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, type, message, duration };
    toastsStore = [...toastsStore, newToast];
    notify();

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
    return id;
  },
  success: (message: string, duration = 4000) => toast.show("success", message, duration),
  error: (message: string, duration = 4000) => toast.show("error", message, duration),
  warning: (message: string, duration = 4000) => toast.show("warning", message, duration),
  info: (message: string, duration = 4000) => toast.show("info", message, duration),
  dismiss: (id: string) => {
    toastsStore = toastsStore.filter((t) => t.id !== id);
    notify();
  },
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleUpdate = (newToasts: ToastItem[]) => {
      setToasts(newToasts);
    };
    listeners.push(handleUpdate);
    setToasts([...toastsStore]);

    return () => {
      listeners = listeners.filter((l) => l !== handleUpdate);
    };
  }, []);

  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((item) => {
          const config = {
            success: {
              icon: CheckCircle,
              bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300 shadow-emerald-500/5",
              iconColor: "text-emerald-500",
            },
            error: {
              icon: XCircle,
              bg: "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300 shadow-rose-500/5",
              iconColor: "text-rose-500",
            },
            warning: {
              icon: AlertTriangle,
              bg: "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300 shadow-amber-500/5",
              iconColor: "text-amber-500",
            },
            info: {
              icon: Info,
              bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-800 dark:text-indigo-300 shadow-indigo-500/5",
              iconColor: "text-indigo-500",
            },
          }[item.type];

          const Icon = config.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg font-sans font-extrabold text-xs leading-relaxed ${config.bg}`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${config.iconColor}`} />
              <div className="flex-grow text-[11px] pr-2 whitespace-pre-wrap">{item.message}</div>
              <button
                onClick={() => toast.dismiss(item.id)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
