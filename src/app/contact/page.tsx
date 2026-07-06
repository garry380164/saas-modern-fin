"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function Contact() {
  const router = useRouter();

  // Options for Volume Select
  const selectOptions = [
    { value: "under_50k", label: "少於 50,000 筆" },
    { value: "50k_500k", label: "50,000 - 500,000 筆" },
    { value: "500k_5m", label: "500,000 - 5,000,000 筆" },
    { value: "over_5m", label: "超過 5,000,000 筆" }
  ];

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [volume, setVolume] = useState("");
  const [source, setSource] = useState("");

  // UI States
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Simple validation
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "請輸入您的名字";
    if (!lastName.trim()) newErrors.lastName = "請輸入您的姓氏";
    if (!email.trim()) {
      newErrors.email = "請輸入工作電子郵件";
    } else if (!validateEmail(email)) {
      newErrors.email = "請輸入有效的電子郵件格式";
    }
    if (!volume) newErrors.volume = "請選擇您的每月交易處理量";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit animation
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f5a0", "#10b981", "#0891b2", "#2563eb", "#ffffff"],
      });
    }, 1800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f5f6] text-[#0f172a]">
      {/* Background Grids */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-cyan/[0.03] blur-[150px] pointer-events-none" />

      {/* FLOATING NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-40 px-6 mt-6 pointer-events-none">
        <div className="max-w-[1400px] mx-auto w-full glass-panel py-3.5 px-8 flex items-center justify-between pointer-events-auto shadow-[0_10px_30px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] border-black/[0.06]">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-accent-emerald to-accent-cyan flex items-center justify-center text-white font-extrabold text-sm">
              F
            </div>
            <span className="text-sm font-extrabold tracking-wider font-mono text-slate-900">
              FINAI&apos;
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider text-slate-500">
            <a href="/#scroll-story-section" className="hover:text-[#0f172a] transition-colors duration-300">
              解決方案
            </a>
            <a href="/#pricing-section" className="hover:text-[#0f172a] transition-colors duration-300">
              顧客
            </a>
            <a href="/#about-section" className="hover:text-[#0f172a] transition-colors duration-300">
              公司
            </a>
            <a href="/#scroll-story-section" className="hover:text-[#0f172a] transition-colors duration-300">
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

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-40 pb-24 relative z-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: Values & Bullet Points */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] bg-black/[0.03] border border-black/[0.08] text-accent-cyan mb-4">
                聯絡我們
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0f172a] leading-tight">
                見證卓越數據為您帶來的優勢
              </h1>
            </div>

            {/* Spade Style Bullet Container */}
            <div className="relative border-l border-r border-t border-b border-black/[0.05] p-8 rounded-lg bg-white/[0.02] overflow-hidden">
              {/* Corner L-brackets decor */}
              <span className="absolute w-2 h-2 border-t-2 border-l-2 border-slate-300 top-0 left-0" />
              <span className="absolute w-2 h-2 border-t-2 border-r-2 border-slate-300 top-0 right-0" />
              <span className="absolute w-2 h-2 border-b-2 border-l-2 border-slate-300 bottom-0 left-0" />
              <span className="absolute w-2 h-2 border-b-2 border-r-2 border-slate-300 bottom-0 right-0" />
              
              <ul className="flex flex-col gap-6">
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-emerald-50 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald text-xs mt-1 font-bold">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">即時商戶情報授權</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      透過即時機器學習商戶解析，大幅提升信用卡授權交易精準度，降低風控誤判。
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-emerald-50 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald text-xs mt-1 font-bold">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">數據清洗與管道簡化</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      簡化您的數據管道，大幅減少人工清理雜亂帳單明細與校正的營運成本。
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-5 h-5 rounded bg-emerald-50 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald text-xs mt-1 font-bold">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">單一 API 整合方案</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      整合了極致豐富的金融數據集，讓新產品的交付與發布速度提高數倍。
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form Card */}
          <div className="lg:col-span-6">
            <Card 
              variant="wireframe"
              borderColor="border-[1.5px] border-accent-cyan"
              tickColor="border-accent-cyan"
              squareCorners={true}
              floatTicks={true}
              outerClassName="shadow-[0_0_25px_rgba(8,145,178,0.18)] hover:shadow-[0_0_35px_rgba(8,145,178,0.28)]"
              innerClassName="p-8 md:p-10 bg-white"
            >
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative">
                  
                  {/* Loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-4 text-center">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-2 border-slate-200 rounded-full" />
                        <div className="absolute inset-0 border-2 border-t-accent-cyan rounded-full animate-spin" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 font-mono">
                        提交資料發送中...
                      </span>
                    </div>
                  )}

                  {/* Form Header */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">聯繫我們的顧問</h2>
                    <p className="text-xs text-slate-500 mt-1 font-mono">填寫下表，我們專業的金融數據工程師將在 24 小時內與您聯繫。</p>
                  </div>

                  {/* First Name & Last Name (Side by side) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold font-mono tracking-wide text-slate-500">
                        名字 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="小明"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (errors.firstName) setErrors(prev => ({ ...prev, firstName: "" }));
                        }}
                        className={`bg-white border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                          errors.firstName ? "border-red-500" : "border-slate-200 focus:border-accent-cyan/50"
                        }`}
                      />
                      {errors.firstName && <span className="text-[10px] text-red-500 font-medium">{errors.firstName}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold font-mono tracking-wide text-slate-500">
                        姓氏 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="陳"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (errors.lastName) setErrors(prev => ({ ...prev, lastName: "" }));
                        }}
                        className={`bg-white border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                          errors.lastName ? "border-red-500" : "border-slate-200 focus:border-accent-cyan/50"
                        }`}
                      />
                      {errors.lastName && <span className="text-[10px] text-red-500 font-medium">{errors.lastName}</span>}
                    </div>
                  </div>

                  {/* Work Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold font-mono tracking-wide text-slate-500">
                      工作電子郵件 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="ming.chen@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      className={`bg-white border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                        errors.email ? "border-red-500" : "border-slate-200 focus:border-accent-cyan/50"
                      }`}
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-medium">{errors.email}</span>}
                  </div>

                  {/* Monthly Transactions Volume */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold font-mono tracking-wide text-slate-500">
                      您每個月處理多少筆交易？ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsOpenSelect(!isOpenSelect)}
                        className={`w-full bg-white border rounded-lg px-4 py-2.5 text-left text-base flex justify-between items-center transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                          isOpenSelect ? "border-accent-cyan/80 ring-2 ring-cyan-500/20" : errors.volume ? "border-red-500" : "border-slate-200 focus:border-accent-cyan/50"
                        }`}
                      >
                        <span className={volume ? "text-slate-800 font-medium" : "text-slate-400"}>
                          {selectOptions.find(o => o.value === volume)?.label || "請選擇一個範圍"}
                        </span>
                        <svg
                          className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpenSelect ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isOpenSelect && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsOpenSelect(false)} />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1.5 animate-fade-in font-sans">
                            {selectOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setVolume(option.value);
                                  setIsOpenSelect(false);
                                  if (errors.volume) setErrors(prev => ({ ...prev, volume: "" }));
                                }}
                                className={`w-full text-left px-4 py-2.5 text-base transition-colors duration-150 flex items-center justify-between hover:bg-slate-50 ${
                                  volume === option.value ? "text-cyan-700 bg-cyan-50/50 font-semibold" : "text-slate-700"
                                }`}
                              >
                                <span>{option.label}</span>
                                {volume === option.value && (
                                  <span className="text-accent-cyan text-sm font-bold">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {errors.volume && <span className="text-[10px] text-red-500 font-medium">{errors.volume}</span>}
                  </div>

                  {/* How did you hear of us */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold font-mono tracking-wide text-slate-500">
                      您是如何得知我們的？
                    </label>
                    <input
                      type="text"
                      placeholder="例如：Google 搜尋、業界推薦..."
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:border-accent-cyan/50 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-3.5 rounded-full text-base font-bold transition-all shadow-md active:scale-[0.99] cursor-pointer"
                  >
                    提交
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 gap-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-cyan-50 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan text-3xl font-extrabold shadow-inner">
                    ✓
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">感謝您的聯繫！</h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm">
                      您的聯絡請求已成功提交。我們專業的顧問將在 24 小時內發送電子郵件或直接與您通話。
                    </p>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="px-6 py-2 bg-white"
                    onClick={() => router.push("/")}
                  >
                    返回首頁
                  </Button>
                </div>
              )}
            </Card>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-black/[0.05] bg-[#eaeced] py-16 relative overflow-hidden mt-auto">
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
    </div>
  );
}
