"use client";

import { URL_SERVER } from "@/app/constants";
import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const API_BASE = `${URL_SERVER}/api/v1`;

export default function SemiContact() {
  const [user, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        if (!API_BASE) return;
        setLoading(true);
        const resp = await fetch(`${API_BASE}/firstUser`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!resp.ok) {
          throw new Error(`Status ${resp.status}`);
        }
        const json = await resp.json();
        if (cancelled) return;
        setUserData(json);
        setError(null);
      } catch (e: any) {
        if (!cancelled) setError("Failed to load");
        console.warn("Contact fetch failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Enhanced motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
  };

  return (
    <section className="relative w-full px-8 py-20 lg:px-20 xl:px-20 flex items-center justify-center mb-6 overflow-hidden">
      {/* Enhanced Background with Gradient and Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 opacity-90 -z-10"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none -z-5">
        {/* Floating circles */}
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: 999999, // Use large number instead of Infinity
            ease: "easeInOut",
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full blur-lg"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
          }}
          transition={{
            duration: 8,
            repeat: 999999, // Use large number instead of Infinity
            ease: "easeInOut",
          }}
        ></motion.div>

        <motion.div 
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-md"
          animate={{
            y: [-15, 15, -15],
          }}
          transition={{
            duration: 4,
            repeat: 999999, // Use large number instead of Infinity
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative text-center text-white max-w-4xl z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* Icon with Pulse Animation - Fix the animate prop */}
        <motion.div 
          className="flex justify-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="relative p-6 bg-white/15 backdrop-blur-md rounded-full shadow-2xl"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: 999999, // Use large number instead of Infinity
              ease: "easeInOut",
            }}
          >
            <FaPhoneAlt className="text-4xl text-white" />
            <div className="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
          </motion.div>
        </motion.div>

        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-6 border border-white/30"
        >
          <FaStar className="text-yellow-300" />
          Ready to Help You 24/7
          <FaStar className="text-yellow-300" />
        </motion.div>

        {/* Main Heading */}
        {/* <motion.h2 
          variants={itemVariants}
          className="text-3xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight"
        >
          <span className="block text-white/90">WE ARE ALWAYS HAPPY</span>
          <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
            TO HEAR FROM YOU
          </span>
        </motion.h2> */}

        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl mb-8 text-white/80 font-light"
        >
          Get in touch with our travel experts
        </motion.p>

        {/* Contact Info Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/15 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20 shadow-xl"
        >
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/70"></div>
            </div>
          ) : error ? (
            <p className="text-red-200 text-lg">{error}</p>
          ) : (
            <div className="space-y-4">
              {/* Phone Number */}
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <FaPhoneAlt className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <p className="text-white/70 text-sm">Call us directly</p>
                  <p className="text-xl md:text-2xl font-bold text-yellow-300">
                    +212 (0) {user?.phone || "No phone available"}
                  </p>
                </div>
              </div>

              {/* Email if available */}
              {user?.email && (
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/20">
                  <div className="p-3 bg-white/20 rounded-full">
                    <FaEnvelope className="text-white text-lg" />
                  </div>
                  <div className="text-left">
                    <p className="text-white/70 text-sm">Email us</p>
                    <p className="text-lg font-semibold text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => router.push("/contact")}
            className="group relative px-8 py-4 bg-white text-teal-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaEnvelope className="group-hover:rotate-12 transition-transform" />
              CONTACT US
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>

          <motion.button
            onClick={() => window.location.href = `tel:+212${user?.phone}`}
            className="group px-8 py-4 bg-transparent border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              <FaPhoneAlt className="group-hover:rotate-12 transition-transform" />
              CALL NOW
            </span>
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-center items-center gap-6 text-white/60 text-sm"
        >
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>Free Consultation</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>Expert Guidance</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}