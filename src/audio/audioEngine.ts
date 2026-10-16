/**
 * Web Audio Engine for "夜" (Night)
 * Provides synthesized melancholic piano playback, ambient residential soundscapes
 * (rain on asphalt, night breeze, streetlight hum, distant train), and audio file loading.
 */

// Chord frequencies and notes for "夜" (Key of F#m / A major, melancholic progression)
interface NoteEvent {
  time: number; // in seconds
  freq: number;
  duration: number;
  gain: number;
}

// Melancholic acoustic piano notes sequenced to match the 1:28 structure of "夜"
function generateYoruScore(): NoteEvent[] {
  const notes: NoteEvent[] = [];
  
  // Note frequency map
  const N: Record<string, number> = {
    'F#2': 92.50, 'A2': 110.00, 'B2': 123.47, 'C#3': 138.59, 'D3': 146.83, 'E3': 164.81, 'F#3': 185.00, 'G#3': 207.65, 'A3': 220.00,
    'B3': 246.94, 'C#4': 277.18, 'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G#4': 415.30, 'A4': 440.00, 'B4': 493.88,
    'C#5': 554.37, 'D5': 587.33, 'E5': 659.25, 'F#5': 739.99, 'G#5': 830.61, 'A5': 880.00
  };

  const addChord = (time: number, bass: string, chordNotes: string[], melody: { t: number; n: string; d?: number }[]) => {
    // Bass
    if (N[bass]) notes.push({ time, freq: N[bass], duration: 3.5, gain: 0.28 });
    // Arpeggiated chord
    chordNotes.forEach((n, idx) => {
      if (N[n]) {
        notes.push({ time: time + idx * 0.25, freq: N[n], duration: 2.8, gain: 0.2 });
      }
    });
    // Melody notes
    melody.forEach(m => {
      if (N[m.n]) {
        notes.push({ time: time + m.t, freq: N[m.n], duration: m.d || 1.6, gain: 0.32 });
      }
    });
  };

  // Progression: F#m -> D -> A -> E -> Bm -> F#m -> D -> C#7
  const progression = [
    // Intro 0 - 13s
    { bass: 'F#2', chord: ['C#3', 'F#3', 'A3', 'C#4'], melody: [{ t: 0, n: 'C#5', d: 1.8 }, { t: 1.2, n: 'B4', d: 1.2 }, { t: 2.2, n: 'A4', d: 1.8 }] },
    { bass: 'D3',  chord: ['A3', 'D4', 'F#4'], melody: [{ t: 0, n: 'F#4', d: 1.5 }, { t: 1.5, n: 'A4', d: 1.5 }] },
    { bass: 'A2',  chord: ['E3', 'A3', 'C#4'], melody: [{ t: 0, n: 'E5', d: 2.0 }, { t: 1.8, n: 'C#5', d: 1.6 }] },
    { bass: 'E3',  chord: ['B3', 'E4', 'G#4'], melody: [{ t: 0, n: 'B4', d: 1.8 }, { t: 1.6, n: 'G#4', d: 1.6 }] },

    // Aメロ: 「医者の単語を含める曲を...」 14s - 42s
    { bass: 'F#2', chord: ['A3', 'C#4', 'F#4'], melody: [{ t: 0, n: 'A4' }, { t: 1.0, n: 'G#4' }, { t: 2.0, n: 'F#4' }] },
    { bass: 'D3',  chord: ['F#3', 'A3', 'D4'], melody: [{ t: 0, n: 'F#4' }, { t: 1.2, n: 'E4' }, { t: 2.2, n: 'D4' }] },
    { bass: 'Bm2', chord: ['D3', 'F#3', 'B3'], melody: [{ t: 0, n: 'D4' }, { t: 1.2, n: 'C#4' }, { t: 2.4, n: 'B3' }] },
    { bass: 'C#3', chord: ['G#3', 'C#4', 'E4'], melody: [{ t: 0, n: 'C#4' }, { t: 1.5, n: 'E4' }, { t: 2.6, n: 'G#4' }] },

    { bass: 'F#2', chord: ['C#3', 'A3', 'C#4'], melody: [{ t: 0, n: 'C#5' }, { t: 1.2, n: 'B4' }, { t: 2.2, n: 'A4' }] },
    { bass: 'D3',  chord: ['A3', 'D4', 'F#4'], melody: [{ t: 0, n: 'A4' }, { t: 1.4, n: 'B4' }, { t: 2.6, n: 'C#5' }] },
    { bass: 'E3',  chord: ['B3', 'E4', 'G#4'], melody: [{ t: 0, n: 'B4' }, { t: 1.5, n: 'A4' }, { t: 2.7, n: 'G#4' }] },
    { bass: 'A2',  chord: ['E3', 'A3', 'C#4'], melody: [{ t: 0, n: 'A4', d: 2.8 }] },

    // サビ前ブリッジ
    { bass: 'D3',  chord: ['F#3', 'A3', 'D4'], melody: [{ t: 0, n: 'F#4' }, { t: 1.2, n: 'G#4' }, { t: 2.2, n: 'A4' }] },
    { bass: 'E3',  chord: ['G#3', 'B3', 'E4'], melody: [{ t: 0, n: 'B4' }, { t: 1.2, n: 'C#5' }, { t: 2.4, n: 'D5' }] },

    // サビ: 「もう一度だけ逢えたなら 何も言わずに笑えるかな」 43s - 74s
    { bass: 'D3',  chord: ['A3', 'D4', 'F#4'], melody: [{ t: 0, n: 'F#5', d: 2.2 }, { t: 1.8, n: 'E5' }, { t: 2.6, n: 'D5' }] },
    { bass: 'E3',  chord: ['B3', 'E4', 'G#4'], melody: [{ t: 0, n: 'E5', d: 2.0 }, { t: 1.6, n: 'D5' }, { t: 2.6, n: 'C#5' }] },
    { bass: 'F#2', chord: ['C#3', 'A3', 'C#4'], melody: [{ t: 0, n: 'C#5', d: 2.2 }, { t: 1.8, n: 'B4' }, { t: 2.6, n: 'A4' }] },
    { bass: 'C#3', chord: ['G#3', 'C#4', 'E4'], melody: [{ t: 0, n: 'B4', d: 2.0 }, { t: 1.8, n: 'C#5', d: 2.0 }] },

    // 「届かなくても 消せないまま 君のいない夜を生きている」
    { bass: 'D3',  chord: ['A3', 'D4', 'F#4'], melody: [{ t: 0, n: 'F#5', d: 2.4 }, { t: 1.8, n: 'E5' }, { t: 2.6, n: 'D5' }] },
    { bass: 'E3',  chord: ['B3', 'E4', 'G#4'], melody: [{ t: 0, n: 'E5', d: 2.2 }, { t: 1.6, n: 'C#5' }, { t: 2.6, n: 'B4' }] },
    { bass: 'F#2', chord: ['A3', 'C#4', 'F#4'], melody: [{ t: 0, n: 'A4', d: 2.5 }, { t: 2.0, n: 'G#4', d: 1.8 }] },
    { bass: 'D3',  chord: ['F#3', 'A3', 'D4'], melody: [{ t: 0, n: 'F#4', d: 3.5 }] },

    // アウトロ 75s - 88s
    { bass: 'F#2', chord: ['C#3', 'F#3', 'A3', 'C#4'], melody: [{ t: 0, n: 'C#5', d: 2.5 }, { t: 1.8, n: 'A4', d: 2.2 }] },
    { bass: 'D3',  chord: ['A3', 'D4', 'F#4'], melody: [{ t: 0, n: 'F#4', d: 3.0 }] },
    { bass: 'A2',  chord: ['E3', 'A3', 'C#4'], melody: [{ t: 0, n: 'E4', d: 3.5 }] },
    { bass: 'F#2', chord: ['C#3', 'A3', 'C#4', 'F#4'], melody: [{ t: 0, n: 'C#4', d: 4.5 }] },
  ];

  let currentT = 1.0;
  progression.forEach((bar) => {
    addChord(currentT, bar.bass, bar.chord, bar.melody);
    currentT += 3.6; // ~3.6s per bar matches ~88s total
  });

  return notes;
}

