import React from 'react';

export default function PicsLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="80" height="80" rx="24" fill="#FFAEC9" transform="rotate(-10 48 60)" />
      <rect x="15" y="15" width="75" height="75" rx="22" fill="url(#paint0_linear)" />
      <path d="M25 60 L42 32 L56 52 L66 42 L78 62" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="paint0_linear" x1="52.5" y1="15" x2="52.5" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF4949" />
          <stop offset="1" stopColor="#FF1493" />
        </linearGradient>
      </defs>
    </svg>
  );
}
