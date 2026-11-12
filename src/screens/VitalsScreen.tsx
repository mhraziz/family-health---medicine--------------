import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Droplet, 
  Calendar, 
  Plus, 
  Trash2, 
  FileText, 
  Check, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { 
  Language, 
  VitalRecord, 
  VitalType, 
  BpCategory, 
  SugarCategory,
  FamilyMember 
} from '../types';
import { translations } from '../i18n/translations';
import { roomDb } from '../db/roomDatabase';
import { alarmManager } from '../services/alarmManager';

interface VitalsScreenProps {
  lang: Language;
  activeMemberId: string;
}

export const VitalsScreen: React.FC<VitalsScreenProps> = ({
  lang,
  activeMemberId,
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<VitalType>('bp');
  const [vitalsList, setVitalsList] = useState<VitalRecord[]>([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  // Form State: Blood Pressure
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(75);

  // Form State: Blood Sugar
  const [sugarValue, setSugarValue] = useState<number>(100);
  const [sugarContext, setSugarContext] = useState<'fasting' | 'random' | 'post_meal'>('fasting');
  const [notes, setNotes] = useState('');

  const members = roomDb.getAllMembers();
  const activeMember = members.find((m) => m.id === activeMemberId) || members[0];

  const loadVitals = () => {
    if (activeMemberId) {
      setVitalsList(roomDb.getVitalsForMember(activeMemberId));
    }
  };

  useEffect(() => {
    loadVitals();
    const unsub = roomDb.subscribe(loadVitals);
    return () => unsub();
  }, [activeMemberId]);

  // Live BP clinical calculation
  const getBpStatus = (sys: number, dia: number): { category: BpCategory; label: string; color: string; advice: string } => {
    if (sys < 90 || dia < 60) {
      return { category: 'low', label: t.lowStatus, color: 'bg-blue-100 text-blue-900 border-blue-300', advice: 'Slightly low. Drink some fluids or salted lassi.' };
    }
    if (sys < 120 && dia < 80) {
      return { category: 'normal', label: t.normalStatus, color: 'bg-emerald-100 text-emerald-900 border-emerald-300', advice: t.bpHelpNormal };
    }
    if (sys <= 129 && dia < 80) {
      return { category: 'elevated', label: t.elevatedStatus, color: 'bg-amber-100 text-amber-950 border-amber-300', advice: t.bpHelpElevated };
    }
    return { category: 'high_stage1', label: t.highStatus, color: 'bg-rose-100 text-rose-950 border-rose-300', advice: t.bpHelpHigh };
  };

  // Live Sugar clinical calculation
  const getSugarStatus = (val: number, context: 'fasting' | 'random' | 'post_meal'): { category: SugarCategory; label: string; color: string; advice: string } => {
    if (val < 70) {
      return { category: 'low', label: t.lowStatus, color: 'bg-blue-100 text-blue-900 border-blue-300', advice: 'Low sugar alert! Have some sweet or juice immediately.' };
    }
    if (context === 'fasting') {
      if (val <= 99) {
        return { category: 'normal', label: t.normalStatus, color: 'bg-emerald-100 text-emerald-900 border-emerald-300', advice: t.sugarHelpNormal };
      }
      if (val <= 125) {
        return { category: 'prediabetes', label: t.elevatedStatus, color: 'bg-amber-100 text-amber-950 border-amber-300', advice: 'Borderline fasting sugar. Watch carb intake.' };
      }
      return { category: 'high', label: t.highStatus, color: 'bg-rose-100 text-rose-950 border-rose-300', advice: t.sugarHelpHigh };
    } else {
      if (val <= 140) {
        return { category: 'normal', label: t.normalStatus, color: 'bg-emerald-100 text-emerald-900 border-emerald-300', advice: t.sugarHelpNormal };
      }
      if (val <= 199) {
        return { category: 'prediabetes', label: t.elevatedStatus, color: 'bg-amber-100 text-amber-950 border-amber-300', advice: 'Higher than normal.' };
      }
      return { category: 'high', label: t.highStatus, color: 'bg-rose-100 text-rose-950 border-rose-300', advice: t.sugarHelpHigh };
    }
  };

  const currentBpStatus = getBpStatus(systolic, diastolic);
  const currentSugarStatus = getSugarStatus(sugarValue, sugarContext);

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    alarmManager.playChime('success');

    if (activeTab === 'bp') {
      roomDb.insertVital({
        memberId: activeMemberId,
        type: 'bp',
        systolic,
        diastolic,
        pulse,
        notes: notes.trim() || undefined,
      });
    } else {
      roomDb.insertVital({
        memberId: activeMemberId,
        type: 'sugar',
        sugarValue,
        sugarContext,
        notes: notes.trim() || undefined,
      });
    }

    setNotes('');
  };

  const handleDeleteVital = (id: string) => {
    alarmManager.playChime('click');
    roomDb.deleteVital(id);
  };

  // Filter 30 days list
  const filteredList = vitalsList.filter((v) => v.type === activeTab);

  // Calculate averages for Doctor Report
  const bpLogs = vitalsList.filter((v) => v.type === 'bp');
  const avgSys = bpLogs.length > 0 ? Math.round(bpLogs.reduce((acc, l) => acc + (l.systolic || 0), 0) / bpLogs.length) : 0;
  const avgDia = bpLogs.length > 0 ? Math.round(bpLogs.reduce((acc, l) => acc + (l.diastolic || 0), 0) / bpLogs.length) : 0;

  const sugarLogs = vitalsList.filter((v) => v.type === 'sugar');
  const avgSugar = sugarLogs.length > 0 ? Math.round(sugarLogs.reduce((acc, l) => acc + (l.sugarValue || 0), 0) / sugarLogs.length) : 0;

  return (
    <div className="space-y-4 pb-24">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-700" />
            <span>{t.vitalsTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {activeMember ? activeMember.name : ''} • 30-Day SQLite Record
          </p>
        </div>

        {/* Doctor Summary Button */}
        <button
          onClick={() => {
            alarmManager.playChime('click');
            setShowDoctorModal(true);
          }}
          type="button"
          className="min-h-[44px] px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">{t.doctorSummaryBtn}</span>
          <span className="sm:hidden">Report</span>
        </button>
      </div>

      {/* Segmented Switcher: Blood Pressure vs Blood Sugar */}
      <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            alarmManager.playChime('click');
            setActiveTab('bp');
          }}
          className={`min-h-[50px] rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bp'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === 'bp' ? 'text-rose-600 fill-rose-100' : 'text-slate-500'}`} />
          <span>{t.bloodPressure}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            alarmManager.playChime('click');
            setActiveTab('sugar');
          }}
          className={`min-h-[50px] rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'sugar'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Droplet className={`w-5 h-5 ${activeTab === 'sugar' ? 'text-sky-600 fill-sky-100' : 'text-slate-500'}`} />
          <span>{t.bloodSugar}</span>
        </button>
      </div>

      {/* Input Form with Big High-Contrast Controls & Steppers */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-5 shadow-sm space-y-4">
        {activeTab === 'bp' ? (
          <form onSubmit={handleSaveVital} className="space-y-4">
            {/* Live Indicator Status Banner */}
            <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${currentBpStatus.color}`}>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">
                  {t.bloodPressure} status:
                </span>
                <span className="text-lg sm:text-xl font-black block">
                  {currentBpStatus.label} ({systolic}/{diastolic} mmHg)
                </span>
                <p className="text-xs font-bold mt-1 text-slate-800">
                  {currentBpStatus.advice}
                </p>
              </div>
            </div>

            {/* Systolic (Upper) Stepper */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900">
                  {t.systolic} (mmHg)
                </label>
                <span className="text-2xl font-black font-mono text-slate-900">
                  {systolic}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alarmManager.playChime('click');
                    setSystolic((s) => Math.max(70, s - 5));
                  }}
                  className="w-14 h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-black text-xl rounded-xl border border-slate-300 flex items-center justify-center cursor-pointer"
                >
                  -5
                </button>
                <input
                  type="range"
                  min="70"
                  max="220"
                  value={systolic}
                  onChange={(e) => setSystolic(parseInt(e.target.value, 10))}
                  className="flex-1 h-3 accent-emerald-700 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    alarmManager.playChime('click');
                    setSystolic((s) => Math.min(240, s + 5));
                  }}
                  className="w-14 h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-black text-xl rounded-xl border border-slate-300 flex items-center justify-center cursor-pointer"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Diastolic (Lower) Stepper */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900">
                  {t.diastolic} (mmHg)
                </label>
                <span className="text-2xl font-black font-mono text-slate-900">
                  {diastolic}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alarmManager.playChime('click');
                    setDiastolic((d) => Math.max(40, d - 5));
                  }}
                  className="w-14 h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-black text-xl rounded-xl border border-slate-300 flex items-center justify-center cursor-pointer"
                >
                  -5
                </button>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={diastolic}
                  onChange={(e) => setDiastolic(parseInt(e.target.value, 10))}
                  className="flex-1 h-3 accent-emerald-700 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    alarmManager.playChime('click');
                    setDiastolic((d) => Math.min(150, d + 5));
                  }}
                  className="w-14 h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-black text-xl rounded-xl border border-slate-300 flex items-center justify-center cursor-pointer"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Pulse */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">{t.pulse}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPulse((p) => Math.max(40, p - 2))}
                  className="w-8 h-8 rounded bg-white border border-slate-300 font-bold"
                >
                  -
                </button>
                <span className="font-mono font-bold text-slate-900 w-12 text-center">
                  {pulse}
                </span>
                <button
                  type="button"
                  onClick={() => setPulse((p) => Math.min(180, p + 2))}
                  className="w-8 h-8 rounded bg-white border border-slate-300 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full min-h-[58px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-md cursor-pointer border-2 border-emerald-600"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>{t.saveVitalBtn}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSaveVital} className="space-y-4">
            {/* Live Sugar Status Banner */}
            <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${currentSugarStatus.color}`}>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">
                  {t.bloodSugar} status:
                </span>
                <span className="text-lg sm:text-xl font-black block">
                  {currentSugarStatus.label} ({sugarValue} {t.sugarUnit})
                </span>
                <p className="text-xs font-bold mt-1 text-slate-800">
                  {currentSugarStatus.advice}
                </p>
              </div>
            </div>

            {/* Fasting vs Random Context Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'en' ? 'When was this tested?' : 'ٹیسٹ کب کیا گیا؟'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fasting' as const, label: t.fastingSugar },
                  { id: 'random' as const, label: t.randomSugar },
                  { id: 'post_meal' as const, label: t.postMealSugar },
                ].map((ctx) => {
                  const isSel = sugarContext === ctx.id;
                  return (
                    <button
                      key={ctx.id}
                      type="button"
                      onClick={() => {
                        alarmManager.playChime('click');
                        setSugarContext(ctx.id);
                      }}
                      className={`min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer text-center flex items-center justify-center ${
                        isSel
                          ? 'bg-sky-700 text-white border-sky-800 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span className="leading-tight">{ctx.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sugar Value Stepper */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900">
                  {t.sugarValue}
                </label>
                <span className="text-3xl font-black font-mono text-slate-900">
                  {sugarValue} <span className="text-sm font-sans font-bold text-slate-500">{t.sugarUnit}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alarmManager.playChime('click');
                    setSugarValue((v) => Math.max(40, v - 10));
                  }}
                  className="w-14 h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-black text-xl rounded-xl border border-slate-300 flex items-center justify-center cursor-pointer"
                >
                  -10
                </button>
                <input
                  type="range"
                  min="40"
                  max="400"
                  value={sugarValue}
                  onChange={(e) => setSugarValue(parseInt(e.target.value, 10))}
                  className="flex-1 h-3 accent-sky-700 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    alarmManager.playChime('click');
                    setSugarValue((v) => Math.min(500, v + 10));
                  }}
                  className="w-14 h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-black text-xl rounded-xl border border-slate-300 flex items-center justify-center cursor-pointer"
                >
                  +10
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full min-h-[58px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-md cursor-pointer border-2 border-emerald-600"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>{t.saveVitalBtn}</span>
            </button>
          </form>
        )}
      </div>

      {/* 30-Day History Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <span>{t.history30Days}</span>
          </h3>
          <span className="text-xs font-bold text-slate-500 font-mono">
            {filteredList.length} {lang === 'en' ? 'records' : 'ریکارڈز'}
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 text-center text-slate-400 font-medium text-sm">
            {t.noVitalsLogged}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredList.map((record) => {
              const isBp = record.type === 'bp';
              return (
                <div
                  key={record.id}
                  className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        isBp
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {isBp ? <Heart className="w-6 h-6" /> : <Droplet className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                          {isBp ? `${record.systolic}/${record.diastolic}` : `${record.sugarValue}`}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {isBp ? 'mmHg' : 'mg/dL'}
                        </span>

                        {/* Status Chip */}
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            record.bpCategory === 'normal' || record.sugarCategory === 'normal'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : record.bpCategory === 'elevated' || record.sugarCategory === 'prediabetes'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}
                        >
                          {record.bpCategory === 'normal' || record.sugarCategory === 'normal'
                            ? t.normalStatus
                            : record.bpCategory === 'elevated' || record.sugarCategory === 'prediabetes'
                            ? t.elevatedStatus
                            : t.highStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                        <span>{record.recordedDate}</span>
                        {isBp && record.pulse && <span>• Pulse: {record.pulse} bpm</span>}
                        {!isBp && record.sugarContext && (
                          <span>
                            •{' '}
                            {record.sugarContext === 'fasting'
                              ? t.fastingSugar
                              : record.sugarContext === 'post_meal'
                              ? t.postMealSugar
                              : t.randomSugar}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteVital(record.id)}
                    className="w-9 h-9 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Doctor Summary Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-300 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-bold">{t.doctorSummaryTitle}</h3>
              </div>
              <button
                onClick={() => setShowDoctorModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <h4 className="font-bold text-emerald-950 text-base mb-1">
                  Patient: {activeMember ? activeMember.name : 'Patient'}
                </h4>
                <p className="text-xs text-emerald-800">
                  Room SQLite 30-Day Offline Clinical Record
                </p>
              </div>

              {/* BP Average Card */}
              <div className="border border-slate-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Blood Pressure Summary (Last {bpLogs.length} readings)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-slate-900">
                    {avgSys}/{avgDia}
                  </span>
                  <span className="text-xs font-bold text-slate-500">mmHg (Average)</span>
                </div>
              </div>

              {/* Sugar Average Card */}
              <div className="border border-slate-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Blood Sugar Summary (Last {sugarLogs.length} readings)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-slate-900">
                    {avgSugar}
                  </span>
                  <span className="text-xs font-bold text-slate-500">mg/dL (Average)</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                Show this screen directly to the examining doctor or rural clinic health worker during follow-up visits.
              </div>

              <button
                type="button"
                onClick={() => setShowDoctorModal(false)}
                className="w-full min-h-[50px] bg-slate-900 text-white rounded-xl font-bold text-base cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
