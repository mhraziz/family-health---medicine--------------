import { Language } from '../types';

export interface TranslationDictionary {
  // App Header & Branding
  appName: string;
  appSubtitle: string;
  offlineBadge: string;
  databaseBadge: string;

  // Language Switcher
  selectLanguage: string;
  english: string;
  urdu: string;
  sindhi: string;

  // Navigation Tabs
  tabToday: string;
  tabAddMed: string;
  tabVitals: string;
  tabFamily: string;

  // Time Slots
  timeMorning: string;
  timeAfternoon: string;
  timeEvening: string;
  timeNight: string;
  morningTimeDesc: string;
  afternoonTimeDesc: string;
  eveningTimeDesc: string;
  nightTimeDesc: string;

  // Dose Actions
  takenBtn: string;
  remindLaterBtn: string;
  takenSuccess: string;
  remindSnoozed: string;
  allDosesDone: string;
  noMedsInSlot: string;
  todayProgress: string;
  dosesCompleted: string;

  // Pill & Stock Warnings
  pillsLeft: string;
  pillsCount: string;
  lowStockWarning: string;
  refillSoon: string;
  urgentRefill: string;
  inStock: string;

  // Meal Timing
  beforeMeal: string;
  afterMeal: string;
  withMeal: string;
  emptyStomach: string;

  // Add Medicine Form
  addNewMedicineTitle: string;
  medicineNameLabel: string;
  medicineNamePlaceholder: string;
  dosageLabel: string;
  dosagePlaceholder: string;
  formLabel: string;
  tablet: string;
  capsule: string;
  syrup: string;
  drops: string;
  injection: string;
  inhaler: string;
  selectMealTiming: string;
  selectScheduleTimes: string;
  totalPillsStock: string;
  lowStockAlertAt: string;
  scheduleAlarms: string;
  scheduleAlarmsDesc: string;
  saveMedicineBtn: string;
  forMember: string;
  quickPresets: string;

  // Vitals Logbook
  vitalsTitle: string;
  bloodPressure: string;
  bloodSugar: string;
  systolic: string;
  diastolic: string;
  pulse: string;
  sugarValue: string;
  sugarUnit: string;
  fastingSugar: string;
  randomSugar: string;
  postMealSugar: string;
  saveVitalBtn: string;
  history30Days: string;
  noVitalsLogged: string;
  normalStatus: string;
  elevatedStatus: string;
  highStatus: string;
  lowStatus: string;
  doctorSummaryBtn: string;
  doctorSummaryTitle: string;
  close: string;

  // Clinical Guidance for Elders
  bpHelpNormal: string;
  bpHelpHigh: string;
  bpHelpElevated: string;
  sugarHelpNormal: string;
  sugarHelpHigh: string;

  // Family Screen
  familyProfilesTitle: string;
  addFamilyMemberBtn: string;
  memberNameLabel: string;
  memberNamePlaceholder: string;
  relationLabel: string;
  ageLabel: string;
  selectRelation: string;
  saveMemberBtn: string;
  activeMember: string;
  switchMember: string;
  chronicConditions: string;
  noMembers: string;

  // Relations
  relMother: string;
  relFather: string;
  relGrandmother: string;
  relGrandfather: string;
  relSpouse: string;
  relSibling: string;
  relChild: string;
  relSelf: string;
  relOther: string;

  // Alarm & Audio
  alarmRinging: string;
  timeToTake: string;
  snooze10m: string;
  takeNow: string;
  testAlarm: string;
  speechListen: string;

  // Room DB Inspector
  roomDbTitle: string;
  roomDbDesc: string;
  table: string;
  rows: string;
  inspectDb: string;
  resetDemoData: string;
  exportBackup: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'Sehat Sathi (Family Health)',
    appSubtitle: 'Offline Care for Elderly Parents & Household',
    offlineBadge: '100% Offline (SQLite Room)',
    databaseBadge: 'Room DB Active',

