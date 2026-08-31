import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AudioContextState = createContext(null);

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const audioCtxRef = useRef(null);
  
  // To handle generative BGM loops
  const bgmTimersRef = useRef([]);
  const bgmTypeRef = useRef(null);
  // To keep track of any active gain nodes we want to fade out
  const activeGainNodesRef = useRef([]);
  // Global BGM master gain
  const bgmMasterGainRef = useRef(null);

  // Initialize Web Audio Context on first interaction
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        const ctx = audioCtxRef.current;
        bgmMasterGainRef.current = ctx.createGain();
        bgmMasterGainRef.current.connect(ctx.destination);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setUnlocked(true);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Soft, warm note generator
  const createNote = (ctx, freq, type, attack, decay, vol, filterFreq) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    
    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);
    
    // Warm filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq || 800, now);
    
    osc.connect(filter);
    filter.connect(gain);
    // Connect to global BGM master if bgm is true, else destination
    gain.connect(bgmMasterGainRef.current || ctx.destination);
    
    osc.start(now);
    osc.stop(now + attack + decay);
    
    return gain;
  };

  const playSFX = useCallback((name) => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;

    if (name === 'chime' || name === 'soft-chime') {
      // Books/confirmation: Very soft, warm page/chime
      createNote(ctx, 523.25, 'sine', 0.05, 1.2, 0.06, 600);
      createNote(ctx, 659.25, 'sine', 0.05, 1.0, 0.04, 600);
    } 
    else if (name === 'boop' || name === 'cute-boop') {
      // Water bottle: Tiny playful soft pluck
      createNote(ctx, 349.23, 'sine', 0.02, 0.3, 0.08, 500);
      setTimeout(() => createNote(ctx, 440.00, 'sine', 0.02, 0.4, 0.08, 500), 150);
    }
    else if (name === 'sparkle') {
      // Taylor Swift / magic: Small bright musical chime
      [880, 1174.66, 1396.91].forEach((freq, idx) => {
        setTimeout(() => {
          createNote(ctx, freq, 'sine', 0.02, 0.6, 0.03, 2000);
        }, idx * 80);
      });
    }
    else if (name === 'suspicious-sting') {
      // Designer / Zara name: Single subtle mysterious note / two-note phrase
      createNote(ctx, 220.00, 'sine', 0.1, 2.0, 0.08, 400);
      setTimeout(() => createNote(ctx, 233.08, 'sine', 0.1, 2.0, 0.06, 400), 400);
    }
    else if (name === 'suspicious-note-1') {
      createNote(ctx, 220.00, 'sine', 0.1, 2.0, 0.08, 400);
    }
    else if (name === 'suspicious-note-2') {
      createNote(ctx, 233.08, 'sine', 0.1, 2.0, 0.06, 400);
    }
    else if (name === 'realization-hit') {
      // Butterscotch "I FOUND HER": Beautiful, short, joyful impact. NOT loud.
      // Soft orchestral chime hit
      [261.63, 329.63, 392.00, 523.25].forEach((freq) => {
        createNote(ctx, freq, 'sine', 0.02, 3.0, 0.1, 1200);
      });
      // Sparkles
      [1046.5, 1318.5, 1567.98].forEach((f, i) => {
        setTimeout(() => createNote(ctx, f, 'sine', 0.02, 1.0, 0.04, 2500), i * 100);
      });
    }
    else if (name === 'warm-chord') {
      // Never lets friends down
      [261.63, 329.63].forEach((freq) => {
        createNote(ctx, freq, 'sine', 0.1, 2.0, 0.08, 600);
      });
    }
    else if (name === 'bag-chime') {
      // Final scene magical chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        setTimeout(() => {
          createNote(ctx, freq, 'sine', 0.05, 2.0, 0.05, 1500);
        }, idx * 150);
      });
    }
  }, [isMuted]);

  const clearBGM = () => {
    bgmTimersRef.current.forEach(clearTimeout);
    bgmTimersRef.current = [];
    
    // Fade out any active background pads softly
    const ctx = audioCtxRef.current;
    if (ctx) {
      activeGainNodesRef.current.forEach(gain => {
        try {
           gain.gain.cancelScheduledValues(ctx.currentTime);
           gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        } catch(e) {}
      });
    }
    activeGainNodesRef.current = [];
  };

  const stopBGM = useCallback(() => {
    bgmTypeRef.current = 'silence';
    clearBGM();
  }, []);

  const setBGMVolume = useCallback((vol, duration = 1.0) => {
    if (!audioCtxRef.current || !bgmMasterGainRef.current) return;
    const ctx = audioCtxRef.current;
    bgmMasterGainRef.current.gain.linearRampToValueAtTime(vol, ctx.currentTime + duration);
  }, []);

  const playBGM = useCallback((type) => {
    if (isMuted || !audioCtxRef.current) return;
    if (bgmTypeRef.current === type) {
      if (type === 'celebration') {
        setBGMVolume(1.0, 1.0); // Ensure volume is up
      }
      return;
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Set master volume to 1.0 initially
    if (bgmMasterGainRef.current) {
       bgmMasterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
       bgmMasterGainRef.current.gain.setValueAtTime(1.0, ctx.currentTime);
    }

    clearBGM();

    if (type === 'silence' || !type) {
      bgmTypeRef.current = 'silence';
      return;
    }

    bgmTypeRef.current = type;

    // Generative music loops (using recursive timeouts for sparse, irregular notes)
    const scheduleNext = (callback, minMs, maxMs) => {
      if (bgmTypeRef.current !== type) return;
      const delay = minMs + Math.random() * (maxMs - minMs);
      const timer = setTimeout(() => {
        if (bgmTypeRef.current === type) {
          callback();
          scheduleNext(callback, minMs, maxMs);
        }
      }, delay);
      bgmTimersRef.current.push(timer);
    };

    if (type === 'search') {
      // Soft whimsical instrumental atmosphere. Gentle piano notes, lots of space.
      const notes = [261.63, 293.66, 329.63, 392.00]; // C pentatonic
      scheduleNext(() => {
        const freq = notes[Math.floor(Math.random() * notes.length)];
        createNote(ctx, freq, 'sine', 0.1, 3.0, 0.04, 500);
      }, 2000, 4500);
      
      // Occasional delicate bell
      scheduleNext(() => {
        const freq = notes[Math.floor(Math.random() * notes.length)] * 2;
        createNote(ctx, freq, 'sine', 0.05, 2.0, 0.02, 1000);
      }, 5000, 10000);
    }
    else if (type === 'mystery' || type === 'suspense') {
      // Very subtle musical tension. Two or three soft notes with lots of silence.
      const notes = [146.83, 174.61, 220.00]; // Dm
      scheduleNext(() => {
        const freq = notes[Math.floor(Math.random() * notes.length)];
        createNote(ctx, freq, 'sine', 0.2, 4.0, 0.04, 400);
      }, 3000, 6000);
    }
    else if (type === 'eyezoom') {
      // VERY subtle atmospheric musical layer. Almost silence at the end.
      const notes = [130.81, 146.83];
      scheduleNext(() => {
        const freq = notes[Math.floor(Math.random() * notes.length)];
        createNote(ctx, freq, 'sine', 0.5, 3.0, 0.03, 300);
      }, 3000, 5000);
    }
    else if (type === 'celebration') {
      // Happy Birthday Melody Arranged for warm piano/bells
      // Notes: G4, G4, A4, G4, C5, B4 ...
      const G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;
      
      const melody = [
        { f: G4, d: 0.5 }, { f: G4, d: 0.5 }, { f: A4, d: 1.0 }, { f: G4, d: 1.0 }, { f: C5, d: 1.0 }, { f: B4, d: 2.0 },
        { f: G4, d: 0.5 }, { f: G4, d: 0.5 }, { f: A4, d: 1.0 }, { f: G4, d: 1.0 }, { f: D5, d: 1.0 }, { f: C5, d: 2.0 },
        { f: G4, d: 0.5 }, { f: G4, d: 0.5 }, { f: G5, d: 1.0 }, { f: E5, d: 1.0 }, { f: C5, d: 1.0 }, { f: B4, d: 1.0 }, { f: A4, d: 1.5 },
        { f: F5, d: 0.5 }, { f: F5, d: 0.5 }, { f: E5, d: 1.0 }, { f: C5, d: 1.0 }, { f: D5, d: 1.0 }, { f: C5, d: 2.0 }
      ];
      
      const tempo = 0.65; // seconds per beat
      const totalLoopTime = 16 * tempo * 1000;
      
      const playMelodyLoop = () => {
        let timeOffset = 0;
        melody.forEach(note => {
          setTimeout(() => {
            if (bgmTypeRef.current !== 'celebration') return;
            // Warm piano-like pluck
            createNote(ctx, note.f, 'sine', 0.05, 2.5, 0.06, 700);
            // Bell overtone
            createNote(ctx, note.f * 2, 'sine', 0.02, 1.5, 0.02, 1200);
          }, timeOffset * 1000);
          timeOffset += note.d * tempo;
        });
        
        // Gentle chord accompaniment
        const chords = [
          { c: [C5, E5, G5], t: 0 },
          { c: [C5, F5, A4], t: 6 * tempo },
          { c: [B4, D5, G5], t: 10 * tempo }
        ];
        
        chords.forEach(chord => {
           setTimeout(() => {
             if (bgmTypeRef.current !== 'celebration') return;
             chord.c.forEach(f => {
               createNote(ctx, f / 2, 'triangle', 0.2, 4.0, 0.03, 500);
             });
           }, chord.t * 1000);
        });
      };
      
      playMelodyLoop();
      const loopTimer = setInterval(() => {
         if (bgmTypeRef.current === 'celebration') {
           playMelodyLoop();
         }
      }, totalLoopTime);
      bgmTimersRef.current.push(loopTimer);
      
      // Background sparkles
      scheduleNext(() => {
        createNote(ctx, 1046.50, 'sine', 0.05, 1.0, 0.02, 1200);
      }, 800, 2000);
    }
  }, [isMuted]);

  return (
    <AudioContextState.Provider value={{
      isMuted,
      unlocked,
      initAudio,
      toggleMute,
      playSFX,
      playBGM,
      stopBGM,
      setBGMVolume
    }}>
      {children}
    </AudioContextState.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContextState);
  if (!ctx) {
    return {
      isMuted: true,
      unlocked: false,
      initAudio: () => {},
      toggleMute: () => {},
      playSFX: () => {},
      playBGM: () => {},
      stopBGM: () => {},
      setBGMVolume: () => {}
    };
  }
  return ctx;
}
