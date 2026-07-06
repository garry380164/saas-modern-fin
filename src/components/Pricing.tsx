"use client";

import React, { useEffect, useState, useRef } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

function TextDecoder({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [trigger, setTrigger] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!+=?";
  const duration = 700; // ms
  const frameRate = 30; // frames per sec
  const totalFrames = (duration / 1000) * frameRate;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.9) {
          setTrigger(true);
        } else if (entry.intersectionRatio < 0.1) {
          setTrigger(false);
        }
      },
      { threshold: [0.1, 0.9] }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text.split("").map((c) => (c === " " ? " " : chars[Math.floor(Math.random() * chars.length)])).join(""));
      return;
    }

    let isMounted = true;
    let timer = setTimeout(() => {
      let frame = 0;
      const interval = setInterval(() => {
        if (!isMounted) return;
        frame++;
        const progress = frame / totalFrames;
        
        const decodedCount = Math.floor(progress * text.length);
        const nextText = text
          .split("")
          .map((char, index) => {
            if (index < decodedCount) {
              return char;
            }
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
          
        setDisplayText(nextText);
        
        if (frame >= totalFrames) {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, 1000 / frameRate);
      
      return () => clearInterval(interval);
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [text, trigger, delay]);

  return <span ref={elementRef} className="inline-block">{displayText}</span>;
}

function PriceCounter({ priceText, delay = 0 }: { priceText: string; delay?: number }) {
  const [displayPrice, setDisplayPrice] = useState("");
  const [trigger, setTrigger] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const numericMatch = priceText.match(/\d+/);
  const isNumeric = numericMatch !== null;
  const targetNum = isNumeric ? parseInt(numericMatch[0], 10) : 0;
  const prefix = priceText.startsWith("$") ? "$" : "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.9) {
          setTrigger(true);
        } else if (entry.intersectionRatio < 0.1) {
          setTrigger(false);
        }
      },
      { threshold: [0.1, 0.9] }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNumeric) {
      return;
    }
    
    if (!trigger) {
      setDisplayPrice(prefix + "0");
      return;
    }

    let isMounted = true;
    let timer = setTimeout(() => {
      const startTime = performance.now();
      const duration = 1000; // ms

      const update = (now: number) => {
        if (!isMounted) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(easeProgress * targetNum);
        
        setDisplayPrice(`${prefix}${currentVal}`);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setDisplayPrice(priceText);
        }
      };

      requestAnimationFrame(update);
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [priceText, trigger, delay, isNumeric, targetNum, prefix]);

  if (!isNumeric) {
    return <TextDecoder text={priceText} delay={delay} />;
  }

  return <span ref={elementRef} className="inline-block">{displayPrice}</span>;
}

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    period: string;
    desc: string;
    features: string[];
    recommended: boolean;
    cta: string;
  };
  isProfessional: boolean;
  onSelectPlan: (planName: string, price: string) => void;
}

function PricingCard({ plan, isProfessional, onSelectPlan }: PricingCardProps) {
  return (
    <div
      className={`flex flex-col h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isProfessional
          ? "scale-[1.02] hover:scale-[1.03]"
          : "hover:-translate-y-1"
      }`}
    >
      <Card
        borderColor={isProfessional ? "border-[1.5px] border-accent-cyan" : "border-slate-200"}
        tickColor={isProfessional ? "border-accent-cyan" : "border-slate-800"}
        squareCorners={isProfessional}
        floatTicks={isProfessional}
        outerClassName={`flex-1 flex flex-col ${
          isProfessional 
            ? "shadow-[0_0_25px_rgba(8,145,178,0.18)] hover:shadow-[0_0_35px_rgba(8,145,178,0.28)]" 
            : "bg-black/[0.01] hover:border-black/10"
        }`}
        innerClassName="flex-1 flex flex-col justify-between p-8 bg-white"
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                <TextDecoder text={plan.name} />
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                <TextDecoder text={plan.desc} />
              </p>
            </div>
            {isProfessional && (
              <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 tracking-wider">
                推薦方案
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline text-[#0f172a]">
            <span className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <PriceCounter priceText={plan.price} />
            </span>
            <span className="text-sm text-slate-400 font-medium ml-1">
              {plan.period}
            </span>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Features List */}
          <ul className="flex flex-col gap-4">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-slate-600 leading-normal">
                <svg
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    isProfessional ? "text-accent-cyan" : "text-accent-emerald"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <TextDecoder text={feature} />
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <div className="mt-8">
          <Button
            variant={isProfessional ? "primary" : "secondary"}
            className="w-full text-center py-3.5"
            onClick={() => onSelectPlan(plan.name, plan.price)}
          >
            <TextDecoder text={plan.cta} />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function Pricing({ onSelectPlan }: { onSelectPlan: (planName: string, price: string) => void }) {
  const plans = [
    {
      name: "Starter 入門方案",
      price: "$29",
      period: "/月",
      desc: "適合小型專案與早期產品驗證使用。",
      features: [
        "每月 50,000 筆交易數據處理",
        "基礎交易類別自動分類",
        "標準 24 小時內 Email 客服支援",
        "提供 1 組生產環境 API 金鑰",
        "API 平均延遲 150ms",
      ],
      recommended: false,
      cta: "立即啟動",
    },
    {
      name: "Professional 專業方案",
      price: "$99",
      period: "/月",
      desc: "適合快速成長中的 B2B 企業與金融產品。",
      features: [
        "每月 500,000 筆交易數據處理",
        "高精度地理位置解析與地圖對齊",
        "商戶註冊資料驗證與商標識別",
        "提供 5 組生產環境 API 金鑰",
        "API 延跨時間低於 50ms SLA",
        "24/7 優先級真人支援通道",
      ],
      recommended: true,
      cta: "立即訂閱推薦方案",
    },
    {
      name: "Enterprise 企業方案",
      price: "客製化",
      period: "",
      desc: "為大型金融機構與高交易量平台量身打造。",
      features: [
        "無限交易處理筆數 (特製頻寬)",
        "自訂機器學習分類與專屬權重調整",
        "獨立區塊鏈寫入與專屬伺服器節點",
        "無限制生產環境 API 金鑰",
        "99.99% 服務可用性 (SLA) 保證",
        "專屬金融架構工程師一對一支援",
      ],
      recommended: false,
      cta: "聯絡我們",
    },
  ];

  return (
    <section className="relative w-full py-32 overflow-hidden bg-background">
      {/* Background grids */}
      <div className="absolute inset-0 tech-grid opacity-30 -z-20" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-blue/[0.02] blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header section */}
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] bg-black/[0.03] border border-black/[0.08] text-accent-cyan">
            方案定價
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0f172a]">
            彈性方案，隨企業規模擴展
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-xl">
            提供精準、無延遲的金融 AI 數據處理。無隱藏費用，隨時可升級或調降您的訂閱方案。
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isProfessional={plan.recommended}
              onSelectPlan={onSelectPlan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
