import { useState, useRef, useEffect } from 'react';
import type { WaterLog } from '../types';
import { Pencil, Trash2 } from 'lucide-react';
import { typeLabels } from './utils';

interface VisualLogProps {
  log: WaterLog;
  onEdit: (log: WaterLog) => void;
  onDelete: (id: string) => void;
}

export default function VisualLog({ log, onEdit, onDelete }: VisualLogProps) {
  const [showMenu, setShowMenu] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); // Prevent default text selection
    pressTimer.current = setTimeout(() => {
      setShowMenu(true);
    }, 500); // 500ms long press
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

  // Max height limit
  const baseHeight = Math.min(140, Math.max(50, (log.amountMl / 250) * 60));
  const height = baseHeight;

  // Width depends on container type but is capped
  const isBottle = log.container === 'bottle';
  // Give it a max width so large amounts don't become fat blocks
  const maxWidth = isBottle ? 45 : 55;
  const width = Math.min(maxWidth, isBottle ? height * 0.45 : height * 0.65);

  // Colors with gradients
  const baseColor = log.type === 'water' ? '#38BDF8' :
    log.type === 'coffee' ? '#8B5CF6' :
      log.type === 'tea' ? '#10B981' :
        log.type === 'sweet' ? '#F59E0B' : '#64748B';

  const darkColor = log.type === 'water' ? '#0284C7' :
    log.type === 'coffee' ? '#5B21B6' :
      log.type === 'tea' ? '#047857' :
        log.type === 'sweet' ? '#B45309' : '#334155';

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
        gap: '8px',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        height: '180px', // Fixed height for the shelf slot
        padding: '0 4px',
        minWidth: '60px',
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
          marginBottom: '8px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 50,
          minWidth: '120px',
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
              gap: '8px',
              padding: '8px 12px',
              border: 'none',
              background: 'transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: '#334155',
              width: '100%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Pencil size={14} color="#3B82F6" /> แก้ไข
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
              gap: '8px',
              padding: '8px 12px',
              border: 'none',
              background: 'transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: '#EF4444',
              width: '100%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={14} /> ลบ
          </button>
        </div>
      )}

      {/* The Container Visual */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: `${width}px`,
        height: `${isBottle ? height * 1.15 : height}px`, // Add space for neck
      }}>

        {/* Bottle components */}
        {isBottle && (
          <>
            {/* Cap */}
            <div style={{
              width: '50%',
              height: '10%',
              background: 'linear-gradient(90deg, #94A3B8, #E2E8F0, #94A3B8)',
              borderRadius: '2px 2px 0 0',
              zIndex: 3,
            }} />
            {/* Neck */}
            <div style={{
              width: '40%',
              height: '10%',
              background: 'rgba(255, 255, 255, 0.4)',
              borderLeft: '2px solid rgba(255,255,255,0.7)',
              borderRight: '2px solid rgba(255,255,255,0.7)',
              zIndex: 2,
            }} />
          </>
        )}

        {/* Main Body */}
        <div style={{
          width: '100%',
          height: isBottle ? '80%' : '100%',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          borderTop: isBottle ? 'none' : '2px solid rgba(255, 255, 255, 0.5)',
          borderRadius: isBottle ? '8px 8px 12px 12px' : '4px 4px 16px 16px',
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.1)',
          boxShadow: 'inset 0 -4px 12px rgba(0,0,0,0.05), 0 8px 12px -4px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(2px)',
          clipPath: isBottle ? 'none' : 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)', // Flared glass shape
        }}>
          {/* Glass reflection rim */}
          {!isBottle && (
            <div style={{
              position: 'absolute',
              top: '-2px',
              left: 0,
              right: 0,
              height: '6px',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              zIndex: 5,
            }} />
          )}

          {/* The Liquid */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: isBottle ? '85%' : '90%', // Fill level
            background: `linear-gradient(180deg, ${baseColor} 0%, ${darkColor} 100%)`,
            opacity: 0.9,
            transition: 'height 0.5s ease-in-out',
            boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.3)',
          }}>
            {/* Liquid Surface */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'rgba(255, 255, 255, 0.4)',
            }} />

            {/* Liquid highlight (Glass curve) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '15%',
              width: '15%',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
              borderRadius: '50%',
            }} />
          </div>

          {/* Container highlight overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '5%',
            width: '20%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }} />
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>{log.amountMl}ml</span>
        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>{typeLabels[log.type] || 'อื่นๆ'}</span>
        <span style={{ fontSize: '9px', color: '#94A3B8' }}>{formatTime(log.time)}</span>
      </div>
    </div>
  );
}
