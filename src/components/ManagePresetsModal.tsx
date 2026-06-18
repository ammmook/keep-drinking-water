import { useState } from 'react';
import type { QuickPreset } from '../types';
import { X, Plus, Trash2, Edit2, Settings } from 'lucide-react';
import { getPresetIcon } from './Dashboard';

interface ManagePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: QuickPreset[];
  onAdd: (preset: Omit<QuickPreset, 'id'>) => void;
  onEdit: (id: string, preset: Partial<QuickPreset>) => void;
  onDelete: (id: string) => void;
}

export default function ManagePresetsModal({ isOpen, onClose, presets, onAdd, onEdit, onDelete }: ManagePresetsModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<QuickPreset>>({});
  
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Omit<QuickPreset, 'id'>>({
    label: 'Custom Drink',
    amountMl: 300,
    unit: 'ml',
    container: 'glass',
    type: 'water',
    icon: 'glass',
  });

  if (!isOpen) return null;

  const handleSaveEdit = (id: string) => {
    onEdit(id, editForm);
    setEditingId(null);
  };

  const handleAdd = () => {
    onAdd(addForm);
    setIsAdding(false);
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '13px',
    fontFamily: `'Google Sans', 'Outfit', sans-serif`,
    outline: 'none',
    width: '100%',
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={24} color="#0EA5E9" />
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#1E293B',
              margin: 0,
            }}>จัดการปุ่มเพิ่มเร็ว</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: '#F1F5F9',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          ><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
          {presets.length === 0 && !isAdding && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94A3B8', fontSize: '14px' }}>
              ไม่มีปุ่มเพิ่มเร็ว
            </div>
          )}

          {presets.map((p) => (
            <div key={p.id} style={{
              padding: '12px',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {editingId === p.id ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input style={inputStyle} value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} placeholder="ชื่อปุ่ม" />
                    <input style={{...inputStyle, width: '80px'}} type="number" value={editForm.amountMl} onChange={e => setEditForm({ ...editForm, amountMl: parseInt(e.target.value) || 0 })} placeholder="ปริมาณ (ml)" />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select style={inputStyle} value={editForm.icon} onChange={e => setEditForm({ ...editForm, icon: e.target.value })}>
                      <option value="glass">ไอคอนแก้ว</option>
                      <option value="bottle">ไอคอนขวด</option>
                      <option value="droplet">ไอคอนหยดน้ำ</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setEditingId(null)}>ยกเลิก</button>
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleSaveEdit(p.id)}>บันทึก</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {getPresetIcon(p.icon || 'glass')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{p.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{p.amountMl}ml • ไอคอน{p.icon === 'bottle' ? 'ขวด' : p.icon === 'glass' ? 'แก้ว' : 'หยดน้ำ'}</div>
                  </div>
                  <button onClick={() => { setEditingId(p.id); setEditForm(p); }} style={{ border: 'none', background: 'transparent', color: '#64748B', cursor: 'pointer', padding: '6px' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDelete(p.id)} style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '6px' }}>
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          ))}

          {isAdding && (
            <div style={{
              padding: '12px',
              border: '2px dashed #2563EB',
              borderRadius: '12px',
              background: '#EFF6FF',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input style={inputStyle} value={addForm.label} onChange={e => setAddForm({ ...addForm, label: e.target.value })} placeholder="ชื่อปุ่ม (เช่น แก้วเล็ก)" />
                <input style={{...inputStyle, width: '80px'}} type="number" value={addForm.amountMl} onChange={e => setAddForm({ ...addForm, amountMl: parseInt(e.target.value) || 0 })} placeholder="ml" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select style={inputStyle} value={addForm.icon} onChange={e => setAddForm({ ...addForm, icon: e.target.value })}>
                  <option value="glass">ไอคอนแก้ว</option>
                  <option value="bottle">ไอคอนขวด</option>
                  <option value="droplet">ไอคอนหยดน้ำ</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setIsAdding(false)}>ยกเลิก</button>
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleAdd}>เพิ่ม</button>
              </div>
            </div>
          )}
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              setAddForm({ label: 'แก้วใหม่', amountMl: 250, unit: 'ml', container: 'glass', type: 'water', icon: 'glass' });
              setIsAdding(true);
            }}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '16px',
              borderRadius: '12px',
              border: '2px dashed #CBD5E1',
              background: 'transparent',
              color: '#64748B',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#94A3B8';
              (e.currentTarget as HTMLButtonElement).style.color = '#475569';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#CBD5E1';
              (e.currentTarget as HTMLButtonElement).style.color = '#64748B';
            }}
          >
            <Plus size={16} /> เพิ่มปุ่มใหม่
          </button>
        )}
      </div>
    </div>
  );
}
