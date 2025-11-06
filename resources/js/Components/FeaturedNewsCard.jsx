
import React from 'react'
import Card from './ui/Card';
import { MessageCircle, Eye, Heart } from "lucide-react";
import { Link } from '@inertiajs/react';

function FeaturedNewsCard({
    event,
    className = ""
}) {

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return (
        <Link href={route('events.guest.detail', { event: event.id, slug: event.slug })}>
            <Card className={` group relative h-60 w-full cursor-pointer overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-300 hover:shadow-2xl lg:h-[29rem] ${className}`}>
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                    style={{ backgroundImage: `url(/storage/${event.image})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative flex h-full transform flex-col justify-end p-6 text-white transition-transform duration-500 ease-in-out group-hover:-translate-y-2">
                    <h1 className="mb-4 text-lg font-bold leading-tight transition-colors group-hover:text-primary-foreground lg:text-3xl">
                        {event.title}
                    </h1>

                    <div className="space-y-2 mb-4 text-base-content">
                        {event.start_date && event.end_date && (
                            <div className="flex items-center text-sm text-white">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {formatDate(event.start_date)}
                            </div>
                        )}

                        {event.location && (
                            <div className="flex items-center text-sm text-white">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                {event.location}
                            </div>
                        )}

                        <div className="flex items-center text-sm text-white">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            {event.total_remaining_quota === 0
                                ? 'Sold Out'
                                : `${event.total_remaining_quota} / ${event.total_quota} tersisa`}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default FeaturedNewsCard