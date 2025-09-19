"use client"
import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaTachometerAlt, FaCalendarCheck, FaCommentDots, FaCog, FaSignOutAlt, FaGlobeAfrica, FaBars, FaTimes } from 'react-icons/fa';
import { SiTransmission } from "react-icons/si";

import { URL_SERVER } from '../constants';

const navLinks = [
  { name: 'Dashboard', href: '/nimda', icon: FaTachometerAlt },
  { name: 'Reservations', href: '/nimda/reservations', icon: FaCalendarCheck },
  { name: 'Experiences', href: '/nimda/experiences', icon: FaGlobeAfrica },
  { name: 'Services', href: '/nimda/services', icon: SiTransmission },
  { name: 'Feedback', href: '/nimda/feedback', icon: FaCommentDots },
  { name: 'Settings', href: '/nimda/settings', icon: FaCog },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getHeaderText = () => {
    const currentLink = navLinks.find(link => link.href === pathname);
    return currentLink ? currentLink.name : 'Admin Panel';
  };
  
  const handleLogout = async () => {
    try {
      // Get token from storage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        // Call the logout API
        await fetch(`${URL_SERVER}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
      }
      
      // Clear storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear storage and redirect even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0`}>
        <div className="flex items-center justify-between p-4 border-b border-b-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Admin Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-600 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name} className="px-4">
                  <Link
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center py-3 px-4 my-1 rounded-md text-gray-700 transition-colors duration-200 ${
                      isActive
                        ? 'bg-orange-100 text-orange-600 font-semibold'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    <link.icon className={`mr-3 ${isActive ? 'text-orange-500' : ''}`} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
            
            {/* Logout button (not a Link) */}
            <li className="px-4">
              <button
                onClick={handleLogout}
                className="flex items-center py-3 px-4 my-1 rounded-md text-gray-700 transition-colors duration-200 w-full text-left hover:bg-gray-200"
              >
                <FaSignOutAlt className="mr-3" />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-0">
        <header className="bg-white shadow-sm border-b border-b-gray-200 sticky top-0 z-30">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
               <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 md:hidden"
              >
                <FaBars className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {getHeaderText()}
              </h1>
               <div className="w-6 md:hidden"></div> {/* Placeholder to balance the header */}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <AuthGuard>
            {children}
          </AuthGuard>
        </main>
      </div>
    </div>
  );
}