"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "./ui/Button";
import Card from "./ui/Card";
import HeroBackground from "./HeroBackground";

export default function Hero({ onSubscribe }: { onSubscribe: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll properties using Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.75]);
  const canvasY = useTransform(scrollYProgress, [0, 0.8], [0, 50]);

  return (
    <div
      ref={containerRef}
      className="relative z-0 w-full min-h-screen flex items-center justify-center overflow-hidden py-28 md:py-36 bg-[#f2f6f0] text-[#0f172a]"
    >
      {/* Left Ruler */}
      <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-black/[0.05] pointer-events-none select-none hidden md:block text-black/[0.08]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ruler-ticks-left" width="32" height="40" patternUnits="userSpaceOnUse">
              <line x1="32" y1="0" x2="16" y2="0" stroke="currentColor" strokeWidth="1.5" />
              <line x1="32" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="1" />
              <line x1="32" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.2" />
              <line x1="32" y1="30" x2="24" y2="30" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ruler-ticks-left)" />
        </svg>
      </div>

      {/* Right Ruler */}
      <div className="absolute right-0 top-0 bottom-0 w-8 border-l border-black/[0.05] pointer-events-none select-none hidden md:block text-black/[0.08]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ruler-ticks-right" width="32" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="16" y2="0" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="10" x2="8" y2="10" stroke="currentColor" strokeWidth="1" />
              <line x1="0" y1="20" x2="12" y2="20" stroke="currentColor" strokeWidth="1.2" />
              <line x1="0" y1="30" x2="8" y2="30" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ruler-ticks-right)" />
        </svg>
      </div>

      {/* Absolute Tech Grid Background */}
      <div className="absolute inset-0 tech-grid -z-20 opacity-15" />
      <div className="absolute inset-0 tech-grid-dense -z-20 opacity-10" />

      {/* Radiant glow mesh behind the content in light mode */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-emerald/[0.04] blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-accent-blue/[0.02] blur-[110px] -z-10 pointer-events-none" />

      {/* 3D Screen-Filling Background Component */}
      <HeroBackground />

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center relative z-10 text-center gap-6">
        
        {/* 1. Heading (Centered at the top) */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="flex flex-col items-center gap-4 max-w-5xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7.5xl font-extrabold tracking-tight leading-[1.12] text-slate-900">
            面向現代金融的數據與 <br /> 人工智慧平台
          </h1>
        </motion.div>

        {/* 2. Animation Arena (Centralized Floating Cards Layout) */}
        <motion.div
          style={{ scale: canvasScale, y: canvasY }}
          className="relative w-full max-w-5xl h-[280px] md:h-[380px] flex items-center justify-center my-4 overflow-visible"
        >
          {/* Invisible center spacing anchor */}
          <div className="w-[100px] h-[100px] flex items-center justify-center relative z-10" />

          {/* 2D Floating Cards overlapping the screen-filling network background */}
          {/* Card 1: Left-Top Floating TRANSACTION ID */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[4%] top-[12%] md:left-[8%] lg:left-[12%] xl:left-[18%] md:top-[16%] scale-90 md:scale-100 z-20"
          >
            <Card outerClassName="max-w-[220px] !p-4 border-slate-200 bg-white" tickColor="border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-accent-cyan font-mono block mb-1 font-bold">
                ▸ TRANSACTION ID
              </span>
              <span className="text-xs font-mono text-slate-800 block select-all font-semibold">
                38012128618
              </span>
            </Card>
          </motion.div>

          {/* Card 2: Left-Bottom Floating LOCATION */}
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute left-[1%] bottom-[8%] md:left-[4%] lg:left-[8%] xl:left-[12%] md:bottom-[12%] scale-90 md:scale-100 z-20"
          >
            <Card outerClassName="max-w-[240px] !p-4 border-slate-200 bg-white" tickColor="border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-accent-cyan font-mono block mb-1.5 font-bold">
                ▸ LOCATION
              </span>
              <span className="text-xs font-mono text-slate-700 block leading-normal font-semibold">
                1164 BROADWAY,<br />
                NEW YORK, NY 10001,<br />
                UNITED STATES
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">
                (32.6416, -96.8396)
              </span>
            </Card>
          </motion.div>

          {/* Card 3: Right-Middle Floating Transaction Record */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute right-[4%] top-[30%] md:right-[8%] lg:right-[12%] xl:right-[18%] md:top-[34%] scale-90 md:scale-100 z-20"
          >
            <Card outerClassName="max-w-[280px] !p-4 border-slate-200 bg-white shadow-md" tickColor="border-slate-800">
              <div className="flex items-center gap-3">
                {/* Starbucks Logo (Green circle with white star) */}
                <div className="w-8 h-8 rounded-full bg-[#00704a] flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-white text-xs font-serif font-bold">★</span>
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Starbucks</h4>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">2026-09-27 09:23:16</p>
                </div>
                <div className="ml-auto text-xs font-extrabold text-slate-900 font-mono">
                  -$14.00
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* 3. Description & CTA Button (Centered at the bottom) */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="flex flex-col items-center gap-8 max-w-2xl mt-4"
        >
          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
            Finai 將雜亂的交易資料轉化為結構化的、經過驗證的記錄——借助 AI 代理，您可以在任何重要的地方使用它。
          </p>

          <div className="flex justify-center w-full">
            <Button
              variant="primary"
              className="px-8 py-3.5 bg-[#122315] hover:bg-[#1c3620] text-white font-bold rounded-lg border-none shadow-[0_6px_20px_rgba(18,35,21,0.15)] transition-all duration-300 scale-105"
              onClick={onSubscribe}
            >
              聯繫銷售
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
