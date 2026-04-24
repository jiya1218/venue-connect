import { motion } from "framer-motion";
import { Building, Hotel, TreePine, Tent, Dumbbell, UtensilsCrossed, Landmark } from "lucide-react";

const types = [
  { name: "Hotels", icon: Hotel, count: 120 },
  { name: "Resorts", icon: TreePine, count: 85 },
  { name: "Party Plots", icon: Tent, count: 200 },
  { name: "Lawns", icon: TreePine, count: 150 },
  { name: "Clubs", icon: Dumbbell, count: 60 },
  { name: "Restaurants", icon: UtensilsCrossed, count: 95 },
  { name: "Convention Centers", icon: Landmark, count: 40 },
];

const VenueTypes = () => {
  return (
    <section className="py-8 bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Explore by Venue Type
          </h2>
          <p className="text-muted-foreground">Find the perfect setting for your celebration</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {types.map((type, i) => (
            <motion.button
              key={type.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <type.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">{type.name}</span>
              <span className="text-xs text-muted-foreground">{type.count}+ venues</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VenueTypes;
