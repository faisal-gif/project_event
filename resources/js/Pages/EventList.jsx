import Card from '@/Components/ui/Card';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, MapPin, Users } from 'lucide-react';
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
            <div className="max-w-7xl mx-auto px-4 py-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start gap-6">
                    {filteredEvents.map((event) => (
                        <Link
                            href={route('events.guest.detail', { event: event.id, slug: event.slug })}

                        >
                            <Card key={event.id} className="bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
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
                                        <div className="badge badge-primary badge-outline py-3 capitalize">{event.category.name}</div>
                                    </div>

                                    <h2 className="card-title text-lg mb-2">{event.title}</h2>

                                    <div className="space-y-2 mb-4">
                                        {event.start_date && event.end_date && (
                                            <div className="flex items-center text-sm">
                                              <Calendar className='w-4 h-4 shrink-0 mr-2' />
                                                {formatDate(event.start_date)}
                                            </div>
                                        )}

                                        {event.location_details && (
                                            <div className="flex items-center text-sm ">
                                                <MapPin className='w-4 h-4 shrink-0 mr-2' />
                                                {event.location_details}
                                            </div>
                                        )}

                                        <div className="flex items-center text-sm">
                                            <Users className='w-4 h-4 shrink-0 mr-2' />
                                            {event.total_remaining_quota === 0
                                                ? 'Sold Out'
                                                : `${event.total_remaining_quota} / ${event.total_quota} tersisa`}
                                        </div>
                                    </div>

                                    <div className="card-actions justify-between items-center">
                                        <div className="text-xl font-bold text-primary">
                                            {formatPriceRange(event.price_range)}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
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