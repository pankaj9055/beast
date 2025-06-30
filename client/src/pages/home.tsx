import Navigation from "@/components/navigation";
import HeroCarousel from "@/components/hero-carousel";
import ServicesSection from "@/components/services-section";
import StatsSection from "@/components/stats-section";
import AboutSection from "@/components/about-section";
import NewsSection from "@/components/news-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <HeroCarousel />
      <ServicesSection />
      <StatsSection />
      <AboutSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