    selectLanguage: 'Language',
    english: 'English',
    urdu: 'اردو',
    sindhi: 'سنڌي',

    tabToday: "Today's Meds",
    tabAddMed: 'Add Medicine',
    tabVitals: 'Vitals Log',
    tabFamily: 'Family',

    timeMorning: 'Morning',
    timeAfternoon: 'Afternoon',
    timeEvening: 'Evening',
    timeNight: 'Night',
    morningTimeDesc: '8:00 AM (Breakfast)',
    afternoonTimeDesc: '1:30 PM (Lunch)',
    eveningTimeDesc: '6:30 PM (Tea / Sunset)',
    nightTimeDesc: '9:30 PM (Before Bed)',

    takenBtn: 'Taken',
    remindLaterBtn: 'Remind Later',
    takenSuccess: 'Dose marked as taken! Pill inventory updated.',
    remindSnoozed: 'Reminder set for 15 minutes.',
    allDosesDone: 'All doses for this slot have been taken!',
    noMedsInSlot: 'No medicines scheduled for this time.',
    todayProgress: "Today's Medicine Progress",
    dosesCompleted: 'doses taken',

    pillsLeft: 'pills left',
    pillsCount: 'in stock',
    lowStockWarning: 'LOW STOCK ALERT',
    refillSoon: 'Only {count} pills remaining. Please refill from pharmacy.',
    urgentRefill: 'Urgent Refill Needed',
    inStock: 'Stock OK',

    beforeMeal: 'Before Meal',
    afterMeal: 'After Meal',
    withMeal: 'With Meal',
    emptyStomach: 'Empty Stomach',

    addNewMedicineTitle: 'Add New Medicine',
    medicineNameLabel: 'Medicine Name',
    medicineNamePlaceholder: 'e.g. Panadol, Glucophage, Loprin',
    dosageLabel: 'Dosage / Amount',
    dosagePlaceholder: 'e.g. 1 Tablet (500mg), 5ml Syrup',
    formLabel: 'Medicine Type',
    tablet: 'Tablet',
    capsule: 'Capsule',
    syrup: 'Syrup',
    drops: 'Drops',
    injection: 'Injection',
    inhaler: 'Inhaler',
    selectMealTiming: 'When to Take?',
    selectScheduleTimes: 'Schedule Times (Select slots)',
    totalPillsStock: 'Total Pills in Pack / Bottle',
    lowStockAlertAt: 'Alert when pills reach (e.g. 5)',
    scheduleAlarms: 'Exact Offline Alarm Reminders',
    scheduleAlarmsDesc: 'Sounds audio alarm & shows high-contrast alert even without internet',
    saveMedicineBtn: 'Save to Room Database',
    forMember: 'Assign to Family Member',
    quickPresets: 'Quick Popular Medicines',

    vitalsTitle: 'Health Vitals Logbook',
    bloodPressure: 'Blood Pressure',
    bloodSugar: 'Blood Sugar',
    systolic: 'Upper (Systolic mmHg)',
    diastolic: 'Lower (Diastolic mmHg)',
    pulse: 'Heart Rate (Pulse bpm)',
    sugarValue: 'Blood Sugar (mg/dL)',
    sugarUnit: 'mg/dL',
    fastingSugar: 'Fasting (Before Breakfast)',
    randomSugar: 'Random (Any Time)',
    postMealSugar: '2 Hours After Meal',
    saveVitalBtn: 'Save Reading to SQLite',
    history30Days: '30-Day Health History',
    noVitalsLogged: 'No readings recorded yet. Tap above to log.',
    normalStatus: 'Normal Range',
    elevatedStatus: 'Elevated / Watch',
    highStatus: 'High (Seek Advice)',
    lowStatus: 'Low Reading',
    doctorSummaryBtn: 'Doctor Visit Summary',
    doctorSummaryTitle: 'Doctor Summary Report',
    close: 'Close',

