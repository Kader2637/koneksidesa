"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProductProps {
  id: number;
  img: string;
  cat: string;
  name: string;
  desa: string;
  delay?: number;
}

export default function ProductCard({ img, cat, name, desa, delay = 0 }: ProductProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer flex flex-col w-full"
    >
      {/* Image Container with Zoom and Glassmorphism Tag */}
      <div className="aspect-[4/5] w-full bg-slate-100 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-sm border border-slate-100 dark:border-zinc-800">
        {/* Next.js Image component optimized loading */}
        <div className="w-full h-full relative">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={false}
          />
        </div>

        {/* Category Tag */}
        <div className="absolute top-5 left-5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 dark:text-white shadow-sm uppercase tracking-wider border border-white/20">
          {cat}
        </div>

        {/* Dynamic Action Button Overlay */}
        <div className="absolute bottom-5 right-5 w-10 h-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-md border border-white/20 opacity-0 transform translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Product Details */}
      <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 tracking-widest uppercase mb-1.5">
        {desa}
      </p>
      <h3 className="text-xl font-heading font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
        {name}
      </h3>
    </motion.div>
  );
}
