import { useState, useEffect } from 'react';
import WaterBottle from './WaterBottle';
import type { WaterLog, UserProfile, QuickPreset } from '../types';
import { Droplet, Coffee, CupSoda, Plus, Trash2, BarChart2, List, Smile, Frown, Inbox, GlassWater, Target, CircleCheck, Package, Settings2 } from 'lucide-react';
import BottleSVG from './icons/BottleSVG';
import ManagePresetsModal from './ManagePresetsModal';
import VisualLog from './VisualLog';

interface DashboardProps {
  profile: UserProfile;
  todayLogs: WaterLog[];
  dailyTotal: number;
  presets: QuickPreset[];
  onAddPreset: (preset: Omit<QuickPreset, 'id'>) => void;
  onEditPreset: (id: string, preset: Partial<QuickPreset>) => void;
  onDeletePreset: (id: string) => void;
  onLogWater: () => void;
  onDeleteLog: (id: string) => void;
  onEditLog: (id: string, updates: Partial<Omit<WaterLog, 'id'>>) => void;
  onQuickAdd: (preset: QuickPreset) => void;
}

export function getLogIcon(type: string, container: string, size = 20): React.ReactNode {
  if (type === 'coffee') return <Coffee size={size} color="#8B5CF6" />;
  if (type === 'tea') return <Coffee size={size} color="#10B981" />;
  if (type === 'sweet') return <CupSoda size={size} color="#F59E0B" />;
  
  if (container === 'glass') return <GlassWater size={size} color="#0EA5E9" />;
  if (container === 'bottle') return <BottleSVG size={size} color="#0EA5E9" />;
  if (container === 'none') return <Package size={size} color="#64748B" />;
  return <Droplet size={size} color="#0EA5E9" />;
}

export function getPresetIcon(iconName: string, size = 24): React.ReactNode {
  if (iconName === 'glass') return <GlassWater size={size} color="#64748B" />;
  if (iconName === 'bottle') return <BottleSVG size={size} color="#64748B" />;
  return <Droplet size={size} color="#64748B" />;
}

export const typeLabels: Record<string, string> = {
  water: 'น้ำเปล่า',
  sweet: 'น้ำหวาน',
  coffee: 'กาแฟ',
  tea: 'ชา',
  other: 'อื่นๆ',
};

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${String(displayHour).padStart(2, '0')}:${m} ${period}`;
}

export default function Dashboard({ profile, todayLogs, dailyTotal, presets, onAddPreset, onEditPreset, onDeletePreset, onLogWater, onDeleteLog, onEditLog, onQuickAdd }: DashboardProps) {
  const percentage = Math.round((dailyTotal / profile.dailyGoalMl) * 100);
  const goalReached = dailyTotal >= profile.dailyGoalMl;
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [showManagePresets, setShowManagePresets] = useState(false);

  useEffect(() => {
    if (goalReached) {
      setShowCelebrate(true);
      const timer = setTimeout(() => setShowCelebrate(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [goalReached]);

  return (
    <div className="animate-fadeIn" style={{ padding: '28px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#1E293B',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Droplet size={28} color="#0EA5E9" strokeWidth={2.5} /> Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
            {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main content: Bottle + Quick Add */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px',
      }} className="dashboard-grid">
        {/* Water Bottle Card */}
        <div className="glass-card" style={{
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}>
          <WaterBottle
            percentage={percentage}
            currentMl={dailyTotal}
            goalMl={profile.dailyGoalMl}
            size="large"
          />

          {/* Emoji Feedback */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            padding: '14px 24px',
            borderRadius: '16px',
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
              marginBottom: '8px',
              color: goalReached ? '#059669' : '#D97706',
            }} className={showCelebrate ? 'animate-celebrate' : ''}>
              {goalReached ? <Smile size={32} /> : <Frown size={32} />}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: goalReached ? '#065F46' : '#92400E',
            }}>
              {goalReached ? 'วันนี้ทำได้ดีมาก!' : 'อยากกินน้ำอีกจังเลย'}
            </span>
          </div>
        </div>

        {/* Right column: Quick Add + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="dashboard-right">
          {/* Quick Add */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                <Settings2 size={14} /> จัดการ
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px' }}>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onQuickAdd(preset)}
                  style={{
                    padding: '16px 8px',
                    borderRadius: '14px',
                    border: '2px solid #E2E8F0',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '6px',
                    fontFamily: `'Google Sans', 'Outfit', sans-serif`,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#3B82F6';
                    (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#E2E8F0';
                    (e.currentTarget as HTMLButtonElement).style.background = 'white';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px' }}>
                    {getPresetIcon(preset.icon)}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{preset.amountMl}ml</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Volume selector (type) */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <BarChart2 size={18} color="#0F172A" /> สรุปวันนี้
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{
                background: '#EFF6FF',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563EB' }}>
                  {todayLogs.length}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><GlassWater size={12} /> ครั้ง</div>
              </div>
              <div style={{
                background: '#EFF6FF',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563EB' }}>
                  {(dailyTotal / 1000).toFixed(1)}L
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Droplet size={12} /> รวม</div>
              </div>
              <div style={{
                background: percentage >= 100 ? '#ECFDF5' : '#FEF3C7',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: percentage >= 100 ? '#059669' : '#D97706',
                }}>
                  {percentage}%
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Target size={12} /> เป้าหมาย</div>
              </div>
              <div style={{
                background: '#F0F9FF',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0EA5E9' }}>
                  {Math.max(0, profile.dailyGoalMl - dailyTotal).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><CircleCheck size={12} /> ml เหลือ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Logs */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#1E293B',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <List size={18} color="#0F172A" /> บันทึกวันนี้
        </h3>

        {todayLogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#94A3B8',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#CBD5E1' }}>
              <Inbox size={48} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '14px' }}>ยังไม่มีบันทึก — เริ่มดื่มน้ำกันเลย!</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            overflowX: 'auto',
            padding: '16px 8px 32px 8px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}>
            {todayLogs.map((log, i) => (
              <div key={log.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                <VisualLog
                  log={log}
                  onEdit={(log) => {
                    // For now, since LogWaterModal handles adding, editing might need a separate flow or we pass it to a special edit state.
                    // Let's implement a simple prompt for amount edit, or if the user wants full edit, we could open the LogWaterModal in edit mode.
                    // The instruction says "ถ้ากดค้าง จะให้เลือกว่า ลบหรือแก้ไข"
                    // Wait, we need to pass the updated data to onEditLog.
                    // Let's just ask the user for the new amount via a simple prompt for now, or just let them delete and re-add.
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

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            display: flex !important;
            flex-direction: column-reverse !important;
          }
        }
      `}</style>
    </div>
  );
}
