import { useEffect, useState } from 'react';

interface WaterBottleProps {
  percentage: number;
  currentMl: number;
  goalMl: number;
  size?: 'small' | 'medium' | 'large';
}

export default function WaterBottle({ percentage, currentMl, goalMl, size = 'large' }: WaterBottleProps) {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const clampedPct = Math.min(percentage, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(clampedPct);
    }, 300);
    return () => clearTimeout(timer);
  }, [clampedPct]);

  const sizeConfig = {
    small: { width: 80, height: 140, fontSize: '14px', subSize: '10px' },
    medium: { width: 120, height: 200, fontSize: '22px', subSize: '12px' },
    large: { width: 160, height: 280, fontSize: '32px', subSize: '14px' },
  };

  const cfg = sizeConfig[size];
  const waterHeight = (animatedLevel / 100) * 150; // percentage of bottle body height (150)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg
        viewBox="0 0 120 220"
        width={cfg.width}
        height={cfg.height}
        style={{ filter: 'drop-shadow(0 8px 24px rgba(37, 99, 235, 0.15))' }}
      >
        <defs>
          <linearGradient id={`waterGrad-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id={`bottleGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <clipPath id={`bottleClip-${size}`}>
            {/* Bottle body rounded rect */}
            <rect x="25" y="50" width="70" height="150" rx="16" />
          </clipPath>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Bottle cap */}
        <rect x="42" y="20" width="36" height="14" rx="5" fill="#CBD5E1" />
        <rect x="38" y="32" width="44" height="12" rx="4" fill="#E2E8F0" />

        {/* Bottle neck */}
        <path d="M38 44 L38 52 Q38 54 36 54 L25 54 Q23 54 23 56 L23 58 Q23 60 25 60 L25 50" fill="none" />
        <path d="M82 44 L82 52 Q82 54 84 54 L95 54 Q97 54 97 56 L97 58 Q97 60 95 60 L95 50" fill="none" />

        {/* Bottle body outline */}
        <rect x="25" y="50" width="70" height="150" rx="16" fill={`url(#bottleGrad-${size})`} stroke="#CBD5E1" strokeWidth="1.5" />

        {/* Water fill (clipped to bottle) */}
        <g clipPath={`url(#bottleClip-${size})`}>
          {/* Water body */}
          <rect
            x="25"
            y={200 - waterHeight}
            width="70"
            height={waterHeight + 10}
            fill={`url(#waterGrad-${size})`}
            style={{
              transition: 'y 1s ease-out, height 1s ease-out',
            }}
          />
          {/* Wave 1 */}
          <ellipse
            cx="60"
            cy={200 - waterHeight}
            rx="38"
            ry="4"
            fill="#BAE6FD"
            opacity="0.6"
            style={{
              transition: 'cy 1s ease-out',
              animation: 'wave 3s ease-in-out infinite',
            }}
          />
          {/* Wave 2 */}
          <ellipse
            cx="60"
            cy={200 - waterHeight + 3}
            rx="36"
            ry="3"
            fill="#3B82F6"
            opacity="0.4"
            style={{
              transition: 'cy 1s ease-out',
              animation: 'wave2 2.5s ease-in-out infinite',
            }}
          />
          {/* Bubbles */}
          {animatedLevel > 10 && (
            <>
              <circle cx="45" cy={200 - waterHeight * 0.7} r="2" fill="rgba(255,255,255,0.5)" style={{ animation: 'float 2s ease-in-out infinite' }} />
              <circle cx="70" cy={200 - waterHeight * 0.5} r="1.5" fill="rgba(255,255,255,0.4)" style={{ animation: 'float 2.5s ease-in-out infinite 0.5s' }} />
              <circle cx="55" cy={200 - waterHeight * 0.9} r="1" fill="rgba(255,255,255,0.3)" style={{ animation: 'float 3s ease-in-out infinite 1s' }} />
            </>
          )}
        </g>

        {/* Highlight / reflection */}
        <rect x="30" y="55" width="8" height="80" rx="4" fill="rgba(255,255,255,0.3)" />

        {/* Measurement lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <g key={pct}>
            <line
              x1="87"
              y1={200 - pct * 150}
              x2="92"
              y2={200 - pct * 150}
              stroke="#94A3B8"
              strokeWidth="1"
              opacity="0.5"
            />
          </g>
        ))}
      </svg>

      {/* Percentage text */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: cfg.fontSize,
          fontWeight: 800,
          background: '#0F172A',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1,
        }}>
          {Math.round(percentage)}%
        </div>
        <div style={{
          fontSize: cfg.subSize,
          color: '#64748B',
          marginTop: '4px',
          fontWeight: 500,
        }}>
          {currentMl.toLocaleString()} / {goalMl.toLocaleString()} ml
        </div>
      </div>
    </div>
  );
}
