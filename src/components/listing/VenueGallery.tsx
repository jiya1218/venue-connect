'use client';

import { useState } from 'react';
import { Camera, Maximize2 } from 'lucide-react';
import VenueLightbox from './VenueLightbox';

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
  const displayImages = images && images.length > 0 
    ? (images.length >= 5 ? images : [...images, ...Array(5 - images.length).fill(images[0])])
    : Array(5).fill('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80');

  return (
    <div className="mb-6 md:mb-10">
      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-4 gap-3 h-[400px] lg:h-[600px] rounded-2xl lg:rounded-[2.5rem] overflow-hidden">
        {/* Main Hero Image */}
        <div 
          className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <img 
            src={displayImages[0]} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          
          {/* Overlay badges if provided */}
          {overlay && (
            <div className="absolute top-8 left-8 z-10">
                {overlay}
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        <div 
          className="relative group cursor-pointer overflow-hidden"
          onClick={() => openLightbox(1)}
        >
          <img 
            src={displayImages[1]} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
        <div 
          className="relative group cursor-pointer overflow-hidden"
          onClick={() => openLightbox(2)}
        >
          <img 
            src={displayImages[2]} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
        <div 
          className="relative group cursor-pointer overflow-hidden"
          onClick={() => openLightbox(3)}
        >
          <img 
            src={displayImages[3]} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
        
        <div 
          className="relative group cursor-pointer overflow-hidden"
          onClick={() => openLightbox(4)}
        >
          <img 
            src={displayImages[4]} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div 
            className="absolute inset-x-0 bottom-0 top-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px] opacity-100 transition-all duration-500"
          >
            <Camera className="w-8 h-8 mb-2" />
            <span className="font-bold tracking-widest uppercase text-xs">View Photos</span>
            <span className="text-[10px] opacity-70 mt-1">{images?.length || 0} Photos Available</span>
          </div>
        </div>
      </div>

      {/* Mobile Single Hero */}
      <div className="md:hidden relative h-[250px] rounded-2xl overflow-hidden shadow-lg">
        <img 
          src={displayImages[0]} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
        {overlay && (
            <div className="absolute top-3 left-3 z-10 scale-75 origin-top-left">
                {overlay}
            </div>
          )}
        <button 
          onClick={() => openLightbox(0)}
          className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20"
        >
          <Camera className="w-3 h-3" />
          View All {images?.length || 0} Photos
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
