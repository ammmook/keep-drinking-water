import { useState, useEffect } from 'react';
import WaterBottle from './WaterBottle';
import type { WaterLog, UserProfile } from '../types';

interface DashboardProps {
  profile: UserProfile;
  todayLogs: WaterLog[];
  dailyTotal: number;
  onLogWater: () => void;
  onDeleteLog: (id: string) => void;
  onQuickAdd: (amountMl: number) => void;
}

const typeIcons: Record<string, string> = {
  water: '💧',
  sweet: '🧃',
  other: '☕',
};

const typeLabels: Record<string, string> = {
  water: 'น้ำเปล่า',
  sweet: 'น้ำหวาน',
  other: 'อื่นๆ',
};

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${String(displayHour).padStart(2, '0')}:${m} ${period}`;
}

export default function Dashboard({ profile, todayLogs, dailyTotal, onLogWater, onDeleteLog, onQuickAdd }: DashboardProps) {
  const percentage = Math.round((dailyTotal / profile.dailyGoalMl) * 100);
  const goalReached = dailyTotal >= profile.dailyGoalMl;
  const [showCelebrate, setShowCelebrate] = useState(false);

  useEffect(() => {
    if (goalReached) {
      setShowCelebrate(true);
      const timer = setTimeout(() => setShowCelebrate(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [goalReached]);

  const quickAddButtons = [
    { ml: 250, icon: '🥤', label: '250ml' },
    { ml: 500, icon: '🧊', label: '500ml' },
    { ml: 1000, icon: '🫗', label: '1000ml' },
  ];

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
          }}>
            💧 Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
            {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={onLogWater}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>+</span> Log Water
        </button>
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
              fontSize: '32px',
              display: 'block',
              marginBottom: '4px',
            }} className={showCelebrate ? 'animate-celebrate' : ''}>
              {goalReached ? '😊' : '😢'}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Add */}
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
              ⚡ เพิ่มเร็ว
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {quickAddButtons.map((btn) => (
                <button
                  key={btn.ml}
                  onClick={() => onQuickAdd(btn.ml)}
                  style={{
                    padding: '16px 8px',
                    borderRadius: '14px',
                    border: '2px solid #E2E8F0',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'Inter, sans-serif',
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
                  <span style={{ fontSize: '24px' }}>{btn.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{btn.label}</span>
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
              📊 สรุปวันนี้
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
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>🥤 ครั้ง</div>
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
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>💧 รวม</div>
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
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>🎯 เป้าหมาย</div>
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
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>ml เหลือ</div>
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
          📋 บันทึกวันนี้
        </h3>

        {todayLogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#94A3B8',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏜️</div>
            <p style={{ fontSize: '14px' }}>ยังไม่มีบันทึก — เริ่มดื่มน้ำกันเลย!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayLogs.map((log, i) => (
              <div
                key={log.id}
                className="animate-fadeInUp"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid #F1F5F9',
                  animationDelay: `${i * 50}ms`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = '#EFF6FF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = '#F8FAFC';
                }}
              >
                <span style={{
                  fontSize: '28px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  flexShrink: 0,
                }}>
                  {typeIcons[log.type]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>
                    {log.amountMl}ml {typeLabels[log.type]}
                  </div>
                  {log.note && (
                    <div style={{
                      fontSize: '12px',
                      color: '#94A3B8',
                      marginTop: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {log.note}
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#94A3B8',
                  fontWeight: 500,
                  flexShrink: 0,
                }}>
                  {formatTime(log.time)}
                </div>
                <button
                  onClick={() => onDeleteLog(log.id)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: '#CBD5E1',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#EF4444';
                    (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#CBD5E1';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                  title="ลบ"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
