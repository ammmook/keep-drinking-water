export interface UserProfile {
  dailyGoalMl: number;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  amountMl: number;
  unit: 'ml' | 'glass' | 'bottle';
  type: 'water' | 'sweet' | 'other';
  note?: string;
}

export type Page = 'home' | 'history';

export type ViewMode = 'day' | 'month' | 'year';
