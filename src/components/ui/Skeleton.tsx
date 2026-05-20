"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({ className = "", variant = "rect" }: SkeletonProps) {
  const baseClass = "bg-slate-200 dark:bg-zinc-800 animate-pulse relative overflow-hidden";
  
  // Custom glassmorphic shimmering overlay layer
  const shimmerEffect = (
    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-zinc-800/10 animate-[shimmer_2s_infinite]" />
  );

  let shapeClass = "rounded-2xl";
  if (variant === "circle") {
    shapeClass = "rounded-full";
  } else if (variant === "text") {
    shapeClass = "rounded-lg h-3 w-full";
  }

  return (
    <div className={`${baseClass} ${shapeClass} ${className}`}>
      {shimmerEffect}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 p-6 rounded-[2.5rem] flex flex-col justify-between h-[360px] shadow-sm relative group overflow-hidden">
      <Skeleton variant="rect" className="w-full h-44 rounded-3xl mb-4" />
      <div className="space-y-3">
        <Skeleton variant="rect" className="w-1/3 h-3 rounded-full" />
        <Skeleton variant="rect" className="w-3/4 h-5 rounded-full" />
        <Skeleton variant="rect" className="w-1/2 h-3.5 rounded-full" />
      </div>
      <div className="flex gap-2 items-center border-t border-slate-100 dark:border-zinc-800 pt-4 mt-4">
        <Skeleton variant="rect" className="h-9 flex-grow rounded-xl" />
        <Skeleton variant="circle" className="w-9 h-9" />
      </div>
    </div>
  );
}

export function InvestmentCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800/80 p-8 rounded-[2.5rem] flex flex-col justify-between h-[450px] animate-pulse">
      <div>
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-14 h-14 rounded-2xl bg-zinc-800" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="w-3/4 h-4 bg-zinc-800 rounded-md" />
            <Skeleton className="w-1/2 h-3 bg-zinc-800 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-full h-16 bg-zinc-800 rounded-2xl mb-6" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-14 bg-zinc-800 rounded-xl" />
          <Skeleton className="h-14 bg-zinc-800 rounded-xl" />
        </div>
      </div>
      <div className="space-y-4 mt-auto">
        <Skeleton className="w-full h-8 bg-zinc-800 rounded-lg" />
        <Skeleton className="w-full h-11 bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}
