"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaCoffee,
  FaMountain,
  FaLandmark,
  FaUsers,
  FaCamera,
  FaClock,
  FaDollarSign,
  FaSpinner,
} from "react-icons/fa";

import useApi from "@/hooks/useApi";
import { MdOutlineDownloadDone } from "react-icons/md";

// Icon mapping for different service types
const getTypeIcon = (typeName) => {
  const type = typeName.toLowerCase();
  if (
    type.includes("nature") ||
    type.includes("mountain") ||
    type.includes("adventure")
  ) {
    return <FaMountain className="mr-2 text-green-500" />;
  } else if (type.includes("cultural") || type.includes("historical")) {
    return <FaLandmark className="mr-2 text-teal-500" />;
  } else if (type.includes("food") || type.includes("culinary")) {
    return <FaUtensils className="mr-2 text-teal-500" />;
  } else if (type.includes("urban") || type.includes("city")) {
    return <FaUsers className="mr-2 text-purple-500" />;
  } else {
    return <FaCamera className="mr-2 text-blue-500" />;
  }
};

// Color mapping for service types
const getTypeColor = (typeName) => {
  const type = typeName.toLowerCase();
  if (
    type.includes("nature") ||
    type.includes("mountain") ||
    type.includes("adventure")
  ) {
    return "bg-green-100 text-green-600";
  } else if (type.includes("cultural") || type.includes("historical")) {
    return "bg-teal-100 text-teal-600";
  } else if (type.includes("food") || type.includes("culinary")) {
    return "bg-teal-100 text-teal-600";
  } else if (type.includes("urban") || type.includes("city")) {
    return "bg-purple-100 text-purple-600";
  } else {
    return "bg-blue-100 text-blue-600";
  }
};

export default function Services() {
  // Flat services list (no grouping)
  const [services, setServices] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");
  const [modalService, setModalService] = useState(null); // selected service for overlay
  const { fetchFilteredServices, fetchServiceTypes, loading, error } = useApi();

  const splitDescription = useCallback((desc) => {
    if (!desc) return [];
    return desc
      .split(/[,;|\n]/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, []);

  const truncatedParts = (service) => {
    const parts = splitDescription(service.description || "");
    if (parts.length <= 3) return parts;
    return parts.slice(0, 3);
  };

  const applyFilters = async () => {
    const opts = {
      groupByType: false,
      q: search || undefined,
      servicesTypeId: selectedType ? Number(selectedType) : undefined,
      minPrice: minPrice !== "" ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
    };
    try {
      const list = await fetchFilteredServices(opts);
      // list may already be flat; normalize
      const flat = Array.isArray(list) ? list : list?.services || [];
      setServices(flat);
    } catch (e) {
      console.error("Filter fetch failed", e);
    }
  };

  const resetFilters = () => {
    setSelectedType("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    applyFilters();
  };

  useEffect(() => {
    const init = async () => {
      try {
        const types = await fetchServiceTypes();
        setTypeOptions(
          (types || []).map((t) => ({
            id: t.id,
            typeName: t.type_name || t.typeName,
          }))
        );
      } catch (e) {
        console.error("Failed loading type options", e);
      }
      applyFilters();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-36">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* General Description Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Our Tailored Tour Services
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the best of Souss massa | Agadir with our diverse range
            of guided tours. Each tour is crafted to provide unique insights,
            unforgettable memories, and exceptional service.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <FaSpinner className="animate-spin text-4xl text-teal-500 mr-3" />
            <span className="text-lg text-gray-600">Loading services...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            <p className="font-medium">Error loading services</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white/70 backdrop-blur rounded-lg shadow p-6 mb-12 border border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyFilters();
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service name"
                className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
              >
                <option value="">All Types</option>
                {typeOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.typeName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="1000"
                className="w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
              />
            </div>
            <div className="flex gap-2 lg:col-span-2">
              <button
                type="submit"
                className="flex-1 inline-flex justify-center items-center py-2 px-4 rounded-md bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Applying
                  </>
                ) : (
                  "Apply Filters"
                )}
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex justify-center items-center py-2 px-4 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Flat Services Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const typeName =
                service.serviceTypeName ||
                service.serviceTypeNameFull ||
                service.serviceTypeName ||
                service.service_type?.type_name ||
                "Tour";
              const parts = truncatedParts(service);
              return (
                <motion.div
                  key={service.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {service.imageBase64 && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={service.imageBase64}
                        alt={service.serviceName}
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase ${getTypeColor(
                            typeName
                          )}`}
                        >
                          {typeName}
                        </span>
                      </div>
                      <button
                        onClick={() => setModalService(service)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-700 flex items-center justify-center shadow hover:bg-white transition"
                        aria-label="View full description"
                      >
                        <span className="text-xl leading-none">+</span>
                      </button>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {service.serviceName}
                    </h3>
                    <div className="mb-4 space-y-2">
                      {parts.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <MdOutlineDownloadDone
                            className="mr-2 mt-0.5 text-teal-400 flex-shrink-0"
                            size={14}
                          />
                          <span className="leading-relaxed">{p}</span>
                        </div>
                      ))}
                      {splitDescription(service.description || "").length >
                        parts.length && (
                        <button
                          onClick={() => setModalService(service)}
                          className="text-xs text-teal-500 hover:underline font-medium"
                        >
                          Show more...
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 mb-4">
                      {service.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaClock className="mr-2 text-teal-500" />
                          <span className="font-medium">Duration:</span>
                          <span className="ml-1">{service.duration}</span>
                        </div>
                      )}
                      {service.price && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaDollarSign className="mr-2 text-green-500" />
                          <span className="font-medium">Price:</span>
                          <span className="ml-1 text-green-600 font-semibold">
                            ${Number(service.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <button className="w-full mt-2 bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors duration-300">
                      <a href={`/reservation/${service.id}`}>
                        Learn More & Book
                      </a>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center py-16">
            <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No Services Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or come back later.
            </p>
          </div>
        )}

        {/* Fullscreen modal overlay */}
        {modalService && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setModalService(null)}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl">
                {modalService.imageBase64 && (
                  <img
                    src={modalService.imageBase64}
                    alt={modalService.serviceName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />
                <div className="relative p-8 max-h-[80vh] overflow-y-auto custom-scrollbar text-white">
                  <button
                    onClick={() => setModalService(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-2xl"
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-3xl font-extrabold mb-6 tracking-tight">
                    {modalService.serviceName}
                  </h2>
                  <div className="space-y-3 text-sm leading-relaxed">
                    {splitDescription(modalService.description || "").map(
                      (p, i) => (
                        <p key={i} className="flex">
                          <MdOutlineDownloadDone
                            className="mr-2 mt-1 text-teal-400 flex-shrink-0"
                            size={14}
                          />
                          <span>{p}</span>
                        </p>
                      )
                    )}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-200">
                    {modalService.duration && (
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-teal-400" />{" "}
                        {modalService.duration}
                      </div>
                    )}
                    {modalService.price && (
                      <div className="flex items-center">
                        <FaDollarSign className="mr-1 text-green-400" />
                        <span className="font-semibold">
                          ${Number(modalService.price).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-10">
                    <a
                      href={`/reservation/${modalService.id}`}
                      className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
                    >
                      Reserve This Tour
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
