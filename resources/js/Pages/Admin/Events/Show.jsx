import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import Card from '@/Components/ui/Card';
import { QrCode as QrCodeIcon } from 'lucide-react';
import Modal from '@/Components/Modal'; // Assuming you have a Modal component
import QrCode from '@/Components/QrCode';

// Helper functions
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'unused':
            return <div className="badge badge-success">VALID</div>;
        case 'used':
            return <div className="badge badge-warning">USED</div>;
        case 'expired':
            return <div className="badge badge-error">EXPIRED</div>;
        default:
            return <div className="badge badge-ghost">UNKNOWN</div>;
    }
};

function Show({ event }) {
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isSubmissionModalOpen, setSubmissionModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    // --- PERUBAHAN 1: Ganti nama state ---
    const [isScannerModalOpen, setScannerModalOpen] = useState(false);

    const handleScanSuccess = (decodedText) => {
        // --- PERUBAHAN 2: Tutup modal scanner ---
        setScannerModalOpen(false);
        Swal.fire({
            title: 'QR Code Scanned!',
            text: decodedText,
            icon: 'success',
        });
    };

    if (!event) {
        return (
            <AuthenticatedLayout>
                <div className="text-center p-16">Event not found.</div>
            </AuthenticatedLayout>
        );
    }

    const openDetailModal = (ticket) => {
        setSelectedTicket(ticket);
        setDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setDetailModalOpen(false);
        setSelectedTicket(null);
    };

    const openSubmissionModal = (ticket) => {
        setSelectedTicket(ticket);
        setSubmissionModalOpen(true);
    };

    const closeSubmissionModal = () => {
        // --- PERBAIKAN BUG: Seharusnya menutup submission modal, bukan detail ---
        setSubmissionModalOpen(false);
        setSelectedTicket(null);
    };

    // --- PERUBAHAN 3: Tambah fungsi untuk tutup modal scanner ---
    const closeScannerModal = () => {
        setScannerModalOpen(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`View Event: ${event.title}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* ... (Event Details Card & Ticket Info Card - tidak ada perubahan) ... */}
                    <div className='grid md:grid-cols-5 gap-4'>
                        <Card className={'h-[50vw] md:col-span-2'}>
                            <img src={`/storage/${event.image}`} alt={event.title} className="w-full h-full object-contain rounded" />
                        </Card>

                        <div className='flex flex-col gap-4 md:col-span-3'>
                            {/* Event Details Card */}
                            <Card className="bg-base-100 shadow-xl ">
                                <div className="card-body">
                                    <div className="badge badge-outline badge-lg">{event.category.name}</div>
                                    <h1 className="text-3xl font-bold my-4">{event.title}</h1>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                                    <div className="divider"></div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold">Event Details</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start">
                                                    <div className="font-semibold w-32">Start Date</div>
                                                    <div className="flex-1">: {formatDate(event.start_date)}</div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="font-semibold w-32">End Date</div>
                                                    <div className="flex-1">: {formatDate(event.end_date)}</div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="font-semibold w-32">Location Type</div>
                                                    <div className="flex-1 capitalize">: {event.location_type}</div>
                                                </div>
                                                {event.location_details && (
                                                    <div className="flex items-start">
                                                        <div className="font-semibold w-32">Details</div>
                                                        <div className="flex-1">: {event.location_details}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className={'bg-base-100 shadow-xl p-6'}>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Ticket Information</h3>
                                    {event.ticket_types && event.ticket_types.length > 0 ? (
                                        <ul className="space-y-3">
                                            {event.ticket_types.map(ticketType => (
                                                <li key={ticketType.id} className="p-3 bg-base-200 rounded-lg flex justify-between items-center">
                                                    <div>
                                                        <span className="font-semibold">{ticketType.name}</span>
                                                        <p className='text-xs'>{ticketType.description}</p>
                                                        <div className="text-sm text-gray-500">Quota: {ticketType.quota}</div>
                                                        <div className="flex items-start">
                                                            <span className="flex-1 text-xs">{formatDate(ticketType.purchase_date)} - {formatDate(ticketType.end_purchase_date)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-lg">{formatPrice(ticketType.price)}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No ticket types configured for this event.</p>
                                    )}
                                    <div className="divider my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Max Tickets per User</span>
                                        <span className="font-bold">{event.limit_ticket_user}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Participants Card */}
                    <Card className="bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className='flex justify-between items-start'>
                                <h2 className="card-title mb-4">Participants</h2>
                                {/* --- PERUBAHAN 4: Update onClick button --- */}
                                <button onClick={() => setScannerModalOpen(true)} className="btn btn-sm btn-primary"><QrCodeIcon size={16} className="mr-1" /> Scan QR</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Ticket Code</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {event.tickets && event.tickets.length > 0 ? (
                                            event.tickets.map((ticket) => (
                                                <tr key={ticket.id}>
                                                    <td>{ticket.ticket_code}</td>
                                                    <td>{ticket.user.name}</td>
                                                    <td>{ticket.user.email}</td>
                                                    <td>{getStatusBadge(ticket.status)}</td>
                                                    <td className="space-x-2">
                                                        <button onClick={() => openDetailModal(ticket)} className="btn btn-sm btn-info">Detail</button>
                                                        {event.needs_submission && (
                                                            <button onClick={() => openSubmissionModal(ticket)} className="btn btn-sm btn-accent">Submission</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="5" className="text-center">No participants yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Detail Modal */}
            <Modal show={isDetailModalOpen} onClose={closeDetailModal}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Participant Details</h2>
                    {selectedTicket ? (
                        <>
                            {selectedTicket.detail_pendaftar && (
                                <div className="space-y-3 pb-4 border-b mb-4">
                                    <div className="flex">
                                        <div className="font-semibold w-32">Name</div>
                                        <div>: {selectedTicket.detail_pendaftar.nama}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold w-32">Email</div>
                                        <div>: {selectedTicket.detail_pendaftar.email}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold w-32">Phone</div>
                                        <div>: {selectedTicket.detail_pendaftar.no_hp}</div>
                                    </div>
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">Additional Questions</h3>
                            {selectedTicket.event_field_responses && selectedTicket.event_field_responses.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedTicket.event_field_responses.map(response => (
                                        <div key={response.id} className="flex">
                                            <div className="font-semibold w-32 capitalize">{response.field_name.replace(/_/g, ' ')}</div>
                                            <div>: {response.field_value}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No additional questions answered.</p>
                            )}
                        </>
                    ) : (
                        <p>Details not available.</p>
                    )}
                    <div className="mt-6 flex justify-end">
                        <button onClick={closeDetailModal} className="btn">Close</button>
                    </div>
                </div>
            </Modal>

            {/* Submission Modal */}
            <Modal show={isSubmissionModalOpen} onClose={closeSubmissionModal}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Participant Details</h2>
                    {selectedTicket ? (
                        <>
                            {selectedTicket.detail_pendaftar && (
                                <div className="space-y-3 pb-4 border-b mb-4">
                                    <div className="flex">
                                        <div className="font-semibold w-32">Name</div>
                                        <div>: {selectedTicket.detail_pendaftar.nama}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold w-32">Email</div>
                                        <div>: {selectedTicket.detail_pendaftar.email}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold w-32">Phone</div>
                                        <div>: {selectedTicket.detail_pendaftar.no_hp}</div>
                                    </div>
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-2">Jawaban Pendaftar</h3>
                            {selectedTicket.submission && selectedTicket.submission.submission_custom_fields && selectedTicket.submission.submission_custom_fields.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedTicket.submission.submission_custom_fields.map(response => (
                                        <div key={response.id} className="flex">
                                            <div className="font-semibold w-32 capitalize">{response.field_name.replace(/_/g, ' ')}</div>
                                            <div>: {response.field_value}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No additional questions answered.</p>
                            )}
                        </>
                    ) : (
                        <p>Details not available.</p>
                    )}
                    <div className="mt-6 flex justify-end">
                        <button onClick={closeSubmissionModal} className="btn">Close</button>
                    </div>
                </div>
            </Modal>

            {/* --- PERUBAHAN 5: Tambahkan Modal untuk QR Scanner --- */}
            <Modal show={isScannerModalOpen} onClose={closeScannerModal} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
                    <QrCode
                        onScanSuccess={handleScanSuccess}
                        startScan={isScannerModalOpen}
                    />
                </div>
            </Modal>



        </AuthenticatedLayout>
    );
}

export default Show;