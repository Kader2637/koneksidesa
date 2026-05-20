"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number; // in seconds
}

export default function Counter({ value, prefix = "", suffix = "", decimals = 0, duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Cubic ease-out calculation for elastic count feel
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + easeOutCubic * (value - startValue);
      
      setCount(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        setCount(value); // Safeguard exact target value
      }
    };

    window.requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-heading font-black tracking-tight">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}
