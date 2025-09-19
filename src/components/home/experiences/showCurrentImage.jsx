"use client";
import React from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

export default function ShowCurrentImage({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 sm:p-8 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 p-2 rounded-lg shadow-2xl w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 transition-colors"
          aria-label="Close image viewer"
        >
          <IoMdClose size={22} />
        </button>
        <div className="relative w-full h-96 sm:h-128 md:h-144 lg:h-160 xl:h-192">
          <Image
            src={imageUrl}
            alt="Selected experience image"
            fill
            style={{ objectFit: "contain" }} 
            className="rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
