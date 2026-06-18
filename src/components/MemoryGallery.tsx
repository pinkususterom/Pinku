import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Play, Sparkles, ShieldAlert, Video } from 'lucide-react';
import { DEFAULT_PHOTOS } from '../utils/defaultImages';
import STATIC_PHOTOS_JSON from '../utils/photos.json';

interface MemoryGalleryProps {
  // Ignored now that custom upload is removed to preserve clean client album
  customPhotos?: any[];
  onPhotosChange?: () => void;
}

interface PhotoItem {
  id: string;
  url: string;      // Thumbnail size (e.g. =w350-h350-c)
  hdUrl: string;    // Lightbox size (e.g. =w900)
  caption: string;
  isCustom: boolean;
  videoUrl?: string | null;
}

export default function MemoryGallery({}: MemoryGalleryProps) {
  // Shared Album state representing the Lovely Sister's Album
  const [albumPhotos, setAlbumPhotos] = useState<{ baseUrl: string; videoUrl: string | null }[]>([]);
  const [isLoadingAlbum, setIsLoadingAlbum] = useState(false);
  const [albumError, setAlbumError] = useState<string | null>(null);

  // Pagination for the grid to keep mobile DOM light & prevent crash
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 12;

  // Lightbox index tracking
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  // Fetch the shared album on mount
  useEffect(() => {
    async function fetchAlbum() {
      setIsLoadingAlbum(true);
      setAlbumError(null);
      try {
        const response = await fetch('/api/photos');
        if (!response.ok) {
          throw new Error('Could not fetch album.');
        }
        const data = await response.json();
        if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          setAlbumPhotos(data.photos);
        } else {
          setAlbumError('No photos found in album. Using fallback.');
        }
      } catch (err: any) {
        console.error('Error loading shared album:', err);
        setAlbumError('Unable to load online album. Try refreshing or check network.');
      } finally {
        setIsLoadingAlbum(false);
      }
    }
    fetchAlbum();
  }, []);

  // Compute total items list (Lovely Sister's Album)
  const currentViewItems: PhotoItem[] = React.useMemo(() => {
    if (albumPhotos.length > 0) {
      return albumPhotos.map((item, idx) => ({
        id: `google_${idx}`,
        url: `${item.baseUrl}=w350-h350-c`,     // Native center-crop thumbnail size
        hdUrl: `${item.baseUrl}=w900`,          // Crisp detail size
        caption: `Lovely Sister Memory #${idx + 1} ✨`,
        isCustom: false,
        videoUrl: item.videoUrl
      }));
    } else if (STATIC_PHOTOS_JSON && Array.isArray(STATIC_PHOTOS_JSON.photos) && STATIC_PHOTOS_JSON.photos.length > 0) {
      // Pre-scraped static photos from build time
      return STATIC_PHOTOS_JSON.photos.map((item, idx) => ({
        id: `static_google_${idx}`,
        url: `${item.baseUrl}=w350-h350-c`,
        hdUrl: `${item.baseUrl}=w900`,
        caption: `Lovely Sister Memory #${idx + 1} ✨`,
        isCustom: false,
        videoUrl: item.videoUrl
      }));
    } else {
      // Fallback local memory list
      return DEFAULT_PHOTOS.map((def, idx) => ({
        id: def.id,
        url: def.url,
        hdUrl: def.url,
        caption: def.caption,
        isCustom: false,
        videoUrl: null
      }));
    }
  }, [albumPhotos]);

  // Handle pagination slices safely
  const totalPages = Math.ceil(currentViewItems.length / photosPerPage);
  const paginatedItems = React.useMemo(() => {
    const startIdx = (currentPage - 1) * photosPerPage;
    return currentViewItems.slice(startIdx, startIdx + photosPerPage);
  }, [currentViewItems, currentPage, photosPerPage]);

  // Handle page resets and lightboxes
  useEffect(() => {
    setActivePhotoIdx(null);
  }, [currentPage]);

  const movePrev = () => {
    if (activePhotoIdx !== null) {
      setActivePhotoIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : paginatedItems.length - 1));
    }
  };

  const moveNext = () => {
    if (activePhotoIdx !== null) {
      setActivePhotoIdx((prev) => (prev !== null && prev < paginatedItems.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <section className="relative w-full min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-transparent">
      {/* Gentle local glow */}
      <div className="absolute top-[10%] left-[10%] w-60 h-60 bg-pink-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col items-center z-10">
        
        {/* Main interactive glass card */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-6 sm:p-10 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.30)] text-white font-sans">

          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-pink-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              📸 Lovely Sister Album ✨
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-2">
            Lovely Sister's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-500 font-extrabold">
              Personal Gallery
            </span>{' '}
            👑
          </h2>

          <p className="text-xs text-white/70 mb-8 max-w-xl leading-relaxed">
            A beautiful, live collection of memories. Scroll, explore, and run videos of sweet sibling times smoothly!
          </p>

          {/* Special loading status */}
          {isLoadingAlbum && (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
              <p className="text-xs text-pink-300 tracking-wider font-mono uppercase font-bold animate-pulse">
                Fetching her beautiful gallery... 💖
              </p>
            </div>
          )}

          {/* Album parse error fallback banner */}
          {albumError && !isLoadingAlbum && (
            <div className="w-full max-w-md p-4 mb-6 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs flex gap-3 items-center text-left">
              <Sparkles size={18} className="flex-shrink-0 text-pink-400 animate-pulse" />
              <div>
                <p className="font-bold">Pinku Bahan's Special Album Active 💖</p>
                <p className="opacity-80">Serving high-resolution, birthday memories safely from the build cache.</p>
              </div>
            </div>
          )}

          {/* The compact, memory-efficient GRID */}
          {!isLoadingAlbum && (
            <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-2 mb-8 select-none">
              <AnimatePresence mode="popLayout">
                {paginatedItems.map((photo, index) => {
                  // A slight elegant tilt for polaroid styling (statically assigned so no re-renders jank)
                  const tiltAngle = (index % 4 === 0) ? -1.5 : (index % 4 === 1) ? 1 : (index % 4 === 2) ? -1 : 1.5;
                  
                  return (
                    <motion.div
                      key={photo.id}
                      onClick={() => setActivePhotoIdx(index)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.03, y: -4, rotate: 0 }}
                      className="bg-white p-3 pb-5 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.25)] border border-slate-100/90 flex flex-col cursor-pointer relative"
                      style={{ rotate: `${tiltAngle}deg` }}
                    >
                      {/* Polaroid Pin */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-rose-500 rounded-full shadow-inner border-2 border-white z-10" />

                      {/* Cover Image Element with custom video indicator overlay */}
                      <div className="w-full aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden relative mb-3">
                        <img 
                          src={photo.url} 
                          alt="Lovely Sister polaroid" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover pointer-events-none" 
                        />
                        <div className="absolute inset-0 bg-pink-500/5 mix-blend-color-burn opacity-40" />

                        {/* Animated Video Ribbon Overlay */}
                        {photo.videoUrl && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white backdrop-blur-[2px] transition-all">
                            <span className="p-3 rounded-full bg-pink-500/90 border border-white/25 text-white shadow-lg flex items-center justify-center scale-100 hover:scale-110 active:scale-95 transition-transform">
                              <Play size={16} fill="white" className="ml-0.5" />
                            </span>
                            <div className="absolute bottom-2 left-2 right-2 bg-black/60 py-1 px-1.5 rounded-md text-[8px] font-bold tracking-widest uppercase text-pink-300 flex items-center justify-center gap-1">
                              <Video size={10} className="text-pink-400" />
                              <span>PLAY VIDEO</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Caption text */}
                      <p className="font-sans italic text-[11px] text-slate-800 text-center font-black truncate w-full px-1">
                        {photo.caption}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Simple compact pagination */}
          {totalPages > 1 && !isLoadingAlbum && (
            <div className="flex items-center gap-4 py-2 border-t border-white/5 w-full justify-center text-white/80 z-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 border border-white/15 hover:bg-white/10 active:scale-90 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center text-xs gap-1"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              
              <span className="font-mono text-xs font-black uppercase text-pink-300">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 border border-white/15 hover:bg-white/10 active:scale-90 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center text-xs gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Swipe Hint indicator */}
          <div className="flex items-center gap-1.5 text-[9px] text-pink-300/60 font-mono font-bold uppercase tracking-wider mt-6 select-none">
            <span>💖 Lovely Sister Birthday Unboxing Road Lane 🧁</span>
          </div>

        </div>

      </div>

      {/* Lightbox Overlay (Uses high quality video player controls to run beautifully!) */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhotoIdx(null)}
            className="fixed inset-0 z-[100] bg-[#06020c]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none cursor-pointer"
          >
            {/* Top Toolbar */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="absolute top-6 left-4 right-4 flex justify-between items-center z-20 text-white max-w-lg mx-auto"
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#f472b6] bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                ⭐ Memory {activePhotoIdx + 1 + (currentPage - 1) * photosPerPage} of {currentViewItems.length}
              </span>
              <button 
                onClick={() => setActivePhotoIdx(null)}
                className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 active:scale-90 transition-all cursor-pointer text-white shadow-lg border border-white/20 flex items-center justify-center"
                title="Close Memory"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Nav Arrows */}
            <button 
              onClick={(e) => { e.stopPropagation(); movePrev(); }}
              className="absolute left-4 p-3 rounded-full bg-white/5 hover:bg-pink-500 text-white transition-all transform hover:-translate-x-1 cursor-pointer active:scale-90 z-20 shadow-md border border-white/10"
            >
              <ChevronLeft size={22} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); moveNext(); }}
              className="absolute right-4 p-3 rounded-full bg-white/5 hover:bg-pink-500 text-white transition-all transform hover:translate-x-1 cursor-pointer active:scale-90 z-20 shadow-md border border-white/10"
            >
              <ChevronRight size={22} />
            </button>

            {/* Polaroid Detail Frame */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 pb-6 rounded-2xl shadow-2xl max-w-xs sm:max-w-md w-full flex flex-col items-center relative cursor-default border border-slate-150"
            >
              {/* Media viewer */}
              <div className="w-full aspect-[4/5] bg-black rounded-xl overflow-hidden relative mb-4 shadow-inner flex flex-col items-center justify-center">
                {paginatedItems[activePhotoIdx].videoUrl ? (
                  <div className="w-full h-full relative flex flex-col items-center justify-center">
                    <video
                      src={paginatedItems[activePhotoIdx].videoUrl}
                      controls
                      autoPlay
                      playsInline
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-contain select-none"
                    />
                  </div>
                ) : (
                  <img 
                    src={paginatedItems[activePhotoIdx].hdUrl} 
                    alt="High resolution memory" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none animate-fade-in" 
                  />
                )}
              </div>

              {/* Caption info & Fail-safe Direct Player Button for Videos */}
              <div className="flex flex-col items-center gap-1.5 w-full bg-slate-50 py-3 px-4 rounded-xl border border-slate-100">
                <p className="text-slate-800 text-xs sm:text-sm font-black italic font-sans text-center leading-relaxed">
                  {paginatedItems[activePhotoIdx].caption}
                </p>
                
                {paginatedItems[activePhotoIdx].videoUrl && (
                  <div className="w-full mt-2 pt-2 border-t border-slate-200/60 flex flex-col items-center">
                    <span className="text-[9px] text-slate-500 font-mono text-center leading-tight mb-2">
                      If browser blocks the video frame from playing here:
                    </span>
                    <a
                      href={paginatedItems[activePhotoIdx].videoUrl || undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 active:scale-95 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-lg shadow-sm transition-all"
                    >
                      <Play size={10} fill="white" /> Play in Native Player Tab ↗
                    </a>
                  </div>
                )}
                
                <span className="text-[9px] font-mono font-bold tracking-widest text-pink-500 uppercase text-center mt-1">
                  💖 sweet sibling connection 💖
                </span>
              </div>

              {/* Pin Accent */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full shadow-md border-2 border-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
