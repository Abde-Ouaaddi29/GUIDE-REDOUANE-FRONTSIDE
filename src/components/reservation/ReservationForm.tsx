"use client"
import React, { useState, useEffect } from 'react';
import useApi from '@/hooks/useApi';
import { URL_SERVER } from '@/app/constants';
import { MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import { motion, AnimatePresence, Variants } from 'framer-motion';
import ReservationConfirmation from './ReservationConfirmation';

// New country option type
interface CountryOption {
  value: string;
  label: string;
}

interface ServiceOption {
    id: number; // backend id (services_content.id)
    value: string; // slug or derived
    label: string;
}

// Will be fetched from backend instead of hardcoding; start empty.
// const services: ServiceOption[] = [...];

interface ReservationDataPayload {
    name: string;
    email: string;
    phone: string;
    country: string;
    selectedService: string; // service value slug
    date: string;
    guests: number;
    message: string;
}

interface ReservationFormProps {
  service?: string | string[];
}

// Animation Variants
const formContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren", // Ensure container animates before children
      staggerChildren: 0.1, // Stagger children animations
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const formItemVariants: Variants = { // Add Variants type annotation here
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const titleVariants: Variants = { // Also add Variants type annotation here for consistency and future-proofing
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.1 } },
};

const buttonVariants: Variants = { // And here
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

const confirmationVariants: Variants = { // Add Variants type annotation here
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
  exit: { opacity: 0, scale: 0.8, y: -30, transition: { duration: 0.3 } }
};

const errorVariants: Variants = { // And here
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: 'auto', marginBottom: '1rem', transition: { duration: 0.3 } },
  exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.2 } }
}



