"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function InitialLoader({ children }: { children: React.ReactNode }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Only run on the very first mount (hard refresh)
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500); // 1.5s of loading screen
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
        {/* Glow behind the icon */}
        <div className="absolute w-40 h-40 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-[40px] animate-pulse" />
        
        {/* Favicon */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 animate-bounce" style={{ animationDuration: "2s" }}>
          <Image
            src="/favicon.png"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <p className="mt-6 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 animate-pulse">
          Memuat Sistem...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
