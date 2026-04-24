const MarqueeStrip = () => {
  const items = [
    "Weddings", "Corporate Events", "Birthdays", "Engagements", 
    "Sangeet", "Conferences", "Baby Showers", "Receptions", 
    "Mehendi", "Award Nights"
  ];

  return (
    <div className="bg-primary py-3.5 overflow-hidden border-t border-b border-white/10">
      <div className="flex gap-0 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div key={i} className="inline-flex items-center gap-4 px-10 flex-shrink-0">
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-[11px] font-medium tracking-[2.5px] uppercase text-white/70">
              {item}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default MarqueeStrip;
