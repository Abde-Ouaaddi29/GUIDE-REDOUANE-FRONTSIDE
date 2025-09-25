"use client";
import React from "react";
import { FaGlobeAmericas, FaUmbrellaBeach, FaHiking } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SemiValues() {
  const values = [
    {
      icon: <FaGlobeAmericas className="text-5xl text-teal-500" />,
      title: "DISCOVERY",
      description:
        "Every journey is an opening to the world. I share the history, culture, and traditions of each destination with passion.",
    },
    {
      icon: <FaHiking className="text-5xl text-teal-500" />,
      title: "ADVENTURE",
      description:
        "Exploring nature, climbing mountains, or crossing deserts… my tours bring authenticity and unforgettable experiences.",
    },
    {
      icon: <FaUmbrellaBeach className="text-5xl text-teal-500" />,
      title: "HOSPITALITY",
      description:
        "A warm and friendly welcome ensures that every traveler feels at home, no matter where the journey takes them.",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative w-full px-8 py-20 lg:p-20 xl:p-20 flex flex-col items-center mb-6">
      <div className="absolute inset-0 bg-teal-600 opacity-70 top-0 left-0 w-full h-full -z-10"></div>
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 70 }}
>
        <img
          src="/assets/logo-removebg-preview.png"
          alt="Logo"
          className="h-24 mx-auto"
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* Title & Intro with motion */}
      <motion.h2
        className="text-3xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 70 }}
      >
        MY VALUES
      </motion.h2>

      <motion.p
        className="text-center max-w-3xl text-gray-50 mb-12 px-4"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        I am <strong>Vallovibe</strong>, a professional licensed tourist guide in Morocco. With years of experience, I specialize in creating authentic journeys that connect travelers to the heart of Moroccan culture, history, and landscapes. From the vibrant streets of Agadir to the calm dunes of the Sahara, my mission is to make every visit not just a trip, but a meaningful story to remember.
      </motion.p>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full px-6">
        {values.map((value, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer"
            variants={cardVariants}
            initial="hidden"
            whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            {value.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2 text-teal-800">
              {value.title}
            </h3>
            <p className="text-gray-600">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
