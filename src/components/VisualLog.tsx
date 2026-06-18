import { useState, useRef, useEffect } from 'react';
import type { WaterLog } from '../types';
import { Pencil, Trash2 } from 'lucide-react';
import { typeLabels } from './utils';

interface VisualLogProps {
  log: WaterLog;
  onEdit: (log: WaterLog) => void;
  onDelete: (id: string) => void;
}

// Liquid colors based on drink type
function getLiquidColors(type: string): { base: string; dark: string; surface: string; opacity: number } {
  switch (type) {
    case 'water':
      return {
        base: '#7DD3FC',    // Light sky blue
        dark: '#38BDF8',    // Deeper blue
        surface: 'rgba(255, 255, 255, 0.6)',
        opacity: 0.75,
      };
    case 'coffee':
      return {
        base: '#78350F',    // Dark brown
        dark: '#451A03',    // Very dark brown/black
        surface: 'rgba(180, 140, 100, 0.4)',
        opacity: 0.95,
      };
    case 'tea':
      return {
        base: '#D4A76A',    // Light transparent brown
        dark: '#A67B3D',    // Amber brown
        surface: 'rgba(255, 220, 170, 0.5)',
        opacity: 0.7,
      };
    case 'sweet':
      return {
        base: '#FB923C',    // Orange
        dark: '#EA580C',    // Deep orange
        surface: 'rgba(255, 200, 120, 0.5)',
        opacity: 0.85,
      };
    default: // 'other'
      return {
        base: '#E2E8F0',    // White/light gray
        dark: '#CBD5E1',    // Slightly darker
        surface: 'rgba(255, 255, 255, 0.7)',
        opacity: 0.6,
      };
  }
}

export default function VisualLog({ log, onEdit, onDelete }: VisualLogProps) {
  const [showMenu, setShowMenu] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    pressTimer.current = setTimeout(() => {
      setShowMenu(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handlePointerLeave = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Consistent glass dimensions — height scales with amount, width stays proportional
  const glassHeight = Math.min(110, Math.max(50, (log.amountMl / 250) * 55));
  const glassWidth = Math.min(52, Math.max(30, glassHeight * 0.55));

  // Fill percentage — more liquid = higher fill
  const fillPercent = Math.min(92, Math.max(25, (log.amountMl / 500) * 85));

  const liquid = getLiquidColors(log.type);

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '6px',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        height: '160px',
        padding: '0 3px',
        minWidth: '56px',
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
      }}
    >
      {/* Menu Modal */}
      {showMenu && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '6px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          zIndex: 50,
          minWidth: '110px',
          border: '1px solid #E2E8F0',
          animation: 'fadeInUp 0.2s ease-out'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(log);
              setShowMenu(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 10px',
              border: 'none',
              background: 'transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              color: '#334155',
              width: '100%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Pencil size={13} color="#3B82F6" /> แก้ไข
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(log.id);
              setShowMenu(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 10px',
              border: 'none',
              background: 'transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              color: '#EF4444',
              width: '100%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={13} /> ลบ
          </button>
        </div>
      )}

      {/* Glass Container — consistent shape for ALL drink types */}
      <div style={{
        position: 'relative',
        width: `${glassWidth}px`,
        height: `${glassHeight}px`,
      }}>
        {/* Glass body — SVG for consistent tapered glass shape */}
        <svg
          viewBox="0 0 60 80"
          width={glassWidth}
          height={glassHeight}
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Clip path for the glass interior */}
            <clipPath id={`glass-clip-${log.id}`}>
              <path d="M6,2 L54,2 Q52,78 46,78 L14,78 Q8,78 6,2 Z" />
            </clipPath>

            {/* Liquid gradient */}
            <linearGradient id={`liquid-grad-${log.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={liquid.base} />
              <stop offset="100%" stopColor={liquid.dark} />
            </linearGradient>

            {/* Glass highlight gradient */}
            <linearGradient id={`glass-shine-${log.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Glass outline — tapered shape wider at top, narrower at bottom */}
          <path
            d="M5,1 L55,1 Q53,79 45,79 L15,79 Q7,79 5,1 Z"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Glass interior background (transparent/empty) */}
          <path
            d="M6,2 L54,2 Q52,78 46,78 L14,78 Q8,78 6,2 Z"
            fill="rgba(240, 248, 255, 0.3)"
          />

          {/* Liquid fill — clipped to glass interior */}
          <g clipPath={`url(#glass-clip-${log.id})`}>
            <rect
              x="0"
              y={80 - (80 * fillPercent / 100)}
              width="60"
              height={80 * fillPercent / 100}
              fill={`url(#liquid-grad-${log.id})`}
              opacity={liquid.opacity}
            />

            {/* Liquid surface line */}
            <rect
              x="6"
              y={80 - (80 * fillPercent / 100)}
              width="48"
              height="3"
              fill={liquid.surface}
              rx="1.5"
            />

            {/* Tiny bubbles for water / sweet drinks */}
            {(log.type === 'water' || log.type === 'sweet') && (
              <>
                <circle cx="20" cy={80 - (80 * fillPercent / 100) + 15} r="1.5" fill="rgba(255,255,255,0.5)" />
                <circle cx="35" cy={80 - (80 * fillPercent / 100) + 25} r="1" fill="rgba(255,255,255,0.4)" />
                <circle cx="28" cy={80 - (80 * fillPercent / 100) + 35} r="1.8" fill="rgba(255,255,255,0.35)" />
              </>
            )}

            {/* Coffee crema layer */}
            {log.type === 'coffee' && (
              <rect
                x="6"
                y={80 - (80 * fillPercent / 100)}
                width="48"
                height="6"
                fill="#A67B3D"
                opacity="0.7"
                rx="2"
              />
            )}
          </g>

          {/* Glass highlight/reflection on the left side */}
          <path
            d="M12,4 L18,4 Q16,76 14,76 L10,76 Q8,76 12,4 Z"
            fill={`url(#glass-shine-${log.id})`}
            opacity="0.6"
          />

          {/* Glass rim at top */}
          <ellipse cx="30" cy="2" rx="25" ry="2.5" fill="rgba(255,255,255,0.8)" stroke="#CBD5E1" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E293B' }}>{log.amountMl}ml</span>
        <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 500 }}>{typeLabels[log.type] || 'อื่นๆ'}</span>
        <span style={{ fontSize: '8px', color: '#94A3B8' }}>{formatTime(log.time)}</span>
      </div>
    </div>
  );
}
