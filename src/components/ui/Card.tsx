import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "wireframe" | "doppelrand";
  outerClassName?: string;
  innerClassName?: string;
  glow?: boolean;
  tickColor?: string; // Border color class for corner L-brackets, e.g. "border-slate-900"
  borderColor?: string; // Border color class for the card body, e.g. "border-slate-200"
  squareCorners?: boolean; // If true, sets card border-radius to rounded-none
  floatTicks?: boolean; // If true, offsets the corner ticks outwards
}

export default function Card({
  children,
  variant = "wireframe",
  outerClassName = "",
  innerClassName = "",
  glow = false,
  tickColor = "border-slate-800",
  borderColor = "border-slate-200",
  squareCorners = false,
  floatTicks = false,
  ...props
}: CardProps) {
  if (variant === "wireframe") {
    const roundedClass = squareCorners ? "rounded-none" : "rounded-[4px]";
    const tickRoundClass = (squareCorners || floatTicks) ? "rounded-none" : "";
    
    // Normal offset is -1.5px (aligned to border). Floating offset is -6px.
    const offsetClassTL = floatTicks ? "-top-[6px] -left-[6px]" : "-top-[1.5px] -left-[1.5px]";
    const offsetClassTR = floatTicks ? "-top-[6px] -right-[6px]" : "-top-[1.5px] -right-[1.5px]";
    const offsetClassBL = floatTicks ? "-bottom-[6px] -left-[6px]" : "-bottom-[1.5px] -left-[1.5px]";
    const offsetClassBR = floatTicks ? "-bottom-[6px] -right-[6px]" : "-bottom-[1.5px] -right-[1.5px]";

    return (
      <div
        className={`relative bg-white border ${borderColor} ${roundedClass} p-5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] text-[#0f172a] shadow-[0_2px_8px_rgba(15,23,42,0.015)] ${outerClassName}`}
        {...props}
      >
        {/* Four Corner L-brackets */}
        {/* Top-Left */}
        <span className={`absolute w-2.5 h-2.5 border-t-2 border-l-2 ${tickColor} ${tickRoundClass ? tickRoundClass : "rounded-tl-[2px]"} ${offsetClassTL} ${floatTicks ? "animate-float-tl" : ""}`} />
        {/* Top-Right */}
        <span className={`absolute w-2.5 h-2.5 border-t-2 border-r-2 ${tickColor} ${tickRoundClass ? tickRoundClass : "rounded-tr-[2px]"} ${offsetClassTR} ${floatTicks ? "animate-float-tr" : ""}`} />
        {/* Bottom-Left */}
        <span className={`absolute w-2.5 h-2.5 border-b-2 border-l-2 ${tickColor} ${tickRoundClass ? tickRoundClass : "rounded-bl-[2px]"} ${offsetClassBL} ${floatTicks ? "animate-float-bl" : ""}`} />
        {/* Bottom-Right */}
        <span className={`absolute w-2.5 h-2.5 border-b-2 border-r-2 ${tickColor} ${tickRoundClass ? tickRoundClass : "rounded-br-[2px]"} ${offsetClassBR} ${floatTicks ? "animate-float-br" : ""}`} />

        <div className={`w-full h-full ${innerClassName}`}>
          {children}
        </div>
      </div>
    );
  }

  // Doppelrand / Double-Bezel nested architecture
  return (
    <div
      className={`group relative p-[6px] rounded-[24px] bg-black/[0.02] border border-black/[0.05] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        glow ? "hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] hover:border-black/[0.1]" : ""
      } ${outerClassName}`}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 -z-10 rounded-[24px] opacity-0 bg-gradient-to-tr from-accent-emerald/5 via-transparent to-accent-cyan/5 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
      )}
      
      <div
        className={`w-full h-full rounded-[18px] bg-white border border-black/[0.02] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9),0_2px_8px_rgba(15,23,42,0.02)] p-6 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] text-[#0f172a] ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
