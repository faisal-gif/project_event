import EventList from '@/Components/EventList';
import HeroSection from '@/Components/HeroSection';
import SideBarLeft from '@/Components/SideBarLeft';
import SideBarRight from '@/Components/SideBarRight';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Ticket, Shield, Award, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Welcome({ listEvents, headlines, populars, categories }) {
    const [selectedCategory, setSelectedCategory] = useState(1); // Default to ID 1 for "Semua"

    const filteredEvents = listEvents.filter(event => {
        if (selectedCategory === 1) { // "Semua"
            return true;
        }
        return event.category_id === selectedCategory;
    });

    return (
        <>
            <Head>
                <title>Home - Times Event</title>
                <meta name="description" content="TIMES Event" />
                <meta property="og:title" content="Home" />
                <meta property="og:description" content="TIMES Event" />
            </Head>
            <div className="bg-gray-50 text-gray-800 ">
                <GuestLayout>
                    <div className='flex flex-col lg:flex-row '>
                        <SideBarLeft setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} categories={categories} />
                        <HeroSection events={filteredEvents} headline={headlines} />
                        <SideBarRight />
                    </div>
                </GuestLayout>
            </div>
        </>
    );
}