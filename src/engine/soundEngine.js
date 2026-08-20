/**
 * Web Audio API Railway Sound Synthesizer & Authentic IR Station Announcement Engine
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.voiceEnabled = true;
  }

  getContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
  }

  /**
   * Dual-tone Indian Railways Electric & Diesel Locomotive Horn
   */
  playTrainHorn(type = 'EXPRESS') {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      if (type === 'VANDE_BHARAT') {
        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(554.37, now);
      } else if (type === 'FREIGHT') {
        osc1.frequency.setValueAtTime(311.13, now);
        osc2.frequency.setValueAtTime(392.00, now);
      } else {
        osc1.frequency.setValueAtTime(370, now);
        osc2.frequency.setValueAtTime(466.16, now);
      }

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.09, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.15);
      osc2.stop(now + 1.15);
    } catch {
      // Audio error fallback
    }
  }

  /**
   * Iconic Indian Railways Station Chime (Ding-Dong-Ding-Dong)
   */
  playStationChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6 chime
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.22);

        gain.gain.setValueAtTime(0, now + idx * 0.22);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.22 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.22 + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.22);
        osc.stop(now + idx * 0.22 + 0.7);
      });
    } catch {
      // Audio error fallback
    }
  }

  /**
   * Mechanical Relay & Electronic Interlocking Click
   */
  playRelayClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Fallback
    }
  }

  /**
   * AI Conflict Alert Sound
   */
  playAlertChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.12);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // Fallback
    }
  }

  /**
   * Successful Interlock Deployment Fanfare
   */
  playSuccessTone() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.26);
      });
    } catch {
      // Fallback
    }
  }

  /**
   * Bilingual Indian Railways Station Public Announcement
   */
  announceTrain(train, stationName = 'Naini Junction') {
    if (this.isMuted || !this.voiceEnabled) return;
    this.playStationChime();

    const isHindiPreferred = true;
    const hindiText = `यात्रीगण कृपया ध्यान दें। गाड़ी संख्या ${train.number}, ${train.name}, प्लेटफॉर्म क्रमांक ${train.assignedPlatform || 1} पर आ रही है।`;
    const englishText = `May I have your attention please. Train number ${train.number}, ${train.name}, from ${train.originStation} to ${train.destinationStation}, is arriving on platform number ${train.assignedPlatform || 1}.`;

    setTimeout(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(isHindiPreferred ? hindiText : englishText);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
          window.speechSynthesis.speak(utterance);
        } catch {
          // Speech synthesis fallback
        }
      }
    }, 1100);
  }

  /**
   * Controller AI Voice Advisory
   */
  speakDispatch(message) {
    if (this.isMuted || !this.voiceEnabled) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.05;
        utterance.pitch = 0.95;
        utterance.volume = 0.85;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis fallback
      }
    }
  }
}

export const soundEngine = new SoundEngine();
