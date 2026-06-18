import { Droplet, Coffee, CupSoda, GlassWater, Package } from 'lucide-react';
import BottleSVG from './icons/BottleSVG';

export function getLogIcon(type: string, container: string, size = 20): React.ReactNode {
  if (type === 'coffee') return <Coffee size={size} color="#8B5CF6" />;
  if (type === 'tea') return <Coffee size={size} color="#10B981" />;
  if (type === 'sweet') return <CupSoda size={size} color="#F59E0B" />;
  
  if (container === 'glass') return <GlassWater size={size} color="#0EA5E9" />;
  if (container === 'bottle') return <BottleSVG size={size} color="#0EA5E9" />;
  if (container === 'none') return <Package size={size} color="#64748B" />;
  return <Droplet size={size} color="#0EA5E9" />;
}

export function getPresetIcon(iconName: string, size = 24): React.ReactNode {
  if (iconName === 'glass') return <GlassWater size={size} color="#64748B" />;
  if (iconName === 'bottle') return <BottleSVG size={size} color="#64748B" />;
  return <Droplet size={size} color="#64748B" />;
}

export const typeLabels: Record<string, string> = {
  water: 'น้ำเปล่า',
  sweet: 'น้ำหวาน',
  coffee: 'กาแฟ',
  tea: 'ชา',
  other: 'อื่นๆ',
};
