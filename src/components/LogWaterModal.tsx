import { useState } from 'react';
import { Droplet, Coffee, CupSoda, GlassWater, Calendar, Clock, Ruler, X, FileText, Container, CheckCircle, Package } from 'lucide-react';

interface LogWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: {
    date: string;
    time: string;
    amountMl: number;
    unit: 'ml' | 'l';
    container: 'glass' | 'bottle' | 'none';
    type: 'water' | 'sweet' | 'coffee' | 'tea' | 'other';
    note?: string;
  }) => void;
}

const unitOptions: { value: 'ml' | 'l'; label: string }[] = [
  { value: 'ml', label: 'มิลลิลิตร (ml)' },
  { value: 'l', label: 'ลิตร (L)' },
];

const containerOptions: { value: 'glass' | 'bottle' | 'none'; icon: React.ReactNode; label: string }[] = [
  { value: 'glass', icon: <GlassWater size={16} />, label: 'แก้ว' },
  { value: 'bottle', icon: <Container size={16} />, label: 'ขวด' },
  { value: 'none', icon: <Package size={16} />, label: 'อื่นๆ' },
];

const typeOptions: { value: 'water' | 'sweet' | 'coffee' | 'tea' | 'other'; icon: React.ReactNode; label: string }[] = [
  { value: 'water', icon: <Droplet size={16} />, label: 'น้ำเปล่า' },
  { value: 'sweet', icon: <CupSoda size={16} />, label: 'น้ำหวาน' },
  { value: 'coffee', icon: <Coffee size={16} />, label: 'กาแฟ' },
  { value: 'tea', icon: <Coffee size={16} />, label: 'ชา' },
  { value: 'other', icon: <Droplet size={16} />, label: 'อื่นๆ' },
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
  const [amount, setAmount] = useState('250');
  const [unit, setUnit] = useState<'ml' | 'l'>('ml');
  const [container, setContainer] = useState<'glass' | 'bottle' | 'none'>('glass');
  const [type, setType] = useState<'water' | 'sweet' | 'coffee' | 'tea' | 'other'>('water');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const getAmountMl = (): number => {
    const baseAmount = parseFloat(amount) || 0;
    if (unit === 'l') return baseAmount * 1000;
    return baseAmount;
  };

  const handleSave = () => {
    const amountMl = getAmountMl();
    if (amountMl <= 0) return;
    onSave({ date, time, amountMl, unit, container, type, note: note || undefined });
    // Reset form
    setDate(getToday());
    setTime(getNow());
    setAmount('250');
    setUnit('ml');
    setContainer('glass');
    setType('water');
    setNote('');
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
    fontFamily: `'Google Sans', 'Outfit', sans-serif`,
    color: '#1E293B',
    background: '#F8FAFC',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
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
            }}>บันทึกการดื่ม</h2>
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

        {/* Volume & Unit */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}><Ruler size={14} /> ปริมาณ</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="number"
              placeholder="กรอกปริมาณ..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ ...inputStyle, flex: 2 }}
            />
            <div style={{ flex: 1, display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
              {unitOptions.map(u => (
                <button
                  key={u.value}
                  onClick={() => setUnit(u.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: unit === u.value ? 'white' : 'transparent',
                    borderRadius: '8px',
                    boxShadow: unit === u.value ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: unit === u.value ? 700 : 500,
                    color: unit === u.value ? '#0F172A' : '#64748B',
                    fontFamily: `'Google Sans', 'Outfit', sans-serif`,
                    transition: 'all 0.2s',
                  }}
                >
                  {u.value.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Container */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}><Container size={14} /> ภาชนะ</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {containerOptions.map((c) => (
              <button
                key={c.value}
                onClick={() => setContainer(c.value)}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: container === c.value ? '2px solid #2563EB' : '2px solid #E2E8F0',
                  background: container === c.value ? '#EFF6FF' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: `'Google Sans', 'Outfit', sans-serif`,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: container === c.value ? '#2563EB' : '#64748B',
                }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}><CupSoda size={14} /> ประเภทเครื่องดื่ม</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {typeOptions.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: type === t.value ? '2px solid #2563EB' : '2px solid #E2E8F0',
                  background: type === t.value ? '#EFF6FF' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  flexGrow: 1,
                  fontFamily: `'Google Sans', 'Outfit', sans-serif`,
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
