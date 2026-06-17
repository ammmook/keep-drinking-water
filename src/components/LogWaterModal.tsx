import { useState } from 'react';
import { Droplet, Coffee, CupSoda, GlassWater, Calendar, Clock, Ruler, X, FileText, Container, CheckCircle } from 'lucide-react';

interface LogWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: {
    date: string;
    time: string;
    amountMl: number;
    unit: 'ml' | 'glass' | 'bottle';
    type: 'water' | 'sweet' | 'other';
    note?: string;
  }) => void;
}

const volumePresets = [
  { label: '250ml', value: 250, icon: <GlassWater size={20} /> },
  { label: '500ml', value: 500, icon: <Droplet size={20} /> },
  { label: '1000ml', value: 1000, icon: <Droplet size={20} fill="currentColor" /> },
];

const unitOptions: { value: 'ml' | 'glass' | 'bottle'; icon: React.ReactNode; label: string }[] = [
  { value: 'ml', icon: <Droplet size={16} />, label: 'ml' },
  { value: 'glass', icon: <GlassWater size={16} />, label: 'แก้ว' },
  { value: 'bottle', icon: <Container size={16} />, label: 'ขวด' },
];

const typeOptions: { value: 'water' | 'sweet' | 'other'; icon: React.ReactNode; label: string }[] = [
  { value: 'water', icon: <Droplet size={16} />, label: 'น้ำเปล่า' },
  { value: 'sweet', icon: <CupSoda size={16} />, label: 'น้ำหวาน' },
  { value: 'other', icon: <Coffee size={16} />, label: 'อื่นๆ' },
];

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function LogWaterModal({ isOpen, onClose, onSave }: LogWaterModalProps) {
  const [date, setDate] = useState(getToday());
  const [time, setTime] = useState(getNow());
  const [amount, setAmount] = useState(250);
  const [unit, setUnit] = useState<'ml' | 'glass' | 'bottle'>('ml');
  const [type, setType] = useState<'water' | 'sweet' | 'other'>('water');
  const [note, setNote] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  if (!isOpen) return null;

  const getAmountMl = (): number => {
    const baseAmount = customAmount ? parseInt(customAmount) || 0 : amount;
    if (unit === 'glass') return baseAmount * 250;
    if (unit === 'bottle') return baseAmount * 500;
    return baseAmount;
  };

  const handleSave = () => {
    const amountMl = getAmountMl();
    if (amountMl <= 0) return;
    onSave({ date, time, amountMl, unit, type, note: note || undefined });
    // Reset form
    setDate(getToday());
    setTime(getNow());
    setAmount(250);
    setUnit('ml');
    setType('water');
    setNote('');
    setCustomAmount('');
    onClose();
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748B',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1.5px solid #E2E8F0',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    color: '#1E293B',
    background: '#F8FAFC',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Droplet size={28} color="#0EA5E9" />
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#1E293B',
              margin: 0,
            }}>บันทึกการดื่มน้ำ</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              background: '#F1F5F9',
              color: '#64748B',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            justifyContent: 'center',
          }}
          ><X size={18} /></button>
        </div>

        {/* Date & Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}><Calendar size={14} /> วันที่</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={getToday()}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}><Clock size={14} /> เวลา</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Volume Presets */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}><Ruler size={14} /> ปริมาณ</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
            {volumePresets.map((p) => (
              <button
                key={p.value}
                onClick={() => { setAmount(p.value); setCustomAmount(''); setUnit('ml'); }}
                style={{
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: amount === p.value && !customAmount && unit === 'ml'
                    ? '2px solid #2563EB'
                    : '2px solid #E2E8F0',
                  background: amount === p.value && !customAmount && unit === 'ml'
                    ? '#EFF6FF'
                    : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px' }}>{p.icon}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: amount === p.value && !customAmount && unit === 'ml' ? '#2563EB' : '#64748B',
                }}>{p.label}</span>
              </button>
            ))}
          </div>
          {/* Custom amount */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="กรอกจำนวน..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              style={{
                ...inputStyle,
                flex: 1,
              }}
              onFocus={() => setCustomAmount(customAmount || '')}
            />
          </div>
        </div>

        {/* Unit */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}><Ruler size={14} /> หน่วย</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {unitOptions.map((u) => (
              <button
                key={u.value}
                onClick={() => setUnit(u.value)}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: unit === u.value ? '2px solid #2563EB' : '2px solid #E2E8F0',
                  background: unit === u.value ? '#EFF6FF' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{u.icon}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: unit === u.value ? '#2563EB' : '#64748B',
                }}>{u.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}><CupSoda size={14} /> ประเภท</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {typeOptions.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: type === t.value ? '2px solid #2563EB' : '2px solid #E2E8F0',
                  background: type === t.value ? '#EFF6FF' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.icon}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: type === t.value ? '#2563EB' : '#64748B',
                }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}><FileText size={14} /> หมายเหตุ</label>
          <input
            type="text"
            placeholder="รายละเอียดเพิ่มเติม..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Preview */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>ปริมาณที่บันทึก</span>
          <span style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#2563EB',
          }}>
            {getAmountMl().toLocaleString()} ml
          </span>
        </div>

        {/* Save button */}
        <button
          className="btn-primary"
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={18} /> บันทึก
        </button>
      </div>
    </div>
  );
}
