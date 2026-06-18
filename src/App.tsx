/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Heart, Edit, ArrowDown, ChevronRight, RotateCcw } from 'lucide-react';
import { StoredPhoto, getPhotos, getSetting, saveSetting } from './utils/db';

// Component imports
import AudioMusicBox from './components/AudioMusicBox';
import Effects from './components/Effects';
import MagicLoading from './components/MagicLoading';
import HeroSection from './components/HeroSection';
import CakeCutting from './components/CakeCutting';
import FunnyCards from './components/FunnyCards';
import MemoryGallery from './components/MemoryGallery';
import WishWall from './components/WishWall';
import EmotionalLetter from './components/EmotionalLetter';
import VoiceMessage from './components/VoiceMessage';
import FinalSurprise from './components/FinalSurprise';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [customPhotos, setCustomPhotos] = useState<StoredPhoto[]>([]);
  const [sisterName, setSisterName] = useState('Pinku Bahan 👑');
  const [cakeCut, setCakeCut] = useState(false);
  
  // Customizer Panel State
  const [showConfig, setShowConfig] = useState(false);
  const [inputName, setInputName] = useState('');

  // Section index tracking
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load photos and settings on mount
  useEffect(() => {
    async function loadData() {
      const photos = await getPhotos();
      setCustomPhotos(photos);
      
      const savedName = await getSetting<string>('sister_name', 'Pinku Bahan 👑');
      setSisterName(savedName);
      setInputName(savedName);
    }
    loadData();
  }, []);

  const refreshPhotos = async () => {
    const photos = await getPhotos();
    setCustomPhotos(photos);
  };

  const saveConfig = async () => {
    await saveSetting('sister_name', inputName);
    setSisterName(inputName);
    setShowConfig(false);
  };

  const handleScrollToSection = (index: number) => {
    setActiveSection(index);
    const target = sectionRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Setup scroll observer to check which step her eyes are on
  useEffect(() => {
    if (!unlocked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) {
              setActiveSection(idx);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [unlocked]);

  return (
    <div className="relative min-h-screen bg-[#1a0b2e] text-white font-sans selection:bg-pink-500/30">
      
      {/* Global Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,105,180,0.15),transparent_70%)]" />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-pink-500 rounded-full blur-[120px] opacity-25" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20" />
      </div>

      <AnimatePresence>
        {!unlocked ? (
          <MagicLoading onUnlock={() => setUnlocked(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col w-full relative z-10"
          >
            {/* Ambient Background Effects */}
            <Effects triggerCakeBlowing={cakeCut} />

            {/* Floating Live Music Box */}
            <AudioMusicBox />

            {/* Customizer Gear Toggle */}
            <button
              onClick={() => setShowConfig(true)}
              className="fixed bottom-4 left-4 z-40 p-3 bg-white/10 backdrop-blur-md hover:bg-pink-500 hover:text-white rounded-full border border-white/20 shadow-lg cursor-pointer transition-all active:scale-95 text-pink-300 hover:scale-110"
              aria-label="Customize settings"
            >
              <Settings size={20} className="animate-[spin_4s_linear_infinite]" />
            </button>

            {/* Magical Main Presentation Journey */}
            <div className="w-full relative z-20 overflow-x-hidden">
              <div ref={(el) => (sectionRefs.current[0] = el)}>
                <HeroSection customPhotos={customPhotos} sisterName={sisterName} />
              </div>
              
              <div ref={(el) => (sectionRefs.current[1] = el)}>
                <CakeCutting onBlowing={() => setCakeCut(true)} />
              </div>

              <div ref={(el) => (sectionRefs.current[2] = el)}>
                <FunnyCards />
              </div>

              <div ref={(el) => (sectionRefs.current[3] = el)}>
                <MemoryGallery customPhotos={customPhotos} onPhotosChange={refreshPhotos} />
              </div>

              <div ref={(el) => (sectionRefs.current[4] = el)}>
                <WishWall />
              </div>

              <div ref={(el) => (sectionRefs.current[5] = el)}>
                <EmotionalLetter />
              </div>

              <div ref={(el) => (sectionRefs.current[6] = el)}>
                <VoiceMessage />
              </div>

              <div ref={(el) => (sectionRefs.current[7] = el)}>
                <FinalSurprise />
              </div>
            </div>

            {/* Progressive Story Nav Bar / Timeline tracker at the bottom */}
            {activeSection !== null && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#160a26]/90 backdrop-blur-lg border border-pink-500/30 rounded-full px-5 py-2.5 flex items-center gap-2.5 max-w-[90vw] w-max shadow-[0_8px_32px_rgba(244,63,94,0.15)] select-none text-white text-center"
              >
                <span className="text-xs animate-bounce">💡</span>
                <p className="text-[10px] sm:text-[11px] font-sans font-black text-pink-200 tracking-tight leading-none text-center">
                  {[
                    "Welcome Pinku! 🎵 Play the Birthday Chime (top-left) & scroll down for the surprise!",
                    "Cut/Slide the Birthday Cake, blow the candles, and let's get partying! 🎂",
                    "Flip the roasted cards 😜 to read customized sweet sibling roasts!",
                    "Tap on the memories below to load and stream gorgeous photos & videos! 📸",
                    "Double tap anywhere on the wall to send floating balloon wishes! 🎈",
                    "Read the beautifully decorated letter from your mendak brother 💖",
                    "Press Play to listen to the special voice tape recorded for you! 🎙️",
                    "Let's click here to capture this beautiful birthday smile forever! 👑"
                  ][activeSection] || "Scroll down to see the magic! ✨"}
                </p>
              </motion.div>
            )}

            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-1 bg-white/30 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/40 shadow-xl select-none max-w-xs sm:max-w-md">
              <span className="text-[10px] font-mono font-bold text-pink-700/80 mr-2">UNBOXING STEPS:</span>
              <div className="flex gap-2">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleScrollToSection(idx)}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center hover:scale-125 transition-transform cursor-pointer ${
                      activeSection === idx 
                        ? 'bg-pink-500 scale-110 ring-2 ring-pink-300' 
                        : idx === 1 && cakeCut 
                        ? 'bg-yellow-400' // candle lit gold
                        : 'bg-pink-200/60 hover:bg-pink-300/80'
                    }`}
                    title={`Go to step ${idx + 1}`}
                  >
                    {idx === activeSection && <Heart className="text-white fill-white" size={6} />}
                  </button>
                ))}
              </div>
              
              {/* Chevron arrow indicator recommending Next Moment */}
              {activeSection < 7 && (
                <button
                  onClick={() => handleScrollToSection(activeSection + 1)}
                  className="ml-3 p-1 rounded-full bg-pink-500 text-white hover:bg-pink-600 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
                  title="Next Slide"
                >
                  <ChevronRight size={10} />
                </button>
              )}
            </div>

            {/* Customizer Slider Panel */}
            <AnimatePresence>
              {showConfig && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 15 }}
                    className="w-full max-w-md rounded-[32px] bg-[#1e0e33]/95 border border-white/20 p-8 shadow-[0_0_50px_rgba(236,72,153,0.15)] relative text-white"
                  >
                    <button
                      onClick={() => setShowConfig(false)}
                      className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-pink-500 hover:text-white cursor-pointer active:scale-95 transition-colors"
                    >
                      <X size={16} />
                    </button>

                    <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                      <span>⚙️ Customizer Tool</span>
                    </h3>
                    
                    <p className="text-[10px] text-pink-300 font-mono mb-8 uppercase tracking-widest font-semibold">
                      Edit her default name and details
                    </p>

                    <div className="space-y-5">
                      {/* Name input */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-extrabold tracking-wider text-purple-300">SISTER'S NAME:</label>
                        <input
                          type="text"
                          value={inputName}
                          onChange={(e) => setInputName(e.target.value)}
                          maxLength={25}
                          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-white font-medium"
                          placeholder="Type her name..."
                        />
                      </div>
                    </div>

                    <button
                      onClick={saveConfig}
                      className="w-full py-4 mt-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-widest font-mono"
                    >
                      Apply Customizations ✨
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
