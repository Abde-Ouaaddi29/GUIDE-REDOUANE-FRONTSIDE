"use client";
import { URL_SERVER } from '@/app/constants';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';

const API_BASE = `${URL_SERVER}/api/v1`;

const Footer: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        if (!API_BASE) return;
        setLoading(true);
        const resp = await fetch(`${API_BASE}/users/1`, {
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

  const displayPhone = userData?.phone ? String(userData.phone) : null;
  const moroccoPhone = displayPhone ? `+212 (0) ${displayPhone.slice(-9)}` : null;
  const moroccoTel = displayPhone ? `+212${displayPhone.slice(-9)}` : null;
  const location = [userData?.city, userData?.country].filter(Boolean).join(', ');

  // Motion variants
  const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', stiffness: 70 } }
  };

  return (
    <footer className="bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 pb-10 border-b border-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Brand / About */}
          <motion.div variants={sectionVariant}>
            {userData?.logo_url && (
              <div className="relative flex justify-start items-start mb-6">
                <img
                  src={userData.logo_url}
                  alt={userData.username ? `${userData.username} logo` : 'Logo'}
                  className="h-12 text-2xl w-auto"
                  loading="lazy"
                />
              </div>
            )}
            <h3 className="text-2xl font-bold tracking-tight mb-2">
              {loading ? 'Loading...' : (userData?.username || 'Tour Guide')}
            </h3>
            <span className='text-sm uppercase tracking-wide text-pink-400 font-semibold mb-2'>
              Professional Tour Guide
            </span>
            <p className="text-sm leading-relaxed text-gray-400 whitespace-pre-line">
              {loading && 'Loading profile...'}
              {error && 'Failed to load profile.'}
              {!loading && !error && (userData?.description4 || 'Authentic Moroccan experiences crafted with passion and cultural insight.')}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="space-y-4" variants={sectionVariant}>
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-pink-400 transition-colors">About</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-pink-400 transition-colors">Services</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-pink-400 transition-colors">Contact</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-pink-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div className="space-y-4" variants={sectionVariant}>
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {moroccoPhone && <li><span className="text-gray-500">Phone: </span><a href={`tel:${moroccoTel}`} className="hover:text-pink-400">{moroccoPhone}</a></li>}
              {userData?.email && <li><span className="text-gray-500">Email: </span><a href={`mailto:${userData.email}`} className="hover:text-pink-400">{userData.email}</a></li>}
              {location && <li><span className="text-gray-500">Location: </span>{location}</li>}
            </ul>
            <p className="text-xs text-gray-500">I typically reply within 24–48 hours.</p>
          </motion.div>

          {/* Social & Credit */}
          <motion.div className="space-y-4" variants={sectionVariant}>
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-blue-500 transition-colors"><FaFacebook size={22} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-sky-400 transition-colors"><FaTwitter size={22} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-pink-500 transition-colors"><FaInstagram size={22} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-600 transition-colors"><FaLinkedin size={22} /></a>
            </div>
            <a href="https://abderrahim-ouaaddi.netlify.app/" target="_blank" rel="noopener noreferrer" className=" text-gray-500 hover:text-gray-300 inline-block pt-2">
              Developed with <span role="img" aria-label="love">❤️</span> by abde-ouaaddi
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div className="text-center text-xs text-gray-600" variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
          <p>&copy; {new Date().getFullYear()} {userData?.username || 'Redwan Guide'}. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
