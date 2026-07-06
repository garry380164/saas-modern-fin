"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import VirtualCard from "./VirtualCard";
import Button from "./ui/Button";
import Card from "./ui/Card";
import {
  formatCardNumber,
  validateCardNumber,
  validateExpiry,
  validateCVC,
  validateCarrier,
  validateTaxId,
} from "../utils/validators";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: string;
}

export default function CheckoutModal({ isOpen, onClose, planName, price }: CheckoutModalProps) {
  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [invoiceType, setInvoiceType] = useState<"carrier" | "taxId">("carrier");
  const [carrier, setCarrier] = useState("/");
  const [taxId, setTaxId] = useState("");
  const [companyTitle, setCompanyTitle] = useState("");

  // UI States
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Modal rendering transition states
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300); // 300ms transition time
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const isFlipped =
    focusedField === "cardName" ||
    focusedField === "cardNumber" ||
    focusedField === "expiry" ||
    focusedField === "cvc";

  // Handle card number change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  // Handle expiry change (auto insert slash)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiry(value);
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: "" }));
    }
  };

  // Handle carrier change (always ensure starts with /)
  const handleCarrierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("/")) {
      val = "/" + val.replace(/\//g, "");
    }
    // Limit length to 8 characters (slash + 7 alphanumeric)
    setCarrier(val.toUpperCase().slice(0, 8));
    if (errors.carrier) {
      setErrors((prev) => ({ ...prev, carrier: "" }));
    }
  };

  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    setTaxId(val);
    if (errors.taxId) {
      setErrors((prev) => ({ ...prev, taxId: "" }));
    }
  };

  // Form submit handler with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // 1. Credit Card validation
    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = "請輸入完整的 16 碼信用卡卡號";
    }
    if (!validateExpiry(expiry)) {
      newErrors.expiry = "請輸入有效的到期日 (MM/YY)";
    }
    if (!validateCVC(cvc)) {
      newErrors.cvc = "請輸入 3 或 4 碼安全碼";
    }
    if (!cardName.trim()) {
      newErrors.cardName = "請輸入持卡人姓名";
    }

    // 2. Invoice validation
    if (invoiceType === "carrier") {
      if (!validateCarrier(carrier)) {
        newErrors.carrier = "請輸入有效的手機條碼載具 (格式如：/ABC1234)";
      }
    } else {
      if (!validateTaxId(taxId)) {
        newErrors.taxId = "統編須為 8 位數字且符合格式校驗";
      }
      if (!companyTitle.trim()) {
        newErrors.companyTitle = "請輸入公司抬頭";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.cardNumber || newErrors.cardName || newErrors.expiry) {
        setFocusedField(null);
      }
      return;
    }

    // Validation passes -> Start high-tech loading state
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#00f5a0", "#10b981", "#0052ff", "#ffffff"],
      });
    }, 2500); // 2.5 seconds mock verification
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${shouldRender ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Background glass filter */}
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ease-out ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={!isLoading && !isSuccess ? onClose : undefined}
      />

      {/* Modal core structure */}
      <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[28px] p-[1.5px] flow-border-wrapper shadow-2xl z-10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        animate ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
      }`}>
        <div className="w-full rounded-[26px] bg-white/95 backdrop-blur-2xl p-6 md:p-10 text-slate-800 relative shadow-2xl">
          
          {/* Close button */}
          {!isLoading && !isSuccess && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/[0.03] border border-black/[0.08] flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-black/[0.06] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Checkout views */}
          {!isSuccess ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Order breakdown details */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:border-r lg:border-black/[0.08] lg:pr-8">
                <div>
                  <span className="text-xs font-mono tracking-widest text-cyan-700 uppercase block mb-1 font-bold">
                    安全訂閱通道
                  </span>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                    確認您的訂閱
                  </h3>
                </div>

                {/* Pricing Info Card */}
                <Card innerClassName="p-5 bg-slate-50 border-black/[0.03]">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-sm text-slate-400 block">方案級別</span>
                      <span className="font-bold text-slate-800 text-lg">{planName} 方案</span>
                    </div>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-cyan-50 text-cyan-600 rounded border border-cyan-100">
                      按月計費
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-black/[0.06] text-slate-800">
                    <span className="text-sm text-slate-400">每月應付總額</span>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-extrabold">{price}</span>
                      <span className="text-xs text-slate-400 ml-1 font-medium">/月</span>
                    </div>
                  </div>
                </Card>

                {/* Feature Checklist */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                    包含的核心特點
                  </span>
                  <ul className="flex flex-col gap-2.5 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>即時金融數據流分類 & 地理定位</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>低於 50 毫秒極速 API 呼叫回應</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>綠界科技自動化發票開立系統</span>
                    </li>
                  </ul>
                </div>

                {/* SSL Seal */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-black/[0.08] text-xs text-slate-400 font-mono">
                  <svg className="w-4 h-4 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>256 位元端到端 SSL 加密傳輸驗證</span>
                </div>
              </div>

              {/* Right Side: Credit Card + Invoice Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6 relative">
                
                {/* Digital Loading Mask */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-2 border-slate-200 rounded-full" />
                      <div className="absolute inset-0 border-2 border-t-accent-cyan rounded-full animate-spin" />
                    </div>
                    <div className="flex flex-col gap-1.5 px-6">
                      <span className="text-sm font-bold text-slate-800 tracking-wide">
                        數據驗證中...
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        正在透過 AI 安全通道傳輸加密數據並開立發票
                      </span>
                    </div>
                  </div>
                )}

                {/* 3D Credit Card visual (Keep Dark for visual contrast) */}
                <VirtualCard
                  cardNumber={cardNumber}
                  cardName={cardName}
                  expiry={expiry}
                  cvc={cvc}
                  isFlipped={isFlipped}
                />

                {/* Form inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Card Holder Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                      持卡人姓名
                    </label>
                    <input
                      type="text"
                      placeholder="ZHANG XIAO MING (例如：張小明)"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value.toUpperCase());
                        if (errors.cardName) setErrors((prev) => ({ ...prev, cardName: "" }));
                      }}
                      onFocus={() => setFocusedField("cardName")}
                      onBlur={() => setFocusedField(null)}
                      className={`bg-slate-50 border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:bg-white ${
                        errors.cardName ? "border-red-500/70" : "border-slate-200 focus:border-accent-cyan/50"
                      }`}
                    />
                    {errors.cardName && <span className="text-[10px] text-red-500 font-medium">{errors.cardName}</span>}
                  </div>

                  {/* Credit Card Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                      信用卡卡號
                    </label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onFocus={() => setFocusedField("cardNumber")}
                      onBlur={() => setFocusedField(null)}
                      maxLength={19}
                      className={`bg-slate-50 border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:bg-white ${
                        errors.cardNumber ? "border-red-500/70" : "border-slate-200 focus:border-accent-cyan/50"
                      }`}
                    />
                    {errors.cardNumber && <span className="text-[10px] text-red-500 font-medium">{errors.cardNumber}</span>}
                  </div>

                  {/* Expiry Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                      卡片效期 (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setFocusedField("expiry")}
                      onBlur={() => setFocusedField(null)}
                      maxLength={5}
                      className={`bg-slate-50 border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:bg-white ${
                        errors.expiry ? "border-red-500/70" : "border-slate-200 focus:border-accent-cyan/50"
                      }`}
                    />
                    {errors.expiry && <span className="text-[10px] text-red-500 font-medium">{errors.expiry}</span>}
                  </div>

                  {/* CVC Code */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                      安全碼 (CVC)
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => {
                        setCvc(e.target.value.replace(/[^0-9]/g, "").slice(0, 4));
                        if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: "" }));
                      }}
                      onFocus={() => setFocusedField("cvc")}
                      onBlur={() => setFocusedField(null)}
                      maxLength={4}
                      className={`bg-slate-50 border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:bg-white ${
                        errors.cvc ? "border-red-500/70" : "border-slate-200 focus:border-accent-cyan/50"
                      }`}
                    />
                    {errors.cvc && <span className="text-[10px] text-red-500 font-medium">{errors.cvc}</span>}
                  </div>
                </div>

                {/* Invoice System (Tab Switcher) */}
                <div className="flex flex-col gap-3 pt-4 border-t border-black/[0.08]">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                    統一發票類型 (綠界電子發票系統)
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg border border-slate-200/50">
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceType("carrier");
                        setErrors({});
                      }}
                      className={`py-1.5 text-sm font-semibold rounded-md transition-all ${
                        invoiceType === "carrier" ? "bg-white text-slate-900 shadow-sm border border-slate-200/30" : "text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      個人手機載具
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceType("taxId");
                        setErrors({});
                      }}
                      className={`py-1.5 text-sm font-semibold rounded-md transition-all ${
                        invoiceType === "taxId" ? "bg-white text-slate-900 shadow-sm border border-slate-200/30" : "text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      公司三聯式發票 (統編)
                    </button>
                  </div>

                  {invoiceType === "carrier" ? (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                        手機條碼載具 (首字 / 自動補齊)
                      </label>
                      <input
                        type="text"
                        placeholder="/ABC1234"
                        value={carrier}
                        onChange={handleCarrierChange}
                        maxLength={8}
                        className={`bg-slate-50 border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:bg-white font-mono ${
                          errors.carrier ? "border-red-500/70" : "border-slate-200 focus:border-accent-cyan/50"
                        }`}
                      />
                      <span className="text-xs text-slate-400">系統將自動驗證條碼格式，開立成功後將寄送發票通知。</span>
                      {errors.carrier && <span className="text-[10px] text-red-500 font-medium">{errors.carrier}</span>}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                          統一編號 (8 碼數字)
                        </label>
                        <input
                          type="text"
                          placeholder="24436074"
                          value={taxId}
                          onChange={handleTaxIdChange}
                          maxLength={8}
                          className={`bg-slate-50 border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:bg-white font-mono ${
                            errors.taxId ? "border-red-500/70" : "border-slate-200 focus:border-accent-cyan/50"
                          }`}
                        />
                        {errors.taxId && <span className="text-[10px] text-red-500 font-medium">{errors.taxId}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">
                          公司發票抬頭
                        </label>
                        <input
                          type="text"
                          placeholder="數能 AI 科技股份有限公司"
                          value={companyTitle}
                          onChange={(e) => {
                            setCompanyTitle(e.target.value);
                            if (errors.companyTitle) setErrors((prev) => ({ ...prev, companyTitle: "" }));
                          }}
                          className={`bg-slate-50 border rounded-lg px-4 py-2.5 text-base transition-all focus:outline-none focus:bg-white ${
                            errors.companyTitle ? "border-red-500/70" : "border-slate-200 focus:border-accent-cyan/50"
                          }`}
                        />
                        {errors.companyTitle && <span className="text-[10px] text-red-500 font-medium">{errors.companyTitle}</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Submission Button */}
                <Button type="submit" variant="primary" className="w-full mt-4 py-3.5">
                  確認付款並啟用 {planName} 服務 ({price})
                </Button>
              </form>
            </div>
          ) : (
            // Success Screen View
            <div className="flex flex-col items-center justify-center text-center py-12 px-6 max-w-xl mx-auto">
              {/* Hand-drawn Green SVG checkmark animation */}
              <div className="w-20 h-20 mb-8 relative">
                <svg
                  className="w-full h-full text-accent-emerald"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="26"
                    cy="26"
                    r="25"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="157"
                    strokeDashoffset="157"
                    className="origin-center animate-[draw-circle_0.8s_cubic-bezier(0.65,0,0.45,1)_forwards]"
                  />
                  <path
                    d="M14 27l8 8 16-16"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="48"
                    strokeDashoffset="48"
                    className="animate-[draw-tick_0.5s_cubic-bezier(0.65,0,0.45,1)_0.6s_forwards]"
                  />
                </svg>
                
                <style jsx global>{`
                  @keyframes draw-circle {
                    to {
                      stroke-dashoffset: 0;
                    }
                  }
                  @keyframes draw-tick {
                    to {
                      stroke-dashoffset: 0;
                    }
                  }
                `}</style>
              </div>

              <span className="text-xs font-mono tracking-[0.2em] text-accent-emerald uppercase mb-2 font-bold">
                交易已完成
              </span>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                付款已完成！
              </h3>
              
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                付款成功！系統已透過金流安全通道自動開立綠界電子發票。發票開立明細通知已同步發送至您的電子信箱。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Button variant="secondary" onClick={() => alert("明細下載中...發票編號: EC-42436074")}>
                  下載交易明細
                </Button>
                <Button variant="primary" onClick={onClose}>
                  進入控制台
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
