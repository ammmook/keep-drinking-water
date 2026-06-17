import { useMemo } from 'react';
import type { UserProfile, WaterLog } from '../types';

interface StatisticsProps {
  profile: UserProfile;
  logs: WaterLog[];
  getStreak: () => number;
  getTotalDaysTracked: () => number;
  getGoalCompletionRate: () => number;
  getDailyTotalsForMonth: (year: number, month: number) => { date: string; total: number }[];
}

const dayLabels = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

export default function Statistics({
  profile,
  logs,
  getStreak,
  getTotalDaysTracked,
  getGoalCompletionRate,
  getDailyTotalsForMonth,
}: StatisticsProps) {
  const totalVolume = useMemo(() => logs.reduce((sum, l) => sum + l.amountMl, 0), [logs]);
  const totalDays = getTotalDaysTracked();
  const dailyAverage = totalDays > 0 ? Math.round(totalVolume / totalDays) : 0;
  const streak = getStreak();
  const completionRate = getGoalCompletionRate();

  // This week's data
  const weekData = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const result: { day: string; total: number; date: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const total = logs.filter(l => l.date === dateStr).reduce((sum, l) => sum + l.amountMl, 0);
      result.push({ day: dayLabels[i], total, date: dateStr });
    }
    return result;
  }, [logs]);

  const maxWeekly = Math.max(...weekData.map(d => d.total), profile.dailyGoalMl);

  // Peak hydration times
  const peakTimes = useMemo(() => {
    const buckets = { morning: 0, afternoon: 0, evening: 0 };
    let total = 0;
    logs.forEach(l => {
      const hour = parseInt(l.time.split(':')[0]);
      total += l.amountMl;
      if (hour < 12) buckets.morning += l.amountMl;
      else if (hour < 18) buckets.afternoon += l.amountMl;
      else buckets.evening += l.amountMl;
    });
    return [
      { label: 'เช้า', icon: '🌅', value: buckets.morning, pct: total > 0 ? Math.round((buckets.morning / total) * 100) : 0 },
      { label: 'บ่าย', icon: '☀️', value: buckets.afternoon, pct: total > 0 ? Math.round((buckets.afternoon / total) * 100) : 0 },
      { label: 'เย็น', icon: '🌙', value: buckets.evening, pct: total > 0 ? Math.round((buckets.evening / total) * 100) : 0 },
    ];
  }, [logs]);

  // Type breakdown
  const typeBreakdown = useMemo(() => {
    const types = { water: 0, sweet: 0, other: 0 };
    logs.forEach(l => { types[l.type] += l.amountMl; });
    const total = types.water + types.sweet + types.other;
    return [
      { label: 'น้ำเปล่า', icon: '💧', value: types.water, pct: total > 0 ? Math.round((types.water / total) * 100) : 0, color: '#3B82F6' },
      { label: 'น้ำหวาน', icon: '🧃', value: types.sweet, pct: total > 0 ? Math.round((types.sweet / total) * 100) : 0, color: '#F59E0B' },
      { label: 'อื่นๆ', icon: '☕', value: types.other, pct: total > 0 ? Math.round((types.other / total) * 100) : 0, color: '#8B5CF6' },
    ];
  }, [logs]);

  const statCard = (icon: string, value: string, label: string, color: string) => (
    <div className="glass-card" style={{
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn" style={{ padding: '28px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
          📈 สถิติ
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
          ติดตามพัฒนาการการดื่มน้ำของคุณ
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }} className="stats-grid">
        {statCard('💧', `${(totalVolume / 1000).toFixed(1)}L`, 'รวมทั้งหมด', '#EFF6FF')}
        {statCard('📊', `${(dailyAverage / 1000).toFixed(1)}L`, 'เฉลี่ยต่อวัน', '#F0F9FF')}
        {statCard('🎯', `${completionRate}%`, 'ถึงเป้าหมาย', '#ECFDF5')}
        {statCard('🔥', `${streak}`, 'วันติดต่อกัน', '#FEF3C7')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }} className="stats-detail-grid">
        {/* Weekly Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '20px' }}>
            📊 สัปดาห์นี้
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px',
            height: '160px',
          }}>
            {weekData.map((d) => {
              const pct = maxWeekly > 0 ? (d.total / maxWeekly) * 100 : 0;
              const goalPct = d.total / profile.dailyGoalMl;
              const isToday = d.date === new Date().toISOString().split('T')[0];
              return (
                <div key={d.day} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}>
                  {d.total > 0 && (
                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                      {d.total}
                    </span>
                  )}
                  <div style={{
                    width: '100%',
                    maxWidth: '36px',
                    height: `${Math.max(pct, 3)}%`,
                    background: goalPct >= 1
                      ? 'linear-gradient(to top, #22C55E, #4ADE80)'
                      : d.total > 0
                        ? 'linear-gradient(to top, #2563EB, #60A5FA)'
                        : '#E2E8F0',
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 0.5s ease',
                    minHeight: d.total > 0 ? '8px' : '4px',
                    boxShadow: isToday ? '0 0 0 2px #2563EB' : 'none',
                  }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? '#2563EB' : '#94A3B8',
                  }}>{d.day}</span>
                </div>
              );
            })}
          </div>
          {/* Goal line hint */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '12px',
            fontSize: '11px',
            color: '#94A3B8',
            justifyContent: 'center',
          }}>
            🎯 เป้าหมาย: {profile.dailyGoalMl.toLocaleString()} ml/วัน
          </div>
        </div>

        {/* Peak Times + Type breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Peak Times */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '16px' }}>
              ⏰ ช่วงเวลาดื่ม
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {peakTimes.map((t) => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px', width: '28px' }}>{t.icon}</span>
                  <span style={{ fontSize: '13px', color: '#475569', width: '36px', fontWeight: 500 }}>{t.label}</span>
                  <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${t.pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', width: '36px', textAlign: 'right' }}>{t.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type breakdown */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '16px' }}>
              🥤 ประเภทเครื่องดื่ม
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {typeBreakdown.map((t) => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px', width: '28px' }}>{t.icon}</span>
                  <span style={{ fontSize: '13px', color: '#475569', width: '50px', fontWeight: 500 }}>{t.label}</span>
                  <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${t.pct}%`,
                      height: '100%',
                      background: t.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: t.color, width: '36px', textAlign: 'right' }}>{t.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stats-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
