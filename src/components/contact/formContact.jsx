"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuMessagesSquare } from "react-icons/lu";
import { BsFillSendCheckFill } from "react-icons/bs";
import useApi from "@/hooks/useApi";
import { URL_SERVER } from "@/app/constants";

const API_BASE = `${URL_SERVER}/api/v1`;

export default function FormContact() {
  // Guide info state
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const { createFeedback } = useApi();

  useEffect(() => {
    let cancelled = false;
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`${API_BASE}/firstUser`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const json = await resp.json();
        if (cancelled) return;
        // Build gallery array
        const gallery = [];
        for (let i = 1; i <= 5; i++) {
          const key = `image_url${i}`;
          if (json[key]) gallery.push(json[key]);
        }
        setGuide({ ...json, gallery });
        setError(null);
      } catch (e) {
        if (!cancelled) setError("Failed to load guide info");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchGuide();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      await createFeedback({
        fullName: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setSubmitMessage(
        "Thank you for your message! We will get back to you soon."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 md:py-24 bg-gray-50 min-h-screen"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Left: Guide Info */}
          <div className="md:w-1/2 w-full bg-gradient-to-br from-teal-100 to-teal-300 flex flex-col items-center justify-center p-8 gap-4">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : guide ? (
              <>
                {/* <img
                  src={guide.logo_url}
                  alt="Guide Logo"
                  className=" rounded-2xl object-cover w-[400px]  shadow-md mb-4"
                /> */}
                <img
                  src="/assets/logo-removebg-preview.png"
                  alt="Logo"
                  className="h-24 mx-auto"
                  style={{ objectFit: "contain" }}
                />
                <h3 className="text-2xl font-bold text-gray-800 mb-1 capitalize">
                  {guide.username}
                </h3>
                <p className="text-teal-700 font-semibold">
                  {guide.city}, {guide.country}
                </p>
                <div className="flex flex-col gap-1 text-gray-700 text-sm mt-2">
                  <span className="font-medium">
                    Email:{" "}
                    <a
                      href={`mailto:${guide.email}`}
                      className="text-teal-600 underline"
                    >
                      {guide.email}
                    </a>
                  </span>
                  <span className="font-medium">
                    Phone:{" "}
                    <a
                      href={`tel:+212${String(guide.phone).slice(-9)}`}
                      className="text-teal-600 underline"
                    >
                      +212 (0) {String(guide.phone).slice(-9)}
                    </a>
                  </span>
                </div>
                <div className="mt-4 text-center flex flex-col gap-2 text-gray-600 text-sm">
                  <p>{guide.description3}</p>
                </div>
              </>
            ) : null}
          </div>
          {/* Right: Contact Form */}
          <div className="md:w-1/2 w-full flex flex-col justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="flex items-center justify-center gap-2 text-gray-900">
                <span className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Get in Touch
                </span>
                <LuMessagesSquare />
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Have a question, feedback, or a special request? I'd love to
                hear from you! As a professional guide, I'm here to help you
                plan your perfect experience. Fill out the form below, and I'll
                get back to you as soon as possible.
              </p>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: "#F97316" }}
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Your Name"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: "#F97316" }}
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: "#F97316" }}
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Regarding your tour services"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02, borderColor: "#F97316" }}
                  name="message"
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Your message, feedback, or inquiry..."
                  disabled={isSubmitting}
                ></motion.textarea>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </div>
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 flex justify-center items-center ${
                    submitMessage.includes("Failed") ||
                    submitMessage.includes("error")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  <span className="text-sm text-center pr-2">
                    {submitMessage}
                  </span>
                  <span>
                    {submitMessage.includes("error") ||
                    submitMessage.includes("Failed") ? (
                      ""
                    ) : (
                      <BsFillSendCheckFill />
                    )}
                  </span>
                </motion.div>
              )}
            </motion.form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
