"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { FaCheckCircle, FaTrash, FaEyeSlash, FaStar, FaHourglassHalf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useApi from '@/hooks/useApi';
import { URL_SERVER } from '@/app/constants';

interface Feedback {
  id: number;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'approved' | 'deactivated';
  deleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

const AdminFeedbackPage = () => {
  const {
    getFeebacksFromAdmin,
    updateFeedbackStatus,
    deleteFeedback,
    loading,
    error,
  } = useApi();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'deactivated'>('all');

  // Fetch feedbacks from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeebacksFromAdmin()
        console.log('Fetched feedbacks:', data);
        setFeedbacks(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchData();
  }, []);

  // Update status via API
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const updated = await updateFeedbackStatus(id, newStatus.toUpperCase());
      setFeedbacks(prev =>
        prev.map(fb => (fb.id === id ? { ...fb, status: updated.status } : fb))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Delete via API
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this feedback?')) {
      try {
        await deleteFeedback(id);
        setFeedbacks(prev => prev.filter(fb => fb.id !== id));
      } catch (err) {
        alert('Failed to delete feedback');
      }
    }
  };

  // Memoized filtering
  const filteredFeedbacks = useMemo(() => {
    if (!Array.isArray(feedbacks)) return [];
    if (filter === 'all') return feedbacks;
    return feedbacks.filter(fb => fb.status && fb.status.toLowerCase() === filter);
  }, [filter, feedbacks]);

  const StatusBadge = ({ status }: { status: Feedback['status'] }) => {
    const statusConfig = {
      approved: { icon: <FaCheckCircle />, text: 'Approved', color: 'text-green-600 bg-green-100' },
      pending: { icon: <FaHourglassHalf />, text: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
      deactivated: { icon: <FaEyeSlash />, text: 'Deactivated', color: 'text-gray-600 bg-gray-100' },
    };
    const config = statusConfig[status] || { icon: <FaHourglassHalf />, text: 'Unknown', color: 'text-gray-400 bg-gray-100' };
    const { icon, text, color } = config;
    return (
      <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${color}`}>
        {icon}
        <span className="ml-1.5">{text}</span>
      </div>
    );
  };

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );

  if (loading) return <div className="text-center p-10">Loading feedback...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error.message || error.toString()}</div>;

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Customer Feedback</h1>
          <div className="text-sm text-gray-600">
            Total: {feedbacks.length} | Showing: {filteredFeedbacks.length}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-6">
          {(['all', 'pending', 'approved', 'deactivated'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 ${
                filter === f
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        <div className="grid gap-6">
          <AnimatePresence>
            {(filteredFeedbacks || []).map((feedback) => (
              <motion.div
                key={feedback.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feedback.fullName}</h3>
                      <p className="text-sm text-gray-500">{feedback.email}</p>
                      <p className="text-sm text-gray-500">{feedback.subject}</p>
                    </div>
                    <div className="flex items-center mt-2 sm:mt-0">
                      {/* If you want to show rating, add it to your backend and frontend */}
                      {/* <RatingStars rating={feedback.rating} /> */}
                      <span className="text-sm text-gray-500 ml-4">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{feedback.message}</p>
                  <div className="flex justify-between items-center">
                    {/* <StatusBadge status={feedback.status} /> */}
                    <div
                      className={`text-sm font-bold ${
                        feedback.status.toLowerCase() === 'approved'
                          ? 'text-green-600 bg-green-100 py-1 px-2 rounded-4xl'
                          : feedback.status.toLowerCase() === 'deactivated'
                          ? 'text-gray-600 bg-gray-100 py-1 px-2 rounded-4xl'
                          : 'text-orange-600 bg-orange-100 py-1 px-2 rounded-4xl'
                      }`}
                    >
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1).toLowerCase()}
                    </div>
                    <div className="flex items-center space-x-2">
                      {feedback.status.toLowerCase() !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(feedback.id, 'APPROVED')}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors"
                        >
                          <FaCheckCircle title="Approve" />
                        </button>
                      )}
                      {feedback.status.toLowerCase() !== 'deactivated' && (
                        <button
                          onClick={() => handleStatusChange(feedback.id, 'DEACTIVATED')}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <FaEyeSlash title="Deactivate" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(feedback.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                        <FaTrash title="Delete" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">No Feedback Found</h3>
            <p className="text-gray-500 mt-2">There is no feedback matching the "{filter}" filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackPage;