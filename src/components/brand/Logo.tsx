import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Original SVG Mark: Two intersecting vertical frames with an anvil/spark diamond */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Base vertical film frame */}
          <rect
            x="4"
            y="6"
            width="18"
            height="24"
            rx="4"
            className="fill-slate-900 dark:fill-slate-100 opacity-90"
          />
          {/* Overlapping offset forged short frame */}
          <rect
            x="14"
            y="6"
            width="18"
            height="24"
            rx="4"
            className="fill-indigo-600 dark:fill-indigo-500 opacity-90"
          />
          {/* Film perforations */}
          <circle cx="8" cy="11" r="1.5" className="fill-white dark:fill-slate-900 opacity-80" />
          <circle cx="8" cy="25" r="1.5" className="fill-white dark:fill-slate-900 opacity-80" />
          <circle cx="28" cy="11" r="1.5" className="fill-white dark:fill-slate-900 opacity-80" />
          <circle cx="28" cy="25" r="1.5" className="fill-white dark:fill-slate-900 opacity-80" />
          {/* Central spark/cut glyph */}
          <path
            d="M18 13L20 18L25 18L21 21L23 26L18 22L13 26L15 21L11 18L16 18L18 13Z"
            className="fill-amber-400 dark:fill-amber-300"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold tracking-tight text-slate-900 dark:text-slate-100 ${textSizes[size]}`}>
          ClipForge <span className="text-indigo-600 dark:text-indigo-400 font-black">AI</span>
        </span>
      )}
    </div>
  );
};
