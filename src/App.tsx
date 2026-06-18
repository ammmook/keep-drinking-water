import { useState, useCallback } from 'react';
import { useWaterData } from './hooks/useWaterData';
import type { Page, QuickPreset } from './types';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LogWaterModal from './components/LogWaterModal';
import History from './components/History';
import MobileNavbar from './components/MobileNavbar';
import { Plus } from 'lucide-react';

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
    editLog,
    getLogsByDate,
    getDailyTotal,
    getDailyTotalsForMonth,
    getMonthlyTotalsForYear,
    clearAllData,
    presets,
    addPreset,
    editPreset,
    deletePreset,
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
      <MobileNavbar />
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
            onAddPreset={addPreset}
            onEditPreset={editPreset}
            onDeletePreset={deletePreset}
            onDeleteLog={deleteLog}
            onEditLog={editLog}
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

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={() => setShowLogModal(true)}
        className="mobile-fab"
        style={{
          position: 'fixed',
          bottom: '80px', /* Above the bottom navigation */
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#2563EB',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'none', // Hidden on desktop, shown via CSS on mobile
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
          zIndex: 110,
        }}
      >
        <Plus size={28} />
      </button>

      <style>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            padding-bottom: 90px !important;
          }
          .mobile-fab {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
