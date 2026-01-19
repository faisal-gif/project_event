import React from 'react'
import { Link } from '@inertiajs/react';
import FeaturedNewsCard from './FeaturedNewsCard';
import Carousel from './ui/Carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import HeadlineEvents from './HeadlineEvents';

function HeroSection({ events, headline }) {

    const formatPrice = (price) => {
        if (price === 0) return 'Gratis';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatPriceRange = (range) => {
        if (!range || range.length === 0) return "N/A";
        const [min, max] = range;

        if (min === max) {
            return formatPrice(min);
        }
        return <>{formatPrice(min)}</>;
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
        <div className="w-full  col-span-2 mx-auto py-4">
            <div className='flex flex-col gap-8'>
                <HeadlineEvents listHeadline={headline} />

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 px-4">
                    Event <span className="text-primary">Akan Datang</span>
                </h2>
                {events.length === 0 && (
                    <div className="max-w-7xl mx-auto py-4 px-4">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-4xl font-bold text-center">
                                Event
                            </h1>
                            <p className="text-lg text-center text-gray-500">
                                Tidak ada event yang tersedia.
                            </p>
                        </div>
                    </div>
                )}
                {events.length !== 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                        {events.map((event) => (
                            <Link
                                href={route('events.guest.detail', { event: event.id, slug: event.slug })} >
                                <div key={event.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                    <figure className="w-full h-48 bg-base-200 flex items-center justify-center overflow-hidden">
                                        {event.image && event.image !== '' ? (
                                            <img
                                                src={`/storage/${event.image}`}
                                                alt={event.title}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <img
                                                src={'https://picsum.photos/400/200'}
                                                alt={event.title}
                                                className="object-cover w-full h-full"
                                            />
                                        )
                                        }
                                    </figure>
                                    <div className="card-body">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="badge badge-primary">{event.category.name}</div>
                                        </div>

                                        <h2 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h2>
                                        <div className="space-y-2 text-base-content">
                                            {event.start_date && event.end_date && (
                                                <div className="flex items-center text-sm">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    {formatDate(event.start_date)}
                                                </div>
                                            )}

                                            {event.location_type && (
                                                <div className="flex items-center text-sm">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                    {event.location_type}
                                                </div>
                                            )}

                                         
                                        </div>

                                        <div className="card-actions justify-between items-center">
                                            <div className="text-xl font-bold text-primary">
                                                {formatPriceRange(event.price_range)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeroSection