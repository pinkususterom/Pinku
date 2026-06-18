import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';

export default function EmotionalLetter() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const rawLines = [
    "So today is birthday of my world prettiest ❤️ bahan ka......",
    "Meri lado rani happiest birthday tere iss 🤧🤧 mendak ki trf se.....",
    "Bhagwan meri bahan ko maximum happiness bkshe jitna wo deserve krti h usse 2guna de.....",
    "Wishes complete ho meri lado ki.... God ji meri bahan ko bilkul healthy rkha kro...",
    "she is not only sister...😛",
    "ik meri jaan hmari bate bhut km hoti h ya wese hm baat ni kr pa rhe h jese hoti thi but iska mtlb y nhi h ki hmara bond hmara love kmjor h ya h nhi",
    "mera tere liye pyar km ho gya ya kuch bhi......",
    "Y time only mere hardwork ka h jo tera bhai lga pda h nothing else",
    "m tere se aaj bhi utna pyaar kru jitna phle krta tha meri lado rani 😘...and this is true pta nhi kyu miss krta hu bhut 🙂tujhe......",
    "Kaam krte krte mn krta h baat krlu...leave wo sb ....",
    "Meri bahan happy Birthday again...god bless you😛hmesha khush rh tuj meri khushiya bhi mil jaye....",
    "Meri bahan ka dimaag shi raste rkhna god ji 🤧🤧...",
    "mujhe smjh ni aara tha kya kru kya kru for my sister so mene kr diya...",
    "i don't know tu sab kuch read kregi bhi ya nhi, dekhegi bhi ya nhi, acha lgega bhi ya nhi, khush hogi bhi ya nhi...",
    "but m hope krta hu meri bahan ko kuch to acha lga ho and smile ki ho... love wishes meri jaan meri cutest bahna😋......",
    "Happy Birthday again meri pyari bahan 😘 tu khri thi bdy hi to h ....",
    "tu wesa na soch skti na sochti m to soch skta meri lado na aai hoti to muje itni pyari bahan kha se milti 😌😌...",
    "wese m tarif krna ni chahta but you are so beautiful 😍❤️🤣🤣 (just kidding 😂) abe htt ....."
  ];

  useEffect(() => {
    if (showAll) {
      setTypedLines(rawLines);
      return;
    }
    if (currentLineIdx >= rawLines.length) return;

    const timer = setTimeout(() => {
      const line = rawLines[currentLineIdx];
      
      if (charIdx < line.length) {
        setTypedLines((prev) => {
          const next = [...prev];
          if (!next[currentLineIdx]) {
            next[currentLineIdx] = '';
          }
          next[currentLineIdx] = line.substring(0, charIdx + 1);
          return next;
        });
        setCharIdx((prev) => prev + 1);
      } else {
        // Line completed, transition to next line with slight pause
        setTimeout(() => {
          setCurrentLineIdx((prev) => prev + 1);
          setCharIdx(0);
        }, 500); // slightly faster pause between lines
      }
    }, 15); // characters speed faster for pleasant reading flow

    return () => clearTimeout(timer);
  }, [currentLineIdx, charIdx, showAll]);

  const handleRestart = () => {
    setShowAll(false);
    setTypedLines([]);
    setCurrentLineIdx(0);
    setCharIdx(0);
  };

  return (
    <section className="relative w-full min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-transparent">
      
      {/* Visual ambient circles */}
      <div className="absolute top-1/4 left-5 w-44 h-44 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-5 w-52 h-52 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col items-center z-10">
        
        {/* Enclosed main card */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">

          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-pink-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              ✍️ Handwritten Letter ✨
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-2">
            To My Favorite{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
              Sissu!
            </span>{' '}
            🥺
          </h2>

          <p className="text-xs text-white/70 mb-8 max-w-sm leading-relaxed">
            An emotional message straight from my heart. Only real sibling stories allowed!
          </p>

          {/* Lined Notebook Paper styled Letter */}
          <div 
            onClick={() => { if (!showAll) setShowAll(true); }}
            className={`w-full bg-[#fdfcf7] rounded-[32px] shadow-2xl border-x-4 border-slate-200/50 relative overflow-hidden p-6 sm:p-8 min-h-[420px] flex flex-col border border-stone-200/40 transition-all ${
              !showAll ? 'cursor-pointer hover:shadow-pink-500/10 hover:-translate-y-0.5' : 'cursor-default'
            }`}
          >
            {/* Sibling spiral binders on top */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-stone-200 to-transparent flex justify-between px-6">
              <span className="w-3 h-5 bg-stone-300 rounded-b-md block border border-stone-400/40 shadow-inner" />
              <span className="w-3 h-5 bg-stone-300 rounded-b-md block border border-stone-400/40 shadow-inner" />
              <span className="w-3 h-5 bg-stone-300 rounded-b-md block border border-stone-400/40 shadow-inner" />
              <span className="w-3 h-5 bg-stone-300 rounded-b-md block border border-stone-400/40 shadow-inner" />
              <span className="w-3 h-5 bg-stone-300 rounded-b-md block border border-stone-400/40 shadow-inner" />
              <span className="w-3 h-5 bg-stone-300 rounded-b-md block border border-stone-400/40 shadow-inner" />
            </div>

            {/* Letter Margin line representing real student diary paper */}
            <div className="absolute top-0 bottom-4 left-10 sm:left-14 w-[1.5px] bg-red-400 opacity-60" />

            {/* Lines of horizontal writing support */}
            <div className="absolute inset-x-0 top-10 bottom-6 bg-[repeating-linear-gradient(rgba(0,0,0,0)_0px,_rgba(0,0,0,0)_29px,_rgba(47,151,255,0.12)_30px)] pointer-events-none" />

            {/* Content Body */}
            <div className="relative mt-8 ml-6 sm:ml-10 font-sans leading-loose pl-1 pr-1.5 flex flex-col gap-6 text-left select-text">
              <h4 className="text-xs sm:text-sm font-black text-pink-600 font-sans tracking-wide uppercase">
                To My Pyari Lado Rani ❤️ (My Sweetest Jaan)
              </h4>

              <div className="space-y-6 text-slate-800 font-bold text-xs sm:text-sm font-sans tracking-tight leading-relaxed">
                {typedLines.map((line, idx) => {
                  const isHeading = line.includes("Happy Birthday again");
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${isHeading ? 'text-pink-600 font-black font-sans text-xs sm:text-sm border-t border-dashed border-pink-200 pt-4 mt-4 inline-block' : 'text-slate-800'}`}
                    >
                      {line}
                    </motion.div>
                  );
                })}
                
                {/* Typewriter Cursor */}
                {!showAll && currentLineIdx < rawLines.length && (
                  <span className="inline-block w-1.5 h-4 bg-pink-500 animate-[blink_0.8s_infinite] ml-1 align-middle" />
                )}
              </div>
            </div>
            
            {/* Little Floating details */}
            <div className="absolute bottom-4 right-6 flex items-center gap-1.5 opacity-70 text-[10px] text-pink-600 font-mono font-bold select-none">
              <Heart size={10} className="fill-pink-500 animate-pulse" />
              <span>Signed by Sibling (Tere Mendak 🐸)</span>
            </div>
          </div>

          {!showAll && currentLineIdx < rawLines.length && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 text-[10px] text-pink-300 hover:text-pink-200 font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 rounded-full px-4 py-1.5 shadow-md active:scale-95 transition-all select-none cursor-pointer"
            >
              ⚡ Click to show full letter instantly!
            </button>
          )}

          {/* Restart Action for typewriter */}
          {(showAll || currentLineIdx >= rawLines.length) && (
            <motion.button
              onClick={handleRestart}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-pink-300 bg-white/5 hover:bg-white/10 p-3 px-5 rounded-2xl border border-white/20 shadow-lg cursor-pointer active:scale-95 transition-transform"
            >
              <RefreshCw size={12} />
              <span>Replay Letter Writer</span>
            </motion.button>
          )}

        </div>

      </div>
    </section>
  );
}
