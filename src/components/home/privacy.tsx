"use client";
import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { FaShieldAlt, FaUserShield, FaLock, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { URL_SERVER } from '@/app/constants';

const API_BASE = `${URL_SERVER}/api/v1`;

// Variants for container and items
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as any } },
};

export default function Privacy() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        if (!API_BASE) return;
        setLoading(true);
        const resp = await fetch(`${API_BASE}/firstUser`, {
          headers: { Accept: "application/json" },
          cache: 'no-store'
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const json = await resp.json();
        if (cancelled) return;
        const gallery: string[] = [];
        for (let i = 1; i <= 5; i++) {
          const key = `image_url${i}` as const;
          if (json[key]) gallery.push(json[key]);
        }
        setUserData({ ...json, gallery });
        setError(null);
      } catch (e: any) {
        if (!cancelled) setError("Failed to load");
        console.warn("Privacy fetch failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-14"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <FaShieldAlt className="text-green-500 text-4xl mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </motion.div>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0, scale: 1.03 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your privacy and trust are paramount to us. Learn how Vallovibe Tour Guide Services 
            protects and handles your personal information.
          </motion.p>
          <motion.div
            className="mt-4 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p>Effective Date: January 1, 2025 | Last Updated: January 27, 2025</p>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[{
            icon: <FaUserShield className="text-green-500 text-3xl mx-auto mb-3" />,
            title: 'Data Protection',
            desc: 'Your information is secured with industry-standard encryption'
          },{
            icon: <FaLock className="text-green-500 text-3xl mx-auto mb-3" />,
            title: 'No Data Selling',
            desc: 'We never sell or share your personal data with third parties'
          },{
            icon: <FaShieldAlt className="text-green-500 text-3xl mx-auto mb-3" />,
            title: 'Transparent Practices',
            desc: 'Clear, honest communication about how we use your data'
          }].map((badge, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileInView={{ opacity: 1, y: 0, scale: 1.03 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              {badge.icon}
              <h3 className="font-semibold text-gray-900">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 space-y-8">

            {/* Introduction */}
            <motion.section
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, scale: 1.02 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {loading && !userData && !error && 'Loading introduction...'}
                {error && !userData && 'Unable to load introduction at this time.'}
                {userData?.description4
                  ? userData.description4
                  : (!loading && !error && `Welcome. This Privacy Policy explains how I collect, use, protect, and share information when you use my tour guide services, visit my website, or communicate with me for booking tours and experiences in Morocco.`)
                }
              </p>
            </motion.section>

            {/* Information We Collect */}
            <motion.section
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, scale: 1.02 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information:</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>Full name and contact details (email, phone number)</li>
                    <li>Country of residence and nationality</li>
                    <li>Tour preferences and special requirements</li>
                    <li>Number of guests and travel dates</li>
                    <li>Dietary restrictions or accessibility needs</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Communication Records:</h3>
                  <ul className="text-gray-700 space-y-1 list-disc list-inside">
                    <li>Messages and inquiries sent through contact forms</li>
                    <li>WhatsApp, email, or phone conversations</li>
                    <li>Booking confirmations and tour itineraries</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* How We Use Information */}
            <motion.section
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, scale: 1.02 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
                How We Use Your Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Tour Services:</h3>
                  <ul className="text-blue-800 space-y-1 text-sm list-disc list-inside">
                    <li>Process and confirm your tour bookings</li>
                    <li>Customize tours to your preferences</li>
                    <li>Coordinate logistics and transportation</li>
                    <li>Provide pre-tour information and guidance</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Communication:</h3>
                  <ul className="text-green-800 space-y-1 text-sm list-disc list-inside">
                    <li>Send tour confirmations and updates</li>
                    <li>Share important travel information</li>
                    <li>Respond to your questions and requests</li>
                    <li>Follow up on your tour experience</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* How We Protect Your Data */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
                How We Protect Your Data
              </h2>
              <div className="bg-yellow-50 p-6 rounded-lg space-y-3">
                <p className="text-gray-700 flex items-start">
                  <FaLock className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span><strong>Secure Storage:</strong> All personal data is stored securely using encryption and protected servers.</span>
                </p>
                <p className="text-gray-700 flex items-start">
                  <FaUserShield className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span><strong>Limited Access:</strong> Only I, Vallovibe, have access to your personal information for legitimate business purposes.</span>
                </p>
                <p className="text-gray-700 flex items-start">
                  <FaShieldAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span><strong>No Third-Party Selling:</strong> I never sell, rent, or share your personal information with marketers or advertisers.</span>
                </p>
              </div>
            </motion.section>

            {/* When We Share Information */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
                When We Share Information
              </h2>
              <p className="text-gray-700 mb-4">
                I only share your information in these limited circumstances:
              </p>
              <div className="space-y-3">
                {[
                  { title: 'Trusted Service Providers', desc: 'Hotels, restaurants, or transport providers necessary for your tour (only relevant details)' },
                  { title: 'Emergency Situations', desc: 'Medical emergencies or safety situations where authorities need to be contacted' },
                  { title: 'Legal Requirements', desc: 'If required by Moroccan law or legal process' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="border-l-4 border-green-500 pl-4"
                  >
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-700 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Your Privacy Rights */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
                Your Privacy Rights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{
                  number: '1', title: 'Access Your Data', desc: 'Request a copy of the personal information I have about you'
                },{
                  number: '2', title: 'Correct Information', desc: 'Update or correct any inaccurate personal information'
                },{
                  number: '3', title: 'Delete Your Data', desc: 'Request deletion of your personal information (subject to legal requirements)'
                },{
                  number: '4', title: 'Opt-Out', desc: 'Unsubscribe from promotional communications at any time'
                }].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx*0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">{item.number}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Contact Information */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
                Contact Me About Privacy
              </h2>
              <div className="bg-green-50 p-6 rounded-lg space-y-3">
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or how I handle your personal information, 
                  please don't hesitate to contact me directly:
                </p>
                <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center">
                  <FaPhone className="text-green-500 mr-3" />
                  <span className="text-gray-700">
                    {loading ? 'Loading...' : userData?.username || 'Your Guide'}{(!loading && userData) && ' - Professional Tour Guide'}
                  </span>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center">
                  <FaEnvelope className="text-green-500 mr-3" />
                  <span className="text-gray-700">{loading ? 'Loading...' : userData?.email || '—'}</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-center">
                  <FaMapMarkerAlt className="text-green-500 mr-3" />
                  <span className="text-gray-700">{loading ? 'Loading...' : [userData?.city, userData?.country].filter(Boolean).join(', ') || '—'}</span>
                </motion.div>
                <p className="text-sm text-gray-600 mt-4">
                  I will respond to your privacy-related inquiries within 48 hours.
                </p>
              </div>
            </motion.section>

            {/* Policy Updates */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
                Policy Updates
              </h2>
              <p className="text-gray-700">
                I may update this Privacy Policy from time to time to reflect changes in my practices or for legal reasons. 
                Any significant changes will be communicated to you via email or through a notice on my website. 
                Your continued use of my services after such changes constitutes acceptance of the updated policy.
              </p>
            </motion.section>

          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, scale: 1.05 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-green-500 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Ready to Book Your Morocco Adventure?</h3>
            <p className="mb-4">Your privacy is protected. Your experience will be unforgettable.</p>
            <a 
              href="/contact" 
              className="bg-white text-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Vallovibe Today
            </a>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
