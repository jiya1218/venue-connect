'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ListingDescriptionProps {
  description: string;
  title?: string;
}

export default function ListingDescription({ description, title = "About the Business" }: ListingDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = description || "Premium professional providing modern services, offering a sophisticated experience for your most cherished celebrations across Gujarat.";
  
  const isLong = text.length > 300;

  return (
    <section className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-sm border border-slate-100 mb-6 md:mb-10">
      <h2 className="text-lg md:text-2xl font-display font-bold mb-4 md:mb-6 text-slate-900 border-l-4 border-primary pl-4 md:pl-6 py-1">{title}</h2>
      <div className="prose prose-slate max-w-none">
        <p className={`text-slate-600 leading-relaxed text-sm md:text-lg font-light whitespace-pre-wrap ${!isExpanded && isLong ? 'line-clamp-4' : ''}`}>
          {text}
        </p>
      </div>
      {isLong && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 md:mt-4 flex items-center gap-2 text-primary font-bold hover:underline transition-all text-sm md:text-base"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Read More <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </section>
  );
}
