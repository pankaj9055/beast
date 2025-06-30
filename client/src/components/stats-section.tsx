import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function StatsSection() {
  const { data: statsContent } = useQuery({
    queryKey: ["/api/content/stats"],
  });

  const stats = [
    { key: "establishedYear", label: "Established" },
    { key: "countries", label: "Countries Served" },
    { key: "dailyCalls", label: "Daily Calls" },
    { key: "uptime", label: "Uptime" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                className="text-4xl md:text-5xl font-bold text-white mb-2"
              >
                {statsContent?.content?.[stat.key] || "Loading..."}
              </motion.div>
              <p className="text-xl text-gray-200 group-hover:text-white transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
