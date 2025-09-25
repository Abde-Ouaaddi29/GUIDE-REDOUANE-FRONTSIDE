import React from 'react';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import { URL_FRONT } from './constants';

// Prefer explicit site URL for metadata; configurable via env
const siteUrl = URL_FRONT;

export const metadata: Metadata = {
  // Base URL so that OpenGraph/Twitter absolute URLs resolve correctly
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vallovibe - Professional Tour Guide in Morocco',
    template: '%s | vallovibe Tour Guide'
  },
  description: 'Book unforgettable tours in Morocco with Vallovibe, your professional local tour guide. Experience authentic Moroccan culture, hidden gems, and personalized travel adventures.',
  keywords: [
    'Vallovibe',
    'Morocco tour guide',
    'professional tour guide Morocco',
    'Morocco travel guide',
    'local guide Morocco',
    'Morocco tours',
    'Moroccan culture tours',
    'authentic Morocco experience',
    'Morocco travel booking',
    'guided tours Morocco'
  ],
  authors: [{ name: 'Vallovibe' }],
  creator: 'Vallovibe',
  publisher: 'Vallovibe Professional Tour Guide',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://Vallovibe.com',
    siteName: 'Vallovibe Tour Guide',
    title: 'Vallovibe - Professional Tour Guide in Morocco',
    description: 'Experience authentic Morocco with professional tour guide Vallovibe. Book personalized tours and discover hidden gems in Morocco.',
    images: [
      {
        url: '/assets/REDWAN_GUIDE.jpeg',
        width: 1200,
        height: 630,
        alt: 'Vallovibe - Professional Tour Guide in Morocco',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vallovibe - Professional Tour Guide in Morocco',
    description: 'Experience authentic Morocco with professional tour guide Vallovibe. Book personalized tours and discover hidden gems.',
    images: ['/assets/REDWAN_GUIDE.jpeg'],
    creator: '@redwan_guide',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  category: 'travel',
  other: {
    'geo.region': 'MA',
    'geo.country': 'Morocco',
    'geo.placename': 'Morocco',
  },
  // Basic responsive viewport (optional but useful)
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}