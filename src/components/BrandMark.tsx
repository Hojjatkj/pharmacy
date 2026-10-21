import React, { useId } from 'react';

interface BrandMarkProps {
  size?: number;
  className?: string;
}

export default function BrandMark({
  size = 44,
  className = '',
}: BrandMarkProps) {
  const gradientId = `pharmart-mark-${useId().replace(/:/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="PharmArt"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="6" y1="4" x2="42" y2="44">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="14"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M15 36V12H26C32 12 35 15.3 35 20.5C35 25.7 31.7 29 26 29H20"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 30V36"
        stroke="#D1FAE5"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="35" cy="35" r="4" fill="#CCFBF1" />
    </svg>
  );
}
