import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'
import React, { useState } from 'react'

function Index({ events }) {
    const [filter, setFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredEvents = events.filter(event => {
        const typeMatch = filter === 'all' || event.type === filter;
        const categoryMatch = categoryFilter === 'all' || event.category === categoryFilter;
        return typeMatch && categoryMatch;
    });

    const categories = Array.from(new Set(events.map(event => event.category)));

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
    };
    return (
        <AuthenticatedLayout>
            <Head title="Event & Lomba" />
            <div className="container mx-auto px-4 py-8">

                {/* Filters */}
                <div className="card bg-base-200 shadow-sm mb-8">
                    <div className="card-body">
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <div className='flex flex-row gap-4'>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Jenis:</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full max-w-xs"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option value="all">Semua</option>
                                        <option value="event">Event</option>
                                        <option value="competition">Lomba</option>
                                    </select>
                                </div>

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

                            {/* <Link href={route('events.create')} className='btn btn-primary mt-10'>Tambah Event</Link> */}
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
                                        src={`/public/${event.image}`}
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

                                <h2 className="card-title text-lg mb-2">{event.title}</h2>
                                <p className="text-sm text-base-content/70 mb-4 line-clamp-3">
                                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        {formatDate(event.start_date)}
                                    </div>

                                    {event.location && (
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            {event.location}
                                        </div>
                                    )}

                                    <div className="flex items-center text-sm">
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
                                    <div className='flex gap-2'>
                                        {/* <Link
                                            href={route('events.edit', event)}
                                            className="btn btn-warning btn-sm"
                                        >
                                            Edit
                                        </Link> */}
                                        <Link
                                            href={route('events.guest.detail', { event: event.id, slug: event.slug })}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Lihat Detail
                                        </Link>

                                    </div>
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
        </AuthenticatedLayout>
    )
}

export default Index