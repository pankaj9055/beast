import { motion } from "framer-motion";
import { MessageSquare, Phone, Database, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const iconMap = {
  MessageSquare,
  Phone,
  Database,
};

const colorMap = {
  emerald: "bg-emerald-600 hover:bg-emerald-700",
  amber: "bg-amber-600 hover:bg-amber-700",
  blue: "bg-blue-600 hover:bg-blue-700",
};

export default function ServicesSection() {
  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Product and Service
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive telecom solutions designed to meet all your communication needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service: any, index: number) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || MessageSquare;
            const colorClass = colorMap[service.color as keyof typeof colorMap] || colorMap.blue;

            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="service-card bg-gray-800 border-gray-700 hover:border-blue-600 group h-full">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 ${service.color === 'emerald' ? 'bg-emerald-600' : service.color === 'amber' ? 'bg-amber-600' : 'bg-blue-600'} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-400">{service.description}</p>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature: string, featureIndex: number) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                          className="flex items-center text-gray-300"
                        >
                          <Check className={`h-5 w-5 mr-3 ${service.color === 'emerald' ? 'text-emerald-400' : service.color === 'amber' ? 'text-amber-400' : 'text-blue-400'}`} />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => {
                        const element = document.getElementById("contact");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className={`w-full ${colorClass} text-white py-3 rounded-lg transition-colors duration-300 font-semibold`}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
