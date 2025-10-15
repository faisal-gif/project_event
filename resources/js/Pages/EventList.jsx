import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react'

function EventList({ events }) {

    const [filter, setFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredEvents = events.filter(event => {
        const typeMatch = filter === 'all' || event.type === filter;
        const categoryMatch = categoryFilter === 'all' || event.category.name === categoryFilter;
        return typeMatch && categoryMatch;
    });

    const categories = Array.from(new Set(events.map(event => event.category.name)));

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
        return <><span className="text-sm font-normal">Mulai dari</span> {formatPrice(min)}</>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    return (<>
        <Head title="Event List" />
        <GuestLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Daftar Event & Lomba</h1>
                    <p className="text-lg text-base-content/70">
                        Temukan event dan lomba menarik yang sesuai dengan minat Anda
                    </p>
                </div>

                {/* Filters */}
                <div className="card bg-base-200 shadow-sm mb-8 p-4">
                    <div className="flex flex-wrap gap-4 items-center">

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Kategori:</span>
                            </label>
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
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
                                    <div className={`badge ${event.type === 'competition' ? 'bg-[#3f154f]/60 py-3 text-white' : 'bg-[#7f0b1a]/60 text-white py-3'}`}>
                                        {event.type === 'competition' ? 'Competition' : 'Event'}
                                    </div>
                                    <div className="badge badge-outline py-3 capitalize">{event.category.name}</div>
                                </div>

                                <h2 className="card-title text-lg mb-2">{event.title}</h2>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        {formatDate(event.start_date)}
                                    </div>

                                    {event.location_details && (
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            {event.location_type}
                                        </div>
                                    )}

                                    <div className="flex items-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        {event.total_remaining_quota === 0
                                            ? 'Sold Out'
                                            : `${event.total_remaining_quota} / ${event.total_quota} tersisa`}
                                    </div>
                                </div>

                                <div className="card-actions justify-between items-center">
                                    <div className="text-xl font-bold text-primary">
                                        {formatPriceRange(event.price_range)}
                                    </div>
                                    <Link
                                         href={route('events.guest.detail', { event: event.id, slug: event.slug })}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Lihat Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold mb-2">Tidak ada event ditemukan</h3>
                        <p className="text-base-content/70">Coba ubah filter atau kembali lagi nanti</p>
                    </div>
                )}
            </div>
        </GuestLayout>
    </>
    )
}

export default EventList