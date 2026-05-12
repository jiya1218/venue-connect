import dynamic from "next/dynamic";
import HeroSearch from "@/components/HeroSearch";
import OccasionSlider from "@/components/OccasionSlider";
import VendorCategories from "@/components/VendorCategories";

// Dynamically import components below the fold for better performance
const EventTypeExplorer = dynamic(() => import("@/components/EventTypeExplorer"));
const PopularCities = dynamic(() => import("@/components/PopularCities"));
const TrendingVenues = dynamic(() => import("@/components/TrendingVenues"));
const VenueTypesBrowse = dynamic(() => import("@/components/VenueTypesBrowse"));
const FeaturedVenues = dynamic(() => import("@/components/FeaturedVenues"));
const VenueMoodExplorer = dynamic(() => import("@/components/VenueMoodExplorer"));
const GetQuoteCTA = dynamic(() => import("@/components/GetQuoteCTA"));
const RecentlyAddedVenues = dynamic(() => import("@/components/RecentlyAddedVenues"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
const VenueOwnerCTA = dynamic(() => import("@/components/VenueOwnerCTA"));
const LocalAreaDiscovery = dynamic(() => import("@/components/LocalAreaDiscovery"));
const EventGallery = dynamic(() => import("@/components/EventGallery"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const PopularSearches = dynamic(() => import("@/components/PopularSearches"));
const StatsBand = dynamic(() => import("@/components/StatsBand"));

export default function Home() {
  return (
    <div className="bg-background">
      <HeroSearch />
      <div className="space-y-8 md:space-y-20 pb-10 md:pb-20">
        <OccasionSlider />
        <VendorCategories />
        <EventTypeExplorer />
        <PopularCities />
        <TrendingVenues />
        <VenueTypesBrowse />
        <FeaturedVenues />
        <VenueMoodExplorer />
        <GetQuoteCTA />
        <RecentlyAddedVenues />
        <HowItWorks />
        <VenueOwnerCTA />
        <LocalAreaDiscovery />
        <EventGallery />
        <Testimonials />
        <PopularSearches />
        <StatsBand />
      </div>
    </div>
  );
}
