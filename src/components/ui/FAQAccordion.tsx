"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {items.map((item, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden"
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 outline-none group cursor-pointer"
            >
              <span className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.q}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`p-1.5 rounded-full ${
                  isExpanded 
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
                    : "bg-slate-50 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                <Plus className="w-4 h-4" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                >
                  <div className="px-8 pb-7 text-slate-500 dark:text-zinc-400 leading-relaxed text-sm font-medium border-t border-slate-50 dark:border-zinc-800/50 pt-4">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
