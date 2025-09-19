"use client"
import React, { useState } from 'react';
import FeedbackForm from '../../components/home/feedback/FeedbackForm';

const FeedbackPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        We Value Your Feedback
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Help us improve our services by sharing your experience. 
                        Your feedback helps us provide better tours for future travelers.
                    </p>
                </div>
                
                <FeedbackForm />
            </div>
        </div>
    );
};

export default FeedbackPage;