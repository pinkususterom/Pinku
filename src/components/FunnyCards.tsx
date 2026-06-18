import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Ghost, AlertTriangle, HelpCircle } from 'lucide-react';
import { FunnyCard } from '../types';

export default function FunnyCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const cards: FunnyCard[] = [
    {
      id: 'chudel',
      title: 'Certified Chudel',
      subtitle: 'Official scary status',
      emoji: '👻',
      desc: 'Expert at waking up at 3 AM with terrifying hair, looking absolutely wild, and haunting the refrigerator for snacks. Highly dangerous without morning coffee.',
      color: 'from-purple-500/10 via-pink-500/5 to-purple-600/15'
    },
    {
      id: 'bhootni',
      title: 'Professional Bhootni',
      subtitle: 'Grand Drama Queen',
      emoji: '😈',
      desc: 'Can transform any simple conversation into an award-winning Bollywood drama scene. Master of fake tears, extreme gossip, and high-frequency shouting.',
      color: 'from-rose-500/10 via-red-500/5 to-rose-600/15'
    },
    {
      id: 'gobar',
      title: 'Gobar Khani Expert',
      subtitle: 'Weird Food Connoisseur',
      emoji: '😂',
      desc: 'Discovered combining bizarre food mixtures. Fights with full conviction that her weird food tastes like five-star cuisine. True culinary pioneer.',
      color: 'from-amber-500/10 via-orange-500/5 to-amber-600/15'
    },
    {
      id: 'moti',
      title: 'World Famous Moti Rani',
      subtitle: 'The Diet Destroyer',
      emoji: '🍰',
      desc: 'Secretly finishes the last slice of cake and blames it on the cat, while chanting "diet starts tomorrow!" to the entire universe. Truly majestic.',
      color: 'from-pink-500/10 via-emerald-500/5 to-pink-600/15'
    }
  ];

  const handleCardClick = (id: string) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  return (
    <section className="relative w-full min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-transparent">
      
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-purple-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-rose-500/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-xl flex flex-col items-center">
        
        {/* Enclosed main card */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-pink-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              🎭 Sibling Teasing Zone ✨
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-2">
            Troublemaker{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
              Badges!
            </span>{' '}
            😈
          </h2>

          <p className="text-xs text-white/70 mb-10 max-w-xs font-sans">
            Tap any badge card to flip and reveal the official sibling verification description!
          </p>

          {/* Badge Cards Grid */}
          <div className="grid grid-cols-2 gap-4 w-full mb-10">
            {cards.map((card) => {
              const isFlipped = flippedCardId === card.id;
              return (
                <div 
                  key={card.id} 
                  className="perspective h-48 cursor-pointer relative"
                  onClick={() => handleCardClick(card.id)}
                >
                  <div 
                    className={`w-full h-full transition-transform duration-500 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
                  >
                    {/* Card Front */}
                    <div className="absolute inset-0 backface-hidden bg-[#24133f]/80 border border-white/10 p-4 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center shadow-lg hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:scale-[1.02] active:scale-95 transition-all">
                      <span className="text-4xl mb-3 animate-bounce" style={{ animationDuration: '3s' }}>
                        {card.emoji}
                      </span>
                      <h3 className="font-extrabold text-white text-xs sm:text-sm tracking-tight text-center">
                        {card.title}
                      </h3>
                      <p className="text-[9px] text-pink-300/90 font-bold uppercase tracking-wider font-mono mt-1">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Card Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#140624] border border-pink-500/20 p-4 rounded-3xl flex flex-col justify-center shadow-inner overflow-hidden">
                      <span className="text-pink-300 font-bold uppercase text-[9px] font-mono tracking-wider mb-1.5 flex items-center gap-0.5">
                        <HelpCircle size={10} /> SIBLING RECORD
                      </span>
                      <p className="text-white/80 text-[10px] leading-relaxed text-left font-sans font-medium">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fun Summary Tease Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full bg-white/5 p-5 rounded-3xl border border-white/15 text-center shadow-inner"
          >
            <div className="space-y-1 text-white/70 font-semibold text-xs sm:text-sm">
              <p className="animate-[pulse_2s_infinite]">"You may be annoying... 🙄"</p>
              <p className="animate-[pulse_2s_infinite_0.4s]">"You may be dramatic... 💅"</p>
              <p className="animate-[pulse_2s_infinite_0.8s]">"You may steal snacks... 🍫"</p>
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300 text-sm sm:text-base font-black tracking-tight mt-3">
              But life would be absolutely boring without you ❤️
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
