import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DEFAULT_PHOTOS } from '../utils/defaultImages';

interface HeroSectionProps {
  customPhotos?: any[];
  sisterName: string;
}

export default function HeroSection({ sisterName }: HeroSectionProps) {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/photos')
      .then(r => r.json())
      .then(d => {
        if (d.photos && Array.isArray(d.photos) && d.photos.length > 0) {
          setPhotos(d.photos.map((p: any) => p.baseUrl));
        }
      })
      .catch(err => console.error('Error fetching hero photos:', err));
  }, []);

  // Merge scraped photos with defaults if not loaded yet
  const displayPhotos = Array.from({ length: 4 }).map((_, idx) => {
    if (photos[idx]) {
      return `${photos[idx]}=w300-h300-c`;
    }
    return DEFAULT_PHOTOS[idx].url;
  });

  return (
    <section className="relative w-full min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-transparent">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(236,72,153,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col items-center">
        
        {/* Hero Glass Card from Vibrant Palette theme */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 p-6 select-none">
            <span className="text-3xl animate-pulse">✨</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-pink-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              ✨ Today is the Day ✨
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black tracking-tighter leading-none mb-4 uppercase text-center"
          >
            HAPPY<br />BIRTHDAY<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-yellow-300 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.3)] font-sans">
              {sisterName.toUpperCase()}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-sm text-white/70 max-w-[340px] leading-relaxed font-medium mt-3"
          >
            You may be my younger sister... but you'll always be one of the most special people in my life. ❤️
          </motion.p>

          {/* Sibling Collage Section */}
          <div className="relative w-full h-56 mt-8 mb-4 flex items-center justify-center select-none">
            {displayPhotos.map((imgSrc, index) => {
              const config = [
                { rotate: -8, x: -70, y: -10, z: 10 },
                { rotate: 10, x: 70, y: -15, z: 5 },
                { rotate: -2, x: 0, y: 15, z: 20 },
                { rotate: 16, x: 45, y: 10, z: 2 }
              ][index] || { rotate: 0, x: 0, y: 0, z: 1 };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: config.rotate,
                    x: config.x,
                    y: config.y,
                    zIndex: config.z
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 0, 
                    zIndex: 40,
                    transition: { duration: 0.2 } 
                  }}
                  className="absolute w-28 sm:w-32 bg-white p-2 rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-pink-100 relative">
                    <img 
                      src={imgSrc} 
                      alt="Moment" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Miniature text bottom */}
                  <div className="mt-1.5 text-[8px] font-bold text-slate-400 font-mono text-center">
                    ⭐ MEMORY
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom decorative stats */}
          <div className="mt-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white/50 uppercase font-mono tracking-widest font-bold">
              Surprise Active: Side A Loaded
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
