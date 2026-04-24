import { motion } from "framer-motion";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    image?: string;
}

const PageHeader = ({ title, subtitle, image = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80" }: PageHeaderProps) => {
    return (
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="container relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-16 bg-white/50" />
                        <span className="text-xs font-semibold tracking-[4px] uppercase text-white/90">
                            VenueConnect
                        </span>
                        <div className="h-px w-16 bg-white/50" />
                    </div>

                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 tracking-tight">
                        {title}
                    </h1>

                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default PageHeader;
