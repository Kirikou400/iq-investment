import React from "react";

interface IqLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export function IqLogo({ className = "", size = "md", showTagline = false }: IqLogoProps) {
  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  const subSizes = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Authentic IQ Mark Icon */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-[0_2px_12px_rgba(255,184,0,0.4)]"
          aria-label="IQ Investment Logo"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE600" />
              <stop offset="50%" stopColor="#FFB800" />
              <stop offset="100%" stopColor="#E69500" />
            </linearGradient>
            <linearGradient id="greenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C853" />
              <stop offset="100%" stopColor="#00E676" />
            </linearGradient>
          </defs>

          {/* Letter 'I' */}
          <rect x="6" y="16" width="16" height="68" rx="3" fill="url(#goldGrad)" />

          {/* Letter 'Q' outer ring */}
          <path
            d="M 60 16 C 40 16 26 30 26 50 C 26 70 40 84 60 84 C 66 84 72 82 77 78 L 84 86 C 86 88 89 87 89 84 L 89 74 C 92 67 94 59 94 50 C 94 30 80 16 60 16 Z"
            fill="url(#goldGrad)"
          />

          {/* Letter 'Q' inner cut */}
          <ellipse cx="60" cy="50" rx="20" ry="22" fill="#060e0a" />

          {/* Green 3-Bar Chart inside the Q */}
          <rect x="49" y="52" width="6.5" height="15" rx="1.5" fill="url(#greenGrad)" />
          <rect x="58" y="44" width="6.5" height="23" rx="1.5" fill="url(#greenGrad)" />
          <rect x="67" y="34" width="6.5" height="33" rx="1.5" fill="url(#greenGrad)" />

          {/* Rising Green Arrow */}
          <path
            d="M 46 64 L 72 32 M 72 32 L 62 31 M 72 32 L 73 42"
            stroke="url(#greenGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-black tracking-tighter text-white ${titleSizes[size]}`}>
            <span className="text-[#FFB800] drop-shadow-[0_0_12px_rgba(255,184,0,0.4)]">IQ</span>{" "}
            INVESTMENT
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black uppercase tracking-[0.2em] text-[#00E676] drop-shadow-[0_0_8px_rgba(0,230,118,0.3)] ${subSizes[size]}`}
          >
            INVESTMENT PLAN
          </span>
          {showTagline && (
            <span className="hidden text-[10px] text-slate-400 sm:inline">
              · Invest Today, Grow Tomorrow!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
