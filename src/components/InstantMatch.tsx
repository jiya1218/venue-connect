import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const InstantMatch = () => {
  return (
    <section className="py-4 md:py-6 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-14"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,white_0%,transparent_50%)]" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/20 mb-4">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">Instant Venue Match</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
                Tell Us Your Requirements
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Share your event details and get matched with the best venues in Gujarat — instantly.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 space-y-4">
              <input
                placeholder="Your Name"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                placeholder="Phone Number"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Event Type</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Corporate</option>
                <option>Engagement</option>
                <option>Reception</option>
              </select>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Preferred City</option>
                <option>Ahmedabad</option>
                <option>Surat</option>
                <option>Vadodara</option>
                <option>Rajkot</option>
              </select>
              <textarea
                placeholder="Any specific requirements..."
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <Button className="w-full gradient-primary text-primary-foreground border-0 h-11 hover:opacity-90">
                <Send className="w-4 h-4 mr-2" /> Get Venue Matches
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InstantMatch;
