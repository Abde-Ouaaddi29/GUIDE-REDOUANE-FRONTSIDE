'use client';

import React, { useState, useEffect } from 'react';
import useApi from '@/hooks/useApi';
import { FaPlus, FaPen, FaTrash, FaSearch, FaCity, FaMapMarkerAlt } from 'react-icons/fa';

interface ExperienceData {
  id?: number;
  city: string;
  place: string;
  img1?: string | File | null;
  img2?: string | File | null;
  img3?: string | File | null;
  img4?: string | File | null;
  images?: string[];
}

export default function ExperienceManagementPage() {
  
  const {
    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    fetchAllCities,
    loading,
    error
  } = useApi();

  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<ExperienceData[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<ExperienceData | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoadingType, setImageLoadingType] = useState<'add' | 'edit' | null>(null);

  const [newExperience, setNewExperience] = useState<ExperienceData>({
    city: '',
    place: '',
    img1: null,
    img2: null,
    img3: null,
    img4: null
  });

  // Utility: derive images[] from img1..img4 for UI
  const attachImagesArray = (e: any): ExperienceData => ({
    ...e,
    images: [e.img1, e.img2, e.img3, e.img4].filter(Boolean)
  });

  // Load data
  useEffect(() => {
    (async () => {
      try {
        const [expData, cityList] = await Promise.all([
          fetchExperiences(),
          fetchAllCities()
        ]);
        const mapped = expData.map(attachImagesArray);
        setExperiences(mapped);
        setFilteredExperiences(mapped);
        setCities(cityList);
      } catch (err) {
        console.error('Load error', err);
      }
    })();
  }, []);

  // Filtering
  useEffect(() => {
    let list = [...experiences];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(e =>
        e.city.toLowerCase().includes(q) || e.place.toLowerCase().includes(q)
      );
    }
    if (filterCity) {
      list = list.filter(e => e.city === filterCity);
    }
    setFilteredExperiences(list);
  }, [searchTerm, filterCity, experiences]);

  // Generic change handlers
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentExperience) return;
    const { name, value } = e.target;
    setCurrentExperience(prev => prev ? { ...prev, [name]: value } : null);
  };

  // File selection (add) with validation
  const handleAddFile = (field: keyof ExperienceData, file?: File) => {
    if (!file) {
      setNewExperience(prev => ({ ...prev, [field]: null }));
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file too large. Please use an image smaller than 1MB.');
      return;
    }
    
    setNewExperience(prev => ({ ...prev, [field]: file }));
  };

  // File selection (edit) with validation
  const handleEditFile = (field: keyof ExperienceData, file?: File) => {
    if (!file) {
      setCurrentExperience(prev => prev ? { ...prev, [field]: null } : null);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file too large. Please use an image smaller than 1MB.');
      return;
    }
    
    setCurrentExperience(prev => prev ? { ...prev, [field]: file } : null);
  };

  // Create with better error handling
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExperience.img1) {
      alert('Main image required');
      return;
    }
    setImageLoading(true);
    setImageLoadingType('add');
    try {
      const created = await createExperience(newExperience as any);
      const withImages = attachImagesArray(created);
      setExperiences(prev => [...prev, withImages]);
      setIsAddModalOpen(false);
      setNewExperience({
        city: '',
        place: '',
        img1: null,
        img2: null,
        img3: null,
        img4: null
      });
      alert('Experience created successfully!');
    } catch (err: any) {
      console.error('Create failed', err);
      alert(err.message || 'Failed to create experience. Please try again.');
    } finally {
      setImageLoading(false);
      setImageLoadingType(null);
    }
  };

  // Update with better error handling
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExperience || !currentExperience.id) return;
    setImageLoading(true);
    setImageLoadingType('edit');
    try {
      const updated = await updateExperience(currentExperience.id, currentExperience as any);
      const withImages = attachImagesArray(updated);
      setExperiences(prev =>
        prev.map(e => (e.id === withImages.id ? withImages : e))
      );
      setIsEditModalOpen(false);
      alert('Experience updated successfully!');
    } catch (err: any) {
      console.error('Update failed', err);
      alert(err.message || 'Failed to update experience. Please try again.');
    } finally {
      setImageLoading(false);
      setImageLoadingType(null);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!currentExperience?.id) return;
    try {
      await deleteExperience(currentExperience.id);
      setExperiences(prev => prev.filter(e => e.id !== currentExperience.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const openEditModal = (exp: ExperienceData) => {
    // Clone so edits do not mutate list until saved
    setCurrentExperience({ ...exp });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (exp: ExperienceData) => {
    setCurrentExperience(exp);
    setIsDeleteModalOpen(true);
  };

  const previewFor = (val?: string | File | null) => {
    if (!val) return null;
    if (val instanceof File) return URL.createObjectURL(val);
    return val; // already base64 data URI from API
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Experience Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Experience
        </button>
      </div>

      {/* Search / Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Search by city or place..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by City</label>
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error.message}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main Image</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExperiences.length ? filteredExperiences.map(exp => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaCity className="text-gray-500 mr-2" /> {exp.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" /> {exp.place}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {previewFor(exp.img1) ? (
                      <div className="h-12 w-20 relative rounded overflow-hidden">
                        <img
                          src={previewFor(exp.img1)!}
                          alt="Main"
                          className="object-cover h-full w-full"
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-20 flex items-center justify-center bg-gray-200 rounded">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => openDeleteModal(exp)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No experiences found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative mt-20">
            {/* Loading Overlay */}
            {imageLoading && imageLoadingType === 'add' && (
              <div className="absolute inset-0 bg-white  bg-opacity-90 flex items-center justify-center z-10 rounded-lg  h-120vh">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Processing images...</p>
                  <p className="text-gray-500 text-sm">Please wait</p>
                </div>
              </div>
            )}
            
            <div className="p-6  ">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add New Experience</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  disabled={imageLoading}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={newExperience.city}
                      onChange={handleAddInputChange}
                      disabled={imageLoading}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place*</label>
                    <input
                      type="text"
                      name="place"
                      required
                      value={newExperience.place}
                      onChange={handleAddInputChange}
                      disabled={imageLoading}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Main Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Image*</label>
                  {newExperience.img1 instanceof File && (
                    <div className="mt-2 mb-3 h-20 w-32 relative rounded overflow-hidden">
                      <img
                        src={previewFor(newExperience.img1)!}
                        alt="Preview"
                        className="object-cover h-full w-full"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="img1"
                    required
                    accept="image/*"
                    onChange={e => handleAddFile('img1', e.target.files?.[0])}
                    disabled={imageLoading}
                    className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum file size: 1MB. Recommended: JPG, PNG</p>
                </div>

                {/* Additional Images */}
                {(['img2','img3','img4'] as (keyof ExperienceData)[]).map(field => (
                  <div className="mb-4" key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field === 'img2' ? 'Additional Image 1'
                        : field === 'img3' ? 'Additional Image 2'
                        : 'Additional Image 3'}
                    </label>
                    {newExperience[field] instanceof File && (
                      <div className="mt-2 mb-3 h-20 w-32 relative rounded overflow-hidden">
                        <img
                          src={previewFor(newExperience[field])!}
                          alt="Preview"
                          className="object-cover h-full w-full"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleAddFile(field, e.target.files?.[0])}
                      disabled={imageLoading}
                      className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum file size: 1MB. Optional</p>
                  </div>
                ))}

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={imageLoading}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={imageLoading}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {imageLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative mt-20">
            {/* Loading Overlay */}
            {imageLoading && imageLoadingType === 'edit' && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg h-[100vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Processing images...</p>
                  <p className="text-gray-500 text-sm">Please wait</p>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Experience</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  disabled={imageLoading}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={currentExperience.city}
                      onChange={handleEditInputChange}
                      disabled={imageLoading}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place*</label>
                    <input
                      type="text"
                      name="place"
                      required
                      value={currentExperience.place}
                      onChange={handleEditInputChange}
                      disabled={imageLoading}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {(['img1','img2','img3','img4'] as (keyof ExperienceData)[]).map((field, idx) => {
                  const label =
                    field === 'img1'
                      ? 'Main Image*'
                      : `Additional Image ${idx}`;
                  const existing =
                    currentExperience[field] instanceof File
                      ? previewFor(currentExperience[field])
                      : (currentExperience as any)[field] || null;

                  return (
                    <div className="mb-4" key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      {existing && (
                        <div className="mt-2 mb-3 h-20 w-32 relative rounded overflow-hidden">
                          <img
                            src={existing}
                            alt="Preview"
                            className="object-cover h-full w-full"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleEditFile(field, e.target.files?.[0])}
                        disabled={imageLoading}
                        className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum file size: 1MB. {field === 'img1' ? 'Required' : 'Optional'}</p>
                    </div>
                  );
                })}

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={imageLoading}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={imageLoading}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {imageLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && currentExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Delete experience <span className="font-semibold">{currentExperience.place}</span> in{' '}
              <span className="font-semibold">{currentExperience.city}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )}