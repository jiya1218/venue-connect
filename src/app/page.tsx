import HeroSearch from "@/components/HeroSearch";
import OccasionSlider from "@/components/OccasionSlider";
import EventTypeExplorer from "@/components/EventTypeExplorer";
import VendorCategories from "@/components/VendorCategories";
import PopularCities from "@/components/PopularCities";
import TrendingVenues from "@/components/TrendingVenues";
import VenueTypesBrowse from "@/components/VenueTypesBrowse";
import FeaturedVenues from "@/components/FeaturedVenues";
import VenueMoodExplorer from "@/components/VenueMoodExplorer";
import GetQuoteCTA from "@/components/GetQuoteCTA";
import RecentlyAddedVenues from "@/components/RecentlyAddedVenues";
import HowItWorks from "@/components/HowItWorks";
import VenueOwnerCTA from "@/components/VenueOwnerCTA";
import LocalAreaDiscovery from "@/components/LocalAreaDiscovery";
import EventGallery from "@/components/EventGallery";
import Testimonials from "@/components/Testimonials";
import PopularSearches from "@/components/PopularSearches";
import StatsBand from "@/components/StatsBand";

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
