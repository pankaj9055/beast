import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCarouselImages } from "@/hooks/use-content";
import { useQuery } from "@tanstack/react-query";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "VoipFit",
    subtitle: "National High-Tech Enterprise",
    description: "Excellent products, sincere service, and mutual win with customers"
  },
  {
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "Global Connectivity",
    subtitle: "Serving 150+ countries worldwide",
    description: "Premium telecom solutions with worldwide reach"
  },
  {
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "Advanced Infrastructure",
    subtitle: "Cutting-edge technology",
    description: "Powering seamless communication worldwide"
  },
  {
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "Smart Communication",
    subtitle: "SMS, Voice & Data services",
    description: "Designed for the future of telecommunications"
  },
  {
    url: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "24/7 Support",
    subtitle: "Dedicated customer service",
    description: "Ensuring your success around the clock"
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    title: "Since 2018",
    subtitle: "Years of excellence",
    description: "Innovation and service in telecom industry"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: carouselImagesData = [] } = useCarouselImages();
  
  const { data: heroContent } = useQuery({
    queryKey: ["/api/content/hero"],
  });

  // Use dynamic images from database or fallback to static images
  const displayImages = carouselImagesData.length > 0 ? carouselImagesData : carouselImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [displayImages.length]);

  const scrollToNext = () => {
    const nextSection = document.getElementById("services");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      <div className="carousel-container h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center parallax-bg"
              style={{ backgroundImage: `url('${displayImages[currentSlide]?.imageUrl || displayImages[currentSlide]?.url}')` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            
            <div className="relative h-full flex items-center justify-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center max-w-4xl mx-auto px-4"
              >
                {currentSlide === 0 && heroContent ? (
                  <>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {heroContent.content.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-300">
                      {heroContent.content.subtitle}
                    </p>
                    <p className="text-lg md:text-xl mb-10 text-gray-400 max-w-2xl mx-auto">
                      {heroContent.content.description}
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {displayImages[currentSlide]?.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-10 text-gray-400 max-w-2xl mx-auto">
                      {displayImages[currentSlide]?.description}
                    </p>
                  </>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={scrollToNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
                  >
                    Explore Services
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {displayImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 right-8"
      >
        <button onClick={scrollToNext} className="text-white text-2xl opacity-70 hover:opacity-100 transition-opacity">
          <ChevronDown />
        </button>
      </motion.div>
    </section>
  );
}
