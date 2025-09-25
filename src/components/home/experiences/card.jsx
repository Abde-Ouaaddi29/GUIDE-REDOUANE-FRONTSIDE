"use client";
import React, { useState } from "react";
import Image from "next/image";
import {FaImages, FaExpand } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaLocationCrosshairs } from "react-icons/fa6";

export default function Card({ experience, cities }) {
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImageUrl(null);
  };

  const getCityName = () => {
    const city = cities?.find(city => city.id === experience.id_city);
    return city?.name || experience.city || 'Unknown City';
  };

  const hasMultipleImages = experience.images && experience.images.length > 1;
  const totalImages = experience.images?.length || 0;

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-80 md:h-96 z-10">
        {/* Main Background Image */}
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={() => experience.images?.[0] && handleImageClick(experience.images[0])}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (experience.images?.[0] && (e.key === "Enter" || e.key === " ")) {
              handleImageClick(experience.images[0]);
            }
          }}
        >
          {experience.images && experience.images.length ? (
            <Image
              src={experience.images[0]}
              alt={`${experience.place} in ${getCityName()}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FaImages className="mx-auto text-4xl mb-2 opacity-50" />
                <p className="text-sm">No Image Available</p>
              </div>
            </div>
          )}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Expand Icon */}
        {experience.images?.[0] && (
          <button
            onClick={() => handleImageClick(experience.images[0])}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10"
            aria-label="View full image"
          >
            <FaExpand className="text-sm" />
          </button>
        )}

        {/* Image Counter Badge */}
        {totalImages > 1 && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1 z-10">
            <FaImages className="text-xs" />
            <span>{totalImages}</span>
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 z-10">
          {/* Location Info */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 mb-3 transform transition-transform duration-300 group-hover:scale-105 w-full">
              <FaLocationCrosshairs className="text-pink-400 text-sm" />
              <div className="text-white">
                <span className=" font-bold block">{experience.place}</span>
                <span className="text-pink-300 text-sm font-medium">{getCityName()}</span>
              </div>
            </div>
          </div>

          {/* Image Thumbnails */}
          {hasMultipleImages && (
            <div className="flex mb-4 justify-center gap-2 opacity-60 lg:opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-1">
              {experience.images.slice(1, 4).map((imageSrc, index) =>
                imageSrc ? (
                  <div
                    key={index}
                    className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 border-white/50 cursor-pointer hover:border-pink-400 transition-all duration-300 transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(imageSrc);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleImageClick(imageSrc);
                      }
                    }}
                  >
                    <Image
                      src={imageSrc}
                      alt={`${experience.place} view ${index + 2}`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                      sizes="64px"
                    />
                    <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                ) : null
              )}
              
              {/* More Images Indicator */}
              {totalImages > 4 && (
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 border-white/50 cursor-pointer hover:border-pink-400 transition-all duration-300 transform hover:scale-110 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+{totalImages - 4}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal - HIGHEST Z-INDEX */}
      {selectedImageUrl && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-[10000] p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Close image viewer"
            >
              <IoMdClose size={24} />
            </button>

            {/* Image Container */}
            <div 
              className="relative w-full h-full max-w-5xl max-h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl mt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImageUrl}
                alt={`${experience.place} - Full view`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 90vw"
                quality={95}
              />
            </div>

            {/* Image Navigation (if multiple images) */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-full p-2 z-[9990]">
                {experience.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(img);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      img === selectedImageUrl 
                        ? 'bg-pink-400 scale-125' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Image Info */}
            <div className="absolute bottom-2 left-12 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg z-[9990]">
              <p className="text-sm font-medium">{experience.place}</p>
              <p className="text-xs text-gray-300">{getCityName()}</p>
            </div>
          </div>
        </div>
      )} 
    </>
  );
}