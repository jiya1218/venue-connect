'use client';

import { useState } from 'react';
import { Camera, Maximize2 } from 'lucide-react';
import VenueLightbox from './VenueLightbox';
import { getVarietyFallback } from "@/lib/imageUtils";

interface VenueGalleryProps {
  images: string[];
  name: string;
  overlay?: React.ReactNode;
}

export default function VenueGallery({ images, name, overlay }: VenueGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  // Ensure we have at least 5 images for the grid
  const displayImages = images && images.length > 0 ? images : [getVarietyFallback(name)];
  const count = displayImages.length;

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = getVarietyFallback(name);
  };

  return (
    <div className="mb-6 md:mb-10">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {count === 1 ? (
          <div 
            className="w-full h-[300px] lg:h-[450px] rounded-2xl lg:rounded-[2.5rem] overflow-hidden relative group cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <img 
              src={displayImages[0]} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              onError={handleImgError}
            />
            {overlay && <div className="absolute top-8 left-8 z-10">{overlay}</div>}
          </div>
        ) : count === 2 ? (
          <div className="grid grid-cols-2 gap-3 h-[300px] lg:h-[450px] rounded-2xl lg:rounded-[2.5rem] overflow-hidden">
            {displayImages.slice(0, 2).map((img, i) => (
              <div key={i} className="relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(i)}>
                <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={handleImgError} />
              </div>
            ))}
          </div>
        ) : count === 3 ? (
          <div className="grid grid-cols-3 gap-3 h-[300px] lg:h-[450px] rounded-2xl lg:rounded-[2.5rem] overflow-hidden">
            <div className="col-span-2 relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(0)}>
              <img src={displayImages[0]} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={handleImgError} />
            </div>
            <div className="grid grid-rows-2 gap-3">
              {displayImages.slice(1, 3).map((img, i) => (
                <div key={i} className="relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(i+1)}>
                  <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={handleImgError} />
                </div>
              ))}
            </div>
          </div>
        ) : count === 4 ? (
          <div className="grid grid-cols-4 gap-3 h-[300px] lg:h-[450px] rounded-2xl lg:rounded-[2.5rem] overflow-hidden">
            {displayImages.slice(0, 4).map((img, i) => (
              <div key={i} className={`relative group cursor-pointer overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`} onClick={() => openLightbox(i)}>
                <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={handleImgError} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 h-[300px] lg:h-[450px] rounded-2xl lg:rounded-[2.5rem] overflow-hidden">
            <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(0)}>
              <img src={displayImages[0]} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" onError={handleImgError} />
            </div>
            {displayImages.slice(1, 4).map((img, i) => (
              <div key={i} className="relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(i+1)}>
                <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={handleImgError} />
              </div>
            ))}
            <div className="relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(4)}>
              <img src={displayImages[4]} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={handleImgError} />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                <Camera className="w-8 h-8 mb-2" />
                <span className="font-bold tracking-widest uppercase text-xs">View Photos</span>
                <span className="text-[10px] opacity-70 mt-1">{count} Photos</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative h-[250px] rounded-2xl overflow-hidden shadow-lg">
        <img 
          src={displayImages[0]} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={handleImgError}
        />
        {overlay && <div className="absolute top-3 left-3 z-10 scale-75 origin-top-left">{overlay}</div>}
        <button 
          onClick={() => openLightbox(0)}
          className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20"
        >
          <Camera className="w-3 h-3" />
          {count} {count === 1 ? 'Photo' : 'Photos'}
        </button>
      </div>

      <VenueLightbox 
        images={images || []} 
        initialIndex={activeImageIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
      />
    </div>
  );
}
