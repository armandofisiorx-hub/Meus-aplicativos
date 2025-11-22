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
    aria-label="PhysioFlow Logo"
  >
    <rect width="100" height="100" rx="24" className="fill-primary-600" />
    <path 
      d="M20 50h15l10-20 10 40 10-20h15" 
      stroke="white" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="80" cy="25" r="6" fill="white" className="opacity-80" />
  </svg>
);