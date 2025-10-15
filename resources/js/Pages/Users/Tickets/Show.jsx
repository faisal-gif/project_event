import FormAditionalQuestion from '@/Components/FormAditionalQuestion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react'

function Show({ ticket }) {

    if (!ticket) {
        return (
            <div className="min-h-screen bg-base-100">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Tiket Tidak Ditemukan</h1>
                    <Link href={route('events.user.index')} className="btn btn-primary">
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
        <GuestLayout>
            <Head title="Detail Tiket" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Ticket Card */}
                    <div className="card bg-base-100 shadow-2xl border">
                        <div className="card-body">
                            {/* Ticket Header */}
                            <div className="text-center border-b border-base-300 pb-6 mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-left">
                                        <h2 className="text-2xl font-bold">{ticket.event.title}</h2>
                                        <p className="text-base-content/70">ID Tiket: {ticket.ticket_code}</p>
                                    </div>
                                    {getStatusBadge(ticket.status)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Ticket Information */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold mb-4">Informasi Tiket</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-base-content/70">Nama Pemegang</label>
                                            <p className="font-medium">{ticket.user.name}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-base-content/70">Email</label>
                                            <p className="font-medium">{ticket.user.email}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-base-content/70">Tanggal Pembelian</label>
                                            <p className="font-medium">{formatDate(ticket.transaction.paid_at)}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-base-content/70">Jenis Tiket</label>
                                            <p className="font-medium">{ticket.transaction.ticket_type.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-base-content/70">Harga Satuan</label>
                                            <p className="font-medium text-primary text-lg">{formatPrice(ticket.transaction.ticket_type.price)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-base-content/70">Quantity</label>
                                            <p className="font-medium text-primary text-lg">{ticket.quantity}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-base-content/70">Total</label>
                                            <p className="font-medium text-primary text-lg">{formatPrice(ticket.transaction.subtotal)}</p>
                                        </div>
                                    </div>

                                    {/* Event Information */}
                                    <div className="pt-4 border-t border-base-300">
                                        <h4 className="font-semibold mb-3">Informasi Event</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                {formatDate(ticket.event.start_date)}
                                            </div>
                                            {ticket.event.location_type == 'online' && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                    {ticket.event.location_type}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Conditional Rendering: Submission Form or QR Code */}
                                {ticket.event.event_submission_fields && ticket.event.event_submission_fields.length > 0 ? (
                                    // This event requires submission
                                    ticket.status === 'unused' ? (
                                        <FormAditionalQuestion ticket={ticket} fields={ticket.event.event_submission_fields} />
                                    ) : (
                                        <div className="text-center p-6 bg-base-200 rounded-lg flex flex-col items-center justify-center h-full">
                                            <h3 className="text-xl font-semibold mb-4">Submission Selesai</h3>
                                            <p className="text-base-content/70">
                                                Anda telah menyelesaikan submission untuk event ini. Terima kasih.
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    // Standard event: Show QR Code
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold mb-4">QR Code Tiket</h3>
                                        <div className="bg-white p-6 rounded-lg border-2 border-dashed border-base-300 inline-block">
                                            {ticket.qr_image ? (
                                                <img
                                                    src={`/storage/${ticket.qr_image}`}
                                                    alt="QR Code Tiket"
                                                    className="mx-auto"
                                                />
                                            ) : (
                                                <div className="w-48 h-48 flex items-center justify-center">
                                                    <span className="loading loading-spinner loading-lg"></span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-base-content/70 mt-4">
                                            Tunjukkan QR Code ini kepada panitia saat masuk event.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Important Notes */}
                            <div className="bg-base-200 rounded-lg p-4 mt-6">
                                <h4 className="font-semibold mb-2 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Penting untuk Diperhatikan
                                </h4>
                                {ticket.event.event_submission_fields && ticket.event.event_submission_fields.length > 0 ? (
                                    <ul className="text-sm space-y-1 text-base-content/70">
                                        <li>• Pastikan Anda mengisi semua data yang diperlukan pada form submission.</li>
                                        <li>• Setelah data dikirim, status tiket akan berubah menjadi "Digunakan" dan tidak dapat diubah.</li>
                                        <li>• Pengumuman lebih lanjut akan diinformasikan melalui sistem atau media sosial kami.</li>
                                    </ul>
                                ) : (
                                    <ul className="text-sm space-y-1 text-base-content/70">
                                        <li>• Simpan tiket ini dengan baik sampai hari H.</li>
                                        <li>• QR Code hanya dapat digunakan sekali untuk check-in.</li>
                                        <li>• Bawa identitas diri yang sesuai dengan nama pemegang tiket.</li>
                                    </ul>
                                )}

                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    onClick={() => window.print()}
                                    className="btn btn-outline flex-1"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Cetak Tiket
                                </button>

                                <Link href={route('events.guest')} className="btn btn-primary flex-1">
                                    Lihat Event Lainnya
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>

    )
}

export default Show