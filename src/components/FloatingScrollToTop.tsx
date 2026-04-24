'use client';

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-20 md:bottom-8 right-6 md:right-8 z-[99] rounded-full w-12 h-12 shadow-lg shadow-black/20 bg-primary hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1 animate-in fade-in zoom-in"
      title="Scroll to Top"
    >
      <ArrowUp className="w-6 h-6 text-white" />
    </Button>
  );
};

export default FloatingScrollToTop;