    bpHelpNormal: 'Ideal reading (<120/80). Blood pressure is healthy.',
    bpHelpElevated: 'Slightly higher than ideal (120-129). Keep salt and stress low.',
    bpHelpHigh: 'High reading (>130 or >80). Ensure medicines are taken on time.',
    sugarHelpNormal: 'Within safe healthy zone.',
    sugarHelpHigh: 'Higher than normal target. Avoid sweets and review with physician.',

    familyProfilesTitle: 'Family Profiles',
    addFamilyMemberBtn: 'Add Family Member',
    memberNameLabel: 'Name',
    memberNamePlaceholder: 'e.g. Ammi, Abbu, Dadi',
    relationLabel: 'Relationship',
    ageLabel: 'Age (Years)',
    selectRelation: 'Select Relation',
    saveMemberBtn: 'Save Profile',
    activeMember: 'Current Active Profile',
    switchMember: 'Switch Profile',
    chronicConditions: 'Health Notes / Conditions',
    noMembers: 'No family profiles found.',

    relMother: 'Mother (Ammi)',
    relFather: 'Father (Abbu)',
    relGrandmother: 'Grandmother (Dadi / Nani)',
    relGrandfather: 'Grandfather (Dada / Nana)',
    relSpouse: 'Spouse',
    relSibling: 'Brother / Sister',
    relChild: 'Child',
    relSelf: 'Self',
    relOther: 'Other Elder / Relative',

    alarmRinging: 'MEDICINE TIME ALERT!',
    timeToTake: 'Please take your scheduled medicine now',
    snooze10m: 'Remind in 10 Mins',
    takeNow: 'I Took It (Mark Taken)',
    testAlarm: 'Test Alarm Sound',
    speechListen: 'Read Aloud (Voice)',

