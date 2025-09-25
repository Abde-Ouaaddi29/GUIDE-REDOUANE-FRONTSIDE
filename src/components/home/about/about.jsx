"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SocialMedia from "./socialMedia";
import { FaLocationDot } from "react-icons/fa6";
import { PiInstagramLogoFill } from "react-icons/pi";
import { BsFacebook } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa6";
import { URL_SERVER } from "@/app/constants";

const API_BASE = `${URL_SERVER}/api/v1`;

// Fallback images if API doesn't return gallery
const fallbackImages = [
  "/assets/rdwan16.jpeg",
  "/assets/zlij2.png",
  "/assets/REDWAN_GUIDE.jpeg",
  "/assets/img6.jpg",
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger children animations
      delayChildren: 0.3, // Delay before children start animating
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const socialIconContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1, // Delay social icons slightly more
    },
  },
};

const socialIconVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.2, y: -3, transition: { duration: 0.2 } },
};

const indicatorContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
};

export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userData, setUserData] = useState(null);
  // Start with no images so we don't show static ones before fetch
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  // Error state (null when no error). Note: using plain JS here; for TS use useState<string | null>(null)
  const [error, setError] = useState(null);

  console.log("Rendering images", images);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!API_BASE) return;
        // Assuming public show route /api/v1/firstUser (adjust if prefix differs)
        const resp = await fetch(`${API_BASE}/firstUser`, {
          headers: { Accept: "application/json" },
        });
        if (resp.ok) {
          const json = await resp.json();
          console.log("json", json);
          const gallery = [];
          for (let i = 1; i <= 5; i++) {
            const key = `image_url${i}`;
            if (json[key]) gallery.push(json[key]);
          }
          setImages(gallery.length ? gallery : fallbackImages);
          setUserData(json);
        } else {
          setError("Failed to load");
        }
      } catch (e) {
        console.warn("About data load failed", e);
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (images.length) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <div className="relative h-screen pt-7 ">
      {/* Background Slider */}
      <div className="absolute inset-0 w-full h-full">
        {images.length ? (
          images.map((image, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`Slider image ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  console.error("Failed to load image:", image);
                }}
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        )}

        <div className="absolute inset-0 bg-black opacity-45"></div>
      </div>

      {/* Content - WITH ANIMATIONS */}
      <motion.div
        className="container mx-auto relative z-10 flex items-center h-full px-10 lg:px-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.div
          className="md:w-2/3 text-white"
          variants={containerVariants}
          viewport={{ once: false, amount: 0.2 }}
        >
          {loading && (
            <motion.div
              className="space-y-6 animate-pulse"
              variants={textItemVariants}
              viewport={{ once: false, amount: 0.2 }}
            >
              <motion.div
                className="h-10 bg-white/20 rounded w-2/3"
                variants={textItemVariants}
                viewport={{ once: false, amount: 0.2 }}
              />
              <motion.div
                className="h-6 bg-white/20 rounded w-1/2"
                variants={textItemVariants}
                viewport={{ once: false, amount: 0.2 }}
              />
              <motion.div
                className="h-5 bg-white/10 rounded w-3/4"
                variants={textItemVariants}
                viewport={{ once: false, amount: 0.2 }}
              />
              <motion.div
                className="flex gap-4 mt-8"
                variants={textItemVariants}
                viewport={{ once: false, amount: 0.2 }}
              >
                <motion.div
                  className="h-12 w-32 bg-teal-700 rounded"
                  variants={textItemVariants}
                  viewport={{ once: false, amount: 0.2 }}
                />
                <motion.div
                  className="h-12 w-40 bg-teal-700 rounded"
                  variants={textItemVariants}
                  viewport={{ once: false, amount: 0.2 }}
                />
              </motion.div>
            </motion.div>
          )}
          {!loading && error && (
            <motion.div
              className="text-red-300"
              variants={textItemVariants}
              viewport={{ once: false, amount: 0.2 }}
            >
              {error}
            </motion.div>
          )}
          {!loading && !error && userData && (
            <>
              <motion.h1
                className="text-2xl md:text-4xl font-bold mb-4"
                variants={titleVariants}
                viewport={{ once: false, amount: 0.2 }}
              >
                {userData?.username || ""}
                <motion.span
                  className="block text-lg md:text-xl font-normal text-primary-light mt-2"
                  variants={textItemVariants}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  {userData?.description1 || ""}
                </motion.span>
              </motion.h1>

              <motion.div
                className="text-4xl space-x-1 lg:text-5xl py-2 md:text-5xl font-bold bg-gradient-to-r from-cyan-500 to-orange-400 bg-clip-text  text-transparent"
                variants={textItemVariants}
                initial={false}
                animate="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                {userData?.description2}
              </motion.div>

              <motion.div
                className="text-white my-8 text-lg md:text-xl font-normal text-primary-light flex items-center gap-2"
                variants={textItemVariants}
                viewport={{ once: false, amount: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                >
                  <FaLocationDot />
                </motion.div>{" "}
                {userData?.country || ""}
              </motion.div>

              <motion.div
                className="p-3 flex"
                variants={containerVariants}
                whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
                viewport={{ once: false, amount: 0.2 }}
              >
                <motion.div
                  variants={buttonVariants}
                  className=" "
                  whileHover="hover"
                  whileTap="tap"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <Link
                    href="/reservation"
                    className="mr-4 px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-teal-700 text-white rounded-md hover:bg-teal-700 transition duration-300"
                  >
                    Book a Tour
                  </Link>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <Link
                    href="/privacy"
                    className="px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 border-2 border-teal-700 text-teal-700 rounded-md hover:bg-teal-700 hover:text-white transition duration-300"
                  >
                    Privacy Policy
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Slider indicators - WITH ANIMATIONS */}
      {images.length > 0 && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20"
          variants={indicatorContainerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-primary" : "bg-white opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              animate={index === currentIndex ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.2 }}
              viewport={{ once: false, amount: 0.2 }}
            />
          ))}
        </motion.div>
      )}

      {/* social media - WITH ANIMATIONS */}
      <motion.div viewport={{ once: false, amount: 0.2 }}>
        <SocialMedia />
      </motion.div>
    </div>
  );
}
