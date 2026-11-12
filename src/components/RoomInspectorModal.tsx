import React, { useState } from 'react';
import { Database, X, Download, RotateCcw, ShieldCheck, HardDrive, Table } from 'lucide-react';
import { roomDb } from '../db/roomDatabase';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface RoomInspectorModalProps {
  lang: Language;
  onClose: () => void;
}

export const RoomInspectorModal: React.FC<RoomInspectorModalProps> = ({ lang, onClose }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'ddl'>('overview');
  const [copied, setCopied] = useState(false);

  const stats = roomDb.getRoomStats();
  const members = roomDb.getAllMembers();
  const medicines = roomDb.getAllMedicines();
  const doses = roomDb.getAllDoseRecords();
  const vitals = roomDb.getAllVitals();

  const handleExport = () => {
    const json = roomDb.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family_health_room_sqlite_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Reset local Room SQLite database to initial defaults (Ammi & Abbu with doses)?')) {
      roomDb.resetDemoData();
      onClose();
    }
  };

  const roomSchemaDDL = `
-- Android Room SQLite Schema Definition
-- Package: com.familyhealth.medicine.data.local

CREATE TABLE IF NOT EXISTS family_members (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    relation TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    avatarColor TEXT NOT NULL,
    avatarIcon TEXT NOT NULL,
    conditions TEXT, -- JSON array of strings
    createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS medicines (
    id TEXT PRIMARY KEY NOT NULL,
    memberId TEXT NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    form TEXT NOT NULL,
    mealTiming TEXT NOT NULL,
    timeSlots TEXT NOT NULL, -- JSON array
    scheduleTimes TEXT NOT NULL, -- JSON map
    totalStock INTEGER NOT NULL DEFAULT 0,
    lowStockThreshold INTEGER NOT NULL DEFAULT 5,
    instructions TEXT,
    alarmEnabled INTEGER NOT NULL DEFAULT 1,
    color TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY(memberId) REFERENCES family_members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dose_records (
    id TEXT PRIMARY KEY NOT NULL,
    medicineId TEXT NOT NULL,
    memberId TEXT NOT NULL,
    medicineName TEXT NOT NULL,
    timeSlot TEXT NOT NULL,
    scheduledDate TEXT NOT NULL,
    scheduledTime TEXT NOT NULL,
    status TEXT NOT NULL, -- 'pending' | 'taken' | 'snoozed' | 'missed'
    takenAt INTEGER,
    snoozedUntil INTEGER,
    FOREIGN KEY(medicineId) REFERENCES medicines(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vitals_records (
    id TEXT PRIMARY KEY NOT NULL,
    memberId TEXT NOT NULL,
    type TEXT NOT NULL, -- 'bp' | 'sugar'
    systolic INTEGER,
    diastolic INTEGER,
    pulse INTEGER,
    bpCategory TEXT,
    sugarValue REAL,
    sugarContext TEXT, -- 'fasting' | 'random' | 'post_meal'
    sugarCategory TEXT,
    notes TEXT,
    recordedAt INTEGER NOT NULL,
    recordedDate TEXT NOT NULL,
    FOREIGN KEY(memberId) REFERENCES family_members(id) ON DELETE CASCADE
);
  `.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{t.roomDbTitle}</span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  100% Offline
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {t.roomDbDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Database Stats
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`py-2 px-3 border-b-2 cursor-pointer ${
              activeTab === 'tables'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Table Rows
          </button>
          <button
            onClick={() => setActiveTab('ddl')}
            className={`py-2 px-3 border-b-2 cursor-pointer ${
              activeTab === 'ddl'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Room SQL DDL
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* SQLite & IndexedDB Architecture Banner */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3">
                <HardDrive className="w-6 h-6 text-sky-700 shrink-0 mt-0.5" />
                <div className="text-xs text-sky-900 space-y-1">
                  <span className="font-bold text-sm block">
                    Permanent Dual Offline Storage: Room SQLite + IndexedDB
                  </span>
                  <p>
                    All family profiles, medicines, dose logs, and vitals are committed synchronously to localStorage and asynchronously to <strong>IndexedDB (SehatSathiRoomDB)</strong>.
                  </p>
                  <p className="font-semibold text-emerald-800">
                    ✈️ Airplane Mode Ready: Service Worker precaches all HTML, CSS, JavaScript, and Urdu/Sindhi web fonts so the app opens instantly with zero internet connectivity.
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-2xl font-black text-emerald-700 block">
                    {stats.membersCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">Family Members</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-2xl font-black text-sky-700 block">
                    {stats.medicinesCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">Medicines</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-2xl font-black text-amber-700 block">
                    {stats.dosesCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">Dose Logs</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-2xl font-black text-rose-700 block">
                    {stats.vitalsCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">Vitals Records</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleExport}
                  className="flex-1 min-h-[48px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.exportBackup}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="min-h-[48px] px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.resetDemoData}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Table: medicines ({medicines.length} rows)
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Dose</th>
                        <th className="p-2">Stock</th>
                        <th className="p-2">Threshold</th>
                        <th className="p-2">Timing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {medicines.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900">{m.name}</td>
                          <td className="p-2 text-slate-600">{m.dosage}</td>
                          <td className="p-2 font-mono font-bold">
                            <span className={m.totalStock <= m.lowStockThreshold ? 'text-rose-600 font-black' : 'text-emerald-700'}>
                              {m.totalStock} {m.totalStock <= m.lowStockThreshold && '⚠️ LOW'}
                            </span>
                          </td>
                          <td className="p-2 font-mono text-slate-500">{m.lowStockThreshold}</td>
                          <td className="p-2 text-slate-600">{m.mealTiming}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Table: vitals_records ({vitals.length} rows)
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2">Type</th>
                        <th className="p-2">Value</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vitals.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="p-2 font-bold uppercase">{v.type}</td>
                          <td className="p-2 font-mono font-bold text-slate-900">
                            {v.type === 'bp' ? `${v.systolic}/${v.diastolic} mmHg` : `${v.sugarValue} mg/dL`}
                          </td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                              {v.bpCategory || v.sugarCategory}
                            </span>
                          </td>
                          <td className="p-2 text-slate-500">{v.recordedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ddl' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600">SQLite CREATE TABLE Statements</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomSchemaDDL);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                >
                  {copied ? 'Copied!' : 'Copy SQL'}
                </button>
              </div>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-80">
                {roomSchemaDDL}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
