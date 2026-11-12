import { DoseRecord, Medicine, Language } from '../types';

class AlarmManagerService {
  private audioCtx: AudioContext | null = null;
  private isRinging: boolean = false;
  private ringInterval: number | null = null;
  private onAlarmTriggerCallback: ((medicine: Medicine, dose: DoseRecord) => void) | null = null;

  constructor() {
    this.requestNotificationPermission();
  }

  public setAlarmTriggerCallback(cb: (medicine: Medicine, dose: DoseRecord) => void) {
    this.onAlarmTriggerCallback = cb;
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          const res = await Notification.requestPermission();
          return res === 'granted';
        } catch {
          return false;
        }
      }
      return Notification.permission === 'granted';
    }
    return false;
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Synthesize a pleasant, melodic, high-volume chime sequence for elderly ears
  public playChime(type: 'alarm' | 'success' | 'click' = 'alarm') {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      if (type === 'success') {
        // Cheerful ascending arpeggio (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx!.createOscillator();
          const gain = this.audioCtx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

          osc.connect(gain);
          gain.connect(this.audioCtx!.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
        return;
      }

      if (type === 'click') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
        return;
      }

      // 'alarm' type: Repeating pleasant 2-tone chime
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // 880 Hz (A5) then 659.25 Hz (E5)
      osc1.frequency.setValueAtTime(880, now);
      osc2.frequency.setValueAtTime(659.25, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc1.stop(now + 0.22);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.warn('Audio playback not permitted yet:', e);
    }
  }

  public startRingingLoop() {
    if (this.isRinging) return;
    this.isRinging = true;
    this.playChime('alarm');
    this.ringInterval = window.setInterval(() => {
      this.playChime('alarm');
    }, 1800);
  }

  public stopRingingLoop() {
    this.isRinging = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Text-To-Speech for illiterate or weak eyesight elders
  public speakInstruction(text: string, lang: Language = 'en') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // slightly slower for elderly comprehension
      utterance.pitch = 1.0;

      if (lang === 'ur') {
        utterance.lang = 'ur-PK';
      } else if (lang === 'sd') {
        utterance.lang = 'ur-PK'; // fallback for Sindhi TTS if browser doesn't have sd-PK
      } else {
        utterance.lang = 'en-US';
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Trigger simulated incoming Android Alarm
  public triggerTestAlarm(medicine: Medicine, dose: DoseRecord) {
    this.startRingingLoop();
    if (this.onAlarmTriggerCallback) {
      this.onAlarmTriggerCallback(medicine, dose);
    }

    // Try showing real browser notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`⏰ Medicine Alert: ${medicine.name}`, {
          body: `Dose: ${medicine.dosage} (${medicine.mealTiming.replace('_', ' ')}) - Please take now.`,
          icon: '/favicon.ico',
          tag: 'med-alarm',
        });
      } catch {
        // Notification in iframe might be blocked, in-app modal handles it
      }
    }
  }
}

export const alarmManager = new AlarmManagerService();
