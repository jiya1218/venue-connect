"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
// Note: We use the Metadata API for SEO in Next.js, but since we are in a 'use client' file 
// (because of PageHeader's framer-motion), we can't export metadata here.
// For now, we'll favor the UI and address SEO via the root layout or separate metadata files if needed.

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <PageHeader
                title="About Venue Finder"
                subtitle="Connecting you to the perfect spaces for your most precious moments."
                image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
            />

            <main className="flex-grow container py-16 max-w-4xl mx-auto space-y-12 px-4">
                <section>
                    <h2 className="text-3xl font-display font-semibold mb-6">Our Story</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
                        Founded with a passion for unforgettable celebrations, Venue Finder was born out of a simple observation: finding the perfect venue should be the beginning of joy, not a stressful chore.
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                        We recognized that event planners and families often spend countless hours calling, visiting, and negotiating with venues. We wanted to change that by building a transparent, beautiful, and comprehensive platform that brings India's finest spaces right to your fingertips.
                    </p>
                </section>

                <div className="w-24 h-px bg-border my-12" />

                <section>
                    <h2 className="text-3xl font-display font-semibold mb-6">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                        To empower hosts to create magical experiences by simplifying the venue discovery and booking process, while providing venue owners with a platform to showcase their exceptional spaces to the world.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="text-center p-6 bg-muted/30 rounded-2xl">
                        <h3 className="text-4xl font-display font-semibold text-primary mb-2">5,000+</h3>
                        <p className="text-muted-foreground font-medium">Curated Venues</p>
                    </div>
                    <div className="text-center p-6 bg-muted/30 rounded-2xl">
                        <h3 className="text-4xl font-display font-semibold text-primary mb-2">1M+</h3>
                        <p className="text-muted-foreground font-medium">Happy Guests</p>
                    </div>
                    <div className="text-center p-6 bg-muted/30 rounded-2xl">
                        <h3 className="text-4xl font-display font-semibold text-primary mb-2">25+</h3>
                        <p className="text-muted-foreground font-medium">Cities in India</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
