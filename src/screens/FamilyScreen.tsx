import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Heart, 
  Activity, 
  Shield, 
  Check, 
  Calendar, 
  Plus, 
  X,
  UserCheck
} from 'lucide-react';
import { FamilyMember, Language, RelationType } from '../types';
import { translations } from '../i18n/translations';
import { roomDb } from '../db/roomDatabase';
import { alarmManager } from '../services/alarmManager';

interface FamilyScreenProps {
  lang: Language;
  activeMemberId: string;
  onSelectMember: (id: string) => void;
}

export const FamilyScreen: React.FC<FamilyScreenProps> = ({
  lang,
  activeMemberId,
  onSelectMember,
}) => {
  const t = translations[lang];
  const [members, setMembers] = useState<FamilyMember[]>(roomDb.getAllMembers());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<RelationType>('mother');
  const [age, setAge] = useState<string>('60');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [avatarColor, setAvatarColor] = useState('bg-emerald-600');
  const [conditionInput, setConditionInput] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const refreshMembers = () => {
    setMembers(roomDb.getAllMembers());
  };

  const commonConditions = [
    { id: 'bp', label: lang === 'en' ? 'High Blood Pressure' : 'بلڈ پریشر (بی پی)' },
    { id: 'sugar', label: lang === 'en' ? 'Diabetes (Sugar)' : 'شوگر (ذیابیطس)' },
    { id: 'joints', label: lang === 'en' ? 'Joint Pain / Arthritis' : 'جوڑوں کا درد' },
    { id: 'heart', label: lang === 'en' ? 'Heart Health' : 'دل کی صحت' },
    { id: 'cholesterol', label: lang === 'en' ? 'Cholesterol' : 'کولیسٹرول' },
  ];

  const toggleCondition = (cond: string) => {
    alarmManager.playChime('click');
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    alarmManager.playChime('success');
    const allConds = [...selectedConditions];
    if (conditionInput.trim()) {
      allConds.push(conditionInput.trim());
    }

    const newMem = roomDb.insertMember({
      name: name.trim(),
      relation,
      age: age ? parseInt(age, 10) : undefined,
      gender,
      avatarColor,
      avatarIcon: 'heart',
      conditions: allConds,
    });

    onSelectMember(newMem.id);
    setName('');
    setAge('60');
    setSelectedConditions([]);
    setConditionInput('');
    setShowAddModal(false);
    refreshMembers();
  };

  const getRelationLabel = (rel: RelationType): string => {
    switch (rel) {
      case 'mother': return t.relMother;
      case 'father': return t.relFather;
      case 'grandmother': return t.relGrandmother;
      case 'grandfather': return t.relGrandfather;
      case 'spouse': return t.relSpouse;
      case 'sibling': return t.relSibling;
      case 'child': return t.relChild;
      case 'self': return t.relSelf;
      default: return t.relOther;
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Banner / Add Button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            <span>{t.familyProfilesTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {lang === 'en' 
              ? 'Select profile to manage doses & health records' 
              : 'جس فرد کی دوائیں دیکھنی ہیں، اس کا کارڈ منتخب کریں'}
          </p>
        </div>

        <button
          onClick={() => {
            alarmManager.playChime('click');
            setShowAddModal(true);
          }}
          type="button"
          className="min-h-[48px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          <span className="hidden sm:inline">{t.addFamilyMemberBtn}</span>
          <span className="sm:hidden">{lang === 'en' ? 'Add' : 'نیا'}</span>
        </button>
      </div>

      {/* Family Member Cards List */}
      <div className="grid grid-cols-1 gap-3">
        {members.map((member) => {
          const isActive = member.id === activeMemberId;
          const medsCount = roomDb.getMedicinesForMember(member.id).length;
          const vitalsCount = roomDb.getVitalsForMember(member.id).length;

          return (
            <div
              key={member.id}
              onClick={() => {
                alarmManager.playChime('click');
                onSelectMember(member.id);
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-emerald-50/70 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Large Avatar */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${member.avatarColor} text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0`}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 leading-tight">
                        {member.name}
                      </h3>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{t.activeMember}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {getRelationLabel(member.relation)}
                      </span>
                      {member.age && (
                        <span className="text-slate-500">
                          {member.age} {lang === 'en' ? 'yrs' : 'سال'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Switch Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    alarmManager.playChime('click');
                    onSelectMember(member.id);
                  }}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isActive ? (lang === 'en' ? 'Active' : 'منتخب') : t.switchMember}</span>
                </button>
              </div>

              {/* Health conditions tags */}
              {member.conditions && member.conditions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-bold text-slate-500">
                    {lang === 'en' ? 'Conditions:' : 'طبی ریکارڈ:'}
                  </span>
                  {member.conditions.map((cond, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick statistics row */}
              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100/70">
                <span className="font-medium">
                  💊 {medsCount} {lang === 'en' ? 'active medicines' : 'دوائیں شیڈول ہیں'}
                </span>
                <span className="font-medium">
                  🩺 {vitalsCount} {lang === 'en' ? 'vital logs' : 'بی پی / شوگر ریکارڈ'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-300 max-h-[90vh] flex flex-col">
            <div className="bg-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-6 h-6" />
                <h3 className="text-xl font-black">{t.addFamilyMemberBtn}</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center cursor-pointer text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Member Name */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  {t.memberNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.memberNamePlaceholder}
                  className="w-full min-h-[52px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-base font-semibold text-slate-900 bg-white"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  {t.relationLabel}
                </label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value as RelationType)}
                  className="w-full min-h-[52px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-base font-semibold text-slate-900 bg-white"
                >
                  <option value="mother">{t.relMother}</option>
                  <option value="father">{t.relFather}</option>
                  <option value="grandmother">{t.relGrandmother}</option>
                  <option value="grandfather">{t.relGrandfather}</option>
                  <option value="spouse">{t.relSpouse}</option>
                  <option value="sibling">{t.relSibling}</option>
                  <option value="child">{t.relChild}</option>
                  <option value="self">{t.relSelf}</option>
                  <option value="other">{t.relOther}</option>
                </select>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">
                    {t.ageLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full min-h-[52px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-base font-bold text-slate-900 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">
                    {lang === 'en' ? 'Gender' : 'صنف'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'female' | 'male')}
                    className="w-full min-h-[52px] px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-base font-semibold text-slate-900 bg-white"
                  >
                    <option value="female">{lang === 'en' ? 'Female' : 'خاتون'}</option>
                    <option value="male">{lang === 'en' ? 'Male' : 'مرد'}</option>
                  </select>
                </div>
              </div>

              {/* Avatar Color */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  {lang === 'en' ? 'Profile Color' : 'پروفائل کا رنگ'}
                </label>
                <div className="flex gap-2">
                  {[
                    'bg-emerald-600',
                    'bg-sky-600',
                    'bg-amber-600',
                    'bg-rose-600',
                    'bg-purple-600',
                    'bg-teal-600',
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      className={`w-10 h-10 rounded-xl ${color} cursor-pointer flex items-center justify-center transition-transform ${
                        avatarColor === color ? 'ring-4 ring-slate-900 scale-110' : ''
                      }`}
                    >
                      {avatarColor === color && <Check className="w-5 h-5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditions checkboxes */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  {t.chronicConditions}
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonConditions.map((cond) => {
                    const isSelected = selectedConditions.includes(cond.label);
                    return (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => toggleCondition(cond.label)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-100 border-rose-600 text-rose-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {cond.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full min-h-[56px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform"
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                  <span>{t.saveMemberBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