export class YoruAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private userAudio: HTMLAudioElement | null = null;

  // Ambient sound generators
  private rainGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private streetlampGain: GainNode | null = null;
  private trainGain: GainNode | null = null;
  
  private activeOscillators: Array<{ stop: () => void }> = [];
  private isSynthesizing = false;
  private playbackStartTime = 0;
  private pausedAt = 0;
  private duration = 88; // 1m 28s matching song
  private timerId: number | null = null;
  private notesScore: NoteEvent[] = [];

  // Public state callbacks
  public onTimeUpdate?: (time: number) => void;
  public onEnded?: () => void;

  constructor() {
    this.notesScore = generateYoruScore();
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create synthetic soft room/reverb impulse
      this.reverbNode = this.createReverb(this.ctx, 2.5, 0.4);
      this.reverbNode.connect(this.masterGain);

      // Setup ambient sound channels
      this.initAmbientNodes(this.ctx);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createReverb(ctx: AudioContext, duration: number, decay: number): ConvolverNode {
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = length - i;
      left[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
      right[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
    }

    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  private initAmbientNodes(ctx: AudioContext) {
    if (!this.masterGain) return;

    // 1. Rain generator (Filtered pink noise with low pass)
    const rainBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const rainData = rainBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < rainBuffer.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      rainData[i] = (b0 + b1 + b2) * 0.25;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1400, ctx.currentTime);

    this.rainGain = ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.2, ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);
    rainSource.start();

    // 2. Night Wind generator (Resonant bandpass sweep)
    const windSource = ctx.createBufferSource();
    windSource.buffer = rainBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(450, ctx.currentTime);
    windFilter.Q.setValueAtTime(3.5, ctx.currentTime);

    // LFO for gentle wind breathing
    const windLFO = ctx.createOscillator();
    windLFO.frequency.setValueAtTime(0.12, ctx.currentTime);
    const windLFOGain = ctx.createGain();
    windLFOGain.gain.setValueAtTime(220, ctx.currentTime);
    windLFO.connect(windLFOGain);
    windLFOGain.connect(windFilter.frequency);
    windLFO.start();

    this.windGain = ctx.createGain();
    this.windGain.gain.setValueAtTime(0.15, ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    windSource.start();

    // 3. Streetlamp hum (warm 60Hz + 120Hz electrical drone)
    const lampOsc = ctx.createOscillator();
    lampOsc.type = 'sine';
    lampOsc.frequency.setValueAtTime(60, ctx.currentTime);

    const lampOsc2 = ctx.createOscillator();
    lampOsc2.type = 'triangle';
    lampOsc2.frequency.setValueAtTime(120, ctx.currentTime);

    this.streetlampGain = ctx.createGain();
    this.streetlampGain.gain.setValueAtTime(0.1, ctx.currentTime);

    lampOsc.connect(this.streetlampGain);
    lampOsc2.connect(this.streetlampGain);
    this.streetlampGain.connect(this.masterGain);
    lampOsc.start();
    lampOsc2.start();

    // 4. Distant night train rumble
    const trainOsc = ctx.createOscillator();
    trainOsc.type = 'sine';
    trainOsc.frequency.setValueAtTime(45, ctx.currentTime);

    this.trainGain = ctx.createGain();
    this.trainGain.gain.setValueAtTime(0.08, ctx.currentTime);

    trainOsc.connect(this.trainGain);
    this.trainGain.connect(this.masterGain);
    trainOsc.start();
  }

  // Play acoustic piano note with rich harmonics and gentle hammer release
  private playPianoNote(freq: number, startTime: number, duration: number, gainVal: number) {
    if (!this.ctx || !this.masterGain || !this.reverbNode) return;
    const now = startTime;

    // Harmonic 1 (Fundamental)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Harmonic 2 (Body warmth)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Harmonic 3 (Bell chime sparkle)
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);

    // Subtle detuning for acoustic chorus/felt piano warmth
    osc1.detune.setValueAtTime(-2, now);
    osc2.detune.setValueAtTime(3, now);

    // Envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(gainVal * 0.9, now + 0.035); // soft hammer attack
    noteGain.gain.exponentialRampToValueAtTime(gainVal * 0.45, now + 0.4);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Filter to simulate soft felt upright piano in late night
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 4.2, 4200), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 300), now + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    osc3.connect(noteGain);
    noteGain.connect(filter);

    // Direct output
    filter.connect(this.masterGain);
    // Send to reverb
    filter.connect(this.reverbNode);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    const stopTime = now + duration + 0.1;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);

    this.activeOscillators.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
          osc3.stop();
        } catch {
          // ignore already stopped
        }
      }
    });
  }

  public play(fromTime?: number) {
    this.initContext();

    if (this.userAudio) {
      if (fromTime !== undefined) {
        this.userAudio.currentTime = fromTime;
      }
      this.userAudio.play().catch(console.error);
      this.isSynthesizing = false;
      this.startTimer();
      return;
    }

    if (!this.ctx) return;

    const startOffset = fromTime !== undefined ? fromTime : this.pausedAt;
    this.stopActiveNotes();
    this.isSynthesizing = true;
    this.playbackStartTime = this.ctx.currentTime - startOffset;

    // Schedule remaining notes
    const remainingNotes = this.notesScore.filter(n => n.time >= startOffset && n.time <= this.duration);
    remainingNotes.forEach(note => {
      const scheduleTime = this.playbackStartTime + note.time;
      if (scheduleTime >= this.ctx!.currentTime) {
        this.playPianoNote(note.freq, scheduleTime, note.duration, note.gain);
      }
    });

    this.startTimer();
  }

  public pause() {
    if (this.userAudio) {
      this.userAudio.pause();
      this.stopTimer();
      return;
    }

    if (this.ctx && this.isSynthesizing) {
      this.pausedAt = Math.min(this.ctx.currentTime - this.playbackStartTime, this.duration);
      this.stopActiveNotes();
      this.isSynthesizing = false;
    }
    this.stopTimer();
  }

  public seek(time: number) {
    const clamped = Math.max(0, Math.min(time, this.duration));
    if (this.userAudio) {
      this.userAudio.currentTime = clamped;
    } else {
      this.pausedAt = clamped;
      if (this.isSynthesizing) {
        this.play(clamped);
      }
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(clamped);
    }
  }

  public getCurrentTime(): number {
    if (this.userAudio) {
      return this.userAudio.currentTime;
    }
    if (this.ctx && this.isSynthesizing) {
      const elapsed = this.ctx.currentTime - this.playbackStartTime;
      return Math.min(elapsed, this.duration);
    }
    return this.pausedAt;
  }

  public getDuration(): number {
    if (this.userAudio && !isNaN(this.userAudio.duration) && this.userAudio.duration > 0) {
      return this.userAudio.duration;
    }
    return this.duration;
  }

  public setMasterVolume(val: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
    if (this.userAudio) {
      this.userAudio.volume = Math.max(0, Math.min(1, val));
    }
  }

  public setAmbientVolume(type: 'rain' | 'wind' | 'streetlamp' | 'train', val: number) {
    this.initContext();
    if (!this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    const targetNode =
      type === 'rain' ? this.rainGain :
      type === 'wind' ? this.windGain :
      type === 'streetlamp' ? this.streetlampGain :
      this.trainGain;

    if (targetNode) {
      targetNode.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  // Load custom user audio file if provided
  public loadUserFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(file);
        if (this.userAudio) {
          this.userAudio.pause();
        }
        this.userAudio = new Audio(url);
        this.userAudio.onloadedmetadata = () => {
          this.duration = this.userAudio!.duration || 88;
          resolve();
        };
        this.userAudio.onended = () => {
          this.stopTimer();
          if (this.onEnded) this.onEnded();
        };
        this.userAudio.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  public resetToBuiltin() {
    if (this.userAudio) {
      this.userAudio.pause();
      this.userAudio = null;
    }
    this.duration = 88;
  }

  private stopActiveNotes() {
    this.activeOscillators.forEach(osc => osc.stop());
    this.activeOscillators = [];
  }

  private startTimer() {
    this.stopTimer();
    this.timerId = window.setInterval(() => {
      const cur = this.getCurrentTime();
      if (this.onTimeUpdate) {
        this.onTimeUpdate(cur);
      }
      if (cur >= this.duration) {
        this.pause();
        this.seek(0);
        if (this.onEnded) {
          this.onEnded();
        }
      }
    }, 100);
  }

  private stopTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public destroy() {
    this.pause();
    this.stopActiveNotes();
    if (this.userAudio) {
      this.userAudio.pause();
      this.userAudio = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
