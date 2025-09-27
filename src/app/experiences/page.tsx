
"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ExperienceBody from "@/components/home/experiences/experienceBody" ;
import Card from "@/components/home/experiences/card";
import useApi from "@/hooks/useApi";

// Type for experience data from API
type ExperienceApi = {
  id: number;
  place: string;
  city: string;
  img1?: string;
  img2?: string;
  img3?: string;
  img4?: string;
};
type City = { id: number; name: string };

export default function Page() {
  const [experiences, setExperiences] = useState<ExperienceApi[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const { fetchPublicExperiences, loading, error } = useApi();
  const didFetchRef = useRef(false);

  const zelija1 = "/assets/zelija4.png";

  useEffect(() => {
    const loadData = async () => {
      if (didFetchRef.current) return;
      didFetchRef.current = true;
      try {
        const experiencesData = await fetchPublicExperiences();
        // Ensure unique experiences by id
        const seen = new Set();
        const unique = experiencesData.filter((e) => {
          if (!e || typeof e.id !== "number" || seen.has(e.id)) return false;
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

  // Transform API data to match the expected format for the Card component
  const dataExperience = experiences.map((exp) => {
    const images = [exp.img1, exp.img2, exp.img3, exp.img4].filter(Boolean);
    return {
      id: exp.id,
      place: exp.place,
      city: exp.city,
      id_city: cities.find((city) => city.name === exp.city)?.id || 1,
      description: `Experience in ${exp.place}, ${exp.city}`,
      images,
      locationHtml: "",
    };
  });

  return (
    <>
    

    <div className="relative overflow-hidden">
      {/* Background image absolute, covers both sections */}
      {/* <div className="absolute inset-0 w-full h-full z-30 pointer-events-none select-none">
        <Image
          src={zelija1}
          alt="Moroccan zelija background"
          fill
          style={{ objectFit: "cover", opacity: 0.08 }}
          priority
        />
      </div> */}
      {/* Experiences grid section */}
      <div className="py-16 px-1 xl:py-16 xl:px-16 md:py-16 md:px-16 mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">All Experiences</h1>
          <p className="text-lg text-gray-700 text-center mb-8 px-6">
            Discover all our unique experiences in Morocco
          </p>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataExperience.map((experience) => (
                <Card
                  key={experience.id}
                  experience={experience}
                  cities={cities}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* ExperienceBody section, also above bg */}
      <div className="relative z-10">
        <ExperienceBody />
      </div>
    </div>
      
      </>
  );
}
