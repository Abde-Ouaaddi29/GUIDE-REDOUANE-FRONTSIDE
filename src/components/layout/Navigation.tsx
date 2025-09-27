"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { IoMdClose } from "react-icons/io";
import { MdFilterList } from "react-icons/md";
import { FaCompass } from "react-icons/fa";
import { PiCompassRoseFill } from 'react-icons/pi';
import { URL_SERVER } from '@/app/constants';

const API_BASE = `${URL_SERVER}/api/v1`;


const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname(); // Get current pathname
    const [logopath, setLogoPath] = useState("");

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    // Helper function to determine active link styles
    const getLinkClassName = (path: string) => {
        const baseClasses = "px-1 py-2 ml-3 lg:py-1 text-gray-700 hover:text-pink-500 hover:border-b hover:border-pink-500 transition-all duration-300";
        if (pathname === path) {
            return `${baseClasses} text-pink-500 border-b border-pink-500`;
        }
        return baseClasses;
    };

      const fetchData = async () => {
        try {
          const response = await fetch(`${API_BASE}/firstUser`);
          const data = await response.json();
          setLogoPath(data.logo_url);
          console.log('logopath', data.logo_url);
        //   setPhone(data.phone || "689474500");
        } catch (err) {
          console.error("Failed to fetch phone number:", err);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);

    return (
        <>
            <div className="navbar shadow-lg py-4 px-9 lg:px-20 md:px-16 flex justify-between items-center fixed top-0 left-0 right-0  z-[999] bg-white">
                {/* Logo/Brand area */}
                <Link href="/" className="flex items-center cursor-pointer">
                    {logopath ? (
                        logopath && (
                            <div className="relative flex justify-start items-start ">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={logopath}
                                alt={logopath ? `${logopath} logo` : 'Logo'}
                                className=" h-8 lg:h-10 xl:h-10 text-xl w-auto"
                                loading="lazy"
                            />
                        </div>
                        )
                    ) : (
                       <div className='flex items-center'>
                            <PiCompassRoseFill className="text-2xl text-pink-600 mr-2" />

                            <span className="text-xl font-medium tracking-wider">
                                <span className="text-pink-400 font-normal">Redouane Tours</span>
                            </span>
                       </div>
                    )}
                </Link>

                {/* Mobile menu toggle */}
                <div onClick={toggleMenu} className="lg:hidden z-[1001]">
                    {menuOpen ? 
                        <IoMdClose className="text-gray-800 w-7 h-7" /> : 
                        <MdFilterList className="text-gray-800 w-7 h-7" />
                    }
                </div>

                {/* Navigation links */}
                <div className={`${menuOpen ? 'flex' : 'hidden'} flex-col lg:flex lg:flex-row absolute lg:static top-16 right-0 left-0 bg-white shadow-lg lg:shadow-none p-4 lg:p-0 z-[1000]`}>
                    <Link href="/" className={getLinkClassName("/")} onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href="/services" className={getLinkClassName("/services")} onClick={() => setMenuOpen(false)}>
                        Services
                    </Link>
                    <Link href="/reservation" className={getLinkClassName("/reservation")} onClick={() => setMenuOpen(false)}>
                        Reservation
                    </Link>
                    <Link href="/experiences" className={getLinkClassName("/experiences")} onClick={() => setMenuOpen(false)}>
                        Experiences
                    </Link>
                    <Link href="/contact" className={getLinkClassName("/contact")} onClick={() => setMenuOpen(false)}>
                        Contact
                    </Link>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {menuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 opacity-85 z-[998] lg:hidden"
                    onClick={toggleMenu}
                />
            )}
        </>
    );
};

export default Navigation;