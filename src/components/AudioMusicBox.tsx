import React, { useEffect, useRef, useState } from 'react';
import { Music, Play, Pause, Volume2, Sparkles } from 'lucide-react';

interface Note {
  freq: number;
  duration: number; // in beats
}

// Convert note string to frequency
const FREQS: Record<string, number> = {
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
  'A5': 880.00, 'B5': 987.77, 'C6': 1046.50
};

// Happy Birthday melody in Music Box style (twinkle chime)
const MELODY: Note[] = [
  { freq: FREQS['G4'], duration: 0.75 },
  { freq: FREQS['G4'], duration: 0.25 },
  { freq: FREQS['A4'], duration: 1.0 },
  { freq: FREQS['G4'], duration: 1.0 },
  { freq: FREQS['C5'], duration: 1.0 },
  { freq: FREQS['B4'], duration: 2.0 },

  { freq: FREQS['G4'], duration: 0.75 },
  { freq: FREQS['G4'], duration: 0.25 },
  { freq: FREQS['A4'], duration: 1.0 },
  { freq: FREQS['G4'], duration: 1.0 },
  { freq: FREQS['D5'], duration: 1.0 },
  { freq: FREQS['C5'], duration: 2.0 },

  { freq: FREQS['G4'], duration: 0.75 },
  { freq: FREQS['G4'], duration: 0.25 },
  { freq: FREQS['G5'], duration: 1.0 },
  { freq: FREQS['E5'], duration: 1.0 },
  { freq: FREQS['C5'], duration: 1.0 },
  { freq: FREQS['B4'], duration: 1.0 },
  { freq: FREQS['A4'], duration: 2.0 },

  { freq: FREQS['F5'], duration: 0.75 },
  { freq: FREQS['F5'], duration: 0.25 },
  { freq: FREQS['E5'], duration: 1.0 },
  { freq: FREQS['C5'], duration: 1.0 },
  { freq: FREQS['D5'], duration: 1.0 },
  { freq: FREQS['C5'], duration: 2.5 },
  
  // Pause between loops
  { freq: 0, duration: 2.0 }
];

export default function AudioMusicBox() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const currentNoteIndexRef = useRef<number>(0);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playMusicBoxPluck = (freq: number, time: number) => {
    if (!audioCtxRef.current || !gainNodeRef.current || freq === 0) return;

    const ctx = audioCtxRef.current;
    
    // Physical Music Box uses comb teeth. Sound has simple sine/tri with high bright harmonics that decay quickly.
    // Base Oscillator (Triangle wave for hollow, warm wood-box resonance)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    // High Bright Harmonics (Sine wave 1 octave above + fifth for glass bell tone)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time); // Octave

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, time); // Fifth overtone

    // Setup envelopes
    gain1.gain.setValueAtTime(0, time);
    gain1.gain.linearRampToValueAtTime(0.3, time + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.001, time + 1.2);

    gain2.gain.setValueAtTime(0, time);
    gain2.gain.linearRampToValueAtTime(0.25, time + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.4); // bright metal pluck decays fast

    gain3.gain.setValueAtTime(0, time);
    gain3.gain.linearRampToValueAtTime(0.15, time + 0.005);
    gain3.gain.exponentialRampToValueAtTime(0.001, time + 0.2); // very high chime fades instantly

    // Connect them
    osc1.connect(gain1);
    gain1.connect(gainNodeRef.current);

    osc2.connect(gain2);
    gain2.connect(gainNodeRef.current);

    osc3.connect(gain3);
    gain3.connect(gainNodeRef.current);

    // Play & Stop
    osc1.start(time);
    osc1.stop(time + 1.3);
    
    osc2.start(time);
    osc2.stop(time + 0.5);

    osc3.start(time);
    osc3.stop(time + 0.3);
  };

  const playSequence = () => {
    if (!isPlaying || !audioCtxRef.current) return;

    const tempo = 150; // BPM
    const beatDuration = 60 / tempo; // Seconds per beat
    const note = MELODY[currentNoteIndexRef.current];

    const lookAhead = 0.05;
    const playTime = audioCtxRef.current.currentTime + lookAhead;

    if (note.freq > 0) {
      playMusicBoxPluck(note.freq, playTime);
    }

    const durationSeconds = note.duration * beatDuration;
    
    currentNoteIndexRef.current = (currentNoteIndexRef.current + 1) % MELODY.length;

    // Schedule next note
    timeoutIdRef.current = window.setTimeout(
      playSequence,
      durationSeconds * 1000
    );
  };

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      playSequence();
    } else {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current?.currentTime || 0);
    }
  }, [volume]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleToggle = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="audio-music-box" className="fixed top-4 left-4 z-[90] transition-all duration-300">
      <button 
        onClick={handleToggle}
        className={`relative flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-[#130722]/90 backdrop-blur-md shadow-[0_8px_32px_rgba(244,63,94,0.3)] transition-all active:scale-90 cursor-pointer ${
          isPlaying ? 'animate-[spin_6s_linear_infinite] ring-2 ring-pink-400' : 'hover:scale-105'
        }`}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isPlaying ? 'Pause Birthday Chime' : 'Play Birthday Chime 🎵'}
      >
        {isPlaying ? (
          <Music size={18} className="text-pink-400 animate-pulse" />
        ) : (
          <Music size={18} className="text-white/60" />
        )}
        
        {/* Tiny active ripple dot */}
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
        )}
      </button>
    </div>
  );
}
