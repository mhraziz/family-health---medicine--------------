import React, { useState, useEffect } from 'react';
import { Language, Medicine, DoseRecord } from './types';
import { translations } from './i18n/translations';
import { roomDb } from './db/roomDatabase';
import { alarmManager } from './services/alarmManager';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { BottomNav, ScreenId } from './components/BottomNav';
import { AlarmModal } from './components/AlarmModal';
import { RoomInspectorModal } from './components/RoomInspectorModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HomeScreen } from './screens/HomeScreen';
import { AddMedicineScreen } from './screens/AddMedicineScreen';
import { VitalsScreen } from './screens/VitalsScreen';
import { FamilyScreen } from './screens/FamilyScreen';
import { HeartHandshake, Database } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ur'); // Default to Urdu for authentic subcontinental elder care demonstration
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activeMemberId, setActiveMemberId] = useState<string>(roomDb.getActiveMemberId());
  const [showRoomInspector, setShowRoomInspector] = useState<boolean>(false);
  const [activeAlarm, setActiveAlarm] = useState<{ medicine: Medicine; dose: DoseRecord } | null>(null);
  const [isAirplaneMode, setIsAirplaneMode] = useState<boolean>(roomDb.isAirplaneMode());

  // Synchronize document dir ('rtl' or 'ltr') and lang code whenever language changes
  useEffect(() => {
    const isRtl = lang === 'ur' || lang === 'sd';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Setup Alarm Trigger Listener
  useEffect(() => {
    alarmManager.setAlarmTriggerCallback((medicine, dose) => {
      setActiveAlarm({ medicine, dose });
    });
  }, []);

  const t = translations[lang];

  const handleSelectMember = (id: string) => {
    setActiveMemberId(id);
    roomDb.setActiveMemberId(id);
  };

  const handleTakeDoseFromAlarm = (doseId: string, medicineId: string) => {
    roomDb.markDoseTaken(doseId, medicineId);
    setActiveAlarm(null);
  };

  const handleSnoozeDoseFromAlarm = (doseId: string) => {
    roomDb.snoozeDose(doseId, 10);
    setActiveAlarm(null);
  };

  const handleToggleAirplaneMode = () => {
    const next = !isAirplaneMode;
    setIsAirplaneMode(next);
    roomDb.setAirplaneMode(next);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col items-center justify-start sm:p-4 select-none">
      {/* Offline / Airplane Mode Active Banner */}
      <OfflineIndicator lang={lang} isAirplaneSimulated={isAirplaneMode} />

      {/* Android Device Outer Wrapper */}
      <div className="w-full max-w-xl min-h-screen sm:min-h-[860px] bg-slate-100 sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-8 sm:border-slate-800">
        
        {/* Android Material Status Bar with Airplane Mode Toggle */}
        <AndroidStatusBar
          onOpenRoomInspector={() => setShowRoomInspector(true)}
          isAirplaneMode={isAirplaneMode}
          onToggleAirplaneMode={handleToggleAirplaneMode}
        />

        {/* Top App Bar with Family Title & PWA Install Button */}
        <header className="bg-white border-b-2 border-slate-200 px-3.5 py-3 shrink-0 flex items-center justify-between shadow-xs z-10 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight tracking-tight truncate">
                {t.appName}
              </h1>
              <p className="text-[11px] text-emerald-800 font-bold leading-none mt-0.5 truncate">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Top Actions: Install PWA + SQLite/IndexedDB Inspector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <PWAInstallButton lang={lang} />

            <button
              onClick={() => {
                alarmManager.playChime('click');
                setShowRoomInspector(true);
              }}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
              title="Inspect SQLite Room & IndexedDB"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline font-mono">DB</span>
            </button>
          </div>
        </header>

        {/* Scrollable Screen Body */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto no-scrollbar">
          {currentScreen === 'home' && (
            <HomeScreen
              lang={lang}
              onLanguageChange={setLang}
              activeMemberId={activeMemberId}
              onSelectMember={handleSelectMember}
              onNavigateToAddMed={() => setCurrentScreen('add')}
              onTriggerAlarmModal={(med, dose) => setActiveAlarm({ medicine: med, dose })}
            />
          )}

          {currentScreen === 'add' && (
            <AddMedicineScreen
              lang={lang}
              activeMemberId={activeMemberId}
              onSuccess={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'vitals' && (
            <VitalsScreen
              lang={lang}
              activeMemberId={activeMemberId}
            />
          )}

          {currentScreen === 'family' && (
            <FamilyScreen
              lang={lang}
              activeMemberId={activeMemberId}
              onSelectMember={handleSelectMember}
            />
          )}
        </main>

        {/* Android Bottom Navigation Bar */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          lang={lang}
        />

        {/* Incoming Medicine Alarm Modal */}
        {activeAlarm && (
          <AlarmModal
            medicine={activeAlarm.medicine}
            dose={activeAlarm.dose}
            lang={lang}
            onTakeDose={handleTakeDoseFromAlarm}
            onSnoozeDose={handleSnoozeDoseFromAlarm}
            onClose={() => setActiveAlarm(null)}
          />
        )}

        {/* Room SQLite Inspector Modal */}
        {showRoomInspector && (
          <RoomInspectorModal
            lang={lang}
            onClose={() => setShowRoomInspector(false)}
          />
        )}
      </div>
    </div>
  );
}
