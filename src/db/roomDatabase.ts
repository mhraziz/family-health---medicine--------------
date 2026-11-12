import { 
  FamilyMember, 
  Medicine, 
  DoseRecord, 
  VitalRecord, 
  TimeSlot,
  BpCategory,
  SugarCategory 
} from '../types';

const STORAGE_KEYS = {
  MEMBERS: 'room_sqlite_table_family_members_v1',
  MEDICINES: 'room_sqlite_table_medicines_v1',
  DOSES: 'room_sqlite_table_dose_records_v1',
  VITALS: 'room_sqlite_table_vitals_records_v1',
  ACTIVE_MEMBER_ID: 'room_sqlite_active_member_id_v1',
  AIRPLANE_MODE: 'room_sqlite_airplane_mode_v1',
};

// IndexedDB Helper for Permanent Offline Storage
const IDB_NAME = 'SehatSathiRoomDB';
const IDB_VERSION = 1;

function openIndexedDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('family_members')) {
        db.createObjectStore('family_members', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('medicines')) {
        db.createObjectStore('medicines', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('dose_records')) {
        db.createObjectStore('dose_records', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('vitals_records')) {
        db.createObjectStore('vitals_records', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

async function persistToIndexedDB(storeName: string, items: unknown[]) {
  try {
    const db = await openIndexedDB();
    if (!db) return;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    items.forEach((item) => store.put(item));
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
  }
}

// Seed initial realistic data for Ammi & Abbu
const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'mem_ammi_1',
    name: 'Ammi (امی جان)',
    relation: 'mother',
    age: 65,
    gender: 'female',
    avatarColor: 'bg-emerald-600',
    avatarIcon: 'heart',
    conditions: ['High Blood Pressure (بی پی)', 'Type 2 Diabetes (شوگر)'],
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'mem_abbu_2',
    name: 'Abbu (ابو جان)',
    relation: 'father',
    age: 72,
    gender: 'male',
    avatarColor: 'bg-sky-600',
    avatarIcon: 'activity',
    conditions: ['Joint Pain / Arthritis (جوڑوں کا درد)', 'Heart Health'],
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'mem_dadi_3',
    name: 'Dadi (ڏاڏي امڙ)',
    relation: 'grandmother',
    age: 84,
    gender: 'female',
    avatarColor: 'bg-amber-600',
    avatarIcon: 'shield',
    conditions: ['Weakness (کمزوری)', 'Eye care'],
    createdAt: Date.now() - 86400000 * 15,
  }
];

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med_glucophage',
    memberId: 'mem_ammi_1',
    name: 'Glucophage (Metformin)',
    dosage: '1 Tablet (500mg)',
    form: 'tablet',
    mealTiming: 'after_meal',
    timeSlots: ['morning', 'night'],
    scheduleTimes: {
      morning: '08:00',
      night: '21:30',
    },
    totalStock: 18,
    lowStockThreshold: 6,
    instructions: 'Take with plenty of water after breakfast and dinner.',
    alarmEnabled: true,
    color: 'emerald',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'med_concor',
    memberId: 'mem_ammi_1',
    name: 'Concor (Bisoprolol)',
    dosage: '1 Tablet (5mg)',
    form: 'tablet',
    mealTiming: 'before_meal',
    timeSlots: ['morning'],
    scheduleTimes: {
      morning: '08:00',
    },
    totalStock: 3, // LOW STOCK! Threshold is 5
    lowStockThreshold: 5,
    instructions: 'Take 30 mins before breakfast for blood pressure control.',
    alarmEnabled: true,
    color: 'rose',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'med_loprin',
    memberId: 'mem_ammi_1',
    name: 'Loprin (Aspirin)',
    dosage: '1 Tablet (75mg)',
    form: 'tablet',
    mealTiming: 'after_meal',
    timeSlots: ['evening'],
    scheduleTimes: {
      evening: '18:30',
    },
    totalStock: 22,
    lowStockThreshold: 5,
    instructions: 'After evening tea.',
    alarmEnabled: true,
    color: 'indigo',
    createdAt: Date.now() - 86400000 * 10,
  },
  // Abbu's Medicines
  {
    id: 'med_calpol',
    memberId: 'mem_abbu_2',
    name: 'Calpol Joint Relief',
    dosage: '1 Tablet (650mg)',
    form: 'tablet',
    mealTiming: 'after_meal',
    timeSlots: ['morning', 'night'],
    scheduleTimes: {
      morning: '08:00',
      night: '21:30',
    },
    totalStock: 14,
    lowStockThreshold: 5,
    instructions: 'For knee joint pain.',
    alarmEnabled: true,
    color: 'sky',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'med_omega3',
    memberId: 'mem_abbu_2',
    name: 'Omega 3 Fish Oil',
    dosage: '1 Capsule',
    form: 'capsule',
    mealTiming: 'with_meal',
    timeSlots: ['afternoon'],
    scheduleTimes: {
      afternoon: '13:30',
    },
    totalStock: 2, // LOW STOCK!
    lowStockThreshold: 5,
    instructions: 'Take with afternoon lunch.',
    alarmEnabled: true,
    color: 'amber',
    createdAt: Date.now() - 86400000 * 8,
  },
];

// Helper to get today's date in YYYY-MM-DD
export function getTodayDateStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Initial vitals
const INITIAL_VITALS: VitalRecord[] = [
  {
    id: 'vit_bp_1',
    memberId: 'mem_ammi_1',
    type: 'bp',
    systolic: 122,
    diastolic: 78,
    pulse: 74,
    bpCategory: 'normal',
    notes: 'Morning reading after walking',
    recordedAt: Date.now() - 86400000 * 1,
    recordedDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
  },
  {
    id: 'vit_bp_2',
    memberId: 'mem_ammi_1',
    type: 'bp',
    systolic: 138,
    diastolic: 88,
    pulse: 82,
    bpCategory: 'high_stage1',
    notes: 'Felt slight headache in afternoon',
    recordedAt: Date.now() - 86400000 * 3,
    recordedDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
  },
  {
    id: 'vit_bp_3',
    memberId: 'mem_ammi_1',
    type: 'bp',
    systolic: 118,
    diastolic: 76,
    pulse: 70,
    bpCategory: 'normal',
    notes: 'Ideal reading',
    recordedAt: Date.now() - 86400000 * 5,
    recordedDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
  },
  {
    id: 'vit_sugar_1',
    memberId: 'mem_ammi_1',
    type: 'sugar',
    sugarValue: 104,
    sugarContext: 'fasting',
    sugarCategory: 'prediabetes',
    notes: 'Morning fasting before chai',
    recordedAt: Date.now() - 86400000 * 1,
    recordedDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
  },
  {
    id: 'vit_sugar_2',
    memberId: 'mem_ammi_1',
    type: 'sugar',
    sugarValue: 142,
    sugarContext: 'random',
    sugarCategory: 'high',
    notes: 'After afternoon meal with biryani',
    recordedAt: Date.now() - 86400000 * 2,
    recordedDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
  },
];

type RoomDbListener = () => void;

class RoomSQLiteDatabase {
  private listeners: Set<RoomDbListener> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  public subscribe(listener: RoomDbListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Room DB listener error:', err);
      }
    });
  }

  private ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEDICINES)) {
      localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VITALS)) {
      localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(INITIAL_VITALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOSES)) {
      // Auto-generate doses for today for the initial medicines
      const today = getTodayDateStr();
      const doses: DoseRecord[] = [];
      INITIAL_MEDICINES.forEach((med) => {
        med.timeSlots.forEach((slot) => {
          doses.push({
            id: `dose_${med.id}_${slot}_${today}`,
            medicineId: med.id,
            memberId: med.memberId,
            medicineName: med.name,
            timeSlot: slot,
            scheduledDate: today,
            scheduledTime: med.scheduleTimes[slot] || '08:00',
            status: 'pending',
          });
        });
      });
      localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_MEMBER_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_MEMBER_ID, 'mem_ammi_1');
    }
  }

  // --- Active Member Management ---
  public getActiveMemberId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_MEMBER_ID) || 'mem_ammi_1';
  }

  public setActiveMemberId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MEMBER_ID, id);
    this.notify();
  }

  // --- Airplane Mode Simulation for Testing ---
  public isAirplaneMode(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AIRPLANE_MODE) === 'true';
  }

  public setAirplaneMode(enabled: boolean) {
    localStorage.setItem(STORAGE_KEYS.AIRPLANE_MODE, enabled ? 'true' : 'false');
    this.notify();
  }

  // --- DAO: FamilyMemberDao ---
  public getAllMembers(): FamilyMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return INITIAL_MEMBERS;
    }
  }

  public getMemberById(id: string): FamilyMember | undefined {
    return this.getAllMembers().find((m) => m.id === id);
  }

  public insertMember(member: Omit<FamilyMember, 'id' | 'createdAt'>): FamilyMember {
    const members = this.getAllMembers();
    const newMember: FamilyMember = {
      ...member,
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    members.push(newMember);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    persistToIndexedDB('family_members', members);
    this.notify();
    return newMember;
  }

  // --- DAO: MedicineDao ---
  public getAllMedicines(): Medicine[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      return data ? JSON.parse(data) : [];
    } catch {
      return INITIAL_MEDICINES;
    }
  }

  public getMedicinesForMember(memberId: string): Medicine[] {
    return this.getAllMedicines().filter((m) => m.memberId === memberId);
  }

  public insertMedicine(medicine: Omit<Medicine, 'id' | 'createdAt'>): Medicine {
    const medicines = this.getAllMedicines();
    const newMedicine: Medicine = {
      ...medicine,
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    medicines.push(newMedicine);
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
    persistToIndexedDB('medicines', medicines);

    // Also schedule doses for today
    const today = getTodayDateStr();
    const currentDoses = this.getAllDoseRecords();
    newMedicine.timeSlots.forEach((slot) => {
      currentDoses.push({
        id: `dose_${newMedicine.id}_${slot}_${today}`,
        medicineId: newMedicine.id,
        memberId: newMedicine.memberId,
        medicineName: newMedicine.name,
        timeSlot: slot,
        scheduledDate: today,
        scheduledTime: newMedicine.scheduleTimes[slot] || '08:00',
        status: 'pending',
      });
    });
    localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(currentDoses));
    persistToIndexedDB('dose_records', currentDoses);

    this.notify();
    return newMedicine;
  }

  public updateStock(medicineId: string, delta: number): Medicine | null {
    const medicines = this.getAllMedicines();
    const idx = medicines.findIndex((m) => m.id === medicineId);
    if (idx === -1) return null;
    const current = medicines[idx];
    const newStock = Math.max(0, current.totalStock + delta);
    medicines[idx] = { ...current, totalStock: newStock };
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
    persistToIndexedDB('medicines', medicines);
    this.notify();
    return medicines[idx];
  }

  // --- DAO: DoseRecordDao ---
  public getAllDoseRecords(): DoseRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOSES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getTodayDosesForMember(memberId: string): DoseRecord[] {
    const today = getTodayDateStr();
    let doses = this.getAllDoseRecords().filter(
      (d) => d.memberId === memberId && d.scheduledDate === today
    );

    // If no doses exist for today yet for this member, materialize them from the member's medicines
    if (doses.length === 0) {
      const meds = this.getMedicinesForMember(memberId);
      if (meds.length > 0) {
        const allDoses = this.getAllDoseRecords();
        const newDoses: DoseRecord[] = [];
        meds.forEach((med) => {
          med.timeSlots.forEach((slot) => {
            const rec: DoseRecord = {
              id: `dose_${med.id}_${slot}_${today}`,
              medicineId: med.id,
              memberId: med.memberId,
              medicineName: med.name,
              timeSlot: slot,
              scheduledDate: today,
              scheduledTime: med.scheduleTimes[slot] || '08:00',
              status: 'pending',
            };
            newDoses.push(rec);
            allDoses.push(rec);
          });
        });
        localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(allDoses));
        doses = newDoses;
      }
    }
    return doses;
  }

  public markDoseTaken(doseId: string, medicineId: string): boolean {
    const doses = this.getAllDoseRecords();
    const idx = doses.findIndex((d) => d.id === doseId);
    if (idx === -1) return false;

    doses[idx] = {
      ...doses[idx],
      status: 'taken',
      takenAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
    persistToIndexedDB('dose_records', doses);

    // Decrement pill count in medicines table (Room transactional logic)
    this.updateStock(medicineId, -1);
    this.notify();
    return true;
  }

  public snoozeDose(doseId: string, minutes: number = 15): boolean {
    const doses = this.getAllDoseRecords();
    const idx = doses.findIndex((d) => d.id === doseId);
    if (idx === -1) return false;

    doses[idx] = {
      ...doses[idx],
      status: 'snoozed',
      snoozedUntil: Date.now() + minutes * 60 * 1000,
    };
    localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
    persistToIndexedDB('dose_records', doses);
    this.notify();
    return true;
  }

  // --- DAO: VitalsDao ---
  public getAllVitals(): VitalRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VITALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return INITIAL_VITALS;
    }
  }

  public getVitalsForMember(memberId: string): VitalRecord[] {
    return this.getAllVitals()
      .filter((v) => v.memberId === memberId)
      .sort((a, b) => b.recordedAt - a.recordedAt);
  }

  public insertVital(vital: Omit<VitalRecord, 'id' | 'recordedAt' | 'recordedDate'>): VitalRecord {
    const vitals = this.getAllVitals();
    const now = Date.now();
    const today = getTodayDateStr();

    // Clinical categorizer
    let bpCategory: BpCategory | undefined = undefined;
    if (vital.type === 'bp' && vital.systolic && vital.diastolic) {
      const sys = vital.systolic;
      const dia = vital.diastolic;
      if (sys < 90 || dia < 60) {
        bpCategory = 'low';
      } else if (sys < 120 && dia < 80) {
        bpCategory = 'normal';
      } else if (sys <= 129 && dia < 80) {
        bpCategory = 'elevated';
      } else if (sys <= 139 || dia <= 89) {
        bpCategory = 'high_stage1';
      } else {
        bpCategory = 'high_stage2';
      }
    }

    let sugarCategory: SugarCategory | undefined = undefined;
    if (vital.type === 'sugar' && vital.sugarValue) {
      const val = vital.sugarValue;
      if (vital.sugarContext === 'fasting') {
        if (val < 70) sugarCategory = 'low';
        else if (val <= 99) sugarCategory = 'normal';
        else if (val <= 125) sugarCategory = 'prediabetes';
        else sugarCategory = 'high';
      } else {
        // Random / Post meal
        if (val < 70) sugarCategory = 'low';
        else if (val <= 140) sugarCategory = 'normal';
        else if (val <= 199) sugarCategory = 'prediabetes';
        else sugarCategory = 'high';
      }
    }

    const newRecord: VitalRecord = {
      ...vital,
      bpCategory: bpCategory || vital.bpCategory,
      sugarCategory: sugarCategory || vital.sugarCategory,
      id: `vit_${now}_${Math.random().toString(36).substring(2, 6)}`,
      recordedAt: now,
      recordedDate: today,
    };

    vitals.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
    persistToIndexedDB('vitals_records', vitals);
    this.notify();
    return newRecord;
  }

  public deleteVital(id: string): boolean {
    const vitals = this.getAllVitals().filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
    persistToIndexedDB('vitals_records', vitals);
    this.notify();
    return true;
  }

  // --- Room Schema & Inspector Utilities ---
  public getRoomStats(): {
    membersCount: number;
    medicinesCount: number;
    dosesCount: number;
    vitalsCount: number;
    isOffline: boolean;
    storageEngine: string;
  } {
    return {
      membersCount: this.getAllMembers().length,
      medicinesCount: this.getAllMedicines().length,
      dosesCount: this.getAllDoseRecords().length,
      vitalsCount: this.getAllVitals().length,
      isOffline: true,
      storageEngine: 'Room SQLite (Local Persistent DAO)',
    };
  }

  public resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.MEDICINES);
    localStorage.removeItem(STORAGE_KEYS.DOSES);
    localStorage.removeItem(STORAGE_KEYS.VITALS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_MEMBER_ID);
    this.ensureInitialized();
    this.notify();
  }

  public exportBackupJson(): string {
    const backup = {
      exportTimestamp: new Date().toISOString(),
      appName: 'Family Health & Medicine (Room SQLite Backup)',
      version: 1,
      tables: {
        family_members: this.getAllMembers(),
        medicines: this.getAllMedicines(),
        dose_records: this.getAllDoseRecords(),
        vitals_records: this.getAllVitals(),
      },
    };
    return JSON.stringify(backup, null, 2);
  }
}

export const roomDb = new RoomSQLiteDatabase();
