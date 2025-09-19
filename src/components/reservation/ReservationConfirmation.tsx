"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { URL_SERVER } from '@/app/constants';

// Reuse shape from form
interface ReservationDataPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  selectedService: string; // slug value
  date: string; // ISO/date string
  guests: number;
  message: string;
}

interface ServiceOption {
  id: number;
  value: string;
  label: string;
}

interface UserPublicData {
  id: number;
  username?: string;
  email?: string;
  phone?: string | number | null;
  country?: string | null;
  city?: string | null;
  description1?: string | null;
  description2?: string | null;
  description3?: string | null;
  description4?: string | null;
  logo_url?: string | null;
  image_url1?: string | null;
  image_url2?: string | null;
  image_url3?: string | null;
  image_url4?: string | null;
  image_url5?: string | null;
}

interface ReservationConfirmationProps {
  data: ReservationDataPayload | null;
  services: ServiceOption[];
  userId?: number; // default 1
}

import type { Variants } from 'framer-motion';

const confirmationVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 100 } },
  exit: { opacity: 0, scale: 0.8, y: -30, transition: { duration: 0.3 } }
};

const ReservationConfirmation: React.FC<ReservationConfirmationProps> = ({ data, services, userId = 1 }) => {
  const [user, setUser] = useState<UserPublicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); setError(null);
      try {
        // Assuming public endpoint /api/v1/users/:id exists (else adjust to list + pick first)
        const resp = await fetch(`${URL_SERVER}/api/v1/users/${userId}`);
        if (!resp.ok) throw new Error('Failed to load host information');
        const json = await resp.json();
        setUser(json);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch user');
      } finally { setLoading(false); }
    };

    fetchUser();
  }, [userId]);

  if (!data) return null;

  const serviceLabel = services.find(s => s.value === data.selectedService)?.label || data.selectedService;

  const handleExport = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const safeName = data.name || 'Reservation';

      // Margins & colors
      const marginX = 40;
      let y = 40;
      const primary = '#ff7a00';
      const gray = '#555555';

      // Embed logo (only in PDF, not in UI)
      if (user?.logo_url) {
        try {
          const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = user.logo_url as string;
          });
          // Determine format from extension or fallback to JPEG
          const extMatch = (user.logo_url || '').toLowerCase().match(/\.([a-z0-9]+)(?:$|\?|#)/);
          const fmtRaw = extMatch ? extMatch[1] : 'jpeg';
          const fmt = fmtRaw === 'jpg' ? 'JPEG' : fmtRaw.toUpperCase();
          doc.addImage(imgEl, fmt as any, marginX, y, 80, 80, undefined, 'FAST');
          y += 90; // space below logo
        } catch {
          // ignore logo failures
        }
      }

      // Title
      doc.setFont('helvetica','bold');
      doc.setFontSize(22);
      doc.setTextColor(primary);
      doc.text('Reservation Confirmation', marginX, y);
      y += 24;

      // Subtitle / meta
      doc.setFontSize(11);
      doc.setFont('helvetica','normal');
      doc.setTextColor(gray);
      doc.text(`Generated: ${new Date().toLocaleString()}`, marginX, y);
      y += 20;

      // Section header
      const sectionHeader = (title:string) => {
        doc.setFillColor(primary);
        doc.setDrawColor(primary);
        doc.setTextColor('#ffffff');
        doc.setFontSize(12);
        doc.setFont('helvetica','bold');
        doc.roundedRect(marginX, y-12, 520, 24, 4, 4, 'F');
        doc.text(title.toUpperCase(), marginX + 12, y + 6);
        y += 30;
        doc.setFont('helvetica','normal');
        doc.setFontSize(11);
        doc.setTextColor(gray);
      };

      sectionHeader('Details');

      const line = (label: string, value: string | number | null | undefined) => {
        const labelW = 110;
        doc.setFont('helvetica','bold');
        doc.setTextColor('#222222');
        doc.text(label + ':', marginX, y);
        doc.setFont('helvetica','normal');
        doc.setTextColor(gray);
        const text = String(value ?? '');
        doc.text(text, marginX + labelW, y);
        y += 18;
        if (y > 760) { doc.addPage(); y = 60; }
      };

      line('Name', data.name);
      line('Email', data.email);
      line('Phone', data.phone);
      line('Country', data.country);
      line('Service', serviceLabel);
      line('Date', new Date(data.date).toLocaleDateString());
      line('Guests', data.guests);
      line('Status', 'PENDING');

      if (data.message) {
        sectionHeader('Message');
        const split = doc.splitTextToSize(data.message, 520);
  split.forEach((t: string) => { doc.text(t, marginX, y); y += 16; if (y > 760) { doc.addPage(); y = 60; } });
      }

      if (user?.username) {
        sectionHeader('Guide');
        doc.text(`Guide: ${user.username}`, marginX, y); y += 18;
      }

      sectionHeader('Notes');
      const note = 'Thank you for choosing our service. We will contact you soon to confirm.';
      doc.text(doc.splitTextToSize(note, 520), marginX, y);

      // Footer
      doc.setFontSize(9);
      doc.setTextColor('#888888');
      doc.text(`© ${new Date().getFullYear()} Reservation`, marginX, 820);

      doc.save(`reservation-${safeName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now()}.pdf`);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div
      className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg shadow-md text-center"
      variants={confirmationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className="text-2xl font-semibold text-green-700 mb-3">Reservation Pending!</h3>
      <p className="text-gray-700 mb-2">
        Thank you for your reservation, {data.name}! We are thrilled to help plan your trip.
      </p>
      <p className="text-gray-700 mb-2">
        We have received your request for the <strong>{serviceLabel}</strong> service on <strong>{new Date(data.date).toLocaleDateString()}</strong> for <strong>{data.guests} guest(s)</strong>.
      </p>
      {/* {data.message && (
        <p className="text-gray-600 mb-2 italic">"{data.message}"</p>
      )} */}
      <p className="text-gray-600 mt-4 text-sm">
        {user ? (
          <>
            {user.username ? <span className="font-semibold">{user.username}</span> : 'Your guide'} will contact you soon via email at <strong>{data.email}</strong> or phone at <strong>{data.phone}</strong> to confirm the details and welcome you to Morocco.
          </>
        ) : loading ? (
          'Loading host info...'
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : null}
      </p>
      <p className="text-orange-500 font-semibold mt-4">Welcome to Morocco!</p>
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="px-6 py-2 rounded-md bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed shadow"
        >
          {exporting ? 'Generating PDF...' : 'Download Reservation (PDF)'}
        </button>
      </div>
    </motion.div>
  );
};

export default ReservationConfirmation;
