"use client";

import { URL_SERVER } from "@/app/constants";
import React, { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
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

  // Motion variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 } 
    },
  };

  return (
    <section className="relative w-full px-8 py-20 lg:p-20 xl:p-20 flex items-center justify-center mb-6">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-teal-600 opacity-70 -z-10"></div>

      {/* Content */}
      <motion.div
        className="text-center text-white max-w-3xl"
        variants={contentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="flex justify-center mb-4">
          <FaPhoneAlt className="text-3xl text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          WE ARE ALWAYS HAPPY TO HEAR FROM YOU
        </h2>
        <p className="text-lg mb-4">Contact us at:</p>

        {loading ? (
          <p className="text-gray-200">Loading...</p>
        ) : error ? (
          <p className="text-red-300">{error}</p>
        ) : (
          <p className="text-3xl font-bold text-gray-500 mb-6">
           +212 (0) {user?.phone || "No phone available"}
          </p>
        )}

        <motion.button
          onClick={() => router.push("/contact")}
          className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-md shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          CONTACT US →
        </motion.button>
      </motion.div>
    </section>
  );
}
