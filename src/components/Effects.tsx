import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  type: 'heart' | 'star' | 'circle' | 'sparkle' | 'balloon';
  duration: number;
  rotation: number;
}

export default function Effects({ triggerCakeBlowing }: { triggerCakeBlowing: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate background particles on mount (optimized and lightweight)
  useEffect(() => {
    const initial: Particle[] = [];
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#fbbf24'];
    const types: ('heart' | 'star' | 'circle' | 'sparkle')[] = ['heart', 'star', 'circle', 'sparkle'];
    
    // Kept to an ultra-frugal 12 initial background particles for high speed
    for (let i = 0; i < 12; i++) {
      initial.push({
        id: Math.random() + i,
        x: Math.random() * 100, // percentage x
        y: Math.random() * 100 + 100, // start below screen or staggered
        size: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)],
        duration: Math.random() * 12 + 10,
        rotation: Math.random() * 360,
      });
    }
    setParticles(initial);

    // Keep spawning new faint background ones slowly up to a cap of 20
    const interval = setInterval(() => {
      setParticles((prev) => {
        if (prev.length > 20) return prev;
        const colors = ['#f43f5e', '#ec4899', '#d946ef', '#fbbf24'];
        const types: ('heart' | 'star' | 'circle' | 'sparkle')[] = ['heart', 'star', 'circle', 'sparkle'];
        return [
          ...prev,
          {
            id: Math.random(),
            x: Math.random() * 100,
            y: 110,
            size: Math.random() * 10 + 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            type: types[Math.floor(Math.random() * types.length)],
            duration: Math.random() * 10 + 10,
            rotation: Math.random() * 360,
          },
        ];
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Trigger celebratory particle explode on cake blowing
  useEffect(() => {
    if (triggerCakeBlowing) {
      const celebratory: Particle[] = [];
      const colors = ['#f43f5e', '#ec4899', '#d946ef', '#fbbf24', '#3b82f6', '#10b981'];
      const types: ('heart' | 'star' | 'circle' | 'sparkle' | 'balloon')[] = ['heart', 'star', 'circle', 'sparkle', 'balloon'];

      // Reduced to a highly energetic but CPU-optimized 35 particles
      for (let i = 0; i < 35; i++) {
        celebratory.push({
          id: Math.random() + i * 1000,
          x: Math.random() * 100,
          y: Math.random() * 15 + 100, // dense at bottom
          size: Math.random() * (i % 7 === 0 ? 30 : 15) + 10, // some balloons, some starbursts
          color: colors[Math.floor(Math.random() * colors.length)],
          type: i % 8 === 0 ? 'balloon' : types[Math.floor(Math.random() * (types.length - 1))],
          duration: Math.random() * 3.5 + 3.5, // fast, punchy float up!
          rotation: Math.random() * 360,
        });
      }

      setParticles((prev) => [...prev, ...celebratory]);

      // Filter out completed celebrating particles after 7 seconds to keep GPU clean
      const timer = setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.y > 90 || p.duration > 7));
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [triggerCakeBlowing]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      <AnimatePresence>
        {particles.map((p) => {
          const isCelebrationParticle = p.duration < 9;
          return (
            <motion.div
              key={p.id}
              initial={{ 
                x: `${p.x}vw`, 
                y: `${p.y}vh`, 
                rotate: p.rotation, 
                opacity: 0,
                scale: 0.5 
              }}
              animate={{
                y: '-15vh',
                rotate: p.rotation + (Math.random() > 0.5 ? 270 : -270),
                opacity: [0, 0.7, 0.7, 0],
                scale: [0.7, 1, 1, 0.5],
                x: [
                  `${p.x}vw`,
                  `${p.x + (Math.random() * 10 - 5)}vw`,
                  `${p.x + (Math.random() * 10 - 5)}vw`,
                ]
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                ease: isCelebrationParticle ? 'easeOut' : 'easeInOut',
                repeat: isCelebrationParticle ? 0 : Infinity,
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                color: p.color,
                // Removed performance-killing drop-shadow CSS filter!
              }}
            >
              {p.type === 'heart' && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.628 3.388 15.485 15.485 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              )}
              {p.type === 'star' && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-amber-300">
                  <path d="M11.48 3.499c.172-.436.79-.436.962 0l1.83 4.63 4.96.486c.475.047.665.632.311.966L15.938 13.1l1.04 4.887c.1.472-.412.844-.824.594L12 16.14l-4.154 2.441c-.412.25-.924-.122-.824-.594L8.06 13.1 4.417 9.58c-.354-.334-.164-.919.311-.966l4.96-.486 1.83-4.63z" />
                </svg>
              )}
              {p.type === 'circle' && (
                <div className="w-full h-full rounded-full opacity-50" style={{ backgroundColor: p.color }} />
              )}
              {p.type === 'sparkle' && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-yellow-300">
                  <path d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904ZM19.071 7.071L18.5 11L17.929 7.071L14 6.5L17.929 5.929L18.5 2L19.071 5.929L23 6.5L19.071 7.071Z" />
                </svg>
              )}
              {p.type === 'balloon' && (
                <div className="relative w-full h-full flex flex-col items-center">
                  <div 
                    className="w-full h-[85%] rounded-t-full rounded-b-2xl relative shadow-[inset_-2px_-3px_5px_rgba(0,0,0,0.15)]"
                    style={{ 
                      backgroundColor: p.color,
                      transform: 'scaleX(1.05)',
                    }}
                  >
                    <div className="absolute top-[15%] left-[20%] w-[25%] h-[20%] bg-white/30 rounded-full" />
                  </div>
                  <div 
                    className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px]" 
                    style={{ borderBottomColor: p.color }}
                  />
                  <svg className="w-1.5 h-6 text-white/40 -mt-1" viewBox="0 0 10 30" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M5 0 C2 10, 8 20, 5 30" />
                  </svg>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
