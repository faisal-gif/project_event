import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { LocateIcon, LocationEdit, MapPin, Video } from 'lucide-react';
import React from 'react'

function Show({ event }) {



    if (!event) {
        return (
            <div className="min-h-screen bg-base-100">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Event Tidak Ditemukan</h1>
                    <Link href={route('events.index')} className="btn btn-primary">
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'unused':
                return <div className="badge badge-success">VALID</div>;
            case 'used':
                return <div className="badge badge-warning">DIGUNAKAN</div>;
            case 'expired':
                return <div className="badge badge-error">KADALUARSA</div>;
            default:
                return <div className="badge badge-ghost">UNKNOWN</div>;
        }
    };

    return (
        <>
            <Head title="Event" />
            <AuthenticatedLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-rows-1 gap-8">
                        {/* Main Content */}
                        <div>
                            <div className="card bg-base-100 shadow-xl">
                                <figure className="p-4">
                                    {event.image && event.image !== '' ? (
                                        <img
                                            src={`/storage/${event.image}`}
                                            alt={event.title}
                                            className="w-64 h-full object-cover rounded"
                                        />
                                    ) : (
                                        <img
                                            src={'https://picsum.photos/400/200'}
                                            alt={event.title}
                                            className="w-64 h-40 object-cover rounded"
                                        />
                                    )}
                                </figure>

                                <div className="card-body">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className="badge badge-outline badge-lg">{event.category.name}</div>
                                        {urgency === 'low' && (
                                            <div className="badge badge-error badge-lg">Hampir Penuh!</div>
                                        )}
                                    </div>

                                    <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

                                    <div className="prose prose-lg max-w-none mb-6 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description }} />

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

                                            {event.location_type && (
                                                <div className="flex items-center space-x-3">
                                                    {event.location_type === 'online' && (
                                                        <Video size={20} className="text-primary" />
                                                    )}
                                                    {event.location_type === 'offline' && (
                                                        <MapPin size={20} className="text-primary" />
                                                    )}
                                                    {event.location_type === 'hybrid' && (
                                                        <LocationEdit size={20} className="text-primary" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">Lokasi</p>
                                                        <p className="capitalize text-sm text-base-content/70">{ event.location_type}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {event.location_details && (
                                                <div className="flex items-center space-x-3">
                                                    <LocateIcon size={20} className="text-primary" />
                                                    <div>
                                                        <p className="font-medium">Detail Lokasi</p>
                                                        <p className="text-sm text-black/70">{event.location_details}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold">Informasi Tiket</h3>

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

                        <div className="card bg-base-200 shadow-sm mb-8">
                            <div className="card-body">
                                <h2 className="card-title mb-2">Pendaftar</h2>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th>Kode Ticket</th>
                                                <th>Nama Peserta</th>
                                                <th>Email Peserta</th>
                                                <th>Jumlah Tiket</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* row 1 */}
                                            {event.tickets.map((peserta) => (
                                                <tr>
                                                    <td>{peserta.ticket_code}</td>
                                                    <td>{peserta.user.name}</td>
                                                    <td>{peserta.user.email}</td>
                                                    <td>{peserta.quantity}</td>
                                                    <td>{getStatusBadge(peserta.status)}</td>
                                                    <td>
                                                        <div className='flex gap-2'>
                                                            <Link
                                                                href='#'
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                Use
                                                            </Link>

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}


                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    )
}

export default Show