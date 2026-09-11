import React from 'react';

interface VaaniLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VaaniLogo: React.FC<VaaniLogoProps> = ({
  className = '',
  showTagline = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Vaani Mark */}
      <div className={`${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="vaaniForestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#24523C" />
              <stop offset="100%" stopColor="#183B2B" />
            </linearGradient>
            <linearGradient id="vaaniTerracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DE795D" />
              <stop offset="100%" stopColor="#C85A3E" />
            </linearGradient>
          </defs>
          {/* Flowing hand & vocal resonance form */}
          <path
            d="M 38 6 C 39 3, 42 5, 41 10 C 39 17, 33 24, 29 32 C 26 37, 24 44, 27 50 C 30 56, 36 61, 44 63 C 33 63, 24 55, 20 45 C 16 35, 18 24, 24 15 C 28 10, 34 6, 38 6 Z"
            fill="url(#vaaniForestGrad)"
          />
          <path
            d="M 29 30 C 32 26, 36 23, 39 25 C 41 27, 40 31, 37 35 C 33 41, 32 47, 34 53 C 37 59, 42 64, 50 66 C 43 68, 35 66, 30 61 C 25 55, 24 46, 26 38 C 27 35, 28 32, 29 30 Z"
            fill="#183B2B"
            opacity="0.92"
          />
          <path
            d="M 43 7 C 44 10, 42 15, 41 18 C 39 22, 40 25, 43 26 C 45 27, 46 29, 45 31 C 43 33, 41 35, 42 37 C 43 39, 46 40, 44 44 C 42 48, 39 52, 38 57 C 41 51, 45 47, 48 41 C 51 35, 50 29, 48 24 C 47 19, 48 13, 45 8 C 44 6, 43 6, 43 7 Z"
            fill="url(#vaaniTerracottaGrad)"
          />
          {/* Sunlit gold spark / awareness accent */}
          <circle cx="53" cy="21" r="4.5" fill="#E5A93C" />
        </svg>
      </div>

      <div className="leading-tight">
        <span className={`font-serif ${titleSizes[size]} font-semibold tracking-tight text-forest dark:text-ivory block`}>
          Vaani
        </span>
        {showTagline && (
          <span className="block text-[9.5px] uppercase tracking-[0.22em] font-semibold text-[#5A6961] dark:text-[#A7A0AF] mt-0.5">
            Signs that Speak.
          </span>
        )}
      </div>
    </div>
  );
};
