import React from "react";
import { getCardType } from "../utils/validators";

interface VirtualCardProps {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
  isFlipped: boolean;
}

export default function VirtualCard({
  cardNumber = "",
  cardName = "",
  expiry = "",
  cvc = "",
  isFlipped = false,
}: VirtualCardProps) {
  const cardType = getCardType(cardNumber);
  const displayCardNumber = cardNumber.padEnd(19, "•"); // 16 digits + 3 spaces formatted
  const displayExpiry = expiry || "MM/YY";
  const displayCardName = cardName || "持卡人姓名";
  const displayCVC = cvc || "•••";

  return (
    <div className="w-full max-w-[380px] aspect-[1.586/1] mx-auto perspective-1000 mb-8 font-mono">
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of the Card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-[20px] p-6 text-white flex flex-col justify-between overflow-hidden border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] bg-gradient-to-br from-[#0c1b12]/95 via-[#0e301b]/90 to-[#030704]/95">
          {/* Futuristic Glowing Orbs inside the card */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-accent-emerald/10 blur-2xl -z-10 pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-accent-blue/10 blur-2xl -z-10 pointer-events-none" />

          {/* Card Header: Chip and Network Logo */}
          <div className="flex justify-between items-start">
            {/* Metallic Smart Chip */}
            <div className="w-10 h-8 rounded-md bg-gradient-to-r from-yellow-600/40 via-yellow-400/30 to-yellow-600/40 border border-yellow-500/20 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-x-2 inset-y-1 border-r border-b border-yellow-500/10" />
              <div className="absolute inset-x-4 inset-y-2 border-l border-t border-yellow-500/10" />
            </div>

            {/* Network Logo */}
            <div className="h-6 flex items-center transition-all duration-300">
              {cardType === "visa" && (
                <span className="text-xl font-bold tracking-tight text-blue-400 italic">
                  VISA
                </span>
              )}
              {cardType === "mastercard" && (
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-red-500/80" />
                  <div className="w-6 h-6 rounded-full bg-yellow-500/80" />
                </div>
              )}
              {cardType === "unknown" && (
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  NETWORK
                </span>
              )}
            </div>
          </div>

          {/* Premium Minimalist Center Emblem */}
          <div className="flex flex-col items-center justify-center flex-1 my-4">
            <span className="text-[10px] tracking-[0.35em] text-white/30 uppercase font-bold">
              FINAI PLATINUM
            </span>
          </div>

          {/* Clean Front Footer */}
          <div className="flex justify-between items-end text-[9px] text-white/20 tracking-wider">
            <span>SECURE SYSTEM</span>
            <span>CLASS A-1</span>
          </div>
        </div>

        {/* Back of the Card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[20px] py-4 text-white flex flex-col justify-between overflow-hidden border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] bg-gradient-to-br from-[#030704]/95 via-[#0e2215]/90 to-[#050906]/95">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-accent-blue/10 blur-2xl -z-10 pointer-events-none" />

          {/* Magnetic Strip */}
          <div className="w-full h-10 bg-black/80 mt-1" />

          {/* Card Details container (Card Number) */}
          <div className="px-6 mt-3">
            <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-0.5">
              Card Number
            </span>
            <div className="text-lg font-semibold tracking-[0.12em] text-white/95 text-left select-all">
              {displayCardNumber}
            </div>
          </div>

          {/* Signature & CVC Container */}
          <div className="px-6 flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-wider text-white/30">
                Authorized Signature
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/30 mr-4">
                CVC
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Signature panel */}
              <div className="flex-1 h-7 bg-white/10 rounded-sm skew-x-3 flex items-center px-3 border border-white/5">
                <span className="text-[10px] italic font-sans text-white/30 tracking-widest pointer-events-none select-none">
                  Secure AI Terminal
                </span>
              </div>
              {/* CVC panel */}
              <div className="w-12 h-7 bg-white text-black rounded-sm flex items-center justify-center font-bold text-xs shadow-inner">
                {displayCVC}
              </div>
            </div>
          </div>

          {/* Back Footer: Holder Name, Expiry & secure info */}
          <div className="px-6 flex justify-between items-end mt-2 pt-2 border-t border-white/5">
            <div className="flex flex-col max-w-[65%]">
              <span className="text-[9px] uppercase tracking-wider text-white/30">
                Cardholder
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase truncate text-white/90">
                {displayCardName}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase tracking-wider text-white/30">
                Expires
              </span>
              <span className="text-xs font-semibold tracking-wide text-white/90">
                {displayExpiry}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
