"use client";
import React, { useEffect, useState } from "react";
import {
  FaMountain,
  FaLandmark,
  FaUmbrellaBeach,
  FaLeaf,
  FaMapSigns,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import { GiCamel } from "react-icons/gi";
import { useRouter } from "next/navigation";
import useApi from "@/hooks/useApi";
import { motion } from "framer-motion";

// Enhanced icon mapping with gradient backgrounds
const getTypeIcon = (typeName: string | undefined | null) => {
  if (!typeName || typeof typeName !== "string") {
    return {
      icon: <FaMapSigns className="text-white text-2xl" />,
      gradient: "from-teal-400 to-teal-600",
      color: "teal",
    };
  }

  const type = typeName.toLowerCase();

  if (
    type.includes("nature") ||
    type.includes("mountain") ||
    type.includes("adventure")
  ) {
    return {
      icon: <FaMountain className="text-white text-2xl" />,
      gradient: "from-emerald-400 to-green-600",
      color: "emerald",
    };
  } else if (type.includes("cultural") || type.includes("historical")) {
    return {
      icon: <FaLandmark className="text-white text-2xl" />,
      gradient: "from-amber-400 to-orange-600",
      color: "amber",
    };
  } else if (type.includes("beach") || type.includes("sea") || type.includes("coast")) {
    return {
      icon: <FaUmbrellaBeach className="text-white text-2xl" />,
      gradient: "from-blue-400 to-blue-600",
      color: "blue",
    };
  } else if (type.includes("desert") || type.includes("sahara") || type.includes("camel")) {
    return {
      icon: <GiCamel className="text-white text-2xl" />,
      gradient: "from-yellow-400 to-orange-600",
      color: "yellow",
    };
  } else if (type.includes("eco") || type.includes("garden") || type.includes("leaf")) {
    return {
      icon: <FaLeaf className="text-white text-2xl" />,
      gradient: "from-lime-400 to-green-600",
      color: "lime",
    };
  } else {
    return {
      icon: <FaMapSigns className="text-white text-2xl" />,
      gradient: "from-teal-400 to-teal-600",
      color: "teal",
    };
  }
};

export default function SemiServices() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchServiceTypes } = useApi();
  const router = useRouter();

  useEffect(() => {
    const loadTypes = async () => {
      try {
        setLoading(true);
        const data = await fetchServiceTypes();
        setTypes(Array.isArray(data) ? data : []);
      } catch (e) {
        setTypes([]);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100/80 backdrop-blur-sm text-teal-700 rounded-full text-sm font-medium mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaStar className="text-yellow-500" />
            Our Services
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover Morocco
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore the most breathtaking destinations and authentic experiences Morocco has to offer
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-teal-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        {!loading && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {types.map((type, index) => {
              const iconData = getTypeIcon(type.typeName);

              return (
                <motion.div
                  key={type.id}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  className="group"
                >
                  <div
                    className="relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100/50 backdrop-blur-sm"
                    onClick={() => router.push("/services")}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") router.push("/services");
                    }}
                  >
                    {/* Gradient background overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${iconData.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    ></div>

                    {/* Content */}
                    <div className="relative p-8">
                      {/* Icon section */}
                      <div className="flex justify-between items-start mb-6">
                        <div
                          className={`relative p-4 rounded-2xl bg-gradient-to-br ${iconData.gradient} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                        >
                          {iconData.icon}
                          {/* Glow effect */}
                          <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${iconData.gradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
                          ></div>
                        </div>

                        {/* Arrow */}
                        <div className="p-3 rounded-full bg-gray-50 group-hover:bg-teal-50 transition-all duration-300 group-hover:scale-110">
                          <FaArrowRight className="text-gray-400 group-hover:text-teal-600 transition-colors duration-300 text-lg" />
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors duration-300">
                          {type.typeName}
                        </h3>

                        {type.description && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                            {type.description}
                          </p>
                        )}
                      </div>

                      {/* Bottom decoration */}
                      <div className="mt-6 pt-4 border-t border-gray-100 group-hover:border-teal-100 transition-colors duration-300">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 group-hover:text-teal-600 transition-colors duration-300">
                            Explore Now
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-xs ${
                                  i < 4 ? "text-yellow-400" : "text-gray-200"
                                } group-hover:text-yellow-500 transition-colors duration-300`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-teal-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            onClick={() => router.push("/services")}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            View All Services
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
