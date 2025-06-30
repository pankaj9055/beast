import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-400">VoipFit</h1>
              <p className="text-xs text-gray-400">Premium Telecom Solutions</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-white hover:text-blue-400 transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                Home
              </button>

              <div className="relative group">
                <button
                  onClick={() => scrollToSection("products")}
                  className="text-white hover:text-blue-400 transition-colors duration-300 px-3 py-2 text-sm font-medium flex items-center"
                >
                  Product <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <button
                    onClick={() => scrollToSection("products")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                  >
                    SMS Service
                  </button>
                  <button
                    onClick={() => scrollToSection("products")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                  >
                    Voice Service
                  </button>
                  <button
                    onClick={() => scrollToSection("products")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                  >
                    Data Service
                  </button>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("news")}
                className="text-white hover:text-blue-400 transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                News
              </button>

              <div className="relative group">
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white hover:text-blue-400 transition-colors duration-300 px-3 py-2 text-sm font-medium flex items-center"
                >
                  About us <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <button
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                  >
                    Company
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                  >
                    Our Team
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
                  >
                    Certifications
                  </button>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("userguide")}
                className="text-white hover:text-blue-400 transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                User guide
              </button>

              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
              >
                Contact
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-400"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-900 border-t border-gray-700"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 transition-colors"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection("news")}
              className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 transition-colors"
            >
              News
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 transition-colors"
            >
              About us
            </button>
            <button
              onClick={() => scrollToSection("userguide")}
              className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 transition-colors"
            >
              User guide
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 transition-colors"
            >
              Contact
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
