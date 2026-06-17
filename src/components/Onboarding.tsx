import { useState } from 'react';
import type { UserProfile } from '../types';
import { Droplet, GlassWater, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const presets = [
  { label: '1.5L', value: 1500, icon: <GlassWater size={24} /> },
  { label: '2L', value: 2000, icon: <Droplet size={24} /> },
  { label: '2.5L', value: 2500, icon: <Droplet size={24} strokeWidth={2.5} /> },
  { label: '3L', value: 3000, icon: <Droplet size={24} fill="currentColor" /> },
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

  if (step === 1) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url("https://images.unsplash.com/photo-1550507992-eb63ffee0224?q=80&w=2000&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        textAlign: 'center',
      }}>
        <div className="animate-fadeInUp" style={{ maxWidth: '800px', padding: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-1px',
            marginBottom: '24px',
            lineHeight: 1.1,
          }}>
            Elevate Your Hydration.
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#E2E8F0',
            marginBottom: '48px',
            lineHeight: 1.6,
            fontWeight: 400,
            maxWidth: '600px',
            margin: '0 auto 48px auto',
          }}>
            Experience the clarity and vitality that comes with optimal hydration. 
            AquaFlow is designed to seamlessly integrate into your premium lifestyle.
          </p>
          <button
            onClick={() => setStep(2)}
            style={{
              background: 'white',
              color: '#0F172A',
              border: 'none',
              borderRadius: '30px',
              padding: '16px 40px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
            }}
          >
            Begin Your Journey <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#F8FAFC',
    }}>
      <div className="animate-scaleIn" style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px 40px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 12px 48px rgba(15, 23, 42, 0.08)',
        border: '1px solid #F1F5F9',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: '#0F172A' }}>
          <Droplet size={48} strokeWidth={1.5} />
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#0F172A',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}>
          Set Your Daily Goal
        </h2>
        <p style={{
          color: '#64748B',
          fontSize: '15px',
          marginBottom: '36px',
        }}>
          Choose a target that aligns with your lifestyle.
        </p>

        {/* Preset buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => setGoalMl(p.value)}
              style={{
                padding: '16px 8px',
                borderRadius: '16px',
                border: goalMl === p.value ? '2px solid #0F172A' : '1px solid #E2E8F0',
                background: goalMl === p.value ? '#F8FAFC' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                color: goalMl === p.value ? '#0F172A' : '#64748B',
              }}
            >
              <div style={{ color: goalMl === p.value ? '#0F172A' : '#94A3B8' }}>
                {p.icon}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: goalMl === p.value ? 600 : 500,
              }}>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px',
          padding: '8px',
          background: '#F8FAFC',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
        }}>
          <button
            onClick={() => setGoalMl(Math.max(500, goalMl - 250))}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              border: 'none',
              background: 'white',
              color: '#0F172A',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            }}
          >
            −
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0F172A',
            }}>
              {goalMl.toLocaleString()}
            </span>
            <span style={{
              fontSize: '15px',
              color: '#64748B',
              marginLeft: '6px',
              fontWeight: 500,
            }}>ml</span>
          </div>
          <button
            onClick={() => setGoalMl(Math.min(5000, goalMl + 250))}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              border: 'none',
              background: 'white',
              color: '#0F172A',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            }}
          >
            +
          </button>
        </div>

        <p style={{
          fontSize: '14px',
          color: '#94A3B8',
          marginBottom: '36px',
        }}>
          ≈ {Math.round(goalMl / 250)} glasses (250ml)
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
          Confirm Goal
        </button>

        <button
          onClick={() => setStep(1)}
          style={{
            marginTop: '20px',
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    </div>
  );
}
