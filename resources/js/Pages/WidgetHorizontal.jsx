import Carousel from '@/Components/ui/Carousel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

function WidgetHorizontal({ events }) {
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
        <>
            <Head title="Widget Event" />

            <div className='flex flex-col justify-center items-center gap-4'>
                <h1 className='text-2xl lg:text-4xl font-bold'>Bosan dengan rutinitas?</h1>
                <h4 className='text-sm lg:text-2xl'>Saatnya Pilih Event Seru yang Cocok untukmu!</h4>
                <Carousel opts={{ align: "start", loop: true }} className="w-full" plugins={[Autoplay()]}>
                    <Carousel.Content className="-ml-4">
                        {events.map((event) => (
                            <Carousel.Item
                                key={event.id}
                                className="pl-4 min-w-0 shrink-0 grow-0 basis-full sm:basis-1/3 lg:basis-1/4"
                            >
                                <div className="p-2 h-full">
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
                                                <div className={`badge ${event.type === 'competition' ? 'badge-neutral' : 'badge-primary'}`}>
                                                    {event.type === 'competition' ? 'Competition' : 'Event'}
                                                </div>
                                                <div className="badge badge-outline">{event.category}</div>
                                            </div>

                                            <h2 className="card-title text-sm mb-2 text-base-content">{event.title}</h2>
                                            <div className="space-y-2 mb-4 text-base-content">
                                                <div className="flex items-center text-xs">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    {formatDate(event.start_date)}
                                                </div>

                                                {event.location && (
                                                    <div className="flex items-center text-xs">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        </svg>
                                                        {event.location}
                                                    </div>
                                                )}

                                                <div className="flex items-center text-xs">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                                    </svg>
                                                    {event.remainingQuota} / {event.quota} tersisa
                                                </div>
                                            </div>

                                            <div className="card-actions justify-between items-center">
                                                <div className="text-xl font-bold text-primary">
                                                    {formatPrice(event.price)}
                                                </div>
                                                <Link
                                                    href={route('events.guest.detail', event)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel.Content>
                </Carousel>
            </div>
        </>
    )
}

export default WidgetHorizontal