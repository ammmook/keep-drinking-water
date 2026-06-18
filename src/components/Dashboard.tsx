import { useState, useEffect, useRef, useCallback } from 'react';
import WaterBottle from './WaterBottle';
import type { WaterLog, UserProfile, QuickPreset } from '../types';
import { Droplet, List, Smile, Frown, Inbox, Settings2 } from 'lucide-react';
import ManagePresetsModal from './ManagePresetsModal';
import VisualLog from './VisualLog';
import { getPresetIcon } from './utils';

interface DashboardProps {
  profile: UserProfile;
  todayLogs: WaterLog[];
  dailyTotal: number;
  presets: QuickPreset[];
  onAddPreset: (preset: Omit<QuickPreset, 'id'>) => void;
  onEditPreset: (id: string, preset: Partial<QuickPreset>) => void;
  onDeletePreset: (id: string) => void;
  onDeleteLog: (id: string) => void;
  onEditLog: (id: string, updates: Partial<Omit<WaterLog, 'id'>>) => void;
  onQuickAdd: (preset: QuickPreset) => void;
}

export default function Dashboard({ profile, todayLogs, dailyTotal, presets, onAddPreset, onEditPreset, onDeletePreset, onDeleteLog, onEditLog, onQuickAdd }: DashboardProps) {
  const percentage = Math.round((dailyTotal / profile.dailyGoalMl) * 100);
  const goalReached = dailyTotal >= profile.dailyGoalMl;
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [showManagePresets, setShowManagePresets] = useState(false);
  const [pressedPresetId, setPressedPresetId] = useState<string | null>(null);
  const prevGoalReached = useRef(goalReached);

  useEffect(() => {
    if (goalReached && !prevGoalReached.current) {
      setShowCelebrate(true);
      const timer = setTimeout(() => setShowCelebrate(false), 1500);
      return () => clearTimeout(timer);
    }
    prevGoalReached.current = goalReached;
  }, [goalReached]);

  const handleQuickAdd = useCallback((preset: QuickPreset, e: React.MouseEvent<HTMLButtonElement>) => {
    // Create ripple
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);

    // Trigger pressed animation
    setPressedPresetId(preset.id);

    setTimeout(() => {
      ripple.remove();
      setPressedPresetId(null);
    }, 600);

    onQuickAdd(preset);
  }, [onQuickAdd]);

  return (
    <div className="animate-fadeIn" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#1E293B',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Droplet size={24} color="#0EA5E9" strokeWidth={2.5} /> Dashboard
          </h1>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main content: Bottle + Quick Add */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px',
      }} className="dashboard-grid">
        {/* Water Bottle Card */}
        <div className="glass-card" style={{
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '340px',
        }}>
          <WaterBottle
            percentage={percentage}
            currentMl={dailyTotal}
            goalMl={profile.dailyGoalMl}
            size="large"
          />

          {/* Emoji Feedback */}
          <div style={{
            marginTop: '14px',
            textAlign: 'center',
            padding: '10px 18px',
            borderRadius: '14px',
            background: goalReached
              ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
              : 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: goalReached
              ? '1px solid #A7F3D0'
              : '1px solid #FCD34D',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px',
              color: goalReached ? '#059669' : '#D97706',
            }} className={showCelebrate ? 'animate-celebrate' : ''}>
              {goalReached ? <Smile size={26} /> : <Frown size={26} />}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: goalReached ? '#065F46' : '#92400E',
            }}>
              {goalReached ? 'วันนี้ทำได้ดีมาก!' : 'อยากกินน้ำอีกจังเลย'}
            </span>
          </div>
        </div>

        {/* Right column: Quick Add */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="dashboard-right">
          {/* Quick Add */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                ⚡ เพิ่มเร็ว
              </h3>
              <button
                onClick={() => setShowManagePresets(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                <Settings2 size={13} /> จัดการ
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(72px, 1fr))', gap: '8px' }}>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  className={`quick-add-btn${pressedPresetId === preset.id ? ' pressed' : ''}`}
                  onClick={(e) => handleQuickAdd(preset, e)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '22px' }}>
                    {getPresetIcon(preset.icon, 20)}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>{preset.amountMl}ml</span>
                  <span style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 500 }}>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Logs */}
      <div className="glass-card" style={{ padding: '18px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#1E293B',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <List size={16} color="#0F172A" /> บันทึกวันนี้
          {todayLogs.length > 0 && (
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#94A3B8',
              marginLeft: '4px',
            }}>
              ({todayLogs.length} ครั้ง · {(dailyTotal / 1000).toFixed(1)}L)
            </span>
          )}
        </h3>

        {todayLogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '30px 16px',
            color: '#94A3B8',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: '#CBD5E1' }}>
              <Inbox size={40} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '13px' }}>ยังไม่มีบันทึก — เริ่มดื่มน้ำกันเลย!</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px',
            overflowX: 'auto',
            padding: '8px 4px 24px 4px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}>
            {todayLogs.map((log) => (
              <div key={log.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                <VisualLog
                  log={log}
                  onEdit={(log) => {
                    const newAmount = window.prompt(`แก้ไขปริมาณน้ำสำหรับบันทึกนี้ (ml):`, log.amountMl.toString());
                    if (newAmount && !isNaN(Number(newAmount))) {
                      onEditLog(log.id, { amountMl: Number(newAmount) });
                    }
                  }}
                  onDelete={onDeleteLog}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ManagePresetsModal
        isOpen={showManagePresets}
        onClose={() => setShowManagePresets(false)}
        presets={presets}
        onAdd={onAddPreset}
        onEdit={onEditPreset}
        onDelete={onDeletePreset}
      />
    </div>
  );
}
