import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { motion } from "framer-motion";
import {
  Heart, Building2, TreePine, Cake, Diamond, Briefcase,
  Cat, Waves, GlassWater, Mic2, Flame, Star
} from "lucide-react";

const categories = [
  { name: "Wedding Venues", icon: Heart, color: "bg-primary/10 text-primary" },
  { name: "Banquet Halls", icon: Building2, color: "bg-accent/10 text-accent" },
  { name: "Farmhouses", icon: TreePine, color: "bg-venue-green/10 text-venue-green" },
  { name: "Birthday Party", icon: Cake, color: "bg-primary/10 text-primary" },
  { name: "Engagement", icon: Diamond, color: "bg-golden/10 text-golden" },
  { name: "Corporate Events", icon: Briefcase, color: "bg-accent/10 text-accent" },
  { name: "Kitty Party", icon: Cat, color: "bg-primary/10 text-primary" },
  { name: "Pool Party", icon: Waves, color: "bg-venue-green/10 text-venue-green" },
  { name: "Reception", icon: GlassWater, color: "bg-golden/10 text-golden" },
  { name: "Conference", icon: Mic2, color: "bg-accent/10 text-accent" },
  { name: "Garba Events", icon: Flame, color: "bg-primary/10 text-primary" },
  { name: "Gujarat Special", icon: Star, color: "bg-golden/10 text-golden" },
];

const CategorySwiper = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Explore Event Categories
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse venues by the type of event you're planning
          </p>
        </motion.div>

        <Swiper
          modules={[FreeMode, Autoplay]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="!overflow-visible"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.name} style={{ width: "auto" }}>
              <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 group min-w-[140px]">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">{cat.name}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CategorySwiper;
