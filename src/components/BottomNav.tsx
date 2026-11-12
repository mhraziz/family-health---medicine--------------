import React from 'react';
import { Pill, PlusCircle, Activity, Users } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { alarmManager } from '../services/alarmManager';

export type ScreenId = 'home' | 'add' | 'vitals' | 'family';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, lang }) => {
  const t = translations[lang];

  const tabs: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.tabToday, icon: Pill },
    { id: 'add', label: t.tabAddMed, icon: PlusCircle },
    { id: 'vitals', label: t.tabVitals, icon: Activity },
    { id: 'family', label: t.tabFamily, icon: Users },
  ];

  const handleTabClick = (id: ScreenId) => {
    alarmManager.playChime('click');
    onNavigate(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 shadow-xl max-w-xl mx-auto" aria-label="Main Navigation">
      <div className="grid grid-cols-4 items-center h-20 px-2">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[56px] py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              {/* Highlight background pill for active state */}
              <div
                className={`flex items-center justify-center w-12 h-9 rounded-full transition-colors mb-1 ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent text-slate-500'
                }`}
              >
                <Icon className={`w-6 h-6 stroke-[2.2] ${isActive ? 'text-emerald-800' : 'text-slate-600'}`} />
              </div>

              {/* Tab Title Label */}
              <span
                className={`text-[12px] sm:text-[13px] leading-tight text-center truncate max-w-full px-0.5 ${
                  lang !== 'en' ? 'font-arabic font-bold' : ''
                } ${isActive ? 'text-emerald-900 font-bold' : 'text-slate-600'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
