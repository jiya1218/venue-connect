const StatsBand = () => {
  const stats = [
    { num: "10K+", label: "Verified Venues" },
    { num: "150+", label: "Cities Covered" },
    { num: "50K+", label: "Events Celebrated" },
    { num: "4.8★", label: "Average Rating" },
  ];

  return (
    <div className="relative bg-primary py-5 md:py-8 overflow-hidden">
      {/* Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 text-center">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`py-4 md:py-12 ${i % 2 === 0 ? 'border-r transition-none' : 'md:border-r'} border-white/20`}
            >
              <div className="font-display text-2xl md:text-7xl font-semibold text-white leading-none mb-1 md:mb-3">
                {stat.num}
              </div>
              <div className="text-[8px] md:text-[11px] font-black tracking-[2px] md:tracking-[3px] uppercase text-white/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBand;
