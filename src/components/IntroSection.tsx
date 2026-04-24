const IntroSection = () => {
  return (
    <section className="bg-white py-6 md:py-8">
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_2px_1fr] gap-8 items-center">
          {/* Left Side */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-5">
              India's most trusted platform for <em className="italic text-primary">exceptional</em> event venues
            </h2>
            
            <div className="grid grid-cols-2 sm:flex gap-6 sm:gap-10 mt-9">
              <div>
                <div className="font-display text-3xl sm:text-5xl font-semibold text-primary leading-none">
                  10K+
                </div>
                <div className="text-[9px] sm:text-[11px] font-medium tracking-wider uppercase text-muted-foreground mt-1 sm:mt-1.5">
                  Verified Venues
                </div>
              </div>
              <div>
                <div className="font-display text-3xl sm:text-5xl font-semibold text-primary leading-none">
                  150+
                </div>
                <div className="text-[9px] sm:text-[11px] font-medium tracking-wider uppercase text-muted-foreground mt-1 sm:mt-1.5">
                  Cities
                </div>
              </div>
              <div>
                <div className="font-display text-3xl sm:text-5xl font-semibold text-primary leading-none">
                  50K+
                </div>
                <div className="text-[9px] sm:text-[11px] font-medium tracking-wider uppercase text-muted-foreground mt-1 sm:mt-1.5">
                  Events Done
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block h-full bg-border" />

          {/* Right Side */}
          <div>
            <p className="text-[15px] font-light text-muted-foreground leading-relaxed mb-5">
              VenueConnect was built for people who believe the perfect setting transforms a celebration into a memory. We partner only with verified, high-quality venues — so every option you see is worth your time.
            </p>
            <p className="text-[15px] font-light text-muted-foreground leading-relaxed mb-5">
              From grand destination weddings in Rajasthan palaces to sleek corporate conferences in Bangalore — we connect you with the right space, every time.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-primary hover:gap-3.5 transition-all">
              Our story <span className="text-base">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
