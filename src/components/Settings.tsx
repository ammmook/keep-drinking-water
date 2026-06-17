import { useState } from 'react';
import type { UserProfile } from '../types';
import { Settings as SettingsIcon, Target, User, Calendar, AlertTriangle, Trash2, CheckCircle, Save } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onUpdateGoal: (newGoalMl: number) => void;
  onClearData: () => void;
}

export default function Settings({ profile, onUpdateGoal, onClearData }: SettingsProps) {
  const [goalMl, setGoalMl] = useState(profile.dailyGoalMl);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveGoal = () => {
    onUpdateGoal(goalMl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    onClearData();
    setShowConfirm(false);
  };

  return (
    <div className="animate-fadeIn" style={{ padding: '28px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SettingsIcon size={28} color="#0F172A" /> ตั้งค่า
        </h1>
      </div>

      {/* Goal Setting */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#1E293B',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Target size={18} color="#0F172A" /> เป้าหมายประจำวัน
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          padding: '4px',
          background: '#F8FAFC',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
        }}>
          <button
            onClick={() => setGoalMl(Math.max(500, goalMl - 250))}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              background: '#EFF6FF',
              color: '#2563EB',
              fontSize: '22px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >−</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#0F172A',
            }}>{goalMl.toLocaleString()}</span>
            <span style={{ fontSize: '16px', color: '#94A3B8', marginLeft: '4px', fontWeight: 500 }}>ml</span>
          </div>
          <button
            onClick={() => setGoalMl(Math.min(5000, goalMl + 250))}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              background: '#EFF6FF',
              color: '#2563EB',
              fontSize: '22px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >+</button>
        </div>

        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px', textAlign: 'center' }}>
          ≈ {Math.round(goalMl / 250)} แก้ว (250ml) • {Math.round(goalMl / 500)} ขวด (500ml)
        </p>

        <button
          className="btn-primary"
          onClick={handleSaveGoal}
          disabled={goalMl === profile.dailyGoalMl}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            opacity: goalMl === profile.dailyGoalMl ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {saved ? <><CheckCircle size={18} /> บันทึกแล้ว!</> : <><Save size={18} /> บันทึกเป้าหมาย</>}
        </button>
      </div>

      {/* Account info */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#1E293B',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <User size={18} color="#0F172A" /> ข้อมูลบัญชี
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: '#F8FAFC',
            borderRadius: '12px',
          }}>
            <span style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> เริ่มใช้งาน</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
              {new Date(profile.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: '#F8FAFC',
            borderRadius: '12px',
          }}>
            <span style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={14} /> เป้าหมายปัจจุบัน</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB' }}>
              {profile.dailyGoalMl.toLocaleString()} ml/วัน
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{
        padding: '28px',
        borderRadius: '20px',
        border: '1px solid #FECACA',
        background: 'rgba(254, 242, 242, 0.5)',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#DC2626',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertTriangle size={18} color="#DC2626" /> โซนอันตราย
        </h3>
        <p style={{ fontSize: '13px', color: '#92400E', marginBottom: '16px' }}>
          การลบข้อมูลจะไม่สามารถกู้คืนได้
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1.5px solid #FECACA',
              background: 'white',
              color: '#DC2626',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Trash2 size={16} /> ลบข้อมูลทั้งหมด
          </button>
        ) : (
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}>
            <button
              onClick={handleClear}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: '#DC2626',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={16} /> ยืนยันลบ
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="btn-secondary"
            >
              ยกเลิก
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
