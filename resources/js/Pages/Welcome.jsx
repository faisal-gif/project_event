import EventList from '@/Components/EventList';
import HeroSection from '@/Components/HeroSection';
import SideBarLeft from '@/Components/SideBarLeft';
import SideBarRight from '@/Components/SideBarRight';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Ticket, Shield, Award, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Welcome({ listEvents, headlines, populars }) {
    const [selectedCategory, setSelectedCategory] = useState(1); // Default to ID 1 for "Semua"

    const filteredEvents = listEvents.filter(event => {
        if (selectedCategory === 1) { // "Semua"
            return true;
        }
        if (selectedCategory === 2) { // "Training & Workshop"
            return event.category === 'workshop' || event.category === 'webinar';
        }
        if (selectedCategory === 6) { // "Kontes & Olahraga"
            return event.category === 'lomba';
        }
        // No direct mapping for other category IDs from sidebar to data
        return false;
    });

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-gray-800">
                <GuestLayout>
                    <div className='flex flex-col lg:flex-row'>
                        <SideBarLeft setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
                        <HeroSection events={filteredEvents} headline={headlines} />
                        <SideBarRight />
                    </div>
                </GuestLayout>
            </div>
        </>
    );
}