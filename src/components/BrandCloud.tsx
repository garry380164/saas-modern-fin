"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface Brand {
  name: string;
  logo: React.ReactNode;
}

export default function BrandCloud() {
  const brands: Brand[] = [
    {
      name: "Aether",
      logo: (
        <div className="flex items-center gap-3 text-slate-400 hover:text-[#0f172a] transition-all duration-300">
          <svg className="w-6.5 h-6.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="12" cy="12" r="5" fill="currentColor" className="opacity-80" />
          </svg>
          <span className="font-sans font-black tracking-[0.2em] text-base md:text-lg uppercase">Aether</span>
        </div>
      ),
    },
    {
      name: "Kora",
      logo: (
        <div className="flex items-center gap-2.5 text-slate-400 hover:text-[#0f172a] transition-all duration-300">
          <svg className="w-6.5 h-6.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V21M12 12L19 5M12 12L19 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="5" cy="12" r="2" fill="currentColor" />
          </svg>
          <span className="font-mono font-extrabold tracking-wider text-lg md:text-xl uppercase">Kora</span>
        </div>
      ),
    },
    {
      name: "Vertex",
      logo: (
        <div className="flex items-center gap-3 text-slate-400 hover:text-[#0f172a] transition-all duration-300">
          <svg className="w-6.5 h-6.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L21 19H3L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 3V19" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
          <span className="font-sans font-black tracking-widest text-base md:text-lg uppercase">Vertex</span>
        </div>
      ),
    },
    {
      name: "Velo",
      logo: (
        <div className="flex items-center gap-2 text-slate-400 hover:text-[#0f172a] transition-all duration-300">
          <svg className="w-7 h-5.5 shrink-0" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L11 17L15 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3L19 17L23 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-50" />
          </svg>
          <span className="font-sans font-black italic tracking-wide text-lg md:text-xl">velo</span>
        </div>
      ),
    },
    {
      name: "Helix",
      logo: (
        <div className="flex items-center gap-3 text-slate-400 hover:text-[#0f172a] transition-all duration-300">
          <svg className="w-6.5 h-6.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 12C4.5 12 7.5 6 12 6C16.5 6 19.5 12 19.5 12C19.5 12 16.5 18 12 18C7.5 18 4.5 12 4.5 12Z" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          <span className="font-mono font-bold tracking-[0.22em] text-base md:text-lg uppercase">Helix</span>
        </div>
      ),
    },
    {
      name: "Spectra",
      logo: (
        <div className="flex items-center gap-3 text-slate-400 hover:text-[#0f172a] transition-all duration-300">
          <svg className="w-6.5 h-6.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="4" height="16" rx="1" fill="currentColor" className="opacity-40" />
            <rect x="10" y="7" width="4" height="13" rx="1" fill="currentColor" className="opacity-70" />
            <rect x="17" y="3" width="4" height="17" rx="1" fill="currentColor" />
          </svg>
          <span className="font-sans font-bold tracking-wider text-base md:text-lg lowercase">spectra</span>
        </div>
      ),
    },
    {
      name: "Zenith",
      logo: (
        <div className="flex items-center gap-3 text-slate-400 hover:text-[#0f172a] transition-all duration-300">
          <svg className="w-6.5 h-6.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 12H7V22H17V12H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          <span className="font-sans font-extrabold tracking-[0.25em] text-base md:text-lg uppercase">Zenith</span>
        </div>
      ),
    },
    {
      name: "Nova",
      logo: (
        <div className="flex items-center gap-3 text-slate-400 hover:text-[#0f172a] transition-all duration-300">
          <svg className="w-6.5 h-6.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
          </svg>
          <span className="font-mono font-black tracking-widest text-base md:text-lg uppercase">Nova</span>
        </div>
      ),
    },
  ];

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 bg-white border-y border-black/[0.03] overflow-hidden relative">
      {/* Decorative tech grid pattern background */}
      <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center gap-10 md:gap-14">
        
        {/* Title / Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <p className="text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.2em] text-slate-400 leading-relaxed">
            每月為指標性金融科技與財星 500 強企業解析數十億筆交易數據
          </p>
        </motion.div>

        {/* Logos Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-12 gap-y-12 items-center justify-items-center select-none"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.name}
              variants={itemVariants}
              className="flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              {brand.logo}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
