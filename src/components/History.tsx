import { useState, useMemo, useId } from 'react';
import type { ViewMode, WaterLog, UserProfile } from '../types';
import { Droplet, Calendar as CalendarIcon, BarChart2, TrendingUp, Trash2, Smile, Frown, Moon, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { getLogIcon, typeLabels } from './utils';

interface HistoryProps {
  profile: UserProfile;
  getLogsByDate: (date: string) => WaterLog[];
  getDailyTotal: (date: string) => number;
  getDailyTotalsForMonth: (year: number, month: number) => { date: string; total: number }[];
  getMonthlyTotalsForYear: (year: number) => { month: number; total: number }[];
  onDeleteLog: (id: string) => void;
}


const monthNamesFull = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const monthNamesShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ===== Mini Bottle SVG ===== */
function MiniBottle({ percentage, label, subLabel, size = 'medium', onClick, isSelected, goalReached }: {
  percentage: number;
  label: string;
  subLabel?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  isSelected?: boolean;
  goalReached?: boolean;
}) {
  const uid = useId();
  const clampedPct = Math.min(Math.max(percentage, 0), 100);
  const sizeConfig = {
    small: { w: 36, h: 56, fontSize: '9px', subFontSize: '7px', labelGap: '3px' },
    medium: { w: 52, h: 80, fontSize: '11px', subFontSize: '9px', labelGap: '5px' },
    large: { w: 72, h: 110, fontSize: '14px', subFontSize: '11px', labelGap: '6px' },
  };
  const cfg = sizeConfig[size];
  const waterH = (clampedPct / 100) * 48; // Max height is 48

  const waterColor = goalReached
    ? { top: '#4ADE80', mid: '#22C55E', bot: '#16A34A' }
    : clampedPct > 0
      ? { top: '#93C5FD', mid: '#3B82F6', bot: '#2563EB' }
      : { top: '#E2E8F0', mid: '#CBD5E1', bot: '#CBD5E1' };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: cfg.labelGap,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
        filter: isSelected ? 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.25))' : 'none',
      }}
    >
      <svg viewBox="0 0 40 70" width={cfg.w} height={cfg.h}>
        <defs>
          <linearGradient id={`wg-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={waterColor.top} />
            <stop offset="100%" stopColor={waterColor.bot} />
          </linearGradient>
          <clipPath id={`bc-${uid}`}>
            <rect x="6" y="16" width="28" height="48" rx="6" />
          </clipPath>
        </defs>
        {/* Cap */}
        <rect x="14" y="4" width="12" height="5" rx="2" fill="#CBD5E1" />
        <rect x="12" y="9" width="16" height="4" rx="1.5" fill="#E2E8F0" />
        {/* Bottle body */}
        <rect x="6" y="16" width="28" height="48" rx="6" fill="#F1F5F9" stroke={isSelected ? '#2563EB' : '#E2E8F0'} strokeWidth={isSelected ? '1.5' : '0.8'} />
        {/* Water */}
        <g clipPath={`url(#bc-${uid})`}>
          <rect x="6" y={64 - waterH} width="28" height={waterH + 2} fill={`url(#wg-${uid})`}>
            <animate attributeName="y" from={66} to={64 - waterH} dur="0.8s" fill="freeze" />
            <animate attributeName="height" from={0} to={waterH + 2} dur="0.8s" fill="freeze" />
          </rect>
          {clampedPct > 5 && (
            <ellipse cx="20" cy={64 - waterH + 1} rx="15" ry="2" fill={waterColor.top} opacity="0.5">
              <animate attributeName="cy" from={66} to={64 - waterH + 1} dur="0.8s" fill="freeze" />
            </ellipse>
          )}
        </g>
        {/* Shine */}
        <rect x="9" y="19" width="3" height="24" rx="1.5" fill="rgba(255,255,255,0.4)" />
        {/* Percentage text */}
        {clampedPct > 0 && (
          <text x="20" y="44" textAnchor="middle" fontSize="8" fontWeight="700" fill={clampedPct > 50 ? 'white' : '#64748B'}>
            {Math.round(clampedPct)}%
          </text>
        )}
      </svg>
      <span style={{
        fontSize: cfg.fontSize,
        fontWeight: isSelected ? 700 : 600,
        color: isSelected ? '#2563EB' : '#475569',
        lineHeight: 1.1,
        textAlign: 'center',
      }}>{label}</span>
      {subLabel && (
        <span style={{
          fontSize: cfg.subFontSize,
          color: '#94A3B8',
          fontWeight: 500,
          lineHeight: 1.1,
        }}>{subLabel}</span>
      )}
    </div>
  );
}

