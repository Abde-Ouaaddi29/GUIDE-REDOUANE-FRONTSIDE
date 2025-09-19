"use client"
import ReservationForm from '@/components/reservation/ReservationForm';
import { useParams } from 'next/navigation';
import React, { use } from 'react'

export default function page() {
    const {id} = useParams();
    console.log(id);
    return (
        <div className='py-32 px-6 bg-gray-100'>
            <ReservationForm service={id} />
        </div>
    );
}
