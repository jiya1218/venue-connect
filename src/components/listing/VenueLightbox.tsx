'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VenueLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function VenueLightbox({ images, initialIndex, isOpen, onClose }: VenueLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrevious, handleNext, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center select-none"
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between text-white bg-gradient-to-b from-black/50 to-transparent z-10">
          <div className="text-sm font-medium tracking-widest uppercase">
            {currentIndex + 1} / {images.length}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Main Image Container */}
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full object-contain shadow-2xl"
              alt={`Venue Photo ${currentIndex + 1}`}
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 md:left-8 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all active:scale-95 group"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all active:scale-95 group"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Thumbnails Strip */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-2 overflow-x-auto bg-gradient-to-t from-black/50 to-transparent">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-16 h-12 md:w-20 md:h-16 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
                currentIndex === idx ? 'border-primary scale-110' : 'border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="Thumb" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
