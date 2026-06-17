export interface UserProfile {
  dailyGoalMl: number;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  amountMl: number;
  unit: 'ml' | 'l';
  container: 'glass' | 'bottle' | 'none';
  type: 'water' | 'sweet' | 'coffee' | 'tea' | 'other';
  note?: string;
}

export interface QuickPreset {
  id: string;
  label: string;
  amountMl: number;
  unit: 'ml' | 'l';
  container: 'glass' | 'bottle' | 'none';
  type: 'water' | 'sweet' | 'coffee' | 'tea' | 'other';
  icon: string;
}

export type Page = 'home' | 'history';

export type ViewMode = 'day' | 'month' | 'year';
