export type Language = 'en' | 'ur' | 'sd';

export type RelationType = 
  | 'mother' 
  | 'father' 
  | 'grandmother' 
  | 'grandfather' 
  | 'spouse' 
  | 'sibling' 
  | 'child' 
  | 'self' 
  | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  relation: RelationType;
  age?: number;
  gender?: 'female' | 'male' | 'other';
  avatarColor: string;
  avatarIcon: string;
  conditions: string[];
  createdAt: number;
}

export type MealTiming = 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Medicine {
  id: string;
  memberId: string;
  name: string;
  dosage: string; // e.g. "1 Tablet", "5ml Syrup"
  form: 'tablet' | 'capsule' | 'syrup' | 'drops' | 'injection' | 'inhaler';
  mealTiming: MealTiming;
  timeSlots: TimeSlot[]; // morning, afternoon, evening, night
  scheduleTimes: {
    morning?: string;   // "08:00"
    afternoon?: string; // "13:30"
    evening?: string;   // "18:30"
    night?: string;     // "21:30"
  };
  totalStock: number;
  lowStockThreshold: number; // e.g. 5 pills
  instructions?: string;
  alarmEnabled: boolean;
  color: string;
  createdAt: number;
}

export interface DoseRecord {
  id: string;
  medicineId: string;
  memberId: string;
  medicineName: string;
  timeSlot: TimeSlot;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: 'pending' | 'taken' | 'snoozed' | 'missed';
  takenAt?: number;
  snoozedUntil?: number;
}

export type VitalType = 'bp' | 'sugar';

export type BpCategory = 'normal' | 'elevated' | 'high_stage1' | 'high_stage2' | 'low';
export type SugarCategory = 'normal' | 'prediabetes' | 'high' | 'low';

export interface VitalRecord {
  id: string;
  memberId: string;
  type: VitalType;
  // Blood Pressure
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  bpCategory?: BpCategory;
  // Blood Sugar
  sugarValue?: number; // mg/dL
  sugarContext?: 'fasting' | 'random' | 'post_meal';
  sugarCategory?: SugarCategory;
  notes?: string;
  recordedAt: number;
  recordedDate: string; // YYYY-MM-DD
}

export interface RoomTableStats {
  tableName: string;
  rowCount: number;
  columns: string[];
}
