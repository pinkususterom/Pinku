import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Gift } from 'lucide-react';

interface MagicLoadingProps {
  onUnlock: () => void;
}

export default function MagicLoading({ onUnlock }: MagicLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Preparing a special surprise...');
  const [step, setStep] = useState<'loading' | 'reveal' | 'unlocked'>('loading');

  const funnyLoadingMsgs = [
    'Preparing a special surprise...',
    'Locating the world\'s biggest troublemaker... 🕵️‍♀️',
    'Calculating sister\'s annual snack-stealing stats... 🍫',
    'Adding extra sparkles to the cake... ✨',
    'Packaging up 1,000 warm virtual hugs... 🤗',
    'Almost ready to make sweet memories... 💖'
  ];

  useEffect(() => {
    let timer: any;
    let textIdx = 0;

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('reveal'), 800);
          return 100;
        }
        
        // Progress step
        const add = Math.floor(Math.random() * 12) + 5;
        const next = Math.min(old + add, 100);
        
        // Change text occasionally
        if (next > (textIdx + 1) * 16 && textIdx < funnyLoadingMsgs.length - 1) {
          textIdx++;
          setLoadingText(funnyLoadingMsgs[textIdx]);
        }
        return next;
      });
    }, 250);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const triggerChime = () => {
    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, actx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, actx.currentTime + 0.5); // C6
      
      gain.gain.setValueAtTime(0.3, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.82);
    } catch (e) {
      console.warn("Audio Context not supported or allowed", e);
    }
  };

  const handleOpen = () => {
    triggerChime();
    // Also try waking the general audio widget by dispatching self-event
    const box = document.getElementById('audio-music-box')?.querySelector('button');
    if (box) {
      box.click(); // simulate user clicking music box center to enable play!
    }
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#160a2c] p-6 overflow-hidden">
      {/* Soft background decor */}
      <div className="absolute top-20 left-10 w-44 h-44 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <AnimatePresence mode="wait">
        {step === 'loading' && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-center flex flex-col items-center"
          >
            {/* Loading graphics */}
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
                className="w-24 h-24 rounded-full border-4 border-dashed border-pink-400 flex items-center justify-center"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="text-pink-500 fill-pink-500/30 animate-bounce" size={32} />
              </div>
            </div>

            <h3 className="text-lg font-black text-pink-300 tracking-tight mb-2 h-14 flow-root font-sans">
              {loadingText}
            </h3>
            
            {/* Progress Bar Container */}
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner mb-2 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-pink-300/80">
              {progress}%
            </span>
          </motion.div>
        )}

        {step === 'reveal' && (
          <motion.div
            key="revelation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md text-center flex flex-col items-center"
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white">
              {/* Corner decor */}
              <div className="absolute -top-3 -left-3 bg-pink-500 text-white rounded-full p-2.5 shadow-lg">
                <Sparkles size={16} />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-purple-600 text-white rounded-full p-2.5 shadow-lg">
                <Gift size={16} />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-pink-300 text-sm font-black tracking-widest uppercase mb-3 font-mono"
              >
                🎂 IT'S TIME...
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl sm:text-2xl font-extrabold text-white leading-snug mb-4 font-sans tracking-tight"
              >
                Today is not just any birthday...
              </motion.h2>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-500 leading-relaxed mb-8 font-sans"
              >
                It's the birthday of my favorite troublemaker! 🤪❤️
              </motion.h1>

              <motion.button
                onClick={handleOpen}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 1.8 }}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 font-extrabold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 relative group overflow-hidden cursor-pointer"
              >
                {/* Shiny highlight animation */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
                
                <Heart className="fill-white" size={20} />
                <span className="text-sm tracking-widest uppercase font-black">Open Your Surprise ❤️</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
