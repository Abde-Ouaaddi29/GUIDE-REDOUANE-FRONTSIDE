"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const articles = [
  {
    title: "Discover the Amazigh Culture",
    image: "/assets/exp6.jpg",
    alt: "Amazigh culture Morocco",
    text: (
      <>
        Morocco is home to the indigenous Amazigh (Berber) people, whose
        traditions, language, and art have shaped the country for millennia. As
        a tourist, you'll have the chance to learn about Amazigh music, try
        traditional clothing, and visit ancient kasbahs nestled in the Atlas
        Mountains. Their hospitality and vibrant festivals will leave you with
        unforgettable memories.
      </>
    ),
  },
  {
    title: "Ride Camels & Horses by the Sea",
    image: "/assets/exp2.jpg",
    alt: "Camel and horse riding Morocco beach",
    text: (
      <>
        Experience the thrill of riding camels and horses along Morocco’s
        stunning Atlantic and Mediterranean coastlines. Whether at sunrise or
        sunset, these rides offer breathtaking views and a unique way to connect
        with the land, just as nomads have done for centuries.
      </>
    ),
  },
  {
    title: "Savor Moroccan Cuisine",
    image: "/assets/exp3.jpg",
    alt: "Moroccan cuisine tajine",
    text: (
      <>
        Moroccan food is a feast for the senses. Learn to cook and taste iconic
        dishes like tagine, couscous, and pastilla. Visit bustling souks to
        sample fresh dates, olives, and mint tea, and discover the secrets of
        Moroccan spices that make every meal an adventure.
      </>
    ),
  },
  {
    title: "Explore Traditional Crafts",
    image: "/assets/exp4.jpg",
    alt: "Moroccan crafts and artisans",
    text: (
      <>
        Morocco’s artisans are world-renowned for their intricate carpets,
        colorful ceramics, and handwoven textiles. As a visitor, you can watch
        masters at work, try your hand at pottery or weaving, and bring home a
        piece of Morocco’s artistic heritage.
      </>
    ),
  },
  {
    title: "Coastal Adventures & Surfing",
    image: "/assets/exp5.jpg",
    alt: "Surfing and adventure Morocco coast",
    text: (
      <>
        The Moroccan coast is a paradise for adventurers. Try surfing in
        Taghazout, kiteboarding in Essaouira, or simply relax on golden beaches.
        The blend of ocean, mountains, and desert makes Morocco a top
        destination for outdoor enthusiasts.
      </>
    ),
  },
];

export default function ExperienceBody() {
  return (
    <section className="py-16 px-4 md:px-16 bg-gradient-to-t from-teal-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-teal-600 mb-6"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 70 }}
        >
          Why Visit Morocco?
        </motion.h2>

        {/* Article Cards */}
        <div className="space-y-16">
          {articles.map((article, idx) => (
            <motion.div
              key={article.title}
              className={`flex flex-col md:flex-row ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              } items-center gap-8 md:gap-12`}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: idx * 0.12, type: "spring", stiffness: 60 }}
            >
              <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={article.image}
                  alt={article.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={idx === 0}
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-semibold text-teal-500 mb-3">
                  {article.title}
                </h3>
                <div className="text-gray-800 text-base leading-relaxed">
                  {article.text}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
