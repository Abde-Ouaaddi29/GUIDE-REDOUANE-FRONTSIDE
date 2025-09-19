import Image from "next/image";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import Card from "@/components/home/experiences/card";
import useApi from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
const zelija1 = "/assets/zelija5.png";

export default function ExperienceHead() {
  const [selectedCity, setSelectedCity] = useState(null);
  const router = useRouter();
  const [experiences, setExperiences] = useState([]);
  const [cities, setCities] = useState([]);
  const { fetchPublicExperiences, loading, error } = useApi();
  // Prevent double-fetch in React 18 StrictMode dev (effect mounts twice)
  const didFetchRef = useRef(false);

  // Load experiences and cities on component mount
  useEffect(() => {
    const loadData = async () => {
      if (didFetchRef.current) return; // guard duplicate in StrictMode
      didFetchRef.current = true;
      try {
        const experiencesData = await fetchPublicExperiences();

        // Ensure unique experiences by id (defensive in case backend duplicates)
        const seen = new Set();
        const unique = experiencesData.filter((e) => {
          if (!e || seen.has(e.id)) return false;
          seen.add(e.id);
          return true;
        });
        setExperiences(unique);

        // Derive unique city list from fetched experiences
        const cityNames = Array.from(
          new Set(unique.map((e) => e.city).filter(Boolean))
        );
        const formattedCities = cityNames.map((city, index) => ({
          id: index + 1,
          name: city,
        }));
        setCities(formattedCities);
      } catch (err) {
        console.error("Failed to load experiences and cities:", err);
      }
    };
    loadData();
  }, [fetchPublicExperiences]);

  const newLocationHtml =
    "<iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5451.477447618604!2d-9.625846200069835!3d30.42877676703517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6b778463b43%3A0xef686a1182a072a!2sKasbah%20Agadir%20Oufella!5e0!3m2!1sfr!2sma!4v1748827277728!5m2!1sfr!2sma' width='600' height='450' style='border:0;' allowfullscreen=' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>";

  // Transform API data to match the expected format for the Card component
  // Backend returns img1..img4 (base64 data URIs) – build an images[] array for UI.
  const dataExperience = experiences.map((exp) => {
    const images = [exp.img1, exp.img2, exp.img3, exp.img4].filter(Boolean);
    return {
      id: exp.id,
      place: exp.place,
      city: exp.city,
      id_city: cities.find((city) => city.name === exp.city)?.id || 1,
      description: `Experience in ${exp.place}, ${exp.city}`,
      images,
      locationHtml: newLocationHtml,
    };
  });

  const filteredExperiences = selectedCity
    ? dataExperience.filter((exp) => exp.id_city === selectedCity)
    : dataExperience;

  // Always show only 8 cards for home
  const visibleExperiences = filteredExperiences.slice(0, 8);

  console.log("experiences", experiences);

  return (
    <div className="relative border border-b border-gray-200 shadow-2xl py-16 px-6 xl:py-16 xl:px-16 md:py-16 md:px-16 overflow-hidden">
      {/* Decorative background image bottom left */}
      <div className="pointer-events-none select-none fixed left-65 bottom-0 -z-10 w-[750px] h-[750px] opacity-20">
        <Image
          src={zelija1}
          alt="Moroccan zelija pattern"
          fill
          style={{ objectFit: "contain" }}
          sizes="256px"
          priority={false}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          className="text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          Experiences
        </motion.h1>

        <motion.p
          className="text-lg text-gray-700 text-center mb-8 px-6"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0, scale: 1.03 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore our unique experiences in Morocco
        </motion.p>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            Error loading experiences: {error.message}
          </div>
        )}

        {/* Content - only show when not loading */}
        {!loading && (
          <>
            {/* Experience cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleExperiences.map((experience, idx) => (
                <motion.div
                  key={experience.id}
                  initial={{
                    opacity: 0,
                    x: idx % 2 === 0 ? -60 : 60, // alternate left/right
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.08,
                    type: "spring",
                    stiffness: 60,
                  }}
                >
                  <Card
                    experience={experience}
                    cities={cities}
                    selectedCity={selectedCity}
                  />
                </motion.div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => router.push("/experiences")}
                className="cursor-pointer flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-6 py-3  transition-colors duration-200"
              >
                Continue <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
