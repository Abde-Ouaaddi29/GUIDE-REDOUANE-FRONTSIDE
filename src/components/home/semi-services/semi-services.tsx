"use client";
import React, { useEffect, useState } from "react";
import {
  FaMountain,
  FaLandmark,
  FaUmbrellaBeach,
  FaLeaf,
  FaMapSigns,
  FaArrowRight,
} from "react-icons/fa";
import { GiCamel } from "react-icons/gi";
import { useRouter } from "next/navigation";
import useApi from "@/hooks/useApi";
import { motion } from "framer-motion";

// Icon mapping
const getTypeIcon = (typeName: string | undefined | null) => {
  if (!typeName || typeof typeName !== "string") {
    return <FaMapSigns className="text-teal-500 text-3xl" />;
  }
  const type = typeName.toLowerCase();
  if (type.includes("nature") || type.includes("mountain") || type.includes("adventure")) {
    return <FaMountain className="text-green-500 text-3xl" />;
  } else if (type.includes("cultural") || type.includes("historical")) {
    return <FaLandmark className="text-teal-600 text-3xl" />;
  } else if (type.includes("beach") || type.includes("sea") || type.includes("coast")) {
    return <FaUmbrellaBeach className="text-blue-400 text-3xl" />;
  } else if (type.includes("desert") || type.includes("sahara") || type.includes("camel")) {
    return <GiCamel className="text-teal-400 text-3xl" />;
  } else if (type.includes("eco") || type.includes("garden") || type.includes("leaf")) {
    return <FaLeaf className="text-green-400 text-3xl" />;
  } else {
    return <FaMapSigns className="text-teal-500 text-3xl" />;
  }
};

export default function SemiServices() {
  const [types, setTypes] = useState<any[]>([]);
  const { fetchServiceTypes } = useApi();
  const router = useRouter();

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchServiceTypes();
        setTypes(Array.isArray(data) ? data : []);
      } catch (e) {
        setTypes([]);
      }
    };
    loadTypes();
  }, []);

  return (
    <section className="py-10 px-10 sm:px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Motion container for stagger effect */}
        <motion.div
          className="flex flex-wrap gap-4 sm:gap-6 justify-center rounded-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {types.map((type, index) => (
            <motion.div
              key={type.id}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
              className="w-full sm:w-[340px] md:w-[360px]"
            >
              <div
                className="flex items-center justify-between px-4 sm:px-6 py-5 sm:py-6 cursor-pointer shadow bg-teal-400 transition-all duration-300 rounded-xl group hover:scale-105 hover:bg-teal-400 hover:shadow-xl mb-4 sm:mb-0"
                onClick={() => router.push("/services")}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") router.push("/services");
                }}
              >
                {/* Icon & Text */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow group-hover:bg-teal-100 transition-all">
                    {getTypeIcon(type.typeName)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-base sm:text-lg uppercase text-teal-700 group-hover:text-white transition-all">
                      {type.typeName}
                    </h3>
                    {type.description && (
                      <p className="text-xs sm:text-sm uppercase text-teal-700 group-hover:text-white transition-all">
                        {type.description}
                      </p>
                    )}
                  </div>
                </div>
                {/* Arrow */}
                <FaArrowRight className="text-lg sm:text-xl transition-colors duration-200 text-teal-400 group-hover:text-white" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
