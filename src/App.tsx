import { useState, useCallback } from 'react';
import { useWaterData } from './hooks/useWaterData';
import type { Page, QuickPreset } from './types';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LogWaterModal from './components/LogWaterModal';
import History from './components/History';

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function App() {
  const {
    profile,
    setProfile,
    addLog,
    deleteLog,
    getLogsByDate,
    getDailyTotal,
    getDailyTotalsForMonth,
    getMonthlyTotalsForYear,
    clearAllData,
    presets,
  } = useWaterData();

  const [activePage, setActivePage] = useState<Page>('home');
  const [showLogModal, setShowLogModal] = useState(false);

  const todayStr = getToday();
  const todayLogs = getLogsByDate(todayStr);
  const todayTotal = getDailyTotal(todayStr);

  const handleQuickAdd = useCallback((preset: QuickPreset) => {
    addLog({
      date: todayStr,
      time: getNow(),
      amountMl: preset.amountMl,
      unit: preset.unit,
      container: preset.container,
      type: preset.type,
    });
  }, [addLog, todayStr]);

  const handleUpdateGoal = useCallback((newGoalMl: number) => {
    if (profile) {
      setProfile({ ...profile, dailyGoalMl: newGoalMl });
    }
  }, [profile, setProfile]);

  // If no profile, show onboarding
  if (!profile) {
    return <Onboarding onComplete={setProfile} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        onLogWater={() => setShowLogModal(true)}
        profile={profile}
        onUpdateGoal={handleUpdateGoal}
        onClearData={clearAllData}
      />

      {/* Main content area */}
      <main style={{
        flex: 1,
        marginLeft: '240px',
        minHeight: '100vh',
        paddingBottom: '80px',
      }} className="main-content">
        {activePage === 'home' && (
          <Dashboard
            profile={profile}
            todayLogs={todayLogs}
            dailyTotal={todayTotal}
            presets={presets}
            onLogWater={() => setShowLogModal(true)}
            onDeleteLog={deleteLog}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {activePage === 'history' && (
          <History
            profile={profile}
            getLogsByDate={getLogsByDate}
            getDailyTotal={getDailyTotal}
            getDailyTotalsForMonth={getDailyTotalsForMonth}
            getMonthlyTotalsForYear={getMonthlyTotalsForYear}
            onDeleteLog={deleteLog}
          />
        )}
      </main>

      {/* Log Water Modal */}
      <LogWaterModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSave={(log) => addLog(log)}
      />

      <style>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
