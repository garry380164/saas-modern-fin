"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Hero from "../components/Hero";
import BrandCloud from "../components/BrandCloud";
import ScrollStory from "../components/ScrollStory";
import Pricing from "../components/Pricing";
import CheckoutModal from "../components/CheckoutModal";
import Button from "../components/ui/Button";

export default function Home() {
  const router = useRouter();
  // Checkout Modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: "", price: "" });

  const handleSelectPlan = (planName: string, price: string) => {
    if (planName.includes("Enterprise") || planName.includes("企業")) {
      router.push("/contact");
      return;
    }
    setSelectedPlan({ name: planName, price });
    setIsCheckoutOpen(true);
  };

  const handleSubscribeHero = () => {
    // Default to Professional Plan when clicking the Hero primary CTA
    handleSelectPlan("Professional", "$99");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f5f6] text-[#0f172a]">
      
      {/* FLOATING GLASS PILLED NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-40 px-6 mt-6 pointer-events-none">
        <div className="max-w-[1400px] mx-auto w-full glass-panel py-3.5 px-8 flex items-center justify-between pointer-events-auto shadow-[0_10px_30px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] border-black/[0.06]">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-accent-emerald to-accent-cyan flex items-center justify-center text-white font-extrabold text-sm">
              F
            </div>
            <span className="text-sm font-extrabold tracking-wider font-mono text-slate-900">
              FINAI&apos;
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider text-slate-500">
            <a
              href="#scroll-story-section"
              className="hover:text-[#0f172a] transition-colors duration-300"
            >
              解決方案
            </a>
            <a
              href="#pricing-section"
              className="hover:text-[#0f172a] transition-colors duration-300"
            >
              顧客
            </a>
            <a
              href="#about-section"
              className="hover:text-[#0f172a] transition-colors duration-300"
            >
              公司
            </a>
            <a
              href="#scroll-story-section"
              className="hover:text-[#0f172a] transition-colors duration-300"
            >
              文件
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              className="px-5 py-2 text-sm font-bold rounded-full scale-95"
              onClick={() => router.push("/contact")}
            >
              聯繫銷售
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN SECTIONS */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section id="hero-section">
          <Hero onSubscribe={handleSubscribeHero} />
        </section>

        {/* Brand Logo Cloud Section */}
        <BrandCloud />

        {/* Scroll Story Section (Chaos -> Scan -> Clean) */}
        <ScrollStory />

        {/* Pricing Plan Section */}
        <section id="pricing-section">
          <Pricing onSelectPlan={handleSelectPlan} />
        </section>

        {/* Detailed Core Values (Spade style grid) */}
        <section id="about-section" className="relative py-32 border-t border-black/[0.05] bg-[#f3f5f6]">
          <div className="absolute inset-0 tech-grid opacity-30 -z-10" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
              <div className="lg:col-span-6">
                {/* <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] bg-black/[0.03] border border-black/[0.08] text-accent-cyan mb-4">
                  核心基礎設施
                </span> */}
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0f172a] leading-tight">
                  為什麼選擇 Finai <br />
                  金融數據基礎設施？
                </h2>
              </div>
              <div className="lg:col-span-6 text-slate-500 text-base md:text-lg leading-relaxed">
                我們深知在金融應用中，數據的精準度直接關係到風控決策與用戶體驗。Finai 結合先進的 AI 代理人架構，以毫秒級延延遲為您的交易流提供結構化、可信賴的黃金級數據。
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 text-center">
              {/* Feature 1 */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center mb-6 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/security_shield_sketch.png?v=2"
                    alt="銀行級安全與隱私"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-[#0f172a] mb-3">銀行級安全與隱私</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                  通過 SOC2 認證，對敏感交易數據實施端到端安全加密與雜湊遮罩。
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center mb-6 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/speed_flame_sketch.png?v=2"
                    alt="毫秒級即時解析"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-[#0f172a] mb-3">毫秒級即時解析</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                  智慧多執行緒推理模型，保證每筆呼召在 50ms 內極速回應。
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center mb-6 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/analytics_chart_sketch.png?v=2"
                    alt="精緻的視覺化分析"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-[#0f172a] mb-3">精緻的視覺化分析</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                  直觀數據儀表板，輕鬆分析商戶分佈、地理熱圖與消費趨勢。
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center group">
                <div className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center mb-6 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/adaptive_monitoring_sketch.png?v=2"
                    alt="彈性自動監控"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-[#0f172a] mb-3">彈性自動監控</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                  智慧代理全天候監控與防護，自動優化查詢負載並阻斷異常威脅。
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-black/[0.05] bg-[#eaeced] py-16 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-black/10 flex items-center justify-center text-[#0f172a] font-extrabold text-xs">
              F
            </div>
            <span>© 2026 FINAI FINANCIAL AI 公司。版權所有，保留一切權利。</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">API 文檔</a>
            <a href="#" className="hover:text-white transition-colors">隱私條款</a>
            <a href="#" className="hover:text-white transition-colors">服務協議</a>
          </div>
        </div>
      </footer>

      {/* CHECKOUT MODAL FLOW */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={selectedPlan.name}
        price={selectedPlan.price}
      />
    </div>
  );
}