const ReservationForm = ({ service: serviceIdFromUrl }: ReservationFormProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [services, setServices] = useState<ServiceOption[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [message, setMessage] = useState('');
    const [submittedData, setSubmittedData] = useState<ReservationDataPayload | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [countriesLoading, setCountriesLoading] = useState(true);
    const [countriesError, setCountriesError] = useState<string | null>(null);
    const api = useApi();

    // Fetch countries once
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setCountriesLoading(true);
                // Using restcountries (light fields)
                const resp = await fetch('https://restcountries.com/v3.1/all?fields=name');
                if (!resp.ok) throw new Error('Failed to load countries');
                const data = await resp.json();
                const mapped: CountryOption[] = data
                  .map((c: any) => c?.name?.common)
                  .filter((n: string) => typeof n === 'string')
                  .sort((a: string, b: string) => a.localeCompare(b))
                  .map((n: string) => ({ value: n, label: n }));
                if (!cancelled) setCountries(mapped);
            } catch (e:any) {
                if (!cancelled) {
                  setCountriesError(e.message || 'Could not load countries.');
                  // Minimal fallback list (optional)
                  setCountries([
                    { value: 'Morocco', label: 'Morocco' },
                    { value: 'France', label: 'France' },
                    { value: 'United States', label: 'United States' },
                  ]);
                }
            } finally {
                if (!cancelled) setCountriesLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Fetch services (public) once for id mapping
    useEffect(() => {
        (async ()=>{
            try {
                // Basic fetch of first 100 services (adjust per pagination impl)
                const resp = await fetch(`${URL_SERVER}/api/v1/services`).catch(()=>null);
                if (resp && resp.ok) {
                    const json = await resp.json();
                    const raw = Array.isArray(json) ? json : (json.data || []);
                    const mapped:ServiceOption[] = raw.map((s:any)=>({
                        id: s.id,
                        value: s.service_name?.toLowerCase().replace(/\s+/g,'_') || String(s.id),
                        label: s.service_name || `Service #${s.id}`
                    }));
                    setServices(mapped);
                } else {
                    // fallback minimal choices if API fails
                    setServices([]);
                }
            } catch(e){ setServices([]); }
            finally { setServicesLoading(false); }
        })();
    }, []);

    useEffect(() => {
        if (serviceIdFromUrl) {
            const idString = Array.isArray(serviceIdFromUrl) ? serviceIdFromUrl[0] : serviceIdFromUrl;
            const numericId = parseInt(idString, 10);

            if (!isNaN(numericId)) {
                const serviceToSelect = services.find(s => s.id === numericId);
                if (serviceToSelect) {
                    setSelectedService(serviceToSelect.value);
                } else {
                    console.warn(`Service with ID ${numericId} not found.`);
                    setSelectedService('');
                }
            } else {
                console.warn(`Invalid service ID from URL: ${idString}`);
                setSelectedService('');
            }
        } else {
            setSelectedService('');
        }
    }, [serviceIdFromUrl, services]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Important: Keep this to prevent default form submission
        setIsSubmitting(true);
        setSubmissionError(null);

                const reservationData: ReservationDataPayload = {
                        name, email, phone, country, selectedService, date, guests: Number(guests), message
                };

        try {
                        const serviceId = services.find(s => s.value === selectedService)?.id;
                        if (!serviceId) throw new Error('Invalid service selected');
                        await api.postReservation({
                            name,
                            email,
                            phone,
                            country,
                            selectedService: serviceId,
                            date,
                            guests: Number(guests),
                            message,
                        } as any);
            setSubmittedData(reservationData);
            // Clear form fields
            setName(''); setEmail(''); setPhone(''); setCountry('');
            setSelectedService(serviceIdFromUrl ? (services.find(s => s.id === parseInt(Array.isArray(serviceIdFromUrl) ? serviceIdFromUrl[0] : serviceIdFromUrl, 10))?.value || '') : '');
            setDate(''); setGuests(1); setMessage('');
        } catch (error:any) {
            console.error("Reservation submission error:", error);
            if (error?.message?.toLowerCase().includes('service id')) {
                setSubmissionError('Selected service is invalid. Please choose another.');
            } else {
                setSubmissionError(error?.message || 'Failed to submit reservation. Please try again.');
            }
            setSubmittedData(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div // Main container for the whole form section
            className="max-w-3xl mx-auto p-6 md:p-8 bg-white shadow-xl rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="flex justify-center items-center mb-8"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
            >
               <span className='text-3xl font-bold text-center text-gray-800'>Book your tour</span>
               <motion.span
                    key={submittedData ? 'submitted' : 'pending'}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
               >
                   {submittedData ? <MdBookmarkAdded className='w-6 h-6 text-green-500 ml-2' /> : <MdBookmarkAdd className='w-6 h-6 text-pink-500 ml-2' /> }
               </motion.span>
            </motion.div>

            <AnimatePresence mode="wait">
                {submissionError && !submittedData && (
                    <motion.div
                        key="error"
                        className="p-3 bg-red-100 text-red-700 border border-red-400 rounded"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        Error: {submissionError}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {!submittedData ? (
                    <motion.form // Changed from custom Form to motion.form
                        key="reservationForm"
                        onSubmit={handleSubmit}
                        variants={formContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6" // Added space-y-6 here for consistent spacing
                    >
                        {/* Name Input */}
                        <motion.div className='mb-4' variants={formItemVariants}>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)}
                                required disabled={isSubmitting}
                                className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
                                placeholder="e.g., John Doe"
                            />
                        </motion.div>

                        {/* Email and Phone Grid */}
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4" variants={formItemVariants}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    required disabled={isSubmitting}
                                    className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                                    required disabled={isSubmitting}
                                    className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
                                    placeholder="e.g., +1 123 456 7890"
                                />
                            </div>
                        </motion.div>

                        {/* Country Select */}
                        <motion.div className='mb-4' variants={formItemVariants}>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <select
                                id="country"
                                name="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                                disabled={isSubmitting || countriesLoading}
                                className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-300 focus:border-pink-300 sm:text-sm bg-white"
                            >
                                <option value="" disabled>
                                  {countriesLoading ? 'Loading countries...' : 'Select your country'}
                                </option>
                                {!countriesLoading && countries.map(c => (
                                  <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                            {countriesError && (
                              <p className="mt-1 text-xs text-red-500">
                                {countriesError} (using fallback list)
                              </p>
                            )}
                        </motion.div>
                        
                        {/* Preferred Date Input */}
                        <motion.div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-4" variants={formItemVariants}>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                                <input type="date" id="date" name="date" value={date} onChange={(e) => setDate(e.target.value)}
                                    required disabled={isSubmitting}
                                    className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
                                />
                            </div>
                        </motion.div>

                        {/* Guests and Service Grid */}
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4" variants={formItemVariants}>
                            <div>
                                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                                <input type="number" id="guests" name="guests" value={Number.isNaN(guests) ? '' : guests} onChange={(e) => {
                                    const v = e.target.value;
                                    if (v === '') { setGuests(1); return; }
                                    const n = parseInt(v,10);
                                    if (!Number.isNaN(n)) setGuests(n < 1 ? 1 : n);
                                }}
                                    min="1" required disabled={isSubmitting}
                                    className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service of Interest</label>
                                <select id="service" name="service" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
                                    required disabled={isSubmitting}
                                    className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-300 focus:border-pink-300 sm:text-sm bg-white"
                                >
                                    <option value="" disabled>Select a service</option>
                                    {servicesLoading && <option disabled value="">Loading services...</option>}
                                    {!servicesLoading && services.length === 0 && <option disabled value="">No services available</option>}
                                    {services.map((s) => (<option key={s.id} value={s.value}>{s.label}</option>))}
                                </select>
                            </div>
                        </motion.div>

                        {/* Message Textarea */}
                        <motion.div className='mb-4' variants={formItemVariants}>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                            <textarea id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)}
                                rows={4} disabled={isSubmitting}
                                className="outline-1 outline-gray-200 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-300 focus:border-pink-300 sm:text-sm"
                                placeholder="Any special requests or additional information..."
                            />
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
                            </button>
                        </motion.div>
                    </motion.form>
                ) : (
                    <ReservationConfirmation key="confirmation" data={submittedData} services={services} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ReservationForm;