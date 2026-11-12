import React, { useEffect } from 'react';
import { BellRing, Check, Clock, Volume2, X } from 'lucide-react';
import { Medicine, DoseRecord, Language } from '../types';
import { translations } from '../i18n/translations';
import { alarmManager } from '../services/alarmManager';

interface AlarmModalProps {
  medicine: Medicine;
  dose: DoseRecord;
  lang: Language;
  onTakeDose: (doseId: string, medicineId: string) => void;
  onSnoozeDose: (doseId: string) => void;
  onClose: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  medicine,
  dose,
  lang,
  onTakeDose,
  onSnoozeDose,
  onClose,
}) => {
  const t = translations[lang];

  useEffect(() => {
    // Automatically read aloud once when opened for elder assistance
    const speechText =
      lang === 'en'
        ? `Reminder! Please take your medicine: ${medicine.name}, ${medicine.dosage}, ${medicine.mealTiming.replace('_', ' ')}`
        : `${medicine.name} دوا لینے کا وقت ہو گیا ہے۔ خوراک: ${medicine.dosage}`;
    
    // Slight delay so audio context initializes
    const timer = setTimeout(() => {
      alarmManager.speakInstruction(speechText, lang);
    }, 600);

    return () => {
      clearTimeout(timer);
      alarmManager.stopRingingLoop();
    };
  }, [medicine, dose, lang]);

  const handleTake = () => {
    alarmManager.stopRingingLoop();
    alarmManager.playChime('success');
    onTakeDose(dose.id, medicine.id);
  };

  const handleSnooze = () => {
    alarmManager.stopRingingLoop();
    alarmManager.playChime('click');
    onSnoozeDose(dose.id);
  };

  const handleReadAloud = () => {
    const text =
      lang === 'en'
        ? `Medicine: ${medicine.name}. Dose: ${medicine.dosage}. Take ${medicine.mealTiming.replace('_', ' ')}.`
        : `${medicine.name}۔ مقدار: ${medicine.dosage}۔ ${medicine.mealTiming === 'after_meal' ? 'کھانے کے بعد' : 'کھانے سے پہلے'} لیں۔`;
    alarmManager.speakInstruction(text, lang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400">
        {/* Urgent Header */}
        <div className="bg-amber-500 text-slate-950 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-amber-600 flex items-center justify-center animate-bounce shadow-md">
              <BellRing className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-950 block">
                {t.alarmRinging}
              </span>
              <h2 className="text-xl font-black leading-tight text-slate-950">
                {t.timeToTake}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              alarmManager.stopRingingLoop();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-amber-400/80 hover:bg-amber-400 flex items-center justify-center text-slate-900 cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Medicine Details Card */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              {t.timeMorning} / {dose.scheduledTime}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
              {medicine.name}
            </h3>
            <div className="inline-block bg-white text-emerald-800 font-bold px-3 py-1 rounded-full text-base border border-emerald-300 shadow-sm mt-1">
              💊 {medicine.dosage}
            </div>

            {/* Meal timing badge */}
            <div className="mt-3 text-sm font-bold text-slate-700 bg-white/80 py-1.5 px-3 rounded-lg border border-slate-200 inline-flex items-center gap-2">
              <span>🍽️</span>
              <span>
                {medicine.mealTiming === 'before_meal'
                  ? t.beforeMeal
                  : medicine.mealTiming === 'after_meal'
                  ? t.afterMeal
                  : medicine.mealTiming === 'empty_stomach'
                  ? t.emptyStomach
                  : t.withMeal}
              </span>
            </div>
          </div>

          {/* Voice instruction button for elders */}
          <button
            onClick={handleReadAloud}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-2 border border-slate-300 transition-colors cursor-pointer text-sm"
          >
            <Volume2 className="w-5 h-5 text-emerald-700" />
            <span>{t.speechListen}</span>
          </button>

          {/* Huge Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Primary 'Taken' Button */}
            <button
              onClick={handleTake}
              type="button"
              className="w-full min-h-[64px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/30 transition-transform cursor-pointer border-2 border-emerald-600"
            >
              <Check className="w-8 h-8 stroke-[3]" />
              <span>{t.takeNow}</span>
            </button>

            {/* Remind Later / Snooze Button */}
            <button
              onClick={handleSnooze}
              type="button"
              className="w-full min-h-[54px] bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-900 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 border-2 border-slate-300 transition-transform cursor-pointer"
            >
              <Clock className="w-6 h-6 text-amber-600 stroke-[2.2]" />
              <span>{t.snooze10m}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
