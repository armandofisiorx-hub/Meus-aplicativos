import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Logo Evolução Eletrônica"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    
    {/* Background Shape */}
    <rect width="100" height="100" rx="22" fill="url(#logoGradient)" />
    
    {/* Pulse Line */}
    <path 
      d="M15 50 H25 L35 25 L50 75 L65 35 L75 50 H85" 
      stroke="white" 
      strokeWidth="7" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Small accent dot */}
    <circle cx="85" cy="30" r="4" fill="white" fillOpacity="0.8" />
  </svg>
);