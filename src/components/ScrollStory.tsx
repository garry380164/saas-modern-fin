"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollProgress } from "../hooks/useScrollProgress";
import Card from "./ui/Card";
import CubeCore from "./CubeCore";

export default function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // 當整個區塊滾動進入瀏覽器視窗一半時，才開始計算並觸發 Stage 1 動畫
        const start = (window.innerHeight / 2) - rect.top;
        const totalStickyScroll = rect.height - (window.innerHeight / 2);
        if (totalStickyScroll > 0) {
          const raw = start / totalStickyScroll;
          setProgress(Math.max(0, Math.min(1, raw)));
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);


  // Divide the main progress (0 to 1) into three stages
  // Stage 1: 0.00 to 0.25 (Flying messy cards)
  // Stage 2: 0.25 to 0.75 (AI Agent clean-up & formatting - 50% length for visual flow)
  // Stage 3: 0.75 to 1.00 (Structured final assembly)
  const s1Prog = Math.max(0, Math.min(1, progress / 0.25));
  const s2Prog = Math.max(0, Math.min(1, (progress - 0.25) / 0.50));
  const s3Prog = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  let stage = 1;
  let bgClass = "bg-[#0c1a0e] text-[#f4f6ef]";
  let gridColor = "rgba(244, 246, 239, 0.04)";

  if (progress >= 0.25 && progress < 0.75) {
    stage = 2;
    bgClass = "bg-[#eef2f6] text-[#0f172a]";
    gridColor = "rgba(15, 23, 42, 0.04)";
  } else if (progress >= 0.75) {
    stage = 3;
    bgClass = "bg-[#f4f6ef] text-[#122315]";
    gridColor = "rgba(18, 35, 21, 0.08)";
  }

  // Raw JSON mockup for Stage 2
  const rawJSON = `{
  "id": "tx_38012128",
  "raw": "APL*STORE_TRIBECA_NY -78.36",
  "merchant": "Apple Store",
  "category": "Technology",
  "location": {
    "lat": 40.7183,
    "lng": -74.0081,
    "city": "New York"
  },
  "latency_ms": 50
}`;

  // 8 files representing messy data documents to be connected and cleared in Stage 2
  // X and Y are target coordinates. X range: -310 ~ 310, Y range: -200 ~ 280 (adjusted to avoid text area)
  const stage2Files = [
    { id: 1, name: "invoice_US_9981.pdf", type: "clean", x: -300, y: -140, rot: -10, label: "已關聯發票" },
    { id: 2, name: "receipt_starbucks_dup.json", type: "duplicate", x: 300, y: -120, rot: 8, label: "重複收據" },
    { id: 3, name: "crm_customer_log.csv", type: "clean", x: -310, y: 160, rot: -12, label: "客戶日誌" },
    { id: 4, name: "payment_gateway_twd.xml", type: "clean", x: 310, y: 180, rot: 14, label: "金流協議" },
    { id: 5, name: "invoice_US_9981_copy.pdf", type: "duplicate", x: -150, y: -200, rot: -6, label: "重複發票" },
    { id: 6, name: "receipt_uber_NaN.log", type: "clean", x: -100, y: 280, rot: 8, label: "異常乘車日誌" },
    { id: 7, name: "api_payload_export.json", type: "clean", x: 220, y: -60, rot: -15, label: "接口數據" },
    { id: 8, name: "metadata_schema.yaml", type: "clean", x: 120, y: 270, rot: 10, label: "元數據結構" },
  ];

  // The Y-offset for AI Agent Core (placed below text center, adaptive on mobile)
  const centerYOffset = isMobile ? 190 : 170;

  // Helper to compute card layout states driven by s2Prog
  const getS2CardState = (idx: number) => {
    const config = stage2Files[idx];
    
    // 1. Calculate flight progress (s2Prog from 0.20 to 0.45)
    let t_flight = 0;
    if (s2Prog >= 0.20) {
      t_flight = Math.min(1, (s2Prog - 0.20) / 0.25);
    }
    const easedT = easeOutBack(t_flight);
    
    const x = config.x * easedT;
    // Starts at centerYOffset (from the AI Core), flies outwards to target Y
    const y = centerYOffset + (config.y - centerYOffset) * easedT;
    const rotate = config.rot * easedT;
    const scale = 0.2 + 0.8 * easedT;
    
    // Flight opacity: fade in fast as it flies out
    let opacity = Math.min(1, t_flight * 2);
    
    // 2. Duplicate clean up logic (s2Prog from 0.70 to 0.85)
    let isRemoving = false;
    let removeProg = 0;
    let shakeX = 0;
    let shakeY = 0;
    let shakeRot = 0;
    if (config.type === "duplicate") {
      if (s2Prog >= 0.70) {
        removeProg = Math.min(1, (s2Prog - 0.70) / 0.15);
        isRemoving = true;
        opacity = Math.max(0, 1 - removeProg);
        
        // High-tech digital glitch vibration (sharp horizontal offsets and jagged rotation)
        const glitchIntensity = Math.sin(removeProg * Math.PI); // strongest in the middle
        shakeX = (Math.sin(removeProg * Math.PI * 40) >= 0 ? 1 : -1) * 16 * glitchIntensity;
        shakeY = (Math.cos(removeProg * Math.PI * 55) >= 0.75 ? 1 : -0.2) * 8 * glitchIntensity;
        shakeRot = Math.sin(removeProg * Math.PI * 45) * 8 * glitchIntensity;
      }
    }
    
    // 3. Overall fade out at the end of stage 2 (s2Prog from 0.85 to 1.00)
    if (s2Prog >= 0.85) {
      const fadeOutProg = Math.min(1, (s2Prog - 0.85) / 0.15);
      opacity = Math.max(0, opacity * (1 - fadeOutProg));
    }
    
    return {
      x: x + shakeX,
      y: y + shakeY,
      rotate: rotate + shakeRot,
      scale: config.type === "duplicate" && isRemoving ? scale * (1 - removeProg) : scale,
      opacity,
      isRemoving,
      removeProg
    };
  };

  // Ease-out Back (spring overshoot) function for bouncy scroll-driven entry
  const easeOutBack = (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };

  // 9 cards representing different messy data scenarios and metrics
  // 9 cards representing different messy data scenarios and metrics
  const stage1Cards = [
    {
      cardType: "pill",
      title: "▸ 未識別的商戶",
      rawText: "ST*RBUX 1024_NY",
      metricLabel: "錯誤率",
      startVal: 0,
      endVal: 87,
      unit: "%",
      errorMsg: "錯誤: 晦澀模糊",
      tickColor: "border-transparent",
      borderColor: "border-slate-500/30",
      outerClass: "w-[260px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] shadow-lg pointer-events-none rounded-lg",
      iconBg: "bg-yellow-500/20 text-yellow-400 font-sans",
      startX: -450, startY: -280, startRot: -45, startScale: 0.4,
      endX: -160, endY: -110, endRot: -12, endScale: 1.0,
      activeStart: 0.20, duration: 0.35,
      fadeOutStart: 0.80, fadeOutEnd: 0.90
    },
    {
      cardType: "wireframe",
      title: "▸ 損壞的地理數據",
      rawText: "APL*STORE_CUP_NaN",
      metricLabel: "遺失屬性",
      startVal: 0,
      endVal: 42,
      unit: " 個",
      errorMsg: "錯誤: 缺乏位置",
      tickColor: "border-slate-300/40",
      borderColor: "border-transparent",
      outerClass: "w-[220px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] shadow-md pointer-events-none",
      startX: 400, startY: 350, startRot: 35, startScale: 0.3,
      endX: 200, endY: 130, endRot: 8, endScale: 0.95,
      activeStart: 0.23, duration: 0.35,
      fadeOutStart: 0.81, fadeOutEnd: 0.91
    },
    {
      cardType: "wireframe",
      title: "▸ 異質貨幣日誌",
      rawText: "TX_CURR: TWD/USD/EUR/JPY",
      metricLabel: "未對齊幣別",
      startVal: 1,
      endVal: 7,
      unit: " 種",
      errorMsg: "錯誤: 匯率解析失敗",
      tickColor: "border-slate-300/40",
      borderColor: "border-transparent",
      outerClass: "w-[240px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] shadow-md pointer-events-none",
      startX: -430, startY: 300, startRot: -30, startScale: 0.4,
      endX: -190, endY: 100, endRot: -6, endScale: 0.9,
      activeStart: 0.26, duration: 0.35,
      fadeOutStart: 0.82, fadeOutEnd: 0.92
    },
    {
      cardType: "wireframe",
      title: "▸ 結構缺失",
      rawText: "<xml><amount>94.2</amount></xml>",
      metricLabel: "格式混亂度",
      startVal: 0,
      endVal: 94,
      unit: " 點",
      errorMsg: "錯誤: XML/JSON 混合",
      tickColor: "border-slate-300/40",
      borderColor: "border-transparent",
      outerClass: "w-[230px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] opacity-95 shadow-md pointer-events-none",
      startX: 430, startY: -300, startRot: 25, startScale: 0.3,
      endX: 190, endY: -130, endRot: 14, endScale: 0.85,
      activeStart: 0.29, duration: 0.35,
      fadeOutStart: 0.83, fadeOutEnd: 0.93
    },
    {
      cardType: "pill",
      title: "▸ 交易 ID 衝突",
      rawText: "DUP_ID: tx_998124x2",
      metricLabel: "重複事件",
      startVal: 0,
      endVal: 128,
      unit: " 次",
      errorMsg: "錯誤: 雙重扣款",
      tickColor: "border-transparent",
      borderColor: "border-slate-500/30",
      outerClass: "w-[250px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] shadow-lg pointer-events-none rounded-lg",
      iconBg: "bg-orange-500/20 text-orange-400 font-sans",
      startX: 20, startY: -400, startRot: 15, startScale: 0.3,
      endX: 20, endY: -160, endRot: 2, endScale: 0.95,
      activeStart: 0.32, duration: 0.35,
      fadeOutStart: 0.84, fadeOutEnd: 0.94
    },
    {
      cardType: "wireframe",
      title: "▸ 系統時間偏移",
      rawText: "TIMESTAMP_ERR_TZ",
      metricLabel: "時間差",
      startVal: 0,
      endVal: 3600,
      unit: "s",
      errorMsg: "錯誤: 時區未對齊",
      tickColor: "border-slate-300/40",
      borderColor: "border-transparent",
      outerClass: "w-[220px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] shadow-md pointer-events-none",
      startX: -350, startY: -120, startRot: -20, startScale: 0.4,
      endX: -200, endY: -20, endRot: -8, endScale: 0.85,
      activeStart: 0.35, duration: 0.35,
      fadeOutStart: 0.85, fadeOutEnd: 0.95
    },
    {
      cardType: "wireframe",
      title: "▸ 終端格式不相容",
      rawText: "POS_LOG_V2.1_REJECT",
      metricLabel: "缺漏欄位",
      startVal: 0,
      endVal: 18,
      unit: " 個",
      errorMsg: "錯誤: 欄位解析失敗",
      tickColor: "border-slate-300/40",
      borderColor: "border-transparent",
      outerClass: "w-[230px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] shadow-md pointer-events-none",
      startX: 370, startY: -80, startRot: 18, startScale: 0.3,
      endX: 210, endY: 10, endRot: 6, endScale: 0.9,
      activeStart: 0.38, duration: 0.35,
      fadeOutStart: 0.86, fadeOutEnd: 0.96
    },
    {
      cardType: "pill",
      title: "▸ 未知管道代碼",
      rawText: "CH_ERR_99128_STRIPE",
      metricLabel: "異常日誌",
      startVal: 0,
      endVal: 1450,
      unit: " 筆",
      errorMsg: "錯誤: 管道未定義",
      tickColor: "border-transparent",
      borderColor: "border-slate-500/30",
      outerClass: "w-[250px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] shadow-lg pointer-events-none rounded-lg",
      iconBg: "bg-emerald-500/20 text-emerald-300 font-sans",
      startX: -390, startY: 220, startRot: -15, startScale: 0.3,
      endX: -100, endY: 180, endRot: -4, endScale: 0.9,
      activeStart: 0.41, duration: 0.35,
      fadeOutStart: 0.87, fadeOutEnd: 0.97
    },
    {
      cardType: "pill",
      title: "▸ 敏感資料洩漏",
      rawText: "CARD: 4532_****_****_8812",
      metricLabel: "暴露欄位",
      startVal: 0,
      endVal: 16,
      unit: " 個",
      errorMsg: "安全錯誤: PII 明文",
      tickColor: "border-transparent",
      borderColor: "border-slate-500/30",
      outerClass: "w-[260px] !p-2.5 !bg-[#0c1a0e]/40 backdrop-blur-[2px] shadow-lg pointer-events-none rounded-lg",
      iconBg: "bg-rose-500/20 text-rose-300 font-sans",
      startX: 350, startY: 220, startRot: 20, startScale: 0.3,
      endX: 90, endY: 100, endRot: 10, endScale: 1.0,
      activeStart: 0.44, duration: 0.35,
      fadeOutStart: 0.88, fadeOutEnd: 0.98
    }
  ];

  // Helper to compute card layout states driven by s1Prog
  const getS1CardState = (index: number) => {
    const config = stage1Cards[index];
    
    // 1. Calculate fade-in and spring entry progress (0 -> 1)
    let t = 0;
    if (s1Prog >= config.activeStart) {
      t = Math.min(1, (s1Prog - config.activeStart) / config.duration);
    }
    
    const easedT = easeOutBack(t);
    
    // Interpolate positions, rotations, and scales based on spring curve
    const x = config.startX + (config.endX - config.startX) * easedT;
    const y = config.startY + (config.endY - config.startY) * easedT;
    const rotate = config.startRot + (config.endRot - config.startRot) * easedT;
    const scale = config.startScale + (config.endScale - config.startScale) * easedT;
    
    // 2. Opacity calculation (fade in fast with bounce, fade out staggered)
    let opacity = 0;
    if (t > 0) {
      opacity = Math.min(1, t * 1.5); // Fast fade-in
    }
    
    if (s1Prog >= config.fadeOutStart) {
      const fadeOutProg = Math.min(1, (s1Prog - config.fadeOutStart) / (config.fadeOutEnd - config.fadeOutStart));
      opacity = 1 - fadeOutProg;
    }
    
    // 3. Interpolated metric count
    const currentVal = Math.floor(config.startVal + (config.endVal - config.startVal) * t);
    
    return {
      style: {
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
        opacity,
      },
      currentVal,
    };
  };
  
  // Calculate text styles for Stage 1 driven by scroll (0.0 -> 0.25 fade-in, 0.75 -> 1.0 fade-out)
  let s1TextOpacity = 1;
  let s1TextY = 0;
  let s1TextBlur = 0;

  if (s1Prog < 0.25) {
    const ratio = s1Prog / 0.25;
    s1TextOpacity = ratio;
    s1TextY = 30 * (1 - ratio);
    s1TextBlur = 8 * (1 - ratio);
  } else if (s1Prog > 0.75) {
    const ratio = Math.min(1, (s1Prog - 0.75) / 0.25);
    s1TextOpacity = 1 - ratio;
    s1TextY = -30 * ratio;
    s1TextBlur = 8 * ratio;
  }

  // Interpolated values for Stage 3 (Structured dashboard grid assembly)
  // Mapped from s3Prog (0 to 1) for sequential card appearance
  const s3Opacity = s3Prog;

  // Central text opacity: fully visible when second card appears (s3Prog = 0.20)
  const centerTextOpacity = Math.min(1, s3Prog / 0.20);

  // 1. Card 1 (cURL): 0.0 -> 0.12
  let c1Opacity = 0;
  let c1TranslateX = -50;
  if (s3Prog > 0) {
    const t = Math.min(1, s3Prog / 0.12);
    c1Opacity = t;
    c1TranslateX = -50 * (1 - t);
  }

  // Line 1 -> 2: 0.12 -> 0.20
  let line1Progress = 0;
  if (s3Prog >= 0.12) {
    line1Progress = Math.min(1, (s3Prog - 0.12) / 0.08);
  }

  // 2. Card 2 (API Key & Latency): 0.20 -> 0.32
  let c2Opacity = 0;
  let c2TranslateY = 30;
  if (s3Prog >= 0.20) {
    const t = Math.min(1, (s3Prog - 0.20) / 0.12);
    c2Opacity = t;
    c2TranslateY = 30 * (1 - t);
  }

  // Line 2 -> 3: 0.32 -> 0.40
  let line2Progress = 0;
  if (s3Prog >= 0.32) {
    line2Progress = Math.min(1, (s3Prog - 0.32) / 0.08);
  }

  // 3. Card 3 (Center Apple Store Map): 0.40 -> 0.55
  let c3Opacity = 0;
  let c3Scale = 0.8;
  let c3TranslateY = 250;
  if (s3Prog >= 0.40) {
    const t = Math.min(1, (s3Prog - 0.40) / 0.15);
    c3Opacity = t;
    c3Scale = 0.8 + 0.2 * t;
    c3TranslateY = 250 * (1 - t);
  }

  // 4. Card 4 (Merchant & Location): 0.55 -> 0.68
  let c4Opacity = 0;
  let c4TranslateX = 50;
  if (s3Prog >= 0.55) {
    const t = Math.min(1, (s3Prog - 0.55) / 0.13);
    c4Opacity = t;
    c4TranslateX = 50 * (1 - t);
  }

  // Line 3 -> 5: 0.68 -> 0.76
  let line3Progress = 0;
  if (s3Prog >= 0.76) {
    line3Progress = Math.min(1, (s3Prog - 0.68) / 0.08);
  }

  // 5. Card 5 (Data Category): 0.76 -> 0.88
  let c5Opacity = 0;
  let c5TranslateY = 30;
  if (s3Prog >= 0.76) {
    const t = Math.min(1, (s3Prog - 0.76) / 0.12);
    c5Opacity = t;
    c5TranslateY = 30 * (1 - t);
  }

  // --- Stage 3 Scroll-Driven Text Effects Helpers ---
  // Decoupled scramble progress to make compilation decode effect last longer
  let c4ScrambleProg = 0;
  if (s3Prog >= 0.55) {
    c4ScrambleProg = Math.min(1, (s3Prog - 0.55) / 0.25); // 0.55 -> 0.80
  }

  let c5ScrambleProg = 0;
  if (s3Prog >= 0.76) {
    c5ScrambleProg = Math.min(1, (s3Prog - 0.76) / 0.16); // 0.76 -> 0.92
  }

  // Card 1: cURL typing text
  const fullCurlText = `curl -X POST https://api.finai.com/v1 \\
    -H "Authorization: Bearer key_live..." \\
    -d amount=78.36 \\
    -d raw="APL*STORE TRIBECA"`;
  const currentCurlText = fullCurlText.slice(0, Math.floor(c1Opacity * fullCurlText.length));

  // Card 2: API key typing
  const fullApiKey = "AIzaSyDaOmMKs4J9xXZ-Hj9w7ISLm_3namB0ewQe";
  const currentApiKey = fullApiKey.slice(0, Math.floor(c2Opacity * fullApiKey.length));

  // Card 3: Counter from 0 to -78.36
  const currentAmountVal = -78.36 * c3Opacity;
  const currentAmountStr = `-$${Math.abs(currentAmountVal).toFixed(2)}`;

  // Card 4 & 5: Scramble reveal compilation effect
  const scrambleReveal = (text: string, t: number) => {
    if (t <= 0) return "";
    if (t >= 1) return text;
    const pool = "A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0XyZ_#*";
    return text
      .split("")
      .map((char, idx) => {
        if (char === " " || char === "\n" || char === "(" || char === ")" || char === "," || char === "-" || char === "." || char === "▸" || char === "[" || char === "]") {
          return char;
        }
        const revealPoint = idx / text.length;
        if (t >= revealPoint) {
          return char;
        } else if (t > Math.max(0, revealPoint - 0.25)) {
          return pool[Math.floor((t * 200 + idx * 7) % pool.length)];
        } else {
          return "";
        }
      })
      .join("");
  };

  // Interpolated values for Stage 2 permanent text
  let s2TextOpacity = 1;
  if (s2Prog < 0.15) {
    s2TextOpacity = s2Prog / 0.15;
  } else if (s2Prog >= 0.85) {
    s2TextOpacity = Math.max(0, 1 - (s2Prog - 0.85) / 0.15);
  }

  return (
    <div
      id="scroll-story-section"
      ref={sectionRef}
      className={`relative h-[1000vh] w-full transition-colors duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${bgClass}`}
    >
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 -z-10"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
        }}
      />

      {/* STICKY CONTAINER */}
      <div className="sticky top-0 left-0 w-full h-screen flex items-center overflow-hidden">
        {stage === 1 && (
          <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-center pt-24 lg:pt-0">
            {/* Left Side: Dynamic Text Story */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-4 lg:gap-6 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key="stage1"
                  style={{
                    opacity: s1TextOpacity,
                    transform: `translate3d(0, ${s1TextY}px, 0)`,
                    filter: `blur(${s1TextBlur}px)`,
                  }}
                  className="flex flex-col gap-2 lg:gap-4 text-[#f4f6ef]"
                >
                  {/* <span className="text-xs font-mono tracking-[0.2em] text-emerald-400 uppercase font-semibold">
                    階段 01 — 混亂異質數據
                  </span> */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    數據過於混亂且缺乏結構，
                    <span className="text-emerald-400 mt-1 block lg:inline">
                      多元異質資料無法直接整合與統計。
                    </span>
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
                    原始日誌格式各異、交易敘述晦澀、缺乏地理情境、甚至包含敏感欄位與重複數據。面對這種無序的「數據星雲」，進行任何有效的財務統計與決策都是工程噩夢。
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side: Dynamic Visual Sandbox */}
            <div className="lg:col-span-7 flex justify-center items-center h-[260px] sm:h-[350px] lg:h-[500px] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Background data stream noise */}
                <div
                  className="absolute inset-0 font-mono text-[8px] text-emerald-400/15 pointer-events-none select-none overflow-hidden leading-normal pr-12 transition-opacity duration-300"
                  style={{ opacity: s1Prog * 0.7 }}
                >
                  <div style={{ transform: `translate3d(0, ${-s1Prog * 80}px, 0)` }}>
                    {`[DATA STREAM SHIFT] >> TX_BLOC: 981248912_RAW\n`}
                    {`>> DESCR: NF*FLIX_MEMBERSHIP_GAT_9981 -15.99\n`}
                    {`>> AUTH_NODE: SECURE_PASS_VERIFY\n`}
                    {`[DATA STREAM SHIFT] >> TX_BLOC: 881289122_RAW\n`}
                    {`>> DESCR: UBER*TRIP_HELP_SAN_FRANCISCO -24.50\n`}
                    {`>> LOC_X: NULL | LOC_Y: NULL\n`}
                    {`[DATA STREAM SHIFT] >> TX_BLOC: 128491294_RAW\n`}
                    {`>> DESCR: AMZN*MKTP_US_SEATTLE_WA -119.00\n`}
                    {`>> ERROR_CODE: DESCRIPTOR_OVERFLOW_SHR\n`}
                    {`[DATA STREAM SHIFT] >> TX_BLOC: 489218204_RAW\n`}
                    {`>> DESCR: STM*GAME_VALVE_BEL_WA -59.99\n`}
                  </div>
                </div>

                <div className="relative w-full max-w-[580px] h-[450px] flex items-center justify-center scale-[0.72] sm:scale-[0.85] lg:scale-100 origin-center">
                  {stage1Cards.map((card, idx) => {
                    const cardState = getS1CardState(idx);
                    if (cardState.style.opacity === 0) return null;
                    
                    return (
                      <div
                        key={idx}
                        className="absolute transition-transform duration-75 ease-out will-change-transform"
                        style={cardState.style}
                      >
                        <Card 
                          outerClassName={card.outerClass} 
                          tickColor={card.tickColor}
                          borderColor={card.borderColor}
                        >
                          {card.cardType === "pill" ? (
                            <div className="flex items-center w-full font-sans">
                              {/* Left icon container */}
                              <div className={`w-8 h-8 rounded flex items-center justify-center mr-2.5 shrink-0 ${card.iconBg || "bg-emerald-500/20 text-emerald-400"}`}>
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                              </div>
                              {/* Middle description fields */}
                              <div className="flex flex-col text-left truncate">
                                <span className="text-[12px] font-bold text-slate-100 truncate block">
                                  {card.rawText}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono font-medium block">
                                  {card.title.replace("▸ ", "")}
                                </span>
                              </div>
                              {/* Right dynamic numerical metric */}
                              <div className="ml-auto text-right text-[11px] font-mono font-bold text-slate-200 shrink-0">
                                {card.metricLabel === "錯誤率" || card.metricLabel === "重複事件" ? (
                                  <span className="text-red-400">-{cardState.currentVal}{card.unit}</span>
                                ) : (
                                  <span>{cardState.currentVal}{card.unit}</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 font-mono text-[11px] text-left">
                              <div className="flex items-center gap-1">
                                <span className="text-emerald-500 font-bold">▸</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                  {card.title.replace("▸ ", "")}
                                </span>
                              </div>
                              <span className="text-[12px] font-semibold text-slate-200 block truncate">
                                {card.rawText}
                              </span>
                              <div className="text-[9.5px] text-slate-500 mt-0.5">
                                {card.metricLabel}: <strong className="text-slate-300 font-mono">{cardState.currentVal}{card.unit}</strong>
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="relative w-full max-w-[1200px] mx-auto px-6 md:px-12 h-[600px] flex items-center justify-center">
            {/* Centered Text Story overlay */}
            <div 
              className="absolute top-24 md:top-auto z-35 text-center max-w-3xl px-6 flex flex-col gap-2 md:gap-4 pointer-events-none transition-all duration-300"
              style={{ 
                opacity: centerTextOpacity,
                transform: isMobile ? `translate3d(0, ${-80 * c3Opacity}px, 0)` : 'none'
              }}
            >
              <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-[#122315] drop-shadow-[0_2px_8px_rgba(255,255,255,0.85)]">
                Finai 即時豐富交易數據，
                <span className="text-emerald-600 block mt-1">
                  在每個層面添加結構、精確性與智能分析。
                </span>
              </h2>
            </div>

            {/* Absolute Visual Sandbox in the background */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              {/* Desktop Layout: Absolute coordinates mapped around the center */}
              <div
                className="relative hidden md:block w-full h-full transition-opacity duration-300"
                style={{ opacity: Math.min(1, s3Prog / 0.05) }}
              >
                {/* Connection Line 1: 1 -> 2 (Vertical on the left) */}
                {s3Prog >= 0.15 && (
                  <div
                    className="absolute left-[170px] top-[165px] w-[2px] h-[280px] bg-gradient-to-b from-transparent via-slate-600/80 to-transparent will-change-transform transition-transform duration-75"
                    style={{
                      transform: `scaleY(${line1Progress})`,
                      transformOrigin: "top",
                      opacity: s3Opacity,
                    }}
                  />
                )}

                {/* Connection Line 2: 2 -> 3 (Horizontal at bottom-left to center) */}
                {s3Prog >= 0.40 && (
                  <div
                    className="absolute left-[300px] top-[515px] w-[130px] h-[2px] bg-gradient-to-r from-transparent via-slate-600/80 to-transparent will-change-transform transition-transform duration-75"
                    style={{
                      transform: `scaleX(${line2Progress})`,
                      transformOrigin: "left",
                      opacity: s3Opacity,
                    }}
                  />
                )}

                {/* Connection Line 3: 3 -> 5 (Horizontal from center to bottom-right) */}
                {s3Prog >= 0.78 && (
                  <div
                    className="absolute left-[770px] top-[515px] w-[130px] h-[2px] bg-gradient-to-r from-transparent via-slate-600/80 to-transparent will-change-transform transition-transform duration-75"
                    style={{
                      transform: `scaleX(${line3Progress})`,
                      transformOrigin: "left",
                      opacity: s3Opacity,
                    }}
                  />
                )}

                {/* 1. cURL terminal window (top-left) - flies in from left */}
                <div
                  className="absolute top-0 left-0 transition-transform duration-100 ease-out will-change-transform"
                  style={{ transform: `translate3d(${c1TranslateX}px, 0, 0)`, opacity: c1Opacity }}
                >
                  <Card outerClassName="w-[340px] text-[10px] !p-4 font-mono border-slate-200 bg-white" tickColor="border-slate-800">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-slate-400 font-bold">
                      <span>cURL</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[8px]">API</span>
                    </div>
                    <pre className="text-slate-600 font-mono leading-relaxed whitespace-pre scale-[0.95] origin-top-left min-h-[70px]">
                      {currentCurlText}
                    </pre>
                  </Card>
                </div>

                 {/* 4. MERCHANT info window (top-right) - flies in from right (part of sequence 4) */}
                <div
                  className="absolute top-0 right-0 transition-transform duration-100 ease-out will-change-transform"
                  style={{ transform: `translate3d(${c4TranslateX}px, 0, 0)`, opacity: c4Opacity }}
                >
                  <Card outerClassName="w-[300px] !p-4 font-mono border-slate-200 bg-white" tickColor="border-slate-800">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">▸ 驗證商戶</span>
                    <span className="text-xs font-bold text-slate-800 block min-h-[16px]">
                      {scrambleReveal("蘋果公司 (APPLE)", c4ScrambleProg)}
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight min-h-[14px]">
                      {scrambleReveal("蘋果股份有限公司 (APPLE, INC.)", c4ScrambleProg)}
                    </span>
                  </Card>
                </div>

                {/* 4. LOCATION window (stacked below MERCHANT) - flies in from right (part of sequence 4) */}
                <div
                  className="absolute top-[90px] right-0 transition-transform duration-100 ease-out will-change-transform"
                  style={{ transform: `translate3d(${c4TranslateX}px, 0, 0)`, opacity: c4Opacity }}
                >
                  <Card outerClassName="w-[300px] !p-4 font-mono border-slate-200 bg-white" tickColor="border-slate-800">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">▸ 地理位置</span>
                    <span className="text-xs text-slate-700 block leading-normal min-h-[32px]">
                      {scrambleReveal("美國德州達拉斯波爾克南街 8770 號", c4ScrambleProg)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 min-h-[12px]">
                      {scrambleReveal("(32.6416, -96.8396)", c4ScrambleProg)}
                    </span>
                  </Card>
                </div>

                {/* 3. Center Main Apple Store Card with map - scales up & drifts from bottom */}
                <div
                  className="fixed bottom-4 z-20 transition-transform duration-100 ease-out will-change-transform"
                  style={{ transform: `translate3d(-50%, ${c3TranslateY}px, 0) scale(${c3Scale})`, left: "50%", opacity: c3Opacity }}
                >
                  <div className="flex flex-col gap-2 w-[340px] text-left">
                    {/* Top block: Receipt Header */}
                    <div className="bg-[#122315] text-white rounded-2xl p-5 shadow-[0_10px_25px_-5px_rgba(18,35,21,0.15)] flex flex-col justify-between h-[135px]">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#122315] text-lg font-bold">
                        
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold font-sans">Apple Store Tribeca</span>
                          <span className="text-[10px] text-white/50 font-mono mt-0.5">2025-09-27 09:23:16</span>
                        </div>
                        <span className="text-2xl font-extrabold font-mono tracking-tight">{currentAmountStr}</span>
                      </div>
                    </div>

                    {/* Middle block: Green map mock (Stylized Google Map layout) */}
                    <div className="h-[90px] rounded-2xl bg-[#f5f6f4] border border-black/5 relative overflow-hidden shadow-sm">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* Park Green Areas */}
                        <path d="M 0 10 Q 40 25 25 90 L 0 90 Z" fill="#e2f0d9" />
                        <rect x="185" y="15" width="45" height="25" rx="3" fill="#e2f0d9" />
                        
                        {/* River / Creek (Light blue line) */}
                        <path d="M 290 0 C 275 30 280 60 305 90" fill="none" stroke="#d4e6f1" strokeWidth="3" />

                        {/* Dense Secondary Streets (Light Grey Grid) */}
                        <path d="M 40 -10 L 40 100 M 80 -10 L 80 100 M 120 -10 L 120 100 M 260 -10 L 260 100 M 300 -10 L 300 100" stroke="#e0e4df" strokeWidth="1" />
                        <path d="M -10 25 L 350 25 M -10 50 L 350 50 M -10 75 L 350 75" stroke="#e0e4df" strokeWidth="1" />
                        
                        {/* Diagonal Streets ("敦化路一段" block lines) */}
                        <path d="M 100 -10 L 200 100 M 130 -10 L 230 100 M 160 -10 L 260 100 M 190 -10 L 290 100" stroke="#e0e4df" strokeWidth="1" />
                        <path d="M 120 0 L 20 80 M 180 0 L 60 90 M 240 0 L 120 90 M 300 0 L 180 90" stroke="#e0e4df" strokeWidth="0.8" />
                        
                        {/* Major Gray Road */}
                        <path d="M 0 45 L 340 45" stroke="#d5dad3" strokeWidth="3" />

                        {/* Thick Blue Highway */}
                        <path d="M 130 0 L 210 90" stroke="#547192" strokeWidth="7" strokeLinecap="round" />
                        <path d="M 130 0 L 210 90" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Highway Shield Icon (Blue shield with "1Z") */}
                        <g transform="translate(142, 22)">
                          <path d="M 0 0 C 4 -2 12 -2 16 0 C 16 6 12 12 8 15 C 4 12 0 6 0 0 Z" fill="#3a75c4" stroke="#ffffff" strokeWidth="0.8" />
                          <text x="8" y="9" fill="#ffffff" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle" className="font-bold select-none scale-[0.95]">1Z</text>
                        </g>

                        {/* Tiny Text Labels */}
                        <text x="12" y="52" fill="#6f9f74" fontSize="9" fontFamily="sans-serif" className="font-bold select-none">公園</text>
                        <text x="175" y="70" fill="#4d5349" fontSize="10" fontFamily="sans-serif" className="font-bold select-none">陳平</text>
                        
                        {/* Rotated road names */}
                        <g transform="translate(195, 25) rotate(48)">
                          <text x="0" y="0" fill="#888f83" fontSize="7" fontFamily="sans-serif" className="font-medium select-none">敦化路一段</text>
                        </g>
                        <g transform="translate(205, 52) rotate(48)">
                          <text x="0" y="0" fill="#888f83" fontSize="7" fontFamily="sans-serif" className="font-medium select-none">陳平路</text>
                        </g>
                      </svg>
                      
                      {/* Map Pin Icon (Black triangle pointing down) */}
                      <div className="absolute top-[50%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <span className="text-[14px] text-[#122315] select-none font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">▼</span>
                      </div>
                    </div>

                    {/* Bottom block: Transaction details */}
                    <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3 font-sans text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Transaction date</span>
                        <span className="text-slate-800 font-medium">September 27, 2025</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Method</span>
                        <span className="text-slate-800 font-medium">Apple Pay</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. API KEY card (bottom-left) - rises from bottom */}
                <div
                  className="absolute bottom-[80px] left-0 transition-transform duration-100 ease-out will-change-transform"
                  style={{ transform: `translate3d(0, ${c2TranslateY}px, 0)`, opacity: c2Opacity }}
                >
                  <Card outerClassName="w-[300px] !p-4 font-mono border-slate-200 bg-white" tickColor="border-slate-800">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-2">[API 金鑰]</span>
                    <span className="text-xs text-emerald-800 bg-[#f4f6ef] border border-black/[0.03] px-1.5 py-0.5 rounded block truncate font-mono font-semibold min-h-[24px]">
                      {currentApiKey}
                    </span>
                  </Card>
                </div>

                {/* 2. LATENCY card (bottom-left) - rises from bottom */}
                <div
                  className="absolute bottom-0 left-0 transition-transform duration-100 ease-out will-change-transform"
                  style={{ transform: `translate3d(0, ${c2TranslateY}px, 0)`, opacity: c2Opacity }}
                >
                  <Card outerClassName="w-[300px] !p-4 font-mono border-slate-200 bg-white" tickColor="border-slate-800">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mb-1">
                      <span>延遲時間</span>
                      <span className="text-emerald-600 font-bold">50MS</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <span className={`w-1.5 h-3 rounded-sm ${s3Prog > 0.15 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      <span className={`w-1.5 h-3 rounded-sm ${s3Prog > 0.30 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      <span className={`w-1.5 h-3 rounded-sm ${s3Prog > 0.45 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      <span className={`w-1.5 h-3 rounded-sm ${s3Prog > 0.60 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      <span className={`w-1.5 h-3 rounded-sm ${s3Prog > 0.75 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      <span className="w-1.5 h-3 rounded-sm bg-slate-200" />
                      <span className="w-1.5 h-3 rounded-sm bg-slate-200" />
                      <span className="w-1.5 h-3 rounded-sm bg-slate-200" />
                    </div>
                  </Card>
                </div>

                {/* 5. CATEGORY card (bottom-right) - rises from bottom */}
                <div
                  className="absolute bottom-0 right-0 transition-transform duration-100 ease-out will-change-transform"
                  style={{ transform: `translate3d(0, ${c5TranslateY}px, 0)`, opacity: c5Opacity }}
                >
                  <Card outerClassName="w-[300px] h-[115px] !p-4 font-mono border-slate-200 bg-white" tickColor="border-slate-800">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">▸ 數據分類</span>
                    <span className="text-xs font-extrabold text-slate-800 block min-h-[16px]">
                      {scrambleReveal("科技與技術", c5ScrambleProg)}
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed block mt-1 font-medium min-h-[32px]">
                      {scrambleReveal("軟體與服務", c5ScrambleProg)}
                      <br />
                      {scrambleReveal("消費性電子產品", c5ScrambleProg)}
                    </span>
                  </Card>
                </div>
              </div>

              {/* Mobile Layout: Stacked wireframe cards (positioned below the heading text, animating sequentially) */}
              <div 
                className="flex md:hidden flex-col gap-3 w-full px-6 max-h-[360px] overflow-y-auto absolute top-[190px] pb-6 transition-transform duration-75"
                style={{
                  transform: `translate3d(0, ${-90 * c3Opacity}px, 0)`
                }}
              >
                {/* 1. cURL Terminal Card */}
                {s3Prog > 0 && s3Prog < 0.55 && (
                  <motion.div
                    style={{ opacity: c1Opacity * (1 - c3Opacity), y: (1 - c1Opacity) * 12 }}
                    className="w-full shrink-0"
                  >
                    <Card outerClassName="!p-3 border-slate-200 bg-white" tickColor="border-slate-800">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-slate-400 font-bold text-[9px] font-mono">
                        <span>cURL</span>
                        <span className="px-1 py-0.5 rounded bg-slate-50 border border-slate-200 text-[8px]">API</span>
                      </div>
                      <pre className="text-slate-600 font-mono text-[9px] leading-normal whitespace-pre min-h-[48px] overflow-x-auto">
                        {currentCurlText}
                      </pre>
                    </Card>
                  </motion.div>
                )}

                {/* 2. API Key & Latency Card */}
                {s3Prog >= 0.20 && s3Prog < 0.55 && (
                  <motion.div
                    style={{ opacity: c2Opacity * (1 - c3Opacity), y: (1 - c2Opacity) * 12 }}
                    className="w-full shrink-0 flex flex-col gap-2"
                  >
                    <Card outerClassName="!p-3 border-slate-200 bg-white" tickColor="border-slate-800">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1 font-sans">[API 金鑰]</span>
                      <span className="text-[10.5px] text-emerald-800 bg-[#f4f6ef] border border-black/5 px-1.5 py-0.5 rounded block truncate font-mono">
                        {currentApiKey || "AIzaSy..."}
                      </span>
                    </Card>
                    <Card outerClassName="!p-2.5 border-slate-200 bg-white" tickColor="border-slate-800">
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold font-sans">
                        <span>延遲時間</span>
                        <span className="text-emerald-600 font-bold">50MS</span>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* 4. Location & Merchant Card */}
                {s3Prog >= 0.55 && s3Prog < 0.88 && (
                  <motion.div
                    style={{ opacity: c4Opacity * (1 - c5Opacity), y: (1 - c4Opacity) * 12 }}
                    className="w-full shrink-0 flex flex-col gap-2"
                  >
                    <Card outerClassName="!p-3 border-slate-200 bg-white" tickColor="border-slate-800">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5 font-sans">▸ 驗證商戶</span>
                      <span className="text-xs font-bold text-slate-800 block min-h-[14px]">
                        {scrambleReveal("蘋果公司 (APPLE)", c4ScrambleProg)}
                      </span>
                    </Card>
                    <Card outerClassName="!p-3 border-slate-200 bg-white" tickColor="border-slate-800">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5 font-sans">▸ 地理位置</span>
                      <span className="text-xs text-slate-700 block font-sans min-h-[14px] leading-tight">
                        {scrambleReveal("美國德州達拉斯波爾克南街 8770 號", c4ScrambleProg)}
                      </span>
                    </Card>
                  </motion.div>
                )}

                {/* 5. Data Category Card */}
                {s3Prog >= 0.76 && (
                  <motion.div
                    style={{ opacity: c5Opacity, y: (1 - c5Opacity) * 12 }}
                    className="w-full shrink-0"
                  >
                    <Card outerClassName="!p-3 border-slate-200 bg-white" tickColor="border-slate-800">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5 font-sans">▸ 數據分類</span>
                      <span className="text-xs font-extrabold text-slate-800 block min-h-[14px]">
                        {scrambleReveal("科技與技術", c5ScrambleProg)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1 min-h-[24px] leading-tight">
                        {scrambleReveal("軟體與服務", c5ScrambleProg)}
                        <br />
                        {scrambleReveal("消費性電子產品", c5ScrambleProg)}
                      </span>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* 3. Floating detailed receipt card for mobile - slides up from screen bottom */}
              {s3Prog >= 0.40 && (
                <div
                  className="fixed bottom-4 left-1/2 z-50 md:hidden w-[90%] max-w-[340px] transition-all duration-100 ease-out will-change-transform"
                  style={{
                    transform: `translate3d(-50%, ${(1 - c3Opacity) * 500}px, 0)`,
                    opacity: c3Opacity,
                  }}
                >
                  <div className="flex flex-col gap-2 w-full text-left">
                    {/* Top block: Receipt Header */}
                    <div className="bg-[#122315] text-white rounded-2xl p-5 shadow-[0_10px_25px_-5px_rgba(18,35,21,0.25)] flex flex-col justify-between h-[135px]">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#122315] text-lg font-bold">
                        
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold font-sans">Apple Store Tribeca</span>
                          <span className="text-[10px] text-white/50 font-mono mt-0.5">2025-09-27 09:23:16</span>
                        </div>
                        <span className="text-2xl font-extrabold font-mono tracking-tight">{currentAmountStr}</span>
                      </div>
                    </div>

                    {/* Middle block: Green map mock (Stylized Google Map layout) */}
                    <div className="h-[90px] rounded-2xl bg-[#f5f6f4] border border-black/5 relative overflow-hidden shadow-sm">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* Park Green Areas */}
                        <path d="M 0 10 Q 40 25 25 90 L 0 90 Z" fill="#e2f0d9" />
                        <rect x="185" y="15" width="45" height="25" rx="3" fill="#e2f0d9" />
                        
                        {/* River / Creek (Light blue line) */}
                        <path d="M 290 0 C 275 30 280 60 305 90" fill="none" stroke="#d4e6f1" strokeWidth="3" />

                        {/* Dense Secondary Streets (Light Grey Grid) */}
                        <path d="M 40 -10 L 40 100 M 80 -10 L 80 100 M 120 -10 L 120 100 M 260 -10 L 260 100 M 300 -10 L 300 100" stroke="#e0e4df" strokeWidth="1" />
                        <path d="M -10 25 L 350 25 M -10 50 L 350 50 M -10 75 L 350 75" stroke="#e0e4df" strokeWidth="1" />
                        
                        {/* Diagonal Streets ("敦化路一段" block lines) */}
                        <path d="M 100 -10 L 200 100 M 130 -10 L 230 100 M 160 -10 L 260 100 M 190 -10 L 290 100" stroke="#e0e4df" strokeWidth="1" />
                        <path d="M 120 0 L 20 80 M 180 0 L 60 90 M 240 0 L 120 90 M 300 0 L 180 90" stroke="#e0e4df" strokeWidth="0.8" />
                        
                        {/* Major Gray Road */}
                        <path d="M 0 45 L 340 45" stroke="#d5dad3" strokeWidth="3" />

                        {/* Thick Blue Highway */}
                        <path d="M 130 0 L 210 90" stroke="#547192" strokeWidth="7" strokeLinecap="round" />
                        <path d="M 130 0 L 210 90" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Highway Shield Icon (Blue shield with "1Z") */}
                        <g transform="translate(142, 22)">
                          <path d="M 0 0 C 4 -2 12 -2 16 0 C 16 6 12 12 8 15 C 4 12 0 6 0 0 Z" fill="#3a75c4" stroke="#ffffff" strokeWidth="0.8" />
                          <text x="8" y="9" fill="#ffffff" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle" className="font-bold select-none scale-[0.95]">1Z</text>
                        </g>

                        {/* Tiny Text Labels */}
                        <text x="12" y="52" fill="#6f9f74" fontSize="9" fontFamily="sans-serif" className="font-bold select-none">公園</text>
                        <text x="175" y="70" fill="#4d5349" fontSize="10" fontFamily="sans-serif" className="font-bold select-none">陳平</text>
                        
                        {/* Rotated road names */}
                        <g transform="translate(195, 25) rotate(48)">
                          <text x="0" y="0" fill="#888f83" fontSize="7" fontFamily="sans-serif" className="font-medium select-none">敦化路一段</text>
                        </g>
                        <g transform="translate(205, 52) rotate(48)">
                          <text x="0" y="0" fill="#888f83" fontSize="7" fontFamily="sans-serif" className="font-medium select-none">陳平路</text>
                        </g>
                      </svg>
                      
                      {/* Map Pin Icon (Black triangle pointing down) */}
                      <div className="absolute top-[50%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <span className="text-[14px] text-[#122315] select-none font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">▼</span>
                      </div>
                    </div>

                    {/* Bottom block: Transaction details */}
                    <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3 font-sans text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Transaction date</span>
                        <span className="text-slate-800 font-medium">September 27, 2025</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Method</span>
                        <span className="text-slate-800 font-medium">Apple Pay</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {stage === 2 && (
          /* ========================================================= */
          /* NEW STAGE 2 FILM: Fullscreen Center Layout               */
          /* ========================================================= */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">

            {/* Stage 2 Grid Background — expands from center as scroll progresses */}
            {(() => {
              // Grid expands during s2Prog 0.00 → 0.20, fades out at 0.92 → 1.00
              const gridExpand = Math.min(1, s2Prog / 0.20);
              const gridFade = s2Prog >= 0.92 ? Math.max(0, 1 - (s2Prog - 0.92) / 0.08) : 1;
              // Circle radius: 0% → 150% (needs to cover corners of the viewport)
              const clipRadius = gridExpand * 150;

              // Center coordinates for AI Agent Core (cube position)
              const centerXStr = "50%";
              const centerYStr = `calc(50% + ${centerYOffset}px)`;

              // Cyan color grid — appears after cube fully fades in (s2Prog 0.55), expands from cube position
              const cyanExpand = s2Prog >= 0.55 ? Math.min(1, (s2Prog - 0.55) / 0.30) : 0;
              const cyanRadius = cyanExpand * 160; // slightly larger to cover corners
              const cyanFade = s2Prog >= 0.92 ? Math.max(0, 1 - (s2Prog - 0.92) / 0.08) : 1;

              // Calculate ripple distort intensity: strongest at the expanding edge, fading as it fills the screen
              const rippleIntensity = cyanExpand > 0 && cyanExpand < 0.95 ? (1 - cyanExpand) * 18 : 0;

              // Revert gray grid — expands from cube position starting at s2Prog = 0.68, slower recovery (over 0.28 progress)
              const revertExpand = s2Prog >= 0.68 ? Math.min(1, (s2Prog - 0.68) / 0.28) : 0;
              const revertRadius = revertExpand * 160;
              const revertInnerRadius = Math.max(0, revertRadius - 6);
              const revertRippleIntensity = revertExpand > 0 && revertExpand < 0.95 ? (1 - revertExpand) * 15 : 0;

              return (
                <>
                  {/* Global SVG filter for ripple distortion */}
                  <svg className="absolute w-0 h-0 pointer-events-none">
                    <defs>
                      <filter id="ripple-filter" x="-20%" y="-20%" width="140%" height="140%">
                        {/* Generate fine turbulence wave distortion */}
                        <feTurbulence 
                          type="fractalNoise" 
                          baseFrequency="0.015" 
                          numOctaves="2" 
                          result="noise" 
                        />
                        {/* Create a moving ripple edge mask based on the expand progress */}
                        {/* We use a color matrix to sharpen the noise exactly around the expanding radius */}
                        <feColorMatrix
                          type="matrix"
                          values="1 0 0 0 0
                                  0 1 0 0 0
                                  0 0 1 0 0
                                  0 0 0 9 -3"
                          in="noise"
                          result="sharpNoise"
                        />
                        {/* Displace the grid pixels to create ripple waves */}
                        <feDisplacementMap 
                          in="SourceGraphic" 
                          in2="sharpNoise" 
                          scale={rippleIntensity} 
                          xChannelSelector="R" 
                          yChannelSelector="G" 
                        />
                      </filter>
                      {/* Separate filter for revert grid wavefront ripple with a slightly different frequency */}
                      <filter id="revert-ripple-filter" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence 
                          type="fractalNoise" 
                          baseFrequency="0.02" 
                          numOctaves="2" 
                          result="noise" 
                        />
                        <feColorMatrix
                          type="matrix"
                          values="1 0 0 0 0
                                  0 1 0 0 0
                                  0 0 1 0 0
                                  0 0 0 10 -4"
                          in="noise"
                          result="sharpNoise"
                        />
                        <feDisplacementMap 
                          in="SourceGraphic" 
                          in2="sharpNoise" 
                          scale={revertRippleIntensity} 
                          xChannelSelector="R" 
                          yChannelSelector="G" 
                        />
                      </filter>
                    </defs>
                  </svg>

                  {/* Base gray grid */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      opacity: gridFade * 0.6,
                      clipPath: `circle(${clipRadius}% at 50% 50%)`,
                      backgroundSize: "48px 48px",
                      backgroundImage: `
                        linear-gradient(to right, rgba(15, 23, 42, 0.06) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(15, 23, 42, 0.06) 1px, transparent 1px)
                      `,
                    }}
                  />

                  {/* Cyan grids */}
                  {cyanExpand > 0 && (() => {
                    // The boundary thickness of the distorted ripple wavefront (approx 40px in viewport space)
                    const innerRadius = Math.max(0, cyanRadius - 8); // outer edge border offset
                    
                    return (
                      <>
                        {/* A. Inner Clean Cyan Grid — Completely straight, no distortion */}
                        <div
                          className="absolute inset-0 z-[1] pointer-events-none"
                          style={{
                            opacity: cyanFade * 0.95,
                            // Covers up to the inner boundary of the wavefront ring
                            clipPath: `circle(${innerRadius}% at ${centerXStr} ${centerYStr})`,
                            backgroundSize: "48px 48px",
                            backgroundImage: `
                              linear-gradient(to right, rgba(6, 182, 212, 0.38) 1.5px, transparent 1.5px),
                              linear-gradient(to bottom, rgba(6, 182, 212, 0.38) 1.5px, transparent 1.5px)
                            `,
                            boxShadow: "inset 0 0 100px rgba(6, 182, 212, 0.04)",
                          }}
                        />

                        {/* B. Outer Wavefront Ripple Ring — Distorted grid limited strictly to the edge ring */}
                        {rippleIntensity > 0 && (
                          <div
                            className="absolute inset-0 z-[2] pointer-events-none"
                            style={{
                              opacity: cyanFade * 0.95,
                              // Outer clip boundary of the wavefront ring
                              clipPath: `circle(${cyanRadius}% at ${centerXStr} ${centerYStr})`,
                              // Mask out the inner part to create a hollow rings-like shape in viewport space
                              WebkitMaskImage: `radial-gradient(circle at ${centerXStr} ${centerYStr}, transparent ${innerRadius}vw, black ${innerRadius}vw)`,
                              maskImage: `radial-gradient(circle at ${centerXStr} ${centerYStr}, transparent ${innerRadius}vw, black ${innerRadius}vw)`,
                              backgroundSize: "48px 48px",
                              backgroundImage: `
                                linear-gradient(to right, rgba(6, 182, 212, 0.55) 2px, transparent 2px),
                                linear-gradient(to bottom, rgba(6, 182, 212, 0.55) 2px, transparent 2px)
                              `,
                              filter: "url(#ripple-filter)",
                            }}
                          />
                        )}
                      </>
                    );
                  })()}

                  {/* C1. Inner Clean Revert gray grid (wiping back to original color from AI core) */}
                  {revertExpand > 0 && (
                    <div
                      className="absolute inset-0 z-[3] pointer-events-none"
                      style={{
                        opacity: gridFade,
                        clipPath: `circle(${revertInnerRadius}% at ${centerXStr} ${centerYStr})`,
                        backgroundSize: "48px 48px",
                        backgroundImage: `
                          linear-gradient(to right, rgba(15, 23, 42, 0.06) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(15, 23, 42, 0.06) 1px, transparent 1px)
                        `,
                        backgroundColor: "#eef2f6",
                      }}
                    />
                  )}

                  {/* C2. Outer Revert Wavefront Ripple Ring — Distorted gray grid for color recovery wavefront */}
                  {revertRippleIntensity > 0 && (
                    <div
                      className="absolute inset-0 z-[4] pointer-events-none"
                      style={{
                        opacity: gridFade,
                        clipPath: `circle(${revertRadius}% at ${centerXStr} ${centerYStr})`,
                        WebkitMaskImage: `radial-gradient(circle at ${centerXStr} ${centerYStr}, transparent ${revertInnerRadius}vw, black ${revertInnerRadius}vw)`,
                        maskImage: `radial-gradient(circle at ${centerXStr} ${centerYStr}, transparent ${revertInnerRadius}vw, black ${revertInnerRadius}vw)`,
                        backgroundSize: "48px 48px",
                        backgroundImage: `
                          linear-gradient(to right, rgba(15, 23, 42, 0.15) 1.5px, transparent 1.5px),
                          linear-gradient(to bottom, rgba(15, 23, 42, 0.15) 1.5px, transparent 1.5px)
                        `,
                        backgroundColor: "#eef2f6",
                        filter: "url(#revert-ripple-filter)",
                      }}
                    />
                  )}

                  {/* C3. Glowing wavefront line circle for expanding color recovery */}
                  {revertExpand > 0 && revertExpand < 0.98 && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-[5]">
                      {/* Cyan outer glow ring */}
                      <circle
                        cx="50%"
                        cy={`calc(50% + ${centerYOffset}px)`}
                        r={`${revertRadius}%`}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="4"
                        style={{
                          filter: "blur(4px) drop-shadow(0 0 12px rgba(34, 211, 238, 0.95))",
                          opacity: Math.sin(revertExpand * Math.PI) * gridFade,
                        }}
                      />
                      {/* Emerald inner sharp ring */}
                      <circle
                        cx="50%"
                        cy={`calc(50% + ${centerYOffset}px)`}
                        r={`${revertRadius}%`}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="1.5"
                        style={{
                          filter: "blur(1px) drop-shadow(0 0 6px rgba(52, 211, 153, 0.8))",
                          opacity: Math.sin(revertExpand * Math.PI) * gridFade * 0.9,
                        }}
                      />
                    </svg>
                  )}
                </>
              );
            })()}
            {/* 1. Stage 2 Center Typography */}
            <div 
              className="absolute max-w-3xl text-center px-6 z-30 transition-all duration-300 ease-out flex flex-col gap-2 sm:gap-4 text-[#0f172a]"
              style={{
                opacity: s2TextOpacity,
                transform: `translate3d(0, ${s2Prog < 0.15 ? (1 - s2Prog / 0.15) * -15 : 0}px, 0)`,
              }}
            >
              {/* <span className="text-xs font-mono tracking-[0.2em] text-cyan-700 uppercase font-semibold">
                階段 02 — 直覺式解析
              </span> */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                AI 代理人即時清理、掃描
                <span className="text-cyan-600 block mt-1">
                  並結構化原始數據。
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                我們的平台掃描交易日誌、提取隱藏商戶、解析位置並交叉比對商戶登記處。在毫秒之間，交易數據從混亂無序轉化為乾淨的 JSON 格式。
              </p>
            </div>

            {/* 2. SVG Connection Lines in the Background */}
            {s2Prog >= 0.55 && (
              <div className="absolute w-[800px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 scale-[0.45] sm:scale-75 md:scale-100 origin-center">
                <svg width="800" height="600" className="w-full h-full">
                  {stage2Files.map((file, idx) => {
                    const cardState = getS2CardState(idx);
                    if (cardState.opacity === 0) return null;

                    const L = Math.sqrt(file.x * file.x + file.y * file.y);
                    const t_line = Math.max(0, Math.min(1, (s2Prog - 0.55) / 0.15));
                    const strokeDashoffset = L * (1 - t_line);

                    let lineOpacity = t_line;
                    if (file.type === "duplicate" && s2Prog >= 0.70) {
                      lineOpacity = Math.max(0, 1 - cardState.removeProg);
                    }
                    if (s2Prog >= 0.85) {
                      const fadeOutProg = Math.min(1, (s2Prog - 0.85) / 0.15);
                      lineOpacity = Math.max(0, lineOpacity * (1 - fadeOutProg));
                    }

                    const isDup = file.type === "duplicate";
                    const strokeColor = isDup ? "rgba(239, 68, 68, 0.6)" : "rgba(6, 182, 212, 0.6)";
                    
                    return (
                      <line
                        key={file.id}
                        x1={400}
                        y1={300 + centerYOffset}
                        x2={400 + cardState.x}
                        y2={300 + cardState.y}
                        stroke={strokeColor}
                        strokeWidth={isDup ? "2" : "1.5"}
                        strokeDasharray={isDup ? "4,4" : L}
                        strokeDashoffset={isDup ? 0 : strokeDashoffset}
                        style={{ opacity: lineOpacity }}
                        strokeLinecap="round"
                        className="transition-all duration-75"
                      />
                    );
                  })}
                </svg>
              </div>
            )}

            {/* 3. Scattered File Cards */}
            {s2Prog >= 0.20 && (
              <div className="absolute w-[800px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none scale-[0.45] sm:scale-75 md:scale-100 origin-center">
                {stage2Files.map((file, idx) => {
                  const cardState = getS2CardState(idx);
                  if (cardState.opacity === 0) return null;

                  const isDup = file.type === "duplicate";
                  
                  let borderClass = "border-slate-200 bg-white";
                  let tagText = file.label;
                  let tagColor = "text-slate-400 border-slate-200 bg-slate-50";
                  let tickColor = "border-slate-400";

                  if (isDup) {
                    if (s2Prog >= 0.70) {
                      borderClass = "border-red-500 bg-red-50/90";
                      tagText = "⚠ 重複資料 - 正在清理";
                      tagColor = "text-red-600 border-red-200 bg-red-100 animate-pulse";
                      tickColor = "border-red-500";
                    } else {
                      borderClass = "border-amber-300 bg-white";
                      tagText = "⚠ 偵測到重複";
                      tagColor = "text-amber-600 border-amber-200 bg-amber-50";
                      tickColor = "border-amber-400";
                    }
                  } else {
                    if (s2Prog >= 0.70) {
                      borderClass = "border-emerald-300 bg-white";
                      tagText = "✓ 已關聯並結構化";
                      tagColor = "text-emerald-600 border-emerald-200 bg-emerald-50";
                      tickColor = "border-emerald-500";
                    } else if (s2Prog >= 0.55) {
                      borderClass = "border-cyan-300 bg-white";
                      tagText = "• 正在關聯...";
                      tagColor = "text-cyan-600 border-cyan-200 bg-cyan-50";
                      tickColor = "border-cyan-400";
                    }
                  }

                  return (
                    <React.Fragment key={file.id}>
                      {/* Card Container with diagonal de-materialization mask */}
                      {(() => {
                        // Calculate diagonal sweep mask percentages
                        const maskStart = cardState.removeProg * 160 - 30;
                        const maskEnd = maskStart + 25;
                        const maskStyle = isDup && cardState.isRemoving
                          ? `linear-gradient(135deg, transparent ${maskStart}%, black ${maskEnd}%)`
                          : 'none';

                        return (
                          <div
                            className="absolute transition-all duration-75 ease-out will-change-transform select-none"
                            style={{
                              transform: `translate3d(${cardState.x}px, ${cardState.y}px, 0) rotate(${cardState.rotate}deg) scale(${cardState.scale})`,
                              opacity: cardState.opacity,
                              filter: isDup && cardState.isRemoving
                                ? `hue-rotate(${cardState.removeProg * 180}deg) brightness(${1 + cardState.removeProg * 2.5}) contrast(1.5) blur(${cardState.removeProg * 3.5}px)`
                                : 'none',
                              WebkitMaskImage: maskStyle,
                              maskImage: maskStyle
                            }}
                          >
                            <Card 
                              outerClassName={`${borderClass} w-[240px] !p-4 pointer-events-none transition-colors duration-300 !shadow-none`}
                              tickColor={tickColor}
                            >
                              <div className="flex flex-col gap-2 text-left font-mono text-[12px]">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[10px] font-bold">
                                  <span className="text-slate-400 block truncate max-w-[130px]">
                                    {file.name}
                                  </span>
                                  <span className="text-slate-300 text-[9px] uppercase">
                                    {isDup ? "dup_log" : "raw_data"}
                                  </span>
                                </div>
                                
                                <div className={`text-[10.5px] px-2 py-0.5 rounded border font-sans font-semibold text-center mt-0.5 ${tagColor} transition-colors duration-300`}>
                                  {tagText}
                                </div>
                                
                                <div className="flex flex-col gap-0.5 text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                                  <div className="truncate">HASH: {(file.id * 18742918).toString(16).toUpperCase()}</div>
                                  <div>SIZE: {((12 + file.id * 7) / 10).toFixed(1)} KB</div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        );
                      })()}

                      {/* Sci-fi digital stream particles (evaporating from the diagonal sweep front) */}
                      {isDup && cardState.isRemoving && (
                        <div
                          className="absolute pointer-events-none z-30"
                          style={{
                            transform: `translate3d(${file.x}px, ${file.y}px, 0)`,
                            width: "240px",
                            height: "140px",
                          }}
                        >
                          {Array.from({ length: 22 }).map((_, pIdx) => {
                            // Map particles diagonally from top-left (0.0) to bottom-right (1.0)
                            const posFactor = pIdx / 21;
                            
                            // Delay the start of each particle based on its position along the diagonal
                            const pStart = posFactor * 0.55;
                            const pEnd = pStart + 0.45;
                            
                            // Calculate local progress for this particle
                            let t = 0;
                            if (cardState.removeProg >= pStart) {
                              t = Math.min(1, (cardState.removeProg - pStart) / 0.45);
                            }
                            
                            // Render particle only if it's active in its lifespan
                            if (t <= 0 || t >= 1) return null;

                            // Start coordinates: sweeping along the diagonal of the 240x140 card
                            const startX = -120 + posFactor * 240 + (pIdx % 3 - 1) * 12;
                            const startY = -70 + posFactor * 140 + (pIdx % 3 - 1) * 8;
                            
                            // Digital upward draft with horizontal noise drift
                            const px = startX + Math.sin(t * Math.PI * 2.5 + pIdx) * 16 * t;
                            const py = startY - t * 130; // floats upwards 130px
                            
                            const pScale = Math.max(0, (1 - t) * (0.85 + (pIdx % 2) * 0.35));
                            const pOpacity = Math.max(0, 1 - t * 1.1);
                            
                            const isDigit = pIdx % 2 === 0;
                            const digitText = isDigit ? (pIdx % 4 === 0 ? "0" : "1") : null;
                            const colors = ["#22d3ee", "#a855f7", "#10b981", "#ffffff"];
                            const color = colors[pIdx % colors.length];

                            return isDigit ? (
                              <div
                                key={`digit-${pIdx}`}
                                className="absolute font-mono text-[11px] font-bold select-none"
                                style={{
                                  left: "50%",
                                  top: "50%",
                                  color: color,
                                  textShadow: `0 0 8px ${color}, 0 0 2px #fff`,
                                  transform: `translate(-50%, -50%) translate3d(${px}px, ${py}px, 0) scale(${pScale})`,
                                  opacity: pOpacity,
                                }}
                              >
                                {digitText}
                              </div>
                            ) : (
                              <div
                                key={`pixel-${pIdx}`}
                                className="absolute rounded-none pointer-events-none"
                                style={{
                                  left: "50%",
                                  top: "50%",
                                  width: pIdx % 3 === 0 ? "5px" : "8px",
                                  height: pIdx % 3 === 0 ? "5px" : "8px",
                                  backgroundColor: color,
                                  boxShadow: `0 0 10px ${color}, 0 0 2px #fff`,
                                  transform: `translate(-50%, -50%) translate3d(${px}px, ${py}px, 0) rotate(${t * 360}deg) scale(${pScale})`,
                                  opacity: pOpacity,
                                }}
                              />
                            );
                          })}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* 4. Center AI Agent Core */}
            {s2Prog >= 0.40 && (
              <div 
                className="absolute z-30 transition-all duration-100 ease-out pointer-events-none"
                style={{
                  opacity: s2Prog < 0.85 
                    ? Math.min(1, (s2Prog - 0.40) / 0.15)
                    : Math.max(0, 1 - (s2Prog - 0.85) / 0.15),
                  transform: `translateY(${centerYOffset}px) scale(${s2Prog < 0.85 
                    ? 0.5 + Math.min(1, (s2Prog - 0.40) / 0.15) * 0.5
                    : 1.0 - (s2Prog - 0.85) / 0.15 * 0.2})`
                }}
              >
                <div className="relative w-[200px] h-[200px] flex items-center justify-center">
                  {/* 3D Wireframe Canvas Core — shared CubeCore component */}
                  <CubeCore size={200} className="absolute inset-0" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
