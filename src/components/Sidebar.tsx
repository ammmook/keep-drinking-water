import { useState } from 'react';
import type { Page, UserProfile } from '../types';
import { Home, Calendar, Settings as SettingsIcon, Droplet, Plus, X, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  onLogWater: () => void;
  profile: UserProfile;
  onUpdateGoal: (goalMl: number) => void;
  onClearData: () => void;
}

const navItems: { page: Page; icon: React.ReactNode; label: string }[] = [
  { page: 'home', icon: <Home size={20} />, label: 'Home' },
  { page: 'history', icon: <Calendar size={20} />, label: 'History' },
];

export default function Sidebar({ activePage, onPageChange, onLogWater, profile, onUpdateGoal, onClearData }: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [goalMl, setGoalMl] = useState(profile.dailyGoalMl);
  const [saved, setSaved] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleSaveGoal = () => {
    onUpdateGoal(goalMl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside style={{
        width: '240px',
        background: 'white',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(37, 99, 235, 0.04)',
      }} className="sidebar-desktop">
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 8px',
          marginBottom: '8px',
        }}>
          <Droplet size={28} color="#0EA5E9" strokeWidth={2.5} />
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0F172A, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
            }}>AquaFlow</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>Stay Hydrated</div>
          </div>
        </div>

        {/* Log Water Button */}
        <button
          onClick={onLogWater}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '15px',
            borderRadius: '14px',
            marginBottom: '28px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Plus size={18} /> Log Water
        </button>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onPageChange(item.page)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: activePage === item.page
                  ? '#F8FAFC'
                  : 'transparent',
                color: activePage === item.page ? '#0F172A' : '#64748B',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activePage === item.page ? 600 : 500,
                transition: 'all 0.2s ease',
                fontFamily: `'Google Sans', 'Outfit', sans-serif`,
                textAlign: 'left',
                border: activePage === item.page ? '1px solid #E2E8F0' : '1px solid transparent',
                boxShadow: activePage === item.page
                  ? '0 2px 8px rgba(15, 23, 42, 0.04)'
                  : 'none',
              }}
              onMouseEnter={(e) => {
                if (activePage !== item.page) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#F1F5F9';
                }
              }}
              onMouseLeave={(e) => {
                if (activePage !== item.page) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Settings gear at bottom */}
        <button
          onClick={() => { setShowSettings(true); setGoalMl(profile.dailyGoalMl); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '12px',
            border: 'none',
            background: 'transparent',
            color: '#94A3B8',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            fontFamily: `'Google Sans', 'Outfit', sans-serif`,
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#F1F5F9';
            (e.currentTarget as HTMLButtonElement).style.color = '#64748B';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8';
          }}
        >
          <SettingsIcon size={20} />
          <span>Settings</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #E2E8F0',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        zIndex: 100,
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.06)',
      }}>
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '6px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              opacity: activePage === item.page ? 1 : 0.5,
              transform: activePage === item.page ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s',
              color: activePage === item.page ? '#0F172A' : '#94A3B8',
            }}>{item.icon}</span>
            <span style={{
              fontSize: '10px',
              fontWeight: activePage === item.page ? 700 : 500,
              color: activePage === item.page ? '#0F172A' : '#94A3B8',
            }}>{item.label}</span>
          </button>
        ))}
        {/* Settings gear mobile */}
        <button
          onClick={() => { setShowSettings(true); setGoalMl(profile.dailyGoalMl); }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '6px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: '10px',
          }}
        >
          <SettingsIcon size={22} color="#94A3B8" style={{ opacity: 0.5 }} />
          <span style={{ fontSize: '10px', fontWeight: 500, color: '#94A3B8' }}>Settings</span>
        </button>
        {/* Floating Log Button on mobile */}
        <button
          onClick={onLogWater}
          style={{
            position: 'absolute',
            top: '-24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#0F172A',
            border: '4px solid white',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.2)',
          }}
        >
          <Plus size={24} />
        </button>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowSettings(false);
        }}>
          <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
                <SettingsIcon size={24} />
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B', margin: 0 }}>ตั้งค่า</h2>
              </div>
              <button onClick={() => setShowSettings(false)} style={{
                width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                background: '#F1F5F9', color: '#64748B', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><X size={18} /></button>
            </div>

            {/* Goal adjustment */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Droplet size={14} /> เป้าหมายประจำวัน
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '4px',
                background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0',
              }}>
                <button onClick={() => setGoalMl(Math.max(500, goalMl - 250))} style={{
                  width: '44px', height: '44px', borderRadius: '12px', border: 'none',
                  background: '#EFF6FF', color: '#2563EB', fontSize: '20px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>−</button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <span style={{
                    fontSize: '28px', fontWeight: 800,
                    color: '#0F172A',
                  }}>{goalMl.toLocaleString()}</span>
                  <span style={{ fontSize: '14px', color: '#94A3B8', marginLeft: '4px', fontWeight: 500 }}>ml</span>
                </div>
                <button onClick={() => setGoalMl(Math.min(5000, goalMl + 250))} style={{
                  width: '44px', height: '44px', borderRadius: '12px', border: 'none',
                  background: '#EFF6FF', color: '#2563EB', fontSize: '20px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>+</button>
              </div>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px', textAlign: 'center' }}>
                ≈ {Math.round(goalMl / 250)} แก้ว (250ml) • {Math.round(goalMl / 500)} ขวด (500ml)
              </p>
            </div>

            <button className="btn-primary" onClick={handleSaveGoal}
              disabled={goalMl === profile.dailyGoalMl}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px', marginBottom: '16px',
                opacity: goalMl === profile.dailyGoalMl ? 0.5 : 1,
                cursor: goalMl === profile.dailyGoalMl ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
              {saved ? <><CheckCircle size={18} /> บันทึกแล้ว!</> : 'บันทึกเป้าหมาย'}
            </button>

            {/* Danger zone */}
            <div style={{
              padding: '16px', borderRadius: '14px', border: '1px solid #FECACA',
              background: 'rgba(254, 242, 242, 0.5)', marginTop: '8px',
            }}>
              <p style={{ fontSize: '12px', color: '#92400E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} /> การลบข้อมูลจะไม่สามารถกู้คืนได้
              </p>
              {!showConfirmClear ? (
                <button onClick={() => setShowConfirmClear(true)} style={{
                  padding: '10px 20px', borderRadius: '10px', border: '1px solid #FECACA',
                  background: 'white', color: '#DC2626', fontWeight: 600, fontSize: '13px',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '6px'
                }}><Trash2 size={16} /> ลบข้อมูลทั้งหมด</button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { onClearData(); setShowConfirmClear(false); setShowSettings(false); }} style={{
                    padding: '10px 20px', borderRadius: '10px', border: 'none',
                    background: '#DC2626', color: 'white', fontWeight: 600, fontSize: '13px',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '6px'
                  }}><AlertTriangle size={16} /> ยืนยันลบ</button>
                  <button onClick={() => setShowConfirmClear(false)} className="btn-secondary" style={{ padding: '10px 16px' }}>
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
