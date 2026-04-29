'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Star, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';

const REVIEWS = [
  { name: "Amarya", text: "We recently hosted our child's first birthday with the help of VenueConnect and it was a very memorable...", title: "Wonderful Experience !", rating: 5 },
  { name: "Siddharth", text: "Found the perfect photographer for my sister's wedding. The process was smooth and the quality was top-notch.", title: "Extremely Professional", rating: 5 },
  { name: "Meera", text: "Great experience booking my pre-wedding shoot. The vendor was very cooperative and understanding.", title: "Saved my day!", rating: 5 },
  { name: "Rahul J.", text: "The team helped us find a venue on extremely short notice. Truly appreciate the quick support and verified list.", title: "Fast & Reliable", rating: 5 },
  { name: "Pooja P.", text: "A one stop solution for all my event needs. Managed to hire a decorator and caterer within hours.", title: "Highly Recommended", rating: 5 },
  { name: "Ankit", text: "Transparency in pricing is what I liked the most. No hidden costs, just honest professional service.", title: "Best in class", rating: 5 },
  { name: "Ishaan", text: "Managed our corporate retreat perfectly. The quality of vendors listed here is premium.", title: "Excellent Service", rating: 5 },
  { name: "Divya", text: "Loved the personal touch and guidance. They really care about making your event special.", title: "Truly Memorable", rating: 5 }
];

export const ReviewCarousel = () => {
    const [revStartIndex, setRevStartIndex] = useState(0);
    const visibleCount = 3;

    const next = () => {
        setRevStartIndex((prev) => (prev + 1) % REVIEWS.length);
    };

    const prev = () => {
        setRevStartIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
    };

    const displayReviews = [...REVIEWS, ...REVIEWS].slice(revStartIndex, revStartIndex + visibleCount);

    return (
        <div className="relative px-12 group/revnav max-w-[1300px] mx-auto">
            <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all z-20 border border-slate-100 md:-left-4">
                <ChevronLeft size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {displayReviews.map((r, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-white shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center min-h-[360px]">
                        <h3 className="text-xl font-black text-slate-900 mb-4">{r.name}</h3>
                        <p className="text-slate-600 font-medium text-center mb-8 leading-relaxed opacity-90 text-sm min-h-[80px]">"{r.text}"</p>
                        <div className="flex gap-1.5 text-amber-500 mb-8">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} className={i < r.rating ? "fill-current" : "text-slate-200"} />
                            ))}
                        </div>
                        <p className="text-lg font-black text-primary uppercase tracking-tight">{r.title}</p>
                    </div>
                ))}
            </div>

            <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all z-20 border border-slate-100 md:-right-4">
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export const BlogsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    const blogs = [
        { title: "Perfect Corporate Venue Guide 2026", text: "Discover how to impress your clients with th...", date: "Wednesday Apr 22, 2026", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80", slug: "perfect-corporate-venue-guide" },
        { title: "Event Lighting Ideas That Completely...", text: "Lighting is one of the most powerful yet oft...", date: "Friday Mar 27, 2026", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", slug: "event-lighting-ideas" },
        { title: "How Couples Are Blending Festiviti...", text: "Indian weddings have always been grand, vibr...", date: "Tuesday Apr 14, 2026", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", slug: "blending-festivities" },
        { title: "Modern Wedding Rituals That Are Rep...", text: "Weddings have always been a reflection of cu...", date: "Thursday Apr 09, 2026", img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80", slug: "modern-wedding-rituals" },
        { title: "Bollywood Bridal Lehengas That Defi...", text: "When it comes to Indian weddings, Bollywood h...", date: "Saturday Apr 04, 2026", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80", slug: "bollywood-bridal-lehengas" },
        { title: "Top 10 Birthday Party Ideas for Kids", text: "Planning a kids birthday can be effortless w...", date: "Monday Mar 30, 2026", img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80", slug: "top-10-birthday-party-ideas" },
    ];

    const [autoPlay, setAutoPlay] = useState(true);

    useEffect(() => {
        if (!autoPlay) return;
        // Disable auto-rotate on mobile view (under 768px)
        if (typeof window !== 'undefined' && window.innerWidth < 768) return;

        const timer = setInterval(() => {
            setIsAnimating(true);
            setCurrentIndex(prev => (prev + 1) % blogs.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [blogs.length, autoPlay]);

    return (
        <div className="relative group/carousel mx-auto">
            <button 
                onClick={() => { setAutoPlay(false); setIsAnimating(true); setCurrentIndex(prev => (prev - 1 + blogs.length) % blogs.length); }}
                className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-30 w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xl"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => { setAutoPlay(false); setIsAnimating(true); setCurrentIndex(prev => (prev + 1) % blogs.length); }}
                className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-30 w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xl"
            >
                <ChevronRight size={24} />
            </button>

            <div className="overflow-hidden px-1">
                <div 
                    className="flex gap-5 transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / 5)}%)` }}
                >
                    {[...blogs, ...blogs].map((blog, idx) => (
                        <Link 
                            key={idx} 
                            href={`/blog/${blog.slug}`} 
                            className="min-w-[calc(50%-0.75rem)] md:min-w-[45%] lg:min-w-[20%] bg-white rounded-xl md:rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group border-b-4 border-b-transparent hover:border-b-primary"
                        >
                            <div className="relative h-32 md:h-44 overflow-hidden">
                                <img src={blog.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            </div>
                            <div className="p-3 md:p-5 flex-grow flex flex-col justify-between min-h-[100px] md:min-h-[150px]">
                                <div>
                                    <h4 className="text-sm md:text-[16px] font-black text-slate-950 group-hover:text-primary transition-colors leading-tight mb-2 md:mb-3 line-clamp-2">{blog.title}</h4>
                                    <p className="text-[12px] md:text-[14px] text-slate-800 font-bold line-clamp-2 leading-relaxed mb-2 md:mb-4">{blog.text}</p>
                                </div>
                                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-auto border-t border-slate-50 pt-2 md:pt-4">
                                    {blog.date}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
