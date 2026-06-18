import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, Heart, X } from 'lucide-react';
import { Wish } from '../types';

export default function WishWall() {
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  // Generate 21 premium custom wishes
  const wishes: Wish[] = [
    { id: 1, text: "Stay happy always", emoji: "❤️", color: "from-pink-500 to-rose-500" },
    { id: 2, text: "Keep smiling forever", emoji: "😊", color: "from-amber-400 to-orange-500" },
    { id: 3, text: "May every dream come true", emoji: "✨", color: "from-yellow-400 to-amber-500" },
    { id: 4, text: "You deserve the best things in life", emoji: "🌸", color: "from-teal-400 to-emerald-500" },
    { id: 5, text: "Never stop being your crazy self", emoji: "😄", color: "from-purple-500 to-pink-500" },
    { id: 6, text: "Find all the hidden snacks in the house", emoji: "🍫", color: "from-amber-600 to-amber-800" },
    { id: 7, text: "Get an extra hour of sleep every morning", emoji: "🛌", color: "from-indigo-400 to-blue-500" },
    { id: 8, text: "Achieve all your studying & career dreams", emoji: "🎓", color: "from-sky-400 to-indigo-600" },
    { id: 9, text: "Keep flying high, my little superstar", emoji: "🚀", color: "from-violet-500 to-indigo-700" },
    { id: 10, text: "Always remain my favorite partner-in-crime", emoji: "🕵️‍♀️", color: "from-slate-700 to-slate-900" },
    { id: 11, text: "Never run out of dramatic Bollywood scripts", emoji: "🎭", color: "from-rose-500 to-purple-600" },
    { id: 12, text: "Endless laughter and deep midnight gossips", emoji: "💬", color: "from-fuchsia-400 to-rose-600" },
    { id: 13, text: "A life-time secure supply of ice cream & pizza", emoji: "🍕", color: "from-orange-400 to-rose-500" },
    { id: 14, text: "Always stay healthy, active and full of life", emoji: "🦋", color: "from-emerald-400 to-teal-500" },
    { id: 15, text: "Your radiant warmth keeps our family happy", emoji: "💡", color: "from-yellow-300 to-orange-400" },
    { id: 16, text: "Never let your adorable innocence fade away", emoji: "🎈", color: "from-red-400 to-pink-600" },
    { id: 17, text: "Travel to all the gorgeous corners of the earth", emoji: "✈️", color: "from-cyan-400 to-blue-600" },
    { id: 18, text: "Keep being the coolest virtual Chudel ever", emoji: "👻", color: "from-violet-400 to-purple-700" },
    { id: 19, text: "Every obstacle turn into a magical breakthrough", emoji: "🎖️", color: "from-yellow-400 to-yellow-600" },
    { id: 20, text: "I will ALWAYS have your back, no matter what", emoji: "🫂", color: "from-indigo-500 to-purple-600" },
    { id: 21, text: "Maximum prosperity, peaceful mind, and total joy", emoji: "🕊️", color: "from-emerald-400 to-teal-600" }
  ];

  // Distribute star coordinates in percentage so it adapts beautifully across all mobile screens
  const starPositions = [
    { x: 15, y: 15 }, { x: 45, y: 10 }, { x: 75, y: 18 },
    { x: 30, y: 24 }, { x: 60, y: 30 }, { x: 85, y: 32 },
    { x: 10, y: 38 }, { x: 50, y: 44 }, { x: 25, y: 52 },
    { x: 70, y: 48 }, { x: 90, y: 58 }, { x: 40, y: 58 },
    { x: 15, y: 68 }, { x: 65, y: 66 }, { x: 80, y: 72 },
    { x: 35, y: 74 }, { x: 50, y: 80 }, { x: 18, y: 86 },
    { x: 70, y: 88 }, { x: 88, y: 90 }, { x: 45, y: 92 }
  ];

  const handleStarClick = (wish: Wish) => {
    setSelectedWish(wish);
    
    // Tiny magical trigger sound upon tapping star
    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880.00, actx.currentTime); // A5 chime
      osc.frequency.exponentialRampToValueAtTime(1760.00, actx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.36);
    } catch (e) {}
  };

  return (
    <section className="relative w-full min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-transparent select-none">
      
      {/* Deep space visual background with constellations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(236,72,153,0.1),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col items-center z-10">
        
        {/* Enclosed main card */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">

          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-yellow-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              ⭐ Wish Constellations ✨
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-2">
            Sister's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
              Wish Wall!
            </span>{' '}
            ✨
          </h2>

          <p className="text-xs text-white/70 mb-8 max-w-xs font-sans leading-relaxed">
            Tapping on any glowing star launches a secret birthday blessing from my heart directly into the night sky!
          </p>

          {/* The Starry Map Canvas */}
          <div className="relative w-full aspect-square max-w-sm rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl p-4 overflow-hidden mb-8 flex items-center justify-center">
            
            {/* Subtle line drawing mapping stars */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 text-pink-400" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3">
              <polyline points="0,0 120,40 180,95 240,110 320,180" fill="none" />
              <polyline points="60,200 100,230 180,240 220,160" fill="none" />
              <polyline points="280,320 200,350 140,280 180,240" fill="none" />
            </svg>

            {/* Glowing Stars Grid */}
            {wishes.map((wish, index) => {
              const pos = starPositions[index] || { x: 50, y: 50 };
              const starDuration = 1.5 + (wish.id % 4) * 0.5;
              return (
                <motion.button
                  key={wish.id}
                  onClick={() => handleStarClick(wish)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: [0.4, 1, 0.4], 
                    scale: [0.9, 1.2, 0.9],
                    boxShadow: ["0 0 5px rgba(236,72,153,0.3)", "0 0 15px rgba(251,191,36,0.8)", "0 0 5px rgba(236,72,153,0.3)"]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: starDuration,
                    ease: 'easeInOut',
                    delay: wish.id * 0.1
                  }}
                  whileHover={{ scale: 1.4, zIndex: 40 }}
                  whileTap={{ scale: 0.8 }}
                  className="absolute p-2 flex items-center justify-center cursor-pointer"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <Star className="text-yellow-300 fill-yellow-300 shadow-md" size={wish.id % 2 === 0 ? 15 : 18} />
                </motion.button>
              );
            })}
          </div>
          
          <span className="text-[10px] text-white/50 font-mono">* 21 Twinkling Wishes Loaded</span>

        </div>

      </div>

      {/* Glow Wish Blessing Box Lightbox */}
      <AnimatePresence>
        {selectedWish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#140624]/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className={`w-full max-w-sm rounded-[32px] bg-gradient-to-br ${selectedWish.color} p-6 pb-8 border border-white/20 text-center shadow-2xl relative overflow-hidden`}
            >
              {/* Background ambient ring */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedWish(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/25 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Big emoji box */}
              <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl mx-auto mb-5 shadow-md">
                {selectedWish.emoji}
              </div>

              {/* Wish text */}
              <span className="text-[10px] font-mono tracking-widest text-white/80 block mb-1">BIRTHDAY BLESSING</span>
              <h3 className="text-lg font-black font-sans text-white mb-4 px-2 tracking-tight">
                {selectedWish.text} <span className="text-yellow-300 font-normal">❤️</span>
              </h3>

              {/* Sweet additional blessing comment */}
              <div className="mt-4 bg-black/15 py-3 px-4 rounded-xl text-left text-[11px] text-white/90 leading-relaxed font-sans font-medium flex items-start gap-2 border border-white/5">
                <Heart size={14} className="text-pink-300 fill-pink-300 mt-0.5 flex-shrink-0" />
                <span>You are the heart of our family. Wishing you infinite blessings on this sweet day!</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
