"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaQuoteLeft, FaQuoteRight, FaUser, FaEnvelope } from "react-icons/fa";
import { URL_SERVER } from "@/app/constants";

const zelija1 = "/assets/zelija2.png";

interface Feedback {
  id: number | string;
  email: string;
  message: string;
}

interface FeedbackApiResponse {
  data: Feedback[];
  [key: string]: unknown;
}

const API_BASE = `${URL_SERVER}/api/v1`;

// Enhanced animations - Fix TypeScript issues
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      stiffness: 100,
      damping: 10,
      duration: 0.8 
    } 
  },
};

const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9,
    rotateX: -15,
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: { 
      stiffness: 120,
      damping: 15,
      duration: 0.7 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    scale: 0.95,
    rotateX: 15,
    transition: { duration: 0.4 } 
  },
};

const dotVariants = {
  active: { 
    scale: 1.4, 
    backgroundColor: "#f59e0b",
    boxShadow: "0 0 20px rgba(245, 158, 11, 0.6)",
    transition: { duration: 0.3 } 
  },
  inactive: { 
    scale: 1, 
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    boxShadow: "none",
    transition: { duration: 0.3 } 
  },
};

export default function DisplayFeedback() {
  const [feedbacksData, setFeedbacksData] = React.useState<Feedback[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${API_BASE}/feedback?status=APPROVED`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        const data: FeedbackApiResponse = await response.json();
        setFeedbacksData(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
        setFeedbacksData([]);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacksData.length < 2) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % feedbacksData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [feedbacksData]);

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <motion.section 
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Decorative zelija patterns */}
        <motion.div 
          className="absolute left-0 bottom-0 z-0 w-[320px] h-[320px] opacity-10"
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 4,
            repeat: 999999,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <Image
            src={zelija1}
            alt="Moroccan zelija pattern"
            fill
            style={{ objectFit: "contain" }}
            sizes="320px"
          />
        </motion.div>
        
        <motion.div 
          className="absolute right-0 top-20 z-0 w-[180px] h-[180px] opacity-15"
          animate={{
            y: [15, -15, 15],
          }}
          transition={{
            duration: 4,
            repeat: 999999,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <Image
            src={zelija1}
            alt="Moroccan zelija pattern"
            fill
            style={{ objectFit: "contain" }}
            sizes="180px"
          />
        </motion.div>

        {/* Gradient orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-2xl"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {/* Badge - Remove variants and use inline animation */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 backdrop-blur-sm text-amber-700 rounded-full text-sm font-semibold mb-6 border border-amber-200/50"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaStar className="text-yellow-500 animate-pulse" />
            Client Testimonials
            <FaStar className="text-yellow-500 animate-pulse" />
          </motion.div>

          {/* Main Title - Remove variants and use inline animation */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-slate-800 via-blue-700 to-teal-600 bg-clip-text text-transparent">
              What Our Clients
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Say About Us
            </span>
          </motion.h2>

          {/* Subtitle - Remove variants and use inline animation */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover why travelers from around the world choose us for their unforgettable Moroccan adventures
          </motion.p>
        </motion.div>

        {/* Feedback Cards Container */}
        <motion.div 
          className="relative flex justify-center items-center min-h-[220px] mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {feedbacksData.length > 0 && (
              <motion.div
                key={feedbacksData[activeIndex]?.id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative w-full max-w-4xl"
              >
                {/* Main Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                  {/* Card Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 p-1">
                    <div className="bg-white/95 backdrop-blur-sm rounded-t-3xl p-8">
                      {/* Quote Icon */}
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <FaQuoteLeft className="text-4xl text-blue-500/30" />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text">
                            <FaQuoteLeft className="text-4xl text-transparent" />
                          </div>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative mr-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {getInitials(feedbacksData[activeIndex]?.email)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                            <FaStar className="text-white text-xs" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-1">
                            <FaEnvelope className="text-blue-500 text-sm" />
                            <span className="font-semibold text-gray-700 text-lg">
                              {feedbacksData[activeIndex]?.email}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-sm" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-8 pb-8">
                    {/* Message */}
                    <div className="relative">
                      <p className="text-gray-700 text-xl md:text-2xl text-center leading-relaxed font-medium italic">
                        "{feedbacksData[activeIndex]?.message}"
                      </p>
                      <div className="flex justify-end mt-4">
                        <FaQuoteRight className="text-2xl text-blue-500/30" />
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex justify-center mt-6">
                      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-emerald-500/10 pointer-events-none"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Dots */}
        {feedbacksData.length > 1 && (
          <motion.div 
            className="flex justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {feedbacksData.map((_, idx) => (
              <motion.button
                key={idx}
                className="w-4 h-4 rounded-full border-2 border-amber-400/50 cursor-pointer hover:scale-110 transition-transform"
                aria-label={`Show feedback ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                variants={dotVariants}
                animate={activeIndex === idx ? "active" : "inactive"}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
              />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {feedbacksData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-gray-500 text-2xl" />
            </div>
            <p className="text-gray-500 text-lg">No testimonials available at the moment.</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full text-sm text-gray-600">
            <span>Join thousands of satisfied travelers</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xs" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}