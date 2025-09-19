import React from 'react';
import FormContact from '@/components/contact/formContact';

const ContactPage = () => {
   return (
        <div className='min-h-screen py-12'> {/* Ensures the page takes at least the full screen height */}
            {/* You can add a header or other introductory content here if needed */}
            <FormContact />
            {/* You can add a footer or other content here if needed */}
        </div>
    );
};

export default ContactPage;