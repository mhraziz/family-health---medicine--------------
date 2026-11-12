import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  CloudSun, 
  Sunset, 
  Moon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Volume2, 
  Bell, 
  ChevronRight, 
  Sparkles,
  Utensils,
  RefreshCw,
  Plus
} from 'lucide-react';
import { 
  Language, 
  TimeSlot, 
  DoseRecord, 
  Medicine, 
  FamilyMember 
} from '../types';
import { translations } from '../i18n/translations';
import { roomDb } from '../db/roomDatabase';
import { alarmManager } from '../services/alarmManager';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface HomeScreenProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeMemberId: string;
  onSelectMember: (id: string) => void;
  onNavigateToAddMed: () => void;
  onTriggerAlarmModal: (medicine: Medicine, dose: DoseRecord) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  lang,
  onLanguageChange,
  activeMemberId,
  onSelectMember,
  onNavigateToAddMed,
  onTriggerAlarmModal,
}) => {
  const t = translations[lang];

  const [members, setMembers] = useState<FamilyMember[]>(roomDb.getAllMembers());
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [doses, setDoses] = useState<DoseRecord[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeMember = members.find((m) => m.id === activeMemberId) || members[0];

  const loadData = () => {
    setMembers(roomDb.getAllMembers());
    if (activeMemberId) {
      setMedicines(roomDb.getMedicinesForMember(activeMemberId));
      setDoses(roomDb.getTodayDosesForMember(activeMemberId));
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = roomDb.subscribe(loadData);
    return () => unsubscribe();
  }, [activeMemberId]);

  // Handle Marking Dose as Taken
  const handleMarkTaken = (doseId: string, medicineId: string) => {
    alarmManager.playChime('success');
    roomDb.markDoseTaken(doseId, medicineId);
    showToast(t.takenSuccess);
  };

  // Handle Snooze / Remind Later
  const handleRemindLater = (doseId: string, medicine: Medicine, dose: DoseRecord) => {
    alarmManager.playChime('click');
    roomDb.snoozeDose(doseId, 15);
    showToast(t.remindSnoozed);
    // Also schedule alarm trigger test
    setTimeout(() => {
      onTriggerAlarmModal(medicine, dose);
    }, 1500);
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  // Read aloud medicine dose for elder assistance
  const handleSpeakDose = (med: Medicine) => {
    alarmManager.playChime('click');
    const timingText =
      med.mealTiming === 'before_meal'
        ? t.beforeMeal
        : med.mealTiming === 'after_meal'
        ? t.afterMeal
        : t.withMeal;

    const speechText =
      lang === 'en'
        ? `${med.name}, dose: ${med.dosage}. Take ${timingText}.`
        : `${med.name}۔ خوراک: ${med.dosage}۔ ${timingText}۔`;
    alarmManager.speakInstruction(speechText, lang);
  };

  // Helper to map slot to display
  const slotConfigs: { slot: TimeSlot; title: string; timeDesc: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { slot: 'morning', title: t.timeMorning, timeDesc: t.morningTimeDesc, icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { slot: 'afternoon', title: t.timeAfternoon, timeDesc: t.afternoonTimeDesc, icon: CloudSun, color: 'text-orange-500 bg-orange-50 border-orange-200' },
    { slot: 'evening', title: t.timeEvening, timeDesc: t.eveningTimeDesc, icon: Sunset, color: 'text-rose-500 bg-rose-50 border-rose-200' },
    { slot: 'night', title: t.timeNight, timeDesc: t.nightTimeDesc, icon: Moon, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  ];

  // Calculate today's dose completion
  const totalTodayDoses = doses.length;
  const takenTodayDoses = doses.filter((d) => d.status === 'taken').length;
  const progressPercent = totalTodayDoses > 0 ? Math.round((takenTodayDoses / totalTodayDoses) * 100) : 0;

  // Check if any medicine has low stock
  const lowStockMeds = medicines.filter((m) => m.totalStock <= m.lowStockThreshold);

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Prominent Language Switcher at the very top */}
      <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />

      {/* 2. Family Member Quick Switcher Strip */}
      <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.switchMember}
          </span>
          <span className="text-xs font-bold text-emerald-700">
            {activeMember ? activeMember.name : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {members.map((mem) => {
            const isSelected = mem.id === activeMemberId;
            return (
              <button
                key={mem.id}
                onClick={() => {
                  alarmManager.playChime('click');
                  onSelectMember(mem.id);
                }}
                className={`min-h-[46px] px-3.5 py-1.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full ${mem.avatarColor} text-white flex items-center justify-center text-xs font-bold`}
                >
                  {mem.name.charAt(0)}
                </div>
                <span>{mem.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Global Low-Stock Banner if any medicine is running low */}
      {lowStockMeds.length > 0 && (
        <div className="bg-rose-500 text-white p-4 rounded-2xl shadow-md border-2 border-rose-600 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center shrink-0 font-black shadow-sm">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {t.lowStockWarning}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-rose-100 mt-0.5">
                {lowStockMeds.map((m) => `${m.name} (${m.totalStock} ${t.pillsLeft})`).join(' • ')}
              </p>
              <div className="mt-2 text-[11px] font-extrabold bg-white/20 px-2.5 py-1 rounded-lg inline-block">
                {t.urgentRefill}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Today's Medicine Progress Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {t.todayProgress}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              {takenTodayDoses} / {totalTodayDoses} {t.dosesCompleted}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Test Alarm Sound Trigger Button */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">
            {lang === 'en' ? 'Alarm Reminder Test:' : 'الارم گھنٹی کی آزمائش:'}
          </span>
          <button
            type="button"
            onClick={() => {
              if (medicines.length > 0 && doses.length > 0) {
                onTriggerAlarmModal(medicines[0], doses[0]);
              } else {
                alarmManager.playChime('alarm');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 border border-amber-300 transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-800" />
            <span>{t.testAlarm}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="bg-emerald-800 text-white p-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg animate-fadeIn border-2 border-emerald-600">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 5. The 4 Scheduled Time Sections: Morning, Afternoon, Evening, Night */}
      <div className="space-y-4">
        {slotConfigs.map(({ slot, title, timeDesc, icon: Icon, color }) => {
          // Find doses matching this slot
          const slotDoses = doses.filter((d) => d.timeSlot === slot);
          const slotMedicines = medicines.filter((m) => m.timeSlots.includes(slot));

          return (
            <div
              key={slot}
              className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm overflow-hidden"
            >
              {/* Slot Header */}
              <div className={`px-4 py-3 flex items-center justify-between border-b ${color}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {title}
                    </h3>
                    <span className="text-xs font-bold text-slate-600">
                      {timeDesc}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-slate-800 border border-slate-200 shadow-xs">
                  {slotDoses.filter((d) => d.status === 'taken').length} / {slotDoses.length} {t.takenBtn}
                </span>
              </div>

              {/* Slot Dose Items */}
              <div className="p-4 space-y-3">
                {slotMedicines.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic text-center py-2">
                    {t.noMedsInSlot}
                  </p>
                ) : (
                  slotMedicines.map((med) => {
                    const dose = slotDoses.find((d) => d.medicineId === med.id);
                    const isTaken = dose?.status === 'taken';
                    const isSnoozed = dose?.status === 'snoozed';
                    const isLowStock = med.totalStock <= med.lowStockThreshold;

                    return (
                      <div
                        key={med.id}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          isTaken
                            ? 'bg-slate-50 border-slate-200 opacity-80'
                            : isLowStock
                            ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                            : 'bg-white border-slate-200 shadow-sm hover:border-slate-400'
                        }`}
                      >
                        {/* Upper row: Medicine Name, Dosage, Read Aloud */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                                {med.name}
                              </h4>

                              {/* Low Stock Badge on Card */}
                              {isLowStock && (
                                <span className="bg-rose-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                  <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                                  <span>{t.lowStockWarning}</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {/* Dosage Badge */}
                              <span className="text-sm font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                                💊 {med.dosage}
                              </span>

                              {/* Meal Timing Badge */}
                              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1">
                                <Utensils className="w-3.5 h-3.5 text-slate-500" />
                                <span>
                                  {med.mealTiming === 'before_meal'
                                    ? t.beforeMeal
                                    : med.mealTiming === 'after_meal'
                                    ? t.afterMeal
                                    : med.mealTiming === 'empty_stomach'
                                    ? t.emptyStomach
                                    : t.withMeal}
                                </span>
                              </span>

                              {/* Remaining Stock Counter */}
                              <span
                                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                  isLowStock
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300 font-black'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {med.totalStock} {t.pillsLeft}
                              </span>
                            </div>

                            {med.instructions && (
                              <p className="text-xs text-slate-500 font-medium mt-1.5">
                                ℹ️ {med.instructions}
                              </p>
                            )}
                          </div>

                          {/* Voice Readout Button */}
                          <button
                            type="button"
                            onClick={() => handleSpeakDose(med)}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 transition-colors cursor-pointer"
                            title={t.speechListen}
                            aria-label={t.speechListen}
                          >
                            <Volume2 className="w-5 h-5 text-emerald-700" />
                          </button>
                        </div>

                        {/* Lower row: Huge High-Contrast Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          {isTaken ? (
                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl font-bold text-sm">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
                                <span>{t.takenSuccess}</span>
                              </div>
                              <span className="text-xs text-emerald-700 font-mono">
                                {dose?.takenAt ? new Date(dose.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Done'}
                              </span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {/* Huge 'Taken' Button */}
                              <button
                                type="button"
                                onClick={() => handleMarkTaken(dose?.id || `temp_${med.id}`, med.id)}
                                className="min-h-[58px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-2.5 shadow-md shadow-emerald-700/20 transition-all cursor-pointer border-2 border-emerald-600"
                              >
                                <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                                <span>{t.takenBtn}</span>
                              </button>

                              {/* Large 'Remind Later' Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemindLater(
                                    dose?.id || `temp_${med.id}`,
                                    med,
                                    dose || {
                                      id: `temp_${med.id}`,
                                      medicineId: med.id,
                                      memberId: med.memberId,
                                      medicineName: med.name,
                                      timeSlot: slot,
                                      scheduledDate: 'today',
                                      scheduledTime: 'now',
                                      status: 'pending',
                                    }
                                  )
                                }
                                className="min-h-[50px] bg-amber-100 hover:bg-amber-200 active:scale-[0.98] text-amber-950 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border-2 border-amber-300 transition-all cursor-pointer"
                              >
                                <Clock className="w-5 h-5 text-amber-700 stroke-[2.2]" />
                                <span>{isSnoozed ? 'Snoozed (15m)' : t.remindLaterBtn}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Medicine CTA button at the bottom of the feed */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            alarmManager.playChime('click');
            onNavigateToAddMed();
          }}
          className="w-full min-h-[54px] bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>{t.addNewMedicineTitle}</span>
        </button>
      </div>
    </div>
  );
};
