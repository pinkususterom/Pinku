import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, Pause, Trash2, Heart, Volume2, Sparkles, Check } from 'lucide-react';
import { saveVoiceRecording, getVoiceRecording, deleteVoiceRecording } from '../utils/db';

const BEST_BIRTHDAY_SPEECH = 
  "My dearest sister, wishing you the happiest, most incredible birthday ever! Thank you for always being my strength, my constant laughter, and my absolute best friend in this entire world. No matter how much we tease each other, you will always be my precious moti rani. Sending you infinite love, and may all your dreams come true! ❤️✨";

export default function VoiceMessage() {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fallback / AI Synthesis controls (Internal only)
  const [voiceMode, setVoiceMode] = useState<'mic' | 'synth'>('mic');
  const [synthText] = useState<string>(BEST_BIRTHDAY_SPEECH);

  const [playbackState, setPlaybackState] = useState<'idle' | 'playing'>('idle');
  const [waves, setWaves] = useState<number[]>(Array(24).fill(4));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wavesIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing microphone voice note on mount
  useEffect(() => {
    async function loadRecording() {
      try {
        const savedBlob = await getVoiceRecording();
        if (savedBlob) {
          const url = URL.createObjectURL(savedBlob);
          setAudioUrl(url);
          setRecordingState('recorded');
          setVoiceMode('mic');
        }
      } catch (err) {
        console.error('Error loading saved voice note:', err);
      }
    }
    loadRecording();
  }, []);

  // Animate cassette tape music visualizer spikes when playing/recording 
  useEffect(() => {
    if (playbackState === 'playing' || recordingState === 'recording') {
      wavesIntervalRef.current = setInterval(() => {
        setWaves(
          Array(24)
            .fill(0)
            .map(() => Math.floor(Math.random() * (playbackState === 'playing' ? 32 : 25)) + 4)
        );
      }, 100);
    } else {
      if (wavesIntervalRef.current) clearInterval(wavesIntervalRef.current);
      setWaves(Array(24).fill(4));
    }

    return () => {
      if (wavesIntervalRef.current) clearInterval(wavesIntervalRef.current);
    };
  }, [playbackState, recordingState]);

  // Clean-up recording timers on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];

    // Stop current speech or media playing to prevent echoing
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaybackState('idle');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
          await saveVoiceRecording(audioBlob);
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          setRecordingState('recorded');
        } catch (err) {
          console.error('Failed to save micro-recording:', err);
        }

        // Clean-up browser stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      setRecordDuration(0);
      durationIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);

      mediaRecorder.start();
      setRecordingState('recording');
      setVoiceMode('mic');
    } catch (err: any) {
      console.warn('Microphone permission blocked or absent:', err);
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        setErrorMessage("Microphone access was dismissed or blocked. You can still use our automated Speech Note option!");
      } else {
        setErrorMessage("Microphone not available on this device. Try the automated Speech Note!");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  };

  const playAutomatedSpeech = () => {
    // If they click Automated Speech Note, we immediately transition into synth playing layout
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setVoiceMode('synth');
    setRecordingState('recorded');
    setErrorMessage(null);

    // Give state transitions a microsecond to align, then execute speech synthesis play
    setTimeout(() => {
      togglePlayback('synth');
    }, 50);
  };

  const togglePlayback = (forcedMode?: 'mic' | 'synth') => {
    const activeMode = forcedMode || voiceMode;

    if (playbackState === 'playing') {
      if (activeMode === 'mic') {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        window.speechSynthesis.pause();
      }
      setPlaybackState('idle');
    } else {
      if (activeMode === 'mic') {
        if (audioUrl) {
          if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.onended = () => {
              setPlaybackState('idle');
            };
          }
          audioRef.current.play().catch((err) => {
            console.error('Mic playback failed:', err);
            setPlaybackState('idle');
          });
          setPlaybackState('playing');
        }
      } else {
        // AI Text to speech
        window.speechSynthesis.cancel();
        
        // If synthesis was paused, resume it, otherwise speak fresh
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setPlaybackState('playing');
          return;
        }

        const utterance = new SpeechSynthesisUtterance(synthText);
        utterance.lang = 'en-US';
        
        const voices = window.speechSynthesis.getVoices();
        // Prefer female/warm voice if loaded
        const preferredVoice = voices.find(
          (v) =>
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('female') ||
            v.lang.includes('en')
        ) || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.rate = 0.95; 
        utterance.pitch = 1.05; 

        utterance.onend = () => {
          setPlaybackState('idle');
        };
        utterance.onerror = () => {
          setPlaybackState('idle');
        };

        setPlaybackState('playing');
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleDeleteRecording = async () => {
    if (window.confirm("Do you want to reset this voice cassette?")) {
      if (voiceMode === 'mic') {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        await deleteVoiceRecording();
        setAudioUrl(null);
      } else {
        window.speechSynthesis.cancel();
      }
      setRecordingState('idle');
      setPlaybackState('idle');
      setVoiceMode('mic');
      setRecordDuration(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="relative w-full min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-transparent">
      
      {/* Visual glowing ring backing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl saturate-150 pointer-events-none -z-10" />

      <div className="w-full max-w-xl flex flex-col items-center z-10 text-center">
        
        {/* Enclosed main card */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white font-sans">

          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-pink-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              🎙️ Special Voice Message ✨
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-2">
            Sister's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
              Voice Letter!
            </span>{' '}
            💖
          </h2>

          <p className="text-xs text-white/70 mb-6 max-w-sm leading-relaxed">
            Record a live, heartwarming voice memo for your sister! Or play our beautiful pre-prepared sister greeting with AI narration.
          </p>

          {/* The Cassette / Record Widget Frame */}
          <div className="w-full max-w-xs relative rounded-[32px] bg-slate-950/95 shadow-2xl p-6 border-4 border-white/10 overflow-hidden flex flex-col items-center mb-6">
            
            {/* Label Card representing old school cassette look */}
            <div className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 rounded-2xl p-3.5 mb-6 shadow-md border-b-4 border-black/30 text-slate-950 flex flex-col items-center">
              <span className="font-mono font-bold text-[9px] uppercase tracking-widest text-[#2e0940]/70 mb-1">RECORD SIDE A 📼</span>
              <span className="text-[11px] font-sans font-black tracking-wide truncate max-w-full italic">
                {recordingState === 'recorded' 
                  ? (voiceMode === 'synth' ? "AI Automated Voice Memo" : "Surprise Message Mic")
                  : "Cassette Empty & Ready..."}
              </span>
            </div>

            {/* Double Tape Reels Spinning Center */}
            <div className="flex justify-around w-full px-4 mb-6 relative">
              
              {/* Spinning spool 1 */}
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-4 border-slate-800 bg-black flex items-center justify-center">
                  <motion.div
                    animate={playbackState === 'playing' ? { rotate: 360 } : recordingState === 'recording' ? { rotate: 180 } : {}}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="w-8 h-8 rounded-full border-4 border-dashed border-slate-600 flex items-center justify-center relative"
                  >
                    <div className="w-2.5 h-2.5 bg-slate-500 rounded-full shadow-inner" />
                  </motion.div>
                </div>
              </div>

              {/* Spinning spool 2 */}
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-4 border-slate-800 bg-black flex items-center justify-center">
                  <motion.div
                    animate={playbackState === 'playing' ? { rotate: 360 } : recordingState === 'recording' ? { rotate: 180 } : {}}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="w-8 h-8 rounded-full border-4 border-dashed border-slate-600 flex items-center justify-center relative"
                  >
                    <div className="w-2.5 h-2.5 bg-slate-500 rounded-full shadow-inner" />
                  </motion.div>
                </div>
              </div>
              
              {/* Trapezoid Cassette window detail */}
              <div className="absolute inset-x-20 top-4 bottom-4 bg-[#111119] rounded-lg border border-slate-800 flex items-center justify-center pointer-events-none opacity-80 shadow-inner" />
            </div>

            {/* Live Waves Indicators */}
            <div className="w-full flex items-end justify-center gap-1 h-10 mb-6 bg-black/40 rounded-xl px-4 border border-slate-800">
              {waves.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${h}px` }}
                  className="w-[3px] bg-pink-500 rounded-lg shadow-xs"
                />
              ))}
            </div>

            {/* Action Recorder Panel */}
            <div className="flex flex-col items-center w-full relative z-10">
              <AnimatePresence mode="wait">
                {recordingState === 'idle' && (
                  <div className="flex flex-col items-center gap-4">
                    <motion.button
                      key="rec-btn"
                      onClick={startRecording}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-red-600 border-2 border-red-400 flex items-center justify-center text-white cursor-pointer hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/30 transition-all shadow-md active:scale-95"
                      title="Click to Record Mic"
                    >
                      <Mic size={20} className="animate-pulse" />
                    </motion.button>
                    <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase font-bold">CLICK TO RECORD MIC</span>
                  </div>
                )}

                {recordingState === 'recording' && (
                  <motion.div
                    key="recoding-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <button
                      onClick={stopRecording}
                      className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-red-600 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                    >
                      <Square size={20} className="fill-red-600 border-none" />
                    </button>
                    <div className="flex items-center gap-1.5 mt-1 text-slate-100 font-mono text-xs font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
                      <span>RECORDING {formatTime(recordDuration)}</span>
                    </div>
                  </motion.div>
                )}

                {recordingState === 'recorded' && (
                  <motion.div
                    key="playback-panel"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex justify-center items-center gap-5 w-full"
                  >
                    {/* Reset button */}
                    <button
                      onClick={handleDeleteRecording}
                      className="p-3 bg-slate-800 rounded-full text-slate-400 border border-slate-700/80 hover:text-red-500 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title="Reset Tape"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Play Main Button */}
                    <button
                      onClick={() => togglePlayback()}
                      className="w-14 h-14 rounded-full bg-pink-500 border-2 border-pink-300 flex items-center justify-center text-white shadow-xl hover:bg-pink-400 focus:outline-none transition-all cursor-pointer shadow-current"
                    >
                      {playbackState === 'playing' ? <Pause size={24} className="animate-pulse" /> : <Play size={24} className="translate-x-0.5" />}
                    </button>

                    {/* Complete green badge */}
                    <div className="p-3 bg-emerald-950/40 rounded-full text-emerald-400 border border-emerald-500/20 shadow-md">
                      <Check size={16} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Beautiful Inline Trigger for automated AI Voice Note Greeting */}
          {recordingState === 'idle' && (
            <motion.button
              type="button"
              onClick={playAutomatedSpeech}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 py-3 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 text-white text-xs font-extrabold uppercase tracking-widest rounded-full shadow-[0_4px_15px_rgba(244,63,94,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles size={14} className="text-yellow-300 animate-spin-slow" />
              <span>✨ Play Automated AI Speech Note</span>
            </motion.button>
          )}

          {/* Diagnostic Error Help banner */}
          {errorMessage && (
            <div className="max-w-xs mt-6 bg-amber-950/40 text-amber-200 p-4 rounded-3xl text-xs leading-relaxed border border-amber-500/20 shadow-lg flex flex-col items-center gap-2">
              <span className="opacity-90">{errorMessage}</span>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
