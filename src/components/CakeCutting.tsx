import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Wind, Sparkles } from 'lucide-react';

interface CakeCuttingProps {
  onBlowing: () => void;
}

export default function CakeCutting({ onBlowing }: CakeCuttingProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleBlow = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    setShowFireworks(true);
    
    // Play blowing chime sound
    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Siffle sound (blowing sound)
      const bufferSize = actx.sampleRate * 0.4;
      const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // white noise
      }
      const noise = actx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = actx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1;
      
      const noiseGain = actx.createGain();
      noiseGain.gain.setValueAtTime(0.2, actx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.35);
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(actx.destination);
      noise.start();
      
      // Happy celebratory high chimes (sparkly chime cascade)
      setTimeout(() => {
        const playChime = (freq: number, delay: number) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, actx.currentTime + delay);
          gain.gain.setValueAtTime(0, actx.currentTime + delay);
          gain.gain.linearRampToValueAtTime(0.25, actx.currentTime + delay + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + delay + 0.6);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start(actx.currentTime + delay);
          osc.stop(actx.currentTime + delay + 0.61);
        };
        
        playChime(523.25, 0); // C5
        playChime(659.25, 0.1); // E5
        playChime(783.99, 0.2); // G5
        playChime(1046.50, 0.3); // C6
      }, 200);

    } catch (e) {
      console.warn("Audio Context not supported", e);
    }

    // Call upstream triggers for falling balloons and floating ribbons
    onBlowing();

    // Replay/play music from the top-widget if paused
    const box = document.getElementById('audio-music-box')?.querySelector('button');
    if (box) {
      // If paused, let's play!
      const isCurrentlyPlaying = box.querySelector('.animate-pulse') !== null;
      if (!isCurrentlyPlaying) {
        box.click();
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-transparent">
      
      {/* Background visual burst */}
      <AnimatePresence>
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Custom vector CSS Fireworks */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1.5], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, ease: 'easeOut', repeat: 4 }}
              className="absolute left-[20%] top-[30%] w-32 h-32 rounded-full border-4 border-amber-300 border-dotted"
            />
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1.6], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, ease: 'easeOut', repeat: 3, delay: 0.3 }}
              className="absolute right-[15%] top-[25%] w-40 h-40 rounded-full border-4 border-pink-400 border-dashed"
            />
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1.4], opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, ease: 'easeOut', repeat: 5, delay: 0.5 }}
              className="absolute left-[35%] bottom-[20%] w-28 h-28 rounded-full border-4 border-purple-400 border-dotted"
            />
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-xl flex flex-col items-center z-10">
        
        {/* Core Vibrant Palette glass card panel wrapping the interactive cake cutting */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-yellow-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              🍯 Celebrating Virtual Cake ✨
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-3">
            Make a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
              Secret Wish!
            </span>{' '}
            💫
          </h2>
          
          <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed font-sans mb-8">
            Blow the candles of her virtual cake to officially kick off the magical surprise event!
          </p>

          {/* Realistic interactive CSS Birthday Cake */}
          <div className="relative w-64 h-72 flex items-end justify-center mb-8 group select-none">
            {/* Plate / Stand */}
            <div className="absolute bottom-0 w-64 h-4 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 rounded-full shadow-lg z-10" />
            <div className="absolute bottom-1 w-52 h-4 bg-white/10 backdrop-blur-xs rounded-full z-11 border border-white/10" />

            {/* Golden Stand Pedestal */}
            <div className="absolute bottom-0 w-24 h-10 bg-yellow-600 rounded-b-xl shadow-md left-1/2 -translate-x-1/2" />

            {/* Cake Body Container */}
            <div className="absolute bottom-4 w-44 h-40 flex flex-col items-center z-20">
              {/* Cake Layer 2 (Top Layer, Pink Strawberry Cream) */}
              <div className="w-36 h-16 bg-gradient-to-b from-pink-400 to-pink-500 rounded-2xl relative shadow-md flex justify-center">
                {/* Cream drips */}
                <div className="absolute -bottom-1 left-3 w-4 h-6 bg-pink-500 rounded-full" />
                <div className="absolute -bottom-2 left-10 w-3 h-8 bg-pink-500 rounded-full" />
                <div className="absolute -bottom-1.5 left-16 w-4 h-5 bg-pink-500 rounded-full" />
                <div className="absolute -bottom-3 left-24 w-3.5 h-10 bg-pink-500 rounded-full" />
                <div className="absolute -bottom-1 left-30 w-4 h-6 bg-pink-500 rounded-full" />

                {/* Frosting Swirls on top */}
                <div className="absolute top-0 w-full h-3 bg-rose-300 rounded-t-2xl flex justify-between px-2">
                  <span className="w-3 h-3 rounded-full bg-white -mt-1 block shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-white -mt-1 block shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-white -mt-1 block shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-white -mt-1 block shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-white -mt-1 block shadow-xs" />
                </div>
              </div>

              {/* Cake Layer 1 (Bottom Layer, Rich Chocolate / Gold Base) */}
              <div className="w-44 h-24 bg-gradient-to-b from-amber-800 to-amber-950 rounded-2xl -mt-4 relative shadow-lg">
                {/* Gold confetti circles on the side of bottom layer */}
                <div className="absolute top-6 left-4 w-2 h-2 rounded-full bg-yellow-400" />
                <div className="absolute top-10 left-10 w-1.5 h-1.5 rounded-full bg-pink-400" />
                <div className="absolute top-5 left-20 w-2 h-2 rounded-full bg-purple-400" />
                <div className="absolute top-12 left-28 w-2 h-2 rounded-full bg-yellow-400" />
                <div className="absolute top-4 left-36 w-1.5 h-1.5 rounded-full bg-sky-400" />
                <div className="absolute top-14 left-40 w-1.5 h-1.5 rounded-full bg-pink-400" />

                {/* Draining Cream */}
                <div className="absolute -bottom-1 w-full h-3 bg-pink-600/20 rounded-b-2xl" />
              </div>
            </div>

            {/* Interactive Candles with flickering flames */}
            <div className="absolute bottom-40 w-36 h-20 -mb-2 z-30 flex justify-around px-2 pointer-events-none">
              {[1, 2, 3].map((id) => (
                <div key={id} className="relative flex flex-col items-center h-full">
                  {/* Flame */}
                  <AnimatePresence>
                    {!candlesBlown && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: [1, 1.15, 1, 1.1, 1],
                          rotate: [0, -4, 4, -2, 0],
                          y: [0, -1, 0]
                        }}
                        exit={{ 
                          scale: 0,
                          opacity: 0,
                          transition: { duration: 0.3 }
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1.2 + id * 0.1,
                          ease: 'easeInOut'
                        }}
                        className="absolute -top-7 w-4 h-7 bg-gradient-to-t from-red-500 via-yellow-400 to-yellow-100 rounded-full filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] origin-bottom"
                      />
                    )}
                  </AnimatePresence>

                  {/* Smoke particle when blown */}
                  {candlesBlown && (
                    <motion.div
                      initial={{ y: -5, opacity: 0, scale: 0.5 }}
                      animate={{ y: -40, opacity: [0, 0.6, 0], scale: [0.5, 1.5, 2] }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: id * 0.15 }}
                      className="absolute -top-10 w-2 h-4 rounded-full bg-slate-400/40 blur-xs"
                    />
                  )}

                  {/* Wick */}
                  <div className="w-[2px] h-2 bg-slate-700 absolute -top-1" />

                  {/* Candle sticks */}
                  <div className={`w-3 h-14 ${id % 2 === 0 ? 'bg-gradient-to-b from-sky-400 to-sky-500' : 'bg-gradient-to-b from-yellow-300 to-yellow-400'} rounded-t-sm shadow-md border-t border-white/40 flex flex-col justify-between overflow-hidden`}>
                    {/* Stripes */}
                    <div className="h-[2px] w-full bg-white/40 skew-y-12 mt-2" />
                    <div className="h-[2px] w-full bg-white/40 skew-y-12" />
                    <div className="h-[2px] w-full bg-white/40 skew-y-12" />
                    <div className="h-[2px] w-full bg-white/40 skew-y-12 mb-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glow Action Button */}
          <div className="w-full h-18 relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!candlesBlown ? (
                <motion.button
                  key="blow-btn"
                  onClick={handleBlow}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-extrabold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.45)] border border-white/20 cursor-pointer"
                >
                  <Flame className="text-white fill-white animate-pulse" size={18} />
                  <span className="uppercase tracking-widest font-mono text-xs">Blow the Candles</span>
                </motion.button>
              ) : (
                <motion.div
                  key="celebrate-text"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-center gap-1.5 text-pink-400 font-extrabold text-base sm:text-lg">
                    <Sparkles size={20} className="text-yellow-400 animate-bounce" />
                    <span>Birthday surprise officially activated! 🎉</span>
                  </div>
                  <span className="text-[10px] text-white/50 font-mono tracking-wider mt-1 uppercase font-semibold">THE CELEBRATION IS LIVE</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
