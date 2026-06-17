import { useState, useCallback, useEffect } from 'react';
import type { UserProfile, WaterLog } from '../types';

const PROFILE_KEY = 'aquaflow_profile';
const LOGS_KEY = 'aquaflow_logs';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function loadProfile(): UserProfile | null {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function loadAllLogs(): WaterLog[] {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveAllLogs(logs: WaterLog[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function useWaterData() {
  const [profile, setProfileState] = useState<UserProfile | null>(loadProfile);
  const [logs, setLogs] = useState<WaterLog[]>(loadAllLogs);

  // Sync logs to localStorage whenever they change
  useEffect(() => {
    saveAllLogs(logs);
  }, [logs]);

  const setProfile = useCallback((p: UserProfile) => {
    saveProfile(p);
    setProfileState(p);
  }, []);

  const addLog = useCallback((log: Omit<WaterLog, 'id'>) => {
    const newLog: WaterLog = { ...log, id: generateId() };
    setLogs(prev => [...prev, newLog]);
    return newLog;
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  }, []);

  const getLogsByDate = useCallback((date: string): WaterLog[] => {
    return logs
      .filter(l => l.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [logs]);

  const getLogsByMonth = useCallback((year: number, month: number): WaterLog[] => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return logs
      .filter(l => l.date.startsWith(prefix))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [logs]);

  const getLogsByYear = useCallback((year: number): WaterLog[] => {
    const prefix = `${year}-`;
    return logs
      .filter(l => l.date.startsWith(prefix))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [logs]);

  const getDailyTotal = useCallback((date: string): number => {
    return logs
      .filter(l => l.date === date)
      .reduce((sum, l) => sum + l.amountMl, 0);
  }, [logs]);

  const getMonthlyTotal = useCallback((year: number, month: number): number => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return logs
      .filter(l => l.date.startsWith(prefix))
      .reduce((sum, l) => sum + l.amountMl, 0);
  }, [logs]);

  const getYearlyTotal = useCallback((year: number): number => {
    const prefix = `${year}-`;
    return logs
      .filter(l => l.date.startsWith(prefix))
      .reduce((sum, l) => sum + l.amountMl, 0);
  }, [logs]);

  const getDaysWithLogs = useCallback((year: number, month: number): Map<string, number> => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const dayMap = new Map<string, number>();
    logs
      .filter(l => l.date.startsWith(prefix))
      .forEach(l => {
        dayMap.set(l.date, (dayMap.get(l.date) || 0) + l.amountMl);
      });
    return dayMap;
  }, [logs]);

  const getDailyTotalsForMonth = useCallback((year: number, month: number): { date: string; total: number }[] => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const result: { date: string; total: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const total = logs
        .filter(l => l.date === dateStr)
        .reduce((sum, l) => sum + l.amountMl, 0);
      result.push({ date: dateStr, total });
    }
    return result;
  }, [logs]);

  const getMonthlyTotalsForYear = useCallback((year: number): { month: number; total: number }[] => {
    const result: { month: number; total: number }[] = [];
    for (let m = 1; m <= 12; m++) {
      const prefix = `${year}-${String(m).padStart(2, '0')}`;
      const total = logs
        .filter(l => l.date.startsWith(prefix))
        .reduce((sum, l) => sum + l.amountMl, 0);
      result.push({ month: m, total });
    }
    return result;
  }, [logs]);

  const getStreak = useCallback((): number => {
    if (!profile) return 0;
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const total = logs
        .filter(l => l.date === dateStr)
        .reduce((sum, l) => sum + l.amountMl, 0);
      if (total >= profile.dailyGoalMl) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [logs, profile]);

  const getTotalDaysTracked = useCallback((): number => {
    const uniqueDays = new Set(logs.map(l => l.date));
    return uniqueDays.size;
  }, [logs]);

  const getGoalCompletionRate = useCallback((): number => {
    if (!profile) return 0;
    const uniqueDays = [...new Set(logs.map(l => l.date))];
    if (uniqueDays.length === 0) return 0;
    const daysCompleted = uniqueDays.filter(date => {
      const total = logs.filter(l => l.date === date).reduce((sum, l) => sum + l.amountMl, 0);
      return total >= profile.dailyGoalMl;
    }).length;
    return Math.round((daysCompleted / uniqueDays.length) * 100);
  }, [logs, profile]);

  const clearAllData = useCallback(() => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LOGS_KEY);
    setProfileState(null);
    setLogs([]);
  }, []);

  return {
    profile,
    setProfile,
    logs,
    addLog,
    deleteLog,
    getLogsByDate,
    getLogsByMonth,
    getLogsByYear,
    getDailyTotal,
    getMonthlyTotal,
    getYearlyTotal,
    getDaysWithLogs,
    getDailyTotalsForMonth,
    getMonthlyTotalsForYear,
    getStreak,
    getTotalDaysTracked,
    getGoalCompletionRate,
    clearAllData,
  };
}