export default function History({
  profile,
  getLogsByDate,
  getDailyTotal,
  getDailyTotalsForMonth,
  getMonthlyTotalsForYear,
  onDeleteLog,
}: HistoryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  // Calendar days for the month
  const calendarWeeks = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    // Pad to complete week
    while (days.length % 7 !== 0) days.push(null);

    const weeks: (number | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [selectedYear, selectedMonth]);

  const monthlyData = useMemo(() => getDailyTotalsForMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth, getDailyTotalsForMonth]);
  const yearlyData = useMemo(() => getMonthlyTotalsForYear(selectedYear), [selectedYear, getMonthlyTotalsForYear]);
  const selectedLogs = useMemo(() => getLogsByDate(selectedDate), [selectedDate, getLogsByDate]);
  const selectedTotal = getDailyTotal(selectedDate);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 24px',
    borderRadius: '10px',
    border: 'none',
    background: active ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : 'transparent',
    color: active ? 'white' : '#64748B',
    fontWeight: active ? 600 : 500,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: `'Google Sans', 'Outfit', sans-serif`,
    boxShadow: active ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
  });

  const navBtnStyle: React.CSSProperties = {
    border: 'none',
    background: '#EFF6FF',
    color: '#2563EB',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  };

  const prevMonth = () => {
    if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  return (
    <div className="animate-fadeIn" style={{ padding: '28px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={28} color="#0F172A" /> ประวัติการดื่มน้ำ
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
          ดูย้อนหลังการดื่มน้ำของคุณ
        </p>
      </div>

      {/* View Tabs */}
      <div style={{
        display: 'inline-flex',
        gap: '4px',
        padding: '4px',
        background: '#F1F5F9',
        borderRadius: '14px',
        marginBottom: '24px',
      }}>
        {(['day', 'month', 'year'] as ViewMode[]).map((mode) => (
          <button key={mode} onClick={() => setViewMode(mode)} style={{ ...tabStyle(viewMode === mode), display: 'flex', alignItems: 'center', gap: '6px' }}>
            {mode === 'day' ? <><CalendarIcon size={16} /> รายวัน</> : mode === 'month' ? <><BarChart2 size={16} /> รายเดือน</> : <><TrendingUp size={16} /> รายปี</>}
          </button>
        ))}
      </div>

      {/* ==================== DAY VIEW ==================== */}
      {viewMode === 'day' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="history-grid">
          {/* Left: Bottle calendar */}
          <div className="glass-card" style={{ padding: '24px' }}>
            {/* Month navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button onClick={prevMonth} style={navBtnStyle}><ChevronLeft size={20} /></button>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>
                {monthNamesFull[selectedMonth - 1]} {selectedYear + 543}
              </span>
              <button onClick={nextMonth} style={navBtnStyle}><ChevronRight size={20} /></button>
            </div>

            {/* Day names header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
              {dayNames.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '10px', color: '#94A3B8', fontWeight: 600, padding: '4px' }}>{d}</div>
              ))}
            </div>

            {/* Bottle grid — each day is a mini bottle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {calendarWeeks.map((week, wi) => (
                <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', justifyItems: 'center' }}>
                  {week.map((day, di) => {
                    if (day === null) return <div key={`e-${wi}-${di}`} />;
                    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const total = getDailyTotal(dateStr);
                    const pct = (total / profile.dailyGoalMl) * 100;
                    const isSelected = dateStr === selectedDate;
                    return (
                      <MiniBottle
                        key={day}
                        percentage={pct}
                        label={`${day}`}
                        size="small"
                        onClick={() => setSelectedDate(dateStr)}
                        isSelected={isSelected}
                        goalReached={pct >= 100}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', justifyContent: 'center', fontSize: '10px', color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'linear-gradient(to bottom, #93C5FD, #2563EB)' }} /> ไม่ถึงเป้า
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'linear-gradient(to bottom, #4ADE80, #16A34A)' }} /> ถึงเป้าหมาย
              </span>
            </div>
          </div>

          {/* Right: Selected day details */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>

              {/* Big bottle for selected day */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                <MiniBottle
                  percentage={(selectedTotal / profile.dailyGoalMl) * 100}
                  label={`${selectedTotal.toLocaleString()} ml`}
                  subLabel={`/ ${profile.dailyGoalMl.toLocaleString()} ml`}
                  size="large"
                  goalReached={selectedTotal >= profile.dailyGoalMl}
                />
              </div>

              {/* Emoji feedback */}
              <div style={{
                textAlign: 'center',
                padding: '10px 16px',
                borderRadius: '12px',
                background: selectedTotal >= profile.dailyGoalMl
                  ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
                  : selectedTotal > 0
                    ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
                    : '#F8FAFC',
                border: selectedTotal >= profile.dailyGoalMl
                  ? '1px solid #A7F3D0'
                  : selectedTotal > 0
                    ? '1px solid #FCD34D'
                    : '1px solid #E2E8F0',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '24px', display: 'flex', justifyContent: 'center' }}>
                  {selectedTotal >= profile.dailyGoalMl ? <Smile size={32} color="#059669" /> : selectedTotal > 0 ? <Frown size={32} color="#D97706" /> : <Moon size={32} color="#94A3B8" />}
                </span>
                <span style={{
                  fontSize: '12px', fontWeight: 600, marginLeft: '8px',
                  color: selectedTotal >= profile.dailyGoalMl ? '#065F46' : selectedTotal > 0 ? '#92400E' : '#94A3B8',
                }}>
                  {selectedTotal >= profile.dailyGoalMl
                    ? 'วันนี้ทำได้ดีมาก!'
                    : selectedTotal > 0
                      ? 'อยากกินน้ำอีกจังเลย'
                      : 'ยังไม่มีบันทึก'}
                </span>
              </div>
            </div>

            {/* Log list */}
            {selectedLogs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                {selectedLogs.map((log) => (
                  <div key={log.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', fontSize: '13px',
                  }}>
                    <span style={{ fontSize: '18px', display: 'flex' }}>{getLogIcon(log.type, log.container, 18)}</span>
                    <span style={{ fontWeight: 600, color: '#1E293B', flex: 1 }}>{log.amountMl}ml {typeLabels[log.type] || 'อื่นๆ'}</span>
                    {log.note && <span style={{ color: '#94A3B8', fontSize: '11px', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.note}</span>}
                    <span style={{ color: '#94A3B8', fontSize: '11px', flexShrink: 0 }}>{log.time}</span>
                    <button onClick={() => onDeleteLog(log.id)} style={{
                      border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px',
                      color: '#CBD5E1', padding: '4px', flexShrink: 0,
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#CBD5E1'; }}
                    ><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== MONTH VIEW ==================== */}
      {viewMode === 'month' && (
        <div className="glass-card" style={{ padding: '28px' }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <button onClick={prevMonth} style={navBtnStyle}><ChevronLeft size={20} /></button>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>
              {monthNamesFull[selectedMonth - 1]} {selectedYear + 543}
            </span>
            <button onClick={nextMonth} style={navBtnStyle}><ChevronRight size={20} /></button>
          </div>

          {/* Bottles grid — each day as a bottle */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
            gap: '10px',
            justifyItems: 'center',
          }}>
            {monthlyData.map((d, i) => {
              const day = i + 1;
              const pct = (d.total / profile.dailyGoalMl) * 100;
              return (
                <MiniBottle
                  key={d.date}
                  percentage={pct}
                  label={`${day}`}
                  subLabel={d.total > 0 ? `${d.total}ml` : ''}
                  size="medium"
                  goalReached={pct >= 100}
                  onClick={() => { setSelectedDate(d.date); setViewMode('day'); }}
                />
              );
            })}
          </div>

          {/* Summary */}
          <div style={{
            display: 'flex', gap: '16px', marginTop: '24px', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {(() => {
              const totalMl = monthlyData.reduce((s, d) => s + d.total, 0);
              const daysWithData = monthlyData.filter(d => d.total > 0).length;
              const daysGoalReached = monthlyData.filter(d => d.total >= profile.dailyGoalMl).length;
              return (
                <>
                  <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB' }}>{(totalMl / 1000).toFixed(1)}L</div>
                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}><Droplet size={12} /> รวมทั้งเดือน</div>
                  </div>
                  <div style={{ background: '#F0F9FF', borderRadius: '12px', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0EA5E9' }}>{daysWithData > 0 ? Math.round(totalMl / daysWithData) : 0}ml</div>
                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}><BarChart2 size={12} /> เฉลี่ย/วัน</div>
                  </div>
                  <div style={{ background: '#ECFDF5', borderRadius: '12px', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>{daysGoalReached}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}><Target size={12} /> วันถึงเป้า</div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', justifyContent: 'center', fontSize: '11px', color: '#94A3B8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(to bottom, #93C5FD, #2563EB)' }} /> ไม่ถึงเป้า
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(to bottom, #4ADE80, #16A34A)' }} /> ถึงเป้าหมาย
            </span>
          </div>
        </div>
      )}

      {/* ==================== YEAR VIEW ==================== */}
      {viewMode === 'year' && (
        <div className="glass-card" style={{ padding: '28px' }}>
          {/* Year navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <button onClick={() => setSelectedYear(y => y - 1)} style={navBtnStyle}><ChevronLeft size={20} /></button>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>
              ปี {selectedYear + 543}
            </span>
            <button onClick={() => setSelectedYear(y => y + 1)} style={navBtnStyle}><ChevronRight size={20} /></button>
          </div>

          {/* 12 months as large bottles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '16px',
            justifyItems: 'center',
          }} className="year-grid">
            {yearlyData.map((d) => {
              // For yearly view, compare monthly total vs (goal * days in month)
              const daysInMonth = new Date(selectedYear, d.month, 0).getDate();
              const monthGoal = profile.dailyGoalMl * daysInMonth;
              const pct = monthGoal > 0 ? (d.total / monthGoal) * 100 : 0;
              return (
                <MiniBottle
                  key={d.month}
                  percentage={pct}
                  label={monthNamesShort[d.month - 1]}
                  subLabel={d.total > 0 ? `${(d.total / 1000).toFixed(1)}L` : '—'}
                  size="large"
                  goalReached={pct >= 100}
                  onClick={() => { setSelectedMonth(d.month); setViewMode('month'); }}
                />
              );
            })}
          </div>

          {/* Yearly summary */}
          <div style={{
            display: 'flex', gap: '16px', marginTop: '28px', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {(() => {
              const totalMl = yearlyData.reduce((s, d) => s + d.total, 0);
              const monthsWithData = yearlyData.filter(d => d.total > 0).length;
              return (
                <>
                  <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '14px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB' }}>{(totalMl / 1000).toFixed(1)}L</div>
                    <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}><Droplet size={14} /> รวมทั้งปี</div>
                  </div>
                  <div style={{ background: '#F0F9FF', borderRadius: '12px', padding: '14px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0EA5E9' }}>{monthsWithData > 0 ? (totalMl / monthsWithData / 1000).toFixed(1) : 0}L</div>
                    <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}><BarChart2 size={14} /> เฉลี่ย/เดือน</div>
                  </div>
                  <div style={{ background: '#ECFDF5', borderRadius: '12px', padding: '14px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>{monthsWithData}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}><CalendarIcon size={14} /> เดือนที่มีข้อมูล</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .history-grid {
            grid-template-columns: 1fr !important;
          }
          .year-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .year-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
