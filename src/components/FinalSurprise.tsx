import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export default function FinalSurprise() {
  return (
    <section className="relative w-full min-h-screen py-24 px-4 flex flex-col items-center justify-center overflow-hidden bg-transparent text-white select-none">
      
      {/* Absolute dark starry sky with shooting stars */}
      <div className="absolute inset-x-0 top-0 bottom-1/2 pointer-events-none overflow-hidden opacity-40 z-0">
        <div className="absolute top-10 left-[10%] w-[1px] h-20 bg-gradient-to-b from-white to-transparent rotate-[45deg] animate-[shootingStar_4s_infinite]" />
        <div className="absolute top-24 left-[50%] w-[1px] h-24 bg-gradient-to-b from-white to-transparent rotate-[45deg] animate-[shootingStar_5s_infinite_1.5s]" />
        <div className="absolute top-8 right-[20%] w-[1px] h-16 bg-gradient-to-b from-white to-transparent rotate-[45deg] animate-[shootingStar_3.5s_infinite_2.2s]" />
      </div>

      <div className="w-full max-w-lg flex flex-col items-center text-center z-10">
        
        {/* Constellation Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono font-bold tracking-widest text-pink-300">
            🌌 CONSTELLATION REVEAL ✨
          </span>
        </motion.div>

        {/* Constellation SVG forming HAPPY BIRTHDAY */}
        <div className="w-full h-24 sm:h-28 flex items-center justify-center mb-8 relative select-none">
          <svg className="w-full h-full text-yellow-300 filter drop-shadow-[0_0_12px_rgba(253,224,71,0.8)]" viewBox="0 0 350 100">
            {/* Elegant glowing constellation lines for HAPPY BDAY */}
            <motion.path
              d="M 20 20 L 20 80 M 20 50 L 50 50 M 50 20 L 50 80 
                 M 75 80 L 90 20 L 105 80 M 80 60 L 100 60
                 M 120 80 L 120 20 Q 140 20 140 45 Q 140 70 120 70
                 M 155 80 L 155 20 Q 175 20 175 45 Q 175 70 155 70
                 M 190 20 L 205 55 L 220 20 M 205 55 L 205 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.2 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 3.5, ease: 'easeInOut' }}
            />
            {/* Heart shape constellation on right */}
            <motion.path
              d="M 270 40 C 270 20, 310 20, 310 40 C 310 65, 270 85, 270 85 C 270 85, 230 65, 230 40 C 230 20, 270 20, 270 40 Z"
              fill="rgba(244,63,94,0.15)"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 4, ease: 'easeInOut', delay: 1 }}
            />
          </svg>
          
          {/* Sparkles around constellation */}
          <div className="absolute top-2 left-[20%] text-yellow-300 animate-ping opacity-60">
            <Sparkles size={12} />
          </div>
          <div className="absolute bottom-2 right-[25%] text-pink-400 animate-pulse opacity-80" style={{ animationDuration: '2s' }}>
            <Heart size={14} className="fill-pink-400" />
          </div>
          <div className="absolute top-5 right-[10%] text-yellow-300 animate-ping opacity-60">
            <Sparkles size={14} />
          </div>
        </div>

        {/* Quotes Section */}
        <div className="max-w-md w-full px-8 py-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative mb-12">
          
          {/* Top light reflections */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg sm:text-xl font-bold font-serif text-white italic tracking-wide leading-relaxed mb-4"
          >
            "Distance means nothing..."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300 font-sans tracking-wide mb-6"
          >
            "...when someone means everything."
          </motion.p>

          {/* Final Love declaration with rotating heart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, delay: 1.6 }}
            className="flex items-center justify-center gap-2 text-2xl font-black text-rose-500 font-sans tracking-tight"
          >
            <span>Love You Little Sister</span>
            <Heart size={28} className="text-rose-500 fill-rose-500 animate-[heartBeat_1.2s_infinite]" />
          </motion.div>
        </div>

        {/* Sparkle decorative tagline */}
        <span className="text-[11px] font-mono tracking-widest text-pink-300 animate-pulse">
          ✨ CRAZY Troublemaker for lifetime ✨
        </span>

      </div>
    </section>
  );
}
