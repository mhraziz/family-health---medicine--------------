import React from 'react';
import { Languages, Check } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { alarmManager } from '../services/alarmManager';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange,
}) => {
  const t = translations[currentLang];

  const languages: { code: Language; label: string; nativeName: string; sub: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English', sub: 'LTR' },
    { code: 'ur', label: 'Urdu', nativeName: 'اردو', sub: 'RTL' },
    { code: 'sd', label: 'Sindhi', nativeName: 'سنڌي', sub: 'RTL' },
  ];

  const handleSelect = (code: Language) => {
    alarmManager.playChime('click');
    onLanguageChange(code);
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-3 shadow-sm mb-4">
      {/* Top Header Label */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Languages className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {t.selectLanguage}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              English • اردو • سنڌي (RTL Layout)
            </p>
          </div>
        </div>

        {/* Current Direction Flag */}
        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          {currentLang === 'en' ? 'LTR' : 'RTL (دائیں سے بائیں)'}
        </span>
      </div>

      {/* Prominent 3-Button Switcher */}
      <div className="grid grid-cols-3 gap-2">
        {languages.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              type="button"
              className={`min-h-[54px] px-3 py-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative text-center border-2 ${
                isActive
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1 w-full">
                <span
                  className={`text-base font-bold leading-tight ${
                    lang.code !== 'en' ? 'font-arabic text-lg' : ''
                  }`}
                >
                  {lang.nativeName}
                </span>
                {isActive && <Check className="w-4 h-4 text-emerald-200 shrink-0" />}
              </div>
              <span
                className={`text-[11px] font-semibold mt-0.5 ${
                  isActive ? 'text-emerald-100' : 'text-slate-500'
                }`}
              >
                {lang.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
