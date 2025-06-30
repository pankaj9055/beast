import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function AboutSection() {
  const { data: aboutContent } = useQuery({
    queryKey: ["/api/content/about"],
  });

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {aboutContent?.content?.title || "About VoipFit"}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mb-6"></div>
            
            <p className="text-lg text-gray-400 mb-6">
              {aboutContent?.content?.description || "Loading..."}
            </p>
            
            <p className="text-lg text-gray-400 mb-8">
              {aboutContent?.content?.mission || "Loading..."}
            </p>
            
            <div className="flex space-x-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Our Vision
                </h4>
                <p className="text-gray-400">
                  {aboutContent?.content?.vision || "Loading..."}
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Our Values
                </h4>
                <p className="text-gray-400">
                  {aboutContent?.content?.values || "Loading..."}
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Professional team collaboration"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 rounded-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
