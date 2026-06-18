

interface BottleSVGProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export default function BottleSVG({ size = 24, color = 'currentColor', className = '' }: BottleSVGProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M10 6v3c0 1-.5 1.5-1.5 2C7 11.5 6 13 6 15v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5c0-2-1-3.5-2.5-4C14.5 10.5 14 10 14 9V6" />
      <line x1="6" y1="14" x2="18" y2="14" opacity="0.4" />
    </svg>
  );
}
