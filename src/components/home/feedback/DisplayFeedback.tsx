"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "8px", flexShrink: 0 }}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring" } },
  exit: { opacity: 0, y: -40, scale: 0.95, transition: { duration: 0.4 } },
};

const dotVariants = {
  active: { scale: 1.3, backgroundColor: "#ec4899", transition: { duration: 0.3 } },
  inactive: { scale: 1, backgroundColor: "#fff", transition: { duration: 0.3 } },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
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
        setFeedbacksData([]);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacksData.length < 2) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % feedbacksData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [feedbacksData]);

  return (
    <div className="relative mb-6 overflow-hidden" style={{ padding: "56px 0" }}>
      <div className="absolute left-0 bottom-0 z-0 w-[320px] h-[320px]">
        <Image
          src={zelija1}
          alt="Moroccan zelija pattern"
          fill
          style={{ objectFit: "contain" }}
          className="opacity-20"
          sizes="320px"
        />
      </div>
      <div className="pointer-events-none select-none absolute right-0 top-20 z-0 w-[180px] h-[180px]">
        <Image
          src={zelija1}
          alt="Moroccan zelija pattern"
          fill
          style={{ objectFit: "contain" }}
          className="opacity-20"
          sizes="180px"
        />
      </div>
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
        viewport={{ once: false, amount: 0.2 }}
        variants={titleVariants}
      >
        <motion.h2 
          initial="hidden"
          animate="visible"
          whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-teal-900 font-bold text-3xl md:text-4xl mb-10 text-center drop-shadow">
          What Our Clients Say
        </motion.h2>
      </motion.div>

      <div className="relative w-full flex flex-col items-center min-h-[220px]">
        <AnimatePresence mode="wait">
          {feedbacksData.length > 0 && (
            <motion.div
              key={feedbacksData[activeIndex]?.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
              viewport={{ once: false, amount: 0.2 }}
              className="w-[95%] max-w-xl bg-white/90 shadow-xl rounded-2xl px-8 py-7 flex flex-col items-center border border-pink-100"
              style={{ minHeight: 180 }}
            >
              <div className="flex items-center mb-3">
                <span className="mr-2 text-pink-500">
                  <EmailIcon />
                </span>
                <span className="font-semibold text-pink-400 underline text-base md:text-lg">
                  {feedbacksData[activeIndex]?.email}
                </span>
              </div>
              <p className="text-gray-700 text-lg text-center leading-relaxed font-medium">
                “{feedbacksData[activeIndex]?.message}”
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {feedbacksData.length > 1 && (
          <div className="flex gap-2 mt-6">
            {feedbacksData.map((_, idx) => (
              <motion.button
                key={idx}
                className="w-3 h-3 rounded-full border-2 border-pink-400"
                aria-label={`Show feedback ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                variants={dotVariants}
                animate={activeIndex === idx ? "active" : "inactive"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
