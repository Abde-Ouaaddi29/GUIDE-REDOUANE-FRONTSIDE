"use client";
import React, { useState, useEffect } from "react"; // Import useState AND useEffect
import Image from "next/image";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io"; // Import IoMdClose here

export default function Card({ experience, cities }) {
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  // const [expanded, setExpanded] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImageUrl(null);
  };

  return (
    <>
      <div className="relative rounded-lg shadow-md overflow-hidden h-85 group">
        {/* Background Image - Make it clickable */}
        <div
          className="absolute inset-0 w-full h-full z-0 cursor-pointer"
          // Only attach handler if we have at least one image
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (
              experience.images &&
              experience.images.length &&
              (e.key === "Enter" || e.key === " ")
            ) {
              handleImageClick(experience.images[0]);
            }
          }}
        >
          {experience.images && experience.images.length ? (
            <Image
              src={experience.images[0]}
              alt={`${experience.place} background`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Black Overlay */}
        <div className="absolute inset-0 w-full h-full bg-black opacity-50 z-10 group-hover:bg-opacity-60 transition-opacity duration-300 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-20 p-6 flex flex-col justify-between h-full text-white ">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border-l-4 border-pink-500 bg-black/30 px-3 py-1.5 shadow">
              <div className="text-lg font-semibold text-white">
                <span className="text-sm"> {experience.place}</span>
                <span>
                  {cities
                    .filter((city) => city.id === experience.id_city)
                    .map((city) => (
                      <span
                        key={city.id}
                        className="bg-primary-light bg-opacity-20 text-primary-light px-3 py-1 rounded-full text-sm font-medium text-pink-400"
                      >
                        <span className="mr-1"> - </span> {city.name}
                      </span>
                    ))}
                </span>
              </div>
              <FaLocationCrosshairs className="text-pink-400" />
            </div>
            {/* <p className="text-white text-sm">
              {expanded
                ? experience.description
                : experience.description.length > 30
                ? `${experience.description.slice(0, 80)}... `
                : experience.description}

              {experience.description.length > 30 && (
                <span
                  className="text-gray-400 cursor-pointer ml-1"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "less" : "plus"}
                </span>
              )}
            </p> */}
          </div>

          {/* Images - smaller and at the bottom */}
          {experience.images && experience.images.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {experience.images.slice(1, 4).map((imageSrc, index) =>
                imageSrc ? (
                  <div
                    key={index}
                    className="relative w-16 h-16 rounded-md overflow-hidden border-2 border-white border-opacity-50 cursor-pointer"
                    onClick={() => handleImageClick(imageSrc)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleImageClick(imageSrc);
                    }}
                  >
                    <Image
                      src={imageSrc}
                      alt={`Experience ${experience.id} Image ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for showing the selected image (integrated directly) */}
      {selectedImageUrl && (
        <div
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-8 transition-opacity duration-300 ease-in-out"
          onClick={handleCloseModal}
        >
          <div className="absolute bg-black top-0 bottom-0 w-full h-full opacity-50"></div>
          <div
            className="relative bg-white p-2 rounded-lg shadow-2xl w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-auto max-h-[85vh] xl:max-h-[70vh] lg:max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-300 hover:text-white z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 transition-colors"
              aria-label="Close image viewer"
            >
              <IoMdClose size={22} />
            </button>
            <div className="relative  w-full h-96 sm:h-128 md:h-144 lg:h-160 xl:h-192 rounded-4xl">
              <Image
                src={selectedImageUrl}
                alt={`Experience ${selectedImageUrl}`}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-2xl w-full "
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
