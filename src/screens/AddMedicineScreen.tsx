import React, { useState } from 'react';
import { 
  PlusCircle, 
  Pill, 
  Utensils, 
  Clock, 
  Package, 
  Bell, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  Language, 
  TimeSlot, 
  MealTiming, 
  Medicine, 
  FamilyMember 
} from '../types';
import { translations } from '../i18n/translations';
import { roomDb } from '../db/roomDatabase';
import { alarmManager } from '../services/alarmManager';

interface AddMedicineScreenProps {
  lang: Language;
  activeMemberId: string;
  onSuccess: () => void;
}

export const AddMedicineScreen: React.FC<AddMedicineScreenProps> = ({
  lang,
  activeMemberId,
  onSuccess,
}) => {
  const t = translations[lang];
  const members = roomDb.getAllMembers();

  // Form State
  const [selectedMemberId, setSelectedMemberId] = useState<string>(activeMemberId || members[0]?.id || '');
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [form, setForm] = useState<Medicine['form']>('tablet');
  const [mealTiming, setMealTiming] = useState<MealTiming>('after_meal');
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>(['morning']);
  const [totalStock, setTotalStock] = useState<string>('30');
  const [lowStockThreshold, setLowStockThreshold] = useState<string>('5');
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [instructions, setInstructions] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick Presets commonly used in Pakistani & rural households
  const presets = [
    { name: 'Panadol (Paracetamol)', dose: '1 Tablet (500mg)', form: 'tablet' as const, timing: 'after_meal' as const },
    { name: 'Glucophage (Metformin)', dose: '1 Tablet (500mg)', form: 'tablet' as const, timing: 'after_meal' as const },
    { name: 'Concor (Bisoprolol)', dose: '1 Tablet (5mg)', form: 'tablet' as const, timing: 'before_meal' as const },
    { name: 'Loprin (Aspirin)', dose: '1 Tablet (75mg)', form: 'tablet' as const, timing: 'after_meal' as const },
    { name: 'Calpol Joint Relief', dose: '1 Tablet (650mg)', form: 'tablet' as const, timing: 'after_meal' as const },
    { name: 'Omega 3 Fish Oil', dose: '1 Capsule', form: 'capsule' as const, timing: 'with_meal' as const },
    { name: 'Cough Syrup', dose: '10ml (2 teaspoons)', form: 'syrup' as const, timing: 'after_meal' as const },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    alarmManager.playChime('click');
    setName(p.name);
    setDosage(p.dose);
    setForm(p.form);
    setMealTiming(p.timing);
  };

  const toggleSlot = (slot: TimeSlot) => {
    alarmManager.playChime('click');
    if (selectedSlots.includes(slot)) {
      if (selectedSlots.length > 1) {
        setSelectedSlots(selectedSlots.filter((s) => s !== slot));
      }
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    alarmManager.playChime('success');

    const stockNum = parseInt(totalStock, 10) || 0;
    const threshNum = parseInt(lowStockThreshold, 10) || 5;

    // Schedule default times
    const scheduleTimes: Medicine['scheduleTimes'] = {};
    if (selectedSlots.includes('morning')) scheduleTimes.morning = '08:00';
    if (selectedSlots.includes('afternoon')) scheduleTimes.afternoon = '13:30';
    if (selectedSlots.includes('evening')) scheduleTimes.evening = '18:30';
    if (selectedSlots.includes('night')) scheduleTimes.night = '21:30';

    roomDb.insertMedicine({
      memberId: selectedMemberId,
      name: name.trim(),
      dosage: dosage.trim() || '1 Tablet',
      form,
      mealTiming,
      timeSlots: selectedSlots,
      scheduleTimes,
      totalStock: stockNum,
      lowStockThreshold: threshNum,
      instructions: instructions.trim() || undefined,
      alarmEnabled,
      color: 'emerald',
    });

    setSavedSuccess(true);
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-700" />
          <span>{t.addNewMedicineTitle}</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {lang === 'en'
            ? 'Saved to offline Room SQLite database with AlarmManager schedules'
            : 'روم ڈیٹا بیس میں بغیر انٹرنیٹ کے محفوظ ہوگا اور الارم بجے گا'}
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-700 text-white p-4 rounded-2xl font-black text-base flex items-center gap-3 shadow-lg border-2 border-emerald-500 animate-fadeIn">
          <Check className="w-6 h-6 stroke-[3]" />
          <span>{lang === 'en' ? 'Medicine saved to SQLite Room!' : 'دوا روم ڈیٹا بیس میں کامیابی سے محفوظ ہو گئی!'}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Family Member Assign */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
          <label className="block text-sm font-bold text-slate-900 mb-2">
            {t.forMember} *
          </label>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => {
              const isSelected = m.id === selectedMemberId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    alarmManager.playChime('click');
                    setSelectedMemberId(m.id);
                  }}
                  className={`min-h-[46px] px-3.5 py-1.5 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${m.avatarColor} text-white flex items-center justify-center text-[10px]`}>
                    {m.name.charAt(0)}
                  </div>
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Quick Presets Bar */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t.quickPresets}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="min-h-[40px] px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0"
              >
                + {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Medicine Name & Dosage */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              {t.medicineNameLabel} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.medicineNamePlaceholder}
              className="w-full min-h-[54px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-lg font-bold text-slate-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                {t.dosageLabel}
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder={t.dosagePlaceholder}
                className="w-full min-h-[50px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-base font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                {t.formLabel}
              </label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value as Medicine['form'])}
                className="w-full min-h-[50px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-base font-bold text-slate-900 bg-white"
              >
                <option value="tablet">{t.tablet}</option>
                <option value="capsule">{t.capsule}</option>
                <option value="syrup">{t.syrup}</option>
                <option value="drops">{t.drops}</option>
                <option value="injection">{t.injection}</option>
                <option value="inhaler">{t.inhaler}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Meal Timing Selector */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
          <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-emerald-700" />
            <span>{t.selectMealTiming} *</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'before_meal' as MealTiming, label: t.beforeMeal, icon: '🍽️' },
              { id: 'after_meal' as MealTiming, label: t.afterMeal, icon: '☕' },
              { id: 'with_meal' as MealTiming, label: t.withMeal, icon: '🥪' },
              { id: 'empty_stomach' as MealTiming, label: t.emptyStomach, icon: '🌅' },
            ].map((timing) => {
              const isSelected = mealTiming === timing.id;
              return (
                <button
                  key={timing.id}
                  type="button"
                  onClick={() => {
                    alarmManager.playChime('click');
                    setMealTiming(timing.id);
                  }}
                  className={`min-h-[52px] p-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <span className="text-base mb-0.5">{timing.icon}</span>
                  <span className="leading-tight">{timing.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Schedule Times Selector (Morning, Afternoon, Evening, Night) */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
          <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{t.selectScheduleTimes} *</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { slot: 'morning' as TimeSlot, label: t.timeMorning, time: '8:00 AM' },
              { slot: 'afternoon' as TimeSlot, label: t.timeAfternoon, time: '1:30 PM' },
              { slot: 'evening' as TimeSlot, label: t.timeEvening, time: '6:30 PM' },
              { slot: 'night' as TimeSlot, label: t.timeNight, time: '9:30 PM' },
            ].map((item) => {
              const isSelected = selectedSlots.includes(item.slot);
              return (
                <button
                  key={item.slot}
                  type="button"
                  onClick={() => toggleSlot(item.slot)}
                  className={`min-h-[56px] p-2.5 rounded-xl border-2 font-bold text-sm flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                  </div>
                  <span className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Total Stock & Low Stock Threshold */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <Package className="w-4 h-4 text-emerald-700" />
            <span>{t.totalPillsStock} & Refill Alert</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {t.totalPillsStock}
              </label>
              <input
                type="number"
                min="0"
                value={totalStock}
                onChange={(e) => setTotalStock(e.target.value)}
                className="w-full min-h-[50px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-lg font-black text-slate-900 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {t.lowStockAlertAt}
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full min-h-[50px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-lg font-black text-rose-700 bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* 7. Exact Offline AlarmManager Toggle */}
        <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-emerald-950">
                {t.scheduleAlarms}
              </h4>
              <p className="text-xs text-emerald-800 font-medium">
                {t.scheduleAlarmsDesc}
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={alarmEnabled}
            onChange={(e) => setAlarmEnabled(e.target.checked)}
            className="w-6 h-6 accent-emerald-700 cursor-pointer rounded"
          />
        </div>

        {/* Big Submit Button */}
        <button
          type="submit"
          className="w-full min-h-[64px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/30 transition-transform cursor-pointer border-2 border-emerald-600"
        >
          <Check className="w-7 h-7 stroke-[3]" />
          <span>{t.saveMedicineBtn}</span>
        </button>
      </form>
    </div>
  );
};
