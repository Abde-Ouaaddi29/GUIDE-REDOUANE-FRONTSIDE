"use client";
import React, { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { URL_SERVER } from "@/app/constants";

const API_BASE = `${URL_SERVER}/api/v1`;

// Component
export default function SocialMedia({ links }) {
  const [open, setOpen] = useState(true);
  const [phone, setPhone] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/firstUser`);
      const data = await response.json();
      setPhone(data.phone || "212689474500");
    } catch (err) {
      console.error("Failed to fetch phone number:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Build dynamic defaults (use fetched phone). Allow prop overrides.
  const computedLinks = {
    whatsapp: links?.whatsapp || `https://wa.me/212${phone}`,
    instagram: links?.instagram || "https://www.instagram.com/vallovibe.tours?igsh=bGo3eWp2bWE0a2Nj&utm_source=qr",
    youtube: links?.youtube || "https://www.youtube.com/@your_channel",
    tiktok: links?.tiktok || "https://www.tiktok.com/@vallovibe.tours?_t=ZS-8zx4xNlz3ns&_r=1",
  };

  const items = [
    {
      key: "whatsapp",
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      href: computedLinks.whatsapp,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      key: "instagram",
      icon: <FaInstagram />,
      label: "Instagram",
      href: computedLinks.instagram,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    // {
    //   key: "youtube",
    //   icon: <FaYoutube />,
    //   label: "YouTube",
    //   href: computedLinks.youtube,
    //   color: "bg-red-600 hover:bg-red-700",
    // },
    {
      key: "tiktok",
      icon: <FaTiktok />,
      label: "TikTok",
      href: computedLinks.tiktok,
      color: "bg-gray-800 hover:bg-black",
    },
  ];

  return (
    <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end select-none">
      {/* Buttons stack */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 space-y-3"
          >
            {items.map((item, idx) => (
              <motion.li
                key={item.key}
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 10 }}
                transition={{ delay: 0.03 * idx }}
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className={`group relative w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg ${item.color} transition-colors`}
                >
                  {item.icon}
                  <span className="absolute right-full mr-3 whitespace-nowrap text-xs font-medium bg-white/90 text-gray-800 px-2 py-1 rounded opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition">
                    {item.label}
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {/* Toggle button */}
      {/* <button
        type="button"
        aria-label={open ? "Close social menu" : "Open social menu"}
        onClick={() => setOpen((o) => !o)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-colors ${
          open
            ? "bg-pink-600 hover:bg-pink-700"
            : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        <motion.span
          key={open ? "close" : "open"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-xl"
        >
          {open ? <FaTimes /> : <FaPlus />}
        </motion.span>
      </button> */}
    </div>
  );
}
