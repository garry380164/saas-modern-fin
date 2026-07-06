import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  showArrow?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  showArrow = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle =
    "group relative inline-flex items-center justify-center rounded-full px-6 py-3 font-sans text-base font-semibold tracking-wide transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white hover:shadow-[0_10px_25px_rgba(15,23,42,0.15)]",
    secondary:
      "bg-black/[0.04] text-[#0f172a] border border-black/[0.06] hover:bg-black/[0.08] hover:border-black/[0.1]",
    ghost:
      "bg-transparent text-slate-600 hover:text-[#0f172a] hover:bg-black/[0.04]",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {showArrow && (
          <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 dark:bg-black/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 group-hover:bg-white/20 dark:group-hover:bg-black/20">
            <svg
              className="h-3 w-3 stroke-current"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </span>
    </button>
  );
}
