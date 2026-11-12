import React, { useState, useEffect } from 'react';
import { WifiOff, BatteryMedium, Database, Plane } from 'lucide-react';
import { roomDb } from '../db/roomDatabase';

interface AndroidStatusBarProps {
  onOpenRoomInspector: () => void;
  isAirplaneMode: boolean;
  onToggleAirplaneMode: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ 
  onOpenRoomInspector,
  isAirplaneMode,
  onToggleAirplaneMode,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-slate-200 px-3.5 py-2 text-xs flex items-center justify-between border-b border-slate-800 select-none shrink-0" aria-label="System status bar">
      {/* Time & Android Mode */}
      <div className="flex items-center gap-2 font-mono tracking-tight font-semibold text-slate-100">
        <span>{currentTime || '08:00 AM'}</span>
        <span className="hidden sm:inline-block text-[11px] text-emerald-400 font-sans font-bold">
          Sehat Sathi PWA
        </span>
      </div>

      {/* System Status Indicators */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Airplane Mode Toggle Button */}
        <button
          onClick={onToggleAirplaneMode}
          type="button"
          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer border transition-colors ${
            isAirplaneMode
              ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title={isAirplaneMode ? 'Airplane Mode is ON (Click to turn OFF)' : 'Click to simulate Airplane Mode'}
        >
          <Plane className="w-3 h-3" />
          <span>{isAirplaneMode ? '✈️ Airplane ON' : 'Airplane'}</span>
        </button>

        {/* Offline Room DB Badge */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
          <WifiOff className="w-3 h-3 text-emerald-400" />
          <span className="hidden sm:inline">Offline DB</span>
          <span className="sm:hidden">Offline</span>
        </div>

        {/* Room SQLite Inspector Trigger */}
        <button
          onClick={onOpenRoomInspector}
          className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-700 cursor-pointer transition-colors"
          title="Inspect Room SQLite & IndexedDB Storage"
        >
          <Database className="w-3 h-3 text-sky-400" />
          <span className="font-mono">DB</span>
        </button>

        {/* Battery */}
        <div className="flex items-center gap-1 text-slate-300">
          <span className="text-[10px] font-mono">96%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </header>
  );
};