    roomDbTitle: 'Room (SQLite) Local Database',
    roomDbDesc: 'Zero cloud data leak. 100% saved locally on Android storage.',
    table: 'Table',
    rows: 'Rows',
    inspectDb: 'Inspect Room SQLite DB',
    resetDemoData: 'Reset Demo Data',
    exportBackup: 'Export Local Backup (JSON)',
  },

  ur: {
    appName: 'صحت ساتھی (خاندانی ادویات)',
    appSubtitle: 'والدین اور دیہی گھرانوں کے لیے آف لائن نگہداشت',
    offlineBadge: 'سو فیصد آف لائن (SQLite روم)',
    databaseBadge: 'لوکل ڈیٹا بیس فعال',

    selectLanguage: 'زبان منتخب کریں',
    english: 'English',
    urdu: 'اردو',
    sindhi: 'سنڌي',

    tabToday: 'آج کی دوائیں',
    tabAddMed: 'دوا شامل کریں',
    tabVitals: 'صحت کی ڈائری',
    tabFamily: 'خاندان',

    timeMorning: 'صبح',
    timeAfternoon: 'دوپہر',
    timeEvening: 'شام',
    timeNight: 'رات',
    morningTimeDesc: 'صبح 8:00 بجے (ناشتہ)',
    afternoonTimeDesc: 'دوپہر 1:30 بجے (کھانا)',
    eveningTimeDesc: 'شام 6:30 بجے (چائے / غروب)',
    nightTimeDesc: 'رات 9:30 بجے (سونے سے قبل)',

    takenBtn: 'پی لی / کھا لی',
    remindLaterBtn: 'بعد میں یاد دلائیں',
    takenSuccess: 'شاباش! دوا کھا لی گئی۔ گولیوں کی تعداد اپ ڈیٹ ہو گئی۔',
    remindSnoozed: 'الارم 15 منٹ بعد دوبارہ بجے گا۔',
    allDosesDone: 'اس وقت کی تمام دوائیں لی جا چکی ہیں!',
    noMedsInSlot: 'اس وقت کوئی دوا مقرر نہیں ہے۔',
    todayProgress: 'آج کی دوائیوں کی صورتحال',
    dosesCompleted: 'خوراکیں کھا لیں',

    pillsLeft: 'گولیاں باقی ہیں',
    pillsCount: 'موجود تعداد',
    lowStockWarning: '⚠️ گولیاں ختم ہونے والی ہیں!',
    refillSoon: 'صرف {count} گولیاں باقی ہیں۔ براہ کرم میڈیکل سٹور سے منگوائیں۔',
    urgentRefill: 'فوری ریفل درکار ہے',
    inStock: 'اسٹاک موجود ہے',

    beforeMeal: 'کھانے سے پہلے',
    afterMeal: 'کھانے کے بعد',
    withMeal: 'کھانے کے ساتھ',
    emptyStomach: 'نہار منہ (خالی پیٹ)',

    addNewMedicineTitle: 'نئی دوا درج کریں',
    medicineNameLabel: 'دوا کا نام',
    medicineNamePlaceholder: 'مثلاً پیناڈول، گلوکوفاج، لوپرن',
    dosageLabel: 'مقدار / خوراک',
    dosagePlaceholder: 'مثلاً 1 گولی (500mg) یا 1 چمچ شربت',
    formLabel: 'دوا کی قسم',
    tablet: 'گولی (ٹیبلٹ)',
    capsule: 'کیپسول',
    syrup: 'شربت (سیرپ)',
    drops: 'قطرے (ڈراپس)',
    injection: 'انجکشن / انسولین',
    inhaler: 'انہیلر',
    selectMealTiming: 'کب لینی ہے؟ (کھانے کا وقت)',
    selectScheduleTimes: 'اوقات مقرر کریں (وقت منتخب کریں)',
    totalPillsStock: 'ڈبے میں کل گولیوں کی تعداد',
    lowStockAlertAt: 'وارننگ کب آئے؟ (مثلاً 5 گولیاں)',
    scheduleAlarms: 'درست آف لائن الارم نوٹیفکیشن',
    scheduleAlarmsDesc: 'انٹرنیٹ کے بغیر بھی زور دار گھنٹی اور بڑی یاد دہانی دکھائے گا',
    saveMedicineBtn: 'روم ڈیٹا بیس میں محفوظ کریں',
    forMember: 'کس فرد کے لیے ہے؟',
    quickPresets: 'عام استعمال کی دوائیں',

    vitalsTitle: 'صحت کا ریکارڈ (بلڈ پریشر و شوگر)',
    bloodPressure: 'بلڈ پریشر (بی پی)',
    bloodSugar: 'شوگر لیول',
    systolic: 'اوپر والا نمبر (سسٹولک)',
    diastolic: 'نیچے والا نمبر (ڈائسٹولک)',
    pulse: 'نبض کی رفتار (دل کی دھڑکن)',
    sugarValue: 'شوگر کی ریڈنگ (mg/dL)',
    sugarUnit: 'mg/dL',
    fastingSugar: 'نہار منہ (صبح ناشتے سے پہلے)',
    randomSugar: 'رینڈم (دن کے کسی بھی وقت)',
    postMealSugar: 'کھانے کے 2 گھنٹے بعد',
    saveVitalBtn: 'ریڈنگ محفوظ کریں',
    history30Days: 'پچھلے 30 دن کا ریکارڈ',
    noVitalsLogged: 'ابھی تک کوئی ریڈنگ درج نہیں ہوئی۔ اوپر سے درج کریں۔',
    normalStatus: 'نارمل (تسلی بخش)',
    elevatedStatus: 'معمولی زیادہ (دھیان رکھیں)',
    highStatus: 'زیادہ (ڈاکٹر سے رابطہ کریں)',
    lowStatus: 'کم ریڈنگ',
    doctorSummaryBtn: 'ڈاکٹر کے لیے خلاصہ',
    doctorSummaryTitle: 'ڈاکٹر رپورٹ سمری',
    close: 'بند کریں',

    bpHelpNormal: 'بہترین ریڈنگ (120/80 سے کم)۔ بلڈ پریشر بالکل درست ہے۔',
    bpHelpElevated: 'معمولی زیادہ (120-129)۔ نمک کم کریں اور آرام کریں۔',
    bpHelpHigh: 'بلڈ پریشر زیادہ ہے! وقت پر دوا لیں اور ڈاکٹر کو دکھائیں۔',
    sugarHelpNormal: 'شوگر محفوظ حد میں ہے۔',
    sugarHelpHigh: 'شوگر زیادہ ہے۔ میٹھی اشیاء سے پرہیز کریں اور دوا لیں۔',

    familyProfilesTitle: 'خاندان کے افراد',
    addFamilyMemberBtn: 'نیا فرد شامل کریں',
    memberNameLabel: 'نام',
    memberNamePlaceholder: 'مثلاً امی جان، ابو جی، دادی جان',
    relationLabel: 'رشتہ / تعلق',
    ageLabel: 'عمر (سال)',
    selectRelation: 'رشتہ منتخب کریں',
    saveMemberBtn: 'پروفائل محفوظ کریں',
    activeMember: 'موجودہ فعال پروفائل',
    switchMember: 'پروفائل تبدیل کریں',
    chronicConditions: 'بیماری یا خاص ہدایات',
    noMembers: 'کوئی فرد موجود نہیں ہے۔ نیا شامل کریں۔',

    relMother: 'امی جان (والدہ)',
    relFather: 'ابو جان (والد)',
    relGrandmother: 'دادی جان / نانی جان',
    relGrandfather: 'دادا جان / نانا جان',
    relSpouse: 'شریک حیات',
    relSibling: 'بھائی / بہن',
    relChild: 'بیٹا / بیٹی',
    relSelf: 'ذاتی (خود)',
    relOther: 'دیگر بزرگ / رشتہ دار',

    alarmRinging: 'دوا لینے کا وقت ہو گیا ہے!',
    timeToTake: 'براہ کرم اپنی مقررہ دوا ابھی پانی کے ساتھ لیں',
    snooze10m: '10 منٹ بعد یاد دلائیں',
    takeNow: 'میں نے کھا لی (نشان لگائیں)',
    testAlarm: 'الارم گھنٹی چیک کریں',
    speechListen: 'آواز میں سنیں (بول کر بتائیں)',

    roomDbTitle: 'روم (SQLite) لوکل ڈیٹا بیس',
    roomDbDesc: 'کوئی ڈیٹا انٹرنیٹ پر نہیں جاتا۔ مکمل طور پر آپ کے فون میں محفوظ ہے۔',
    table: 'ٹیبل',
    rows: 'ریکارڈز',
    inspectDb: 'لوکل ڈیٹا بیس کا جائزہ لیں',
    resetDemoData: 'ڈیمو ڈیٹا دوبارہ سیٹ کریں',
    exportBackup: 'بیک اپ فائل ڈاؤن لوڈ کریں (JSON)',
  },

  sd: {
    appName: 'صحت ساٿي (خانداني دوائون)',
    appSubtitle: 'والدين ۽ ٻهراڙي وارن گهرن لاءِ آف لائن سار سنڀال',
    offlineBadge: '100% آف لائن (SQLite روم)',
    databaseBadge: 'لوڪل ڊيٽابيس فعال',

    selectLanguage: 'ٻولي چونڊيو',
    english: 'English',
    urdu: 'اردو',
    sindhi: 'سنڌي',

    tabToday: 'اڄ جون دوائون',
    tabAddMed: 'دوا شامل ڪريو',
    tabVitals: 'صحت جي ڊائري',
    tabFamily: 'خاندان',

    timeMorning: 'صبح',
    timeAfternoon: 'منجھند',
    timeEvening: 'شام',
    timeNight: 'رات',
    morningTimeDesc: 'صبح 8:00 وڳي (ناشتو)',
    afternoonTimeDesc: 'منجھند 1:30 وڳي (ماني)',
    eveningTimeDesc: 'شام 6:30 وڳي (چانهه / سج لٿي)',
    nightTimeDesc: 'رات 9:30 وڳي (سمهڻ کان اڳ)',

    takenBtn: 'کائي ورتي / پي ورتي',
    remindLaterBtn: 'پوءِ ياد ڏياريو',
    takenSuccess: 'شاباس! دوا کائي ورتي. گورين جو انگ اپڊيٽ ٿي ويو.',
    remindSnoozed: 'ياد ڏياريندڙ 15 منٽن کان پوءِ ٻيهر وڄندو.',
    allDosesDone: 'هن وقت جون سڀ دوائون کائي ورتيون ويون آهن!',
    noMedsInSlot: 'هن وقت لاءِ ڪا دوا مقرر نه آهي.',
    todayProgress: 'اڄ جي دوائن جي اڳڀرائي',
    dosesCompleted: 'دوائون کائي ورتيون',

    pillsLeft: 'گوريون باقي آهن',
    pillsCount: 'موجود انگ',
    lowStockWarning: '⚠️ گوريون ختم ٿيڻ واريون آهن!',
    refillSoon: 'صرف {count} گوريون باقي آهن. مهرباني ڪري ميڊيڪل اسٽور تان گهرائي وٺو.',
    urgentRefill: 'فوري نيون گوريون گهرائي وٺو',
    inStock: 'اسٽاڪ موجود آهي',

    beforeMeal: 'ماني کان اڳ',
    afterMeal: 'ماني کان پوءِ',
    withMeal: 'ماني سان گڏ',
    emptyStomach: 'بک تي (خالي پيٽ)',

    addNewMedicineTitle: 'نئين دوا شامل ڪريو',
    medicineNameLabel: 'دوا جو نالو',
    medicineNamePlaceholder: 'مثال: پيناڊول، گلوڪوفيج، لوپرن',
    dosageLabel: 'اندازو / مقدار',
    dosagePlaceholder: 'مثال: 1 گوري (500mg) يا 1 چمچو شربت',
    formLabel: 'دوا جو قسم',
    tablet: 'گوري (ٽيبلٽ)',
    capsule: 'ڪيپسول',
    syrup: 'شربت (سيرپ)',
    drops: 'ڦڙا (ڊراپس)',
    injection: 'انجيڪشن / انسولين',
    inhaler: 'انهيلر',
    selectMealTiming: 'ڪڏهن کائڻي آهي؟ (ماني جو وقت)',
    selectScheduleTimes: 'اوقات مقرر ڪريو (وقت چونڊيو)',
    totalPillsStock: 'دٻي ۾ سمورين گورين جو انگ',
    lowStockAlertAt: 'وارننگ ڪڏهن اچي؟ (مثال: 5 گوريون)',
    scheduleAlarms: 'پڪا آف لائن الارم نوٽيفڪيشن',
    scheduleAlarmsDesc: 'انٽرنيٽ کانسواءِ به گهنٽي وڄائيندو ۽ وڏي ياد ڏياريندو',
    saveMedicineBtn: 'روم ڊيٽابيس ۾ محفوظ ڪريو',
    forMember: 'ڪهڙي ڀاتي لاءِ آهي؟',
    quickPresets: 'عام واهپي جون دوائون',

    vitalsTitle: 'صحت جو رڪارڊ (رت جو دٻاءُ ۽ شگر)',
    bloodPressure: 'رت جو دٻاءُ (بلڊ پريشر)',
    bloodSugar: 'شگر جي سطح',
    systolic: 'مٿيون نمبر (سسٽولڪ)',
    diastolic: 'هيٺيون نمبر (ڊائسٽولڪ)',
    pulse: 'نبض جي رفتار (دل جي ڌڙڪن)',
    sugarValue: 'شگر جو نمبر (mg/dL)',
    sugarUnit: 'mg/dL',
    fastingSugar: 'بک تي (صبح ناشتي کان اڳ)',
    randomSugar: 'رينڊم (ڏينهن ۾ ڪنهن به وقت)',
    postMealSugar: 'ماني کائڻ کان 2 ڪلاڪ پوءِ',
    saveVitalBtn: 'رڪارڊ محفوظ ڪريو',
    history30Days: 'گذريل 30 ڏينهن جو رڪارڊ',
    noVitalsLogged: 'اڃا تائين ڪا به ريڊنگ داخل ناهي ڪئي وئي.',
    normalStatus: 'نارمل (صحيح حد)',
    elevatedStatus: 'ٿورو مٿي (ڌيان ڏيو)',
    highStatus: 'مٿاهون / وڌيڪ (ڊاڪٽر سان ملو)',
    lowStatus: 'گهٽ ريڊنگ',
    doctorSummaryBtn: 'ڊاڪٽر لاءِ تفصيل',
    doctorSummaryTitle: 'ڊاڪٽر لاءِ سمري رپورٽ',
    close: 'بند ڪريو',

    bpHelpNormal: 'بهترين حالت (120/80 کان گهٽ). رت جو دٻاءُ بلڪل ٺيڪ آهي.',
    bpHelpElevated: 'ٿورو وڌيڪ (120-129). لوڻ گهٽ واهپو ڪريو ۽ آرام ڪريو.',
    bpHelpHigh: 'رت جو دٻاءُ تمام گهڻو وڌيل آهي! وقت تي دوا وٺو ۽ ڊاڪٽر ڏيکاريو.',
    sugarHelpNormal: 'شگر صحيح حد ۾ آهي.',
    sugarHelpHigh: 'شگر وڌيل آهي. مٺائي کان پرهيز ڪريو ۽ دوا وٺو.',

    familyProfilesTitle: 'خاندان جا ڀاتي',
    addFamilyMemberBtn: 'نئون ڀاتي شامل ڪريو',
    memberNameLabel: 'نالو',
    memberNamePlaceholder: 'مثال: امڙ، بابا، ڏاڏي، ناني',
    relationLabel: 'رشتو / ناتو',
    ageLabel: 'عمر (سال)',
    selectRelation: 'رشتو چونڊيو',
    saveMemberBtn: 'پروفائل محفوظ ڪريو',
    activeMember: 'هن وقت هلندڙ پروفائل',
    switchMember: 'پروفائل تبديل ڪريو',
    chronicConditions: 'بيماري يا خاص هدايتون',
    noMembers: 'ڪو به ڀاتي شامل ناهي. نئون شامل ڪريو.',

    relMother: 'امڙ (ماءُ)',
    relFather: 'بابا (پيءُ)',
    relGrandmother: 'ڏاڏي / ناني',
    relGrandfather: 'ڏاڏو / نانو',
    relSpouse: 'گهرواري / مڙس',
    relSibling: 'ڀاءُ / ڀيڻ',
    relChild: 'پٽ / ڌيءُ',
    relSelf: 'ذاتي (پاڻ)',
    relOther: 'ٻيو وڏڙو / مائٽ',

    alarmRinging: 'دوا کائڻ جو وقت ٿي ويو آهي!',
    timeToTake: 'مهرباني ڪري پنهنجي مقرر دوا هاڻي کائي وٺو',
    snooze10m: '10 منٽ پوءِ ياد ڏياريو',
    takeNow: 'مان کائي ورتي (نشاني لڳايو)',
    testAlarm: 'الارم چيڪ ڪريو',
    speechListen: 'آواز ۾ ٻڌو (ڳالهائي ٻڌايو)',

    roomDbTitle: 'روم (SQLite) لوڪل ڊيٽابيس',
    roomDbDesc: 'ڪو به ڊيٽا انٽرنيٽ تي نٿو وڃي. مڪمل توهان جي موبائيل ۾ محفوظ آهي.',
    table: 'ٽيبل',
    rows: 'رڪارڊ',
    inspectDb: 'لوڪل ڊيٽابيس چيڪ ڪريو',
    resetDemoData: 'ڊيمو ڊيٽا نئين سر رکو',
    exportBackup: 'بيڪ اپ فائيل ڊائون لوڊ ڪريو (JSON)',
  },
};
