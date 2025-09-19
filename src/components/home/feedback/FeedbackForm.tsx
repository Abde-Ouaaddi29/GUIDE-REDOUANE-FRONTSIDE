"use client"
import React, { useState } from 'react';
import useApi, { FeedbackData } from '@/hooks/useApi';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

interface FeedbackFormProps {
  onSubmit?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    const { createFeedback } = useApi();

    console.log('FeedbackForm rendered');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting feedback:', { fullName, email, subject, message });
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmitMessage('');

        try {
            const feedbackData: FeedbackData = {
                fullName,
                email,
                subject,
                message
            };

            const response = await createFeedback(feedbackData);
            
            if (response.success) {
                console.error(response.success);
                setSubmitStatus('success');
                setSubmitMessage(response.message || 'Feedback submitted successfully!');
                
                // Reset form
                setFullName('');
                setEmail('');
                setSubject('');
                setMessage('');

                // Call parent's onSubmit if provided
                if (onSubmit) {
                    onSubmit();
                }
            } else {
                throw new Error(response.message || 'Failed to submit feedback');
            }
        } catch (error: any) {
            console.error('Error submitting feedback:', error);
            setSubmitStatus('error');
            setSubmitMessage(error.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Experience</h2>
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <p className="text-green-700">{submitMessage}</p>
                </div>
            )}
            
            {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-3" />
                    <p className="text-red-700">{submitMessage}</p>
                </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name Input */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                        placeholder="Your full name"
                    />
                </div>

                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                        placeholder="your@email.com"
                    />
                </div>

                {/* Subject Input */}
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                    </label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                        placeholder="What is your feedback about?"
                    />
                </div>

                {/* Message Textarea */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message *
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={isSubmitting}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                        placeholder="Tell us about your experience, suggestions, or any concerns..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <>
                            <FaSpinner className="animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Feedback'
                    )}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                    * Required fields. We'll get back to you within 24-48 hours.
                </p>
            </form>
        </div>
    );
};

export default FeedbackForm;