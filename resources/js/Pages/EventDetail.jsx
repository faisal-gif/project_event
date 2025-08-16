import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

function EventDetail({ event }) {

    if (!event) {
        return (
            <div className="min-h-screen bg-base-100">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Event Tidak Ditemukan</h1>
                    <Link to="/guest/events" className="btn btn-primary">
                        Kembali ke Daftar Event
                    </Link>
                </div>
            </div>
        );
    }

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

    const isEventFull = event.remainingQuota === 0;
    const urgency = event.remainingQuota <= 10 ? 'low' : event.remainingQuota <= 50 ? 'medium' : 'high';


    return (
        <>
            <Head title="Event" />
            <GuestLayout>
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <div className="text-sm breadcrumbs mb-6">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/events">Event</Link></li>
                            <li>{event.title}</li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="card bg-base-100 shadow-xl">
                                <figure>
                                    {event.image && event.image !== '' ? (
                                        <img
                                            src={`/storage/${event.image}`}
                                            alt={event.title}
                                            className='w-full' />
                                    ) : (
                                        <img
                                            src={'https://picsum.photos/400/200'}
                                            alt={event.title}
                                            className='w-full' />
                                    )
                                    }
                                </figure>

                                <div className="card-body">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className={`badge ${event.type === 'lomba' ? 'badge-secondary' : 'badge-primary'} badge-lg`}>
                                            {event.type === 'lomba' ? 'Lomba' : 'Event'}
                                        </div>
                                        <div className="badge badge-outline badge-lg">{event.category}</div>
                                        {urgency === 'low' && (
                                            <div className="badge badge-error badge-lg">Hampir Penuh!</div>
                                        )}
                                    </div>

                                    <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                                    <div className="prose prose-lg max-w-none mb-6 text-lg leading-relaxed"  dangerouslySetInnerHTML={{ __html: event.description }} />
                                    
                                    {/* Event Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold">Detail Event</h3>

                                            <div className="flex items-start space-x-3">
                                                <svg className="w-5 h-5 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <div>
                                                    <p className="font-medium">Tanggal Mulai</p>
                                                    <p className="text-sm text-base-content/70">{formatDate(event.start_date)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <svg className="w-5 h-5 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <div>
                                                    <p className="font-medium">Tanggal Selesai</p>
                                                    <p className="text-sm text-base-content/70">{formatDate(event.end_date)}</p>
                                                </div>
                                            </div>

                                            {event.location && (
                                                <div className="flex items-start space-x-3">
                                                    <svg className="w-5 h-5 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                    <div>
                                                        <p className="font-medium">Lokasi</p>
                                                        <p className="text-sm text-base-content/70">{event.location}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold">Informasi Event</h3>

                                            <div className="bg-base-200 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium">Harga Tiket</span>
                                                    <span className="text-2xl font-bold text-primary">{formatPrice(event.price)}</span>
                                                </div>

                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium">Kuota Total</span>
                                                    <span>{event.quota} orang</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Sisa Kuota</span>
                                                    <span className={`font-bold ${urgency === 'low' ? 'text-error' : urgency === 'medium' ? 'text-warning' : 'text-success'}`}>
                                                        {event.remainingQuota} orang
                                                    </span>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>Terisi</span>
                                                        <span>{Math.round(((event.quota - event.remainingQuota) / event.quota) * 100)}%</span>
                                                    </div>
                                                    <progress
                                                        className={`progress w-full ${urgency === 'low' ? 'progress-error' : urgency === 'medium' ? 'progress-warning' : 'progress-success'}`}
                                                        value={event.quota - event.remainingQuota}
                                                        max={event.quota}
                                                    ></progress>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="card bg-base-100 shadow-xl sticky top-8">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold mb-4">Daftar Event</h3>

                                    <div className="space-y-4">
                                        <div className="bg-base-200 rounded-lg p-4">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-primary mb-1">
                                                    {formatPrice(event.price)}
                                                </div>
                                                <div className="text-sm text-base-content/70">per tiket</div>
                                            </div>
                                        </div>

                                        {urgency === 'low' && (
                                            <div className="alert alert-warning">
                                                <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <span className="text-sm">Hanya tersisa {event.remainingQuota} tiket!</span>
                                            </div>
                                        )}

                                        {isEventFull ? (
                                            <button className="btn btn-disabled w-full">
                                                Tiket Habis
                                            </button>
                                        ) : (
                                            <Link href={route("transactions.checkout", event)} className="btn btn-primary w-full btn-lg">
                                                Daftar
                                            </Link>
                                        )}

                                        <div className="text-center">
                                            <Link href={route('events.guest')} className="btn btn-ghost btn-sm">
                                                ← Kembali ke Daftar Event
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </>
    )
}

export default EventDetail