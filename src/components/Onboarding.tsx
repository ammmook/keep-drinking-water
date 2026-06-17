import { useState } from 'react';
import type { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const presets = [
  { label: '1.5L', value: 1500, icon: '🥤' },
  { label: '2L', value: 2000, icon: '💧' },
  { label: '2.5L', value: 2500, icon: '🚰' },
  { label: '3L', value: 3000, icon: '🌊' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [goalMl, setGoalMl] = useState(2000);
  const [step, setStep] = useState<1 | 2>(1);

  const handleStart = () => {
    onComplete({
      dailyGoalMl: goalMl,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 30%, #BFDBFE 60%, #93C5FD 100%)',
    }}>
      <div className="animate-scaleIn" style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        padding: '48px 40px',
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 24px 64px rgba(37, 99, 235, 0.15), 0 8px 24px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
      }}>
        {step === 1 ? (
          <>
            {/* Welcome */}
            <div style={{ fontSize: '72px', marginBottom: '16px', animation: 'dropBounce 0.8s ease-out' }}>
              💧
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}>
              AquaFlow
            </h1>
            <p style={{
              color: '#64748B',
              fontSize: '15px',
              marginBottom: '36px',
              lineHeight: 1.6,
            }}>
              เริ่มต้นดูแลสุขภาพ<br />ด้วยการดื่มน้ำให้เพียงพอทุกวัน
            </p>
            <button
              className="btn-primary"
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                borderRadius: '16px',
              }}
            >
              เริ่มต้นใช้งาน 🚀
            </button>
          </>
        ) : (
          <>
            {/* Goal setting */}
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'dropBounce 0.6s ease-out' }}>
              🎯
            </div>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: '8px',
            }}>
              ตั้งเป้าหมายประจำวัน
            </h2>
            <p style={{
              color: '#64748B',
              fontSize: '14px',
              marginBottom: '28px',
            }}>
              เลือกปริมาณน้ำที่ต้องการดื่มต่อวัน
            </p>

            {/* Preset buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '24px',
            }}>
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setGoalMl(p.value)}
                  style={{
                    padding: '14px 8px',
                    borderRadius: '16px',
                    border: goalMl === p.value ? '2px solid #2563EB' : '2px solid #E2E8F0',
                    background: goalMl === p.value ? '#EFF6FF' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{p.icon}</span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: goalMl === p.value ? '#2563EB' : '#64748B',
                  }}>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Custom input */}
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
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  fontSize: '20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                −
              </button>
              <div style={{
                flex: 1,
                textAlign: 'center',
              }}>
                <span style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {goalMl.toLocaleString()}
                </span>
                <span style={{
                  fontSize: '14px',
                  color: '#94A3B8',
                  marginLeft: '4px',
                  fontWeight: 500,
                }}>ml</span>
              </div>
              <button
                onClick={() => setGoalMl(Math.min(5000, goalMl + 250))}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  fontSize: '20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>

            {/* Glasses equivalent */}
            <p style={{
              fontSize: '13px',
              color: '#94A3B8',
              marginBottom: '28px',
            }}>
              ≈ {Math.round(goalMl / 250)} แก้ว (250ml) • {Math.round(goalMl / 500)} ขวด (500ml)
            </p>

            <button
              className="btn-primary"
              onClick={handleStart}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                borderRadius: '16px',
              }}
            >
              ยืนยันเป้าหมาย ✨
            </button>

            <button
              onClick={() => setStep(1)}
              style={{
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ← ย้อนกลับ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
