"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPalette, FaSave, FaTrash, FaImage } from 'react-icons/fa';
import useApi from '../../../hooks/useApi';

// Derive user id safely from stored auth user (falls back to 1 if missing)
// NOTE: Avoid direct property access on the raw string; must parse JSON.
let USER_ID = 1; // default fallback
try {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.id === 'number') {
        USER_ID = parsed.id;
      }
    }
  }
} catch { /* ignore parse errors */ }

// Main Settings Page Component
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('personal');


  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <FaUser /> },
    { id: 'content', label: 'Website Content', icon: <FaPalette /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoSettings />;
      case 'content':
        return <WebsiteContentSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface SectionWrapperProps { title:string; children:React.ReactNode }
const SectionWrapper = ({ title, children }:SectionWrapperProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">{title}</h2>
    {children}
  </div>
);

function PersonalInfoSettings() {
  const { fetchAuthUser, updateAuthUser, updateAuthUserLogo } = useApi();
  const [info, setInfo] = useState({ fullName:'', email:'', phone:'', city:'', country:'', logoUrl:'' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const user = await fetchAuthUser();
    if (user) {
      setInfo({
        fullName: user.username || '',
        email: user.email || '',
        phone: user.phone ? String(user.phone) : '',
        city: user.city || '',
        country: user.country || '',
        logoUrl: user.logo_url || '/assets/REDWAN_GUIDE.jpeg'
      });
    }
  };
  useEffect(()=>{ load(); },[]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAuthUser(USER_ID, { username: info.fullName, email: info.email, phone: info.phone, city: info.city, country: info.country });
      alert('Personal info saved!');
    } finally { setSaving(false); }
  };

  return (
    <SectionWrapper title="Update Personal Information">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          {info.logoUrl ? (
            <img src={info.logoUrl} alt="Logo" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400"><FaUser size={48} /></div>
          )}
          <div>
            <label htmlFor="logo-upload" className="cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
              Change Logo
            </label>
            <input
              id="logo-upload"
              type="file"
              className="hidden"
              onChange={async e => {
                if (e.target.files && e.target.files[0]) {
                  await updateAuthUserLogo(USER_ID, e.target.files[0]);
                  await load();
                }
              }}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" value={info.fullName} onChange={e => setInfo({...info, fullName: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" value={info.email} onChange={e => setInfo({...info, email: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone number</label>
          <input type="tel" value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" value={info.city} onChange={e=>setInfo({...info, city:e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input type="text" value={info.country} onChange={e=>setInfo({...info, country:e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
          </div>
        </div>
        {/* Password change UI can be added here */}
        <div className="text-right">
          <button disabled={saving} onClick={handleSave} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60">
            <FaSave className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}

function WebsiteContentSettings() {
  const { fetchAuthUser, updateAuthUserDescriptions, updateAuthUserGalleryImage } = useApi();
  const [content, setContent] = useState({ aboutDescription1:'', aboutDescription2:'', aboutDescription3:'', aboutDescription4:'', galleryImages: [null,null,null,null,null] as (string|null)[] });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const user = await fetchAuthUser();
    if (user) {
      setContent({
        aboutDescription1: user.description1 || '',
        aboutDescription2: user.description2 || '',
        aboutDescription3: user.description3 || '',
        aboutDescription4: user.description4 || '',
        galleryImages: [user.image_url1 || null, user.image_url2 || null, user.image_url3 || null, user.image_url4 || null, user.image_url5 || null],
      });
    }
  };
  useEffect(()=>{ load(); },[]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAuthUserDescriptions(USER_ID, content.aboutDescription1, content.aboutDescription2, content.aboutDescription3, content.aboutDescription4);
      alert('Website content saved!');
    } finally { setSaving(false); }
  };

  const handleGalleryImageChange = async (index:number, file:File) => {
    await updateAuthUserGalleryImage(USER_ID, index+1, file); await load();
  };

  return (
    <SectionWrapper title="Manage Website Content">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mini description</label>
          <textarea rows={4} value={content.aboutDescription1} onChange={e => setContent({...content, aboutDescription1: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">About Section - Paragraph</label>
          <textarea rows={4} value={content.aboutDescription2} onChange={e => setContent({...content, aboutDescription2: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Footer Section - Paragraph 1</label>
          <textarea rows={4} value={content.aboutDescription3} onChange={e => setContent({...content, aboutDescription3: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Introduction Privacy Section</label>
          <textarea rows={4} value={content.aboutDescription4} onChange={e => setContent({...content, aboutDescription4: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image Gallery</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {content.galleryImages.map((img, index) => (
              <div key={index} className="relative group border rounded overflow-hidden h-32 flex items-center justify-center bg-gray-50">
                {img ? <img src={img} alt={`Gallery ${index+1}`} className="object-cover w-full h-full" /> : <div className="text-gray-400 text-xs">Slot {index+1}</div>}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white cursor-pointer transition">
                  {img ? 'Change' : 'Upload'}
                  <input type="file" className="hidden" onChange={e => e.target.files && handleGalleryImageChange(index, e.target.files[0])} />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right">
          <button disabled={saving} onClick={handleSave} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60">
            <FaSave className="mr-2" /> {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}


