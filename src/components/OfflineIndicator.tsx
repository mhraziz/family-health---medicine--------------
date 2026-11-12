import React, { useState, useEffect } from 'react';
import { Plane, WifiOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface OfflineIndicatorProps {
  lang: Language;
  isAirplaneSimulated?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  lang,
  isAirplaneSimulated = false,
}) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveOffline = !isOnline || isAirplaneSimulated;

  if (!effectiveOffline) return null;

  const message =
    lang === 'ur'
      ? 'ایئرپلین موڈ فعال: تمام ڈیٹا اور دوائیں فون میں محفوظ ہیں (SQLite + IndexedDB)'
      : lang === 'sd'
      ? 'هوائي جهاز موڊ: سمورو ڊيٽا موبائيل ۾ محفوظ آهي (SQLite + IndexedDB)'
      : 'Airplane Mode Active — 100% Offline using Room SQLite & IndexedDB cache';

  return (
    <aside aria-label="Offline status banner" className="fixed top-12 left-2 right-2 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-emerald-900/95 text-white p-2.5 rounded-2xl shadow-xl border-2 border-emerald-500 backdrop-blur-md flex items-center justify-between gap-2.5 animate-fadeIn">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
          <Plane className="w-4 h-4 text-emerald-200" />
        </div>
        <p className="text-xs font-bold leading-tight">
          {message}
        </p>
      </div>
      <span className="text-[10px] font-mono font-black uppercase bg-emerald-800 px-2 py-0.5 rounded border border-emerald-600 shrink-0">
        Offline OK
      </span>
    </aside>
  );
};
