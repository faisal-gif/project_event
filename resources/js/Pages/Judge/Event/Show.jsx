import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import Card from '@/Components/ui/Card';
import Modal from '@/Components/Modal'; // Assuming you have a Modal component
import JudgeLayout from '@/Layouts/JudgeLayout';

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
            return <div className="badge badge-success">Belum Mengisi</div>;
        case 'used':
            return <div className="badge badge-warning">Sudah Mengisi</div>;
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
        setDetailModalOpen(false);
        setSubmissionModalOpen(null);
    };

   
    return (
        <JudgeLayout>
            <Head title={`View Event: ${event.title}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* ===== Tab Content ===== */}
                    <div className='space-y-6'>
                        {/* Detail Event */}
                        <div className="grid md:grid-cols-5 gap-4 px-2 md:px-0 items-start">
                            <Card className="md:col-span-2">
                                <img
                                    src={`/storage/${event.image}`}
                                    alt={event.title}
                                    className="w-full h-full object-contain rounded"
                                />
                            </Card>
                            <Card className="bg-base-100 shadow-xl md:col-span-3">
                                <div className="card-body">
                                    <h1 className="text-3xl font-bold my-4">{event.title}</h1>
                                    <div className="badge badge-outline badge-lg">{event.category.name}</div>
                                    <div className="divider"></div>
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex">
                                                <div className="font-semibold w-32">Start Date</div>
                                                <div>: {formatDate(event.start_date)}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="font-semibold w-32">End Date</div>
                                                <div>: {formatDate(event.end_date)}</div>
                                            </div>
                                            <div className="flex">
                                                <div className="font-semibold w-32">Location Type</div>
                                                <div className="capitalize">: {event.location_type}</div>
                                            </div>
                                            {event.location_details && (
                                                <div className="flex">
                                                    <div className="font-semibold w-32">Details</div>
                                                    <div>: {event.location_details}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        {/* Deskripsi Event */}
                        <div className="collapse collapse-arrow bg-base-100 shadow-xl border border-base-300">
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold">Deskripsi</div>
                            <div className="collapse-content text-sm w-full">
                                <div className="prose prose-sm prose-p:my-2 prose-h2:mb-1 prose-li:my-0 m-4 max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                            </div>
                        </div>
                    </div>

                    <div className='px-2 md:px-0'>
                        <Card className="bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className='flex justify-between items-start'>
                                    <h2 className="card-title mb-4">Peserta</h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
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
                                                        <td>{ticket.ticket_type.name}</td>
                                                        <td>{ticket.user.name}</td>
                                                        <td>{ticket.user.email}</td>
                                                        <td>{getStatusBadge(ticket.status)}</td>
                                                        <td className="space-x-2">
                                                            {/* <button onClick={() => openDetailModal(ticket)} className="btn btn-sm btn-info">Detail Peserta</button> */}

                                                            {event.needs_submission === 1 && (
                                                                <button onClick={() => openSubmissionModal(ticket)} className="btn btn-sm btn-accent">Jawaban Peserta</button>
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
                                        <div className="font-semibold md:w-32">Name</div>
                                        <div>: {selectedTicket.detail_pendaftar.nama}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold md:w-32">Email</div>
                                        <div>: {selectedTicket.detail_pendaftar.email}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold md:w-32">Phone</div>
                                        <div>: {selectedTicket.detail_pendaftar.no_hp}</div>
                                    </div>
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">Additional Questions</h3>
                            {selectedTicket.event_field_responses && selectedTicket.event_field_responses.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedTicket.event_field_responses.map(response => (
                                        <div key={response.id} className="flex">
                                            <div className="font-semibold md:w-32 capitalize">{response.field_name.replace(/_/g, ' ')}</div>
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

            <Modal maxWidth='5xl' show={isSubmissionModalOpen} onClose={closeSubmissionModal}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Participant Details</h2>
                    {selectedTicket ? (
                        <>
                            {selectedTicket.detail_pendaftar && (
                                <div className="space-y-3 pb-4 border-b mb-4">
                                    <div className="flex">
                                        <div className="font-semibold">Name</div>
                                        <div>: {selectedTicket.detail_pendaftar.nama}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold">Email</div>
                                        <div>: {selectedTicket.detail_pendaftar.email}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold">Phone</div>
                                        <div>: {selectedTicket.detail_pendaftar.no_hp}</div>
                                    </div>
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-2">Jawaban Pendaftar</h3>
                            {selectedTicket.submission ? (
                                <div className="space-y-3">
                                    {selectedTicket.submission.submission_custom_fields.map(response => (
                                        <div key={response.id} className="flex items-start">
                                            {/* Kolom Label / Pertanyaan */}
                                            <div className="font-semibold capitalize w-1/3">
                                                {response.field_name.replace(/_/g, ' ')}
                                            </div>

                                            {/* Kolom Jawaban */}
                                            <div className="flex-1 flex items-start">
                                                <span className="mr-2">:</span>

                                                {/* Logika Tampilan Berdasarkan Tipe Field */}
                                                {response.field_type == 'image' ? (
                                                    <div className="mt-2">
                                                        <img
                                                            src={'/storage/' + response.field_value}
                                                            alt={response.field_name}
                                                            className="max-w-[200px] h-auto rounded-lg border border-gray-200 shadow-sm"
                                                        />
                                                    </div>
                                                ) : response.field_type == 'file' ? (
                                                    /* --- BAGIAN BARU UNTUK FILE --- */
                                                    <div className="flex items-center gap-3">
                                                        <a
                                                            href={'/storage/' + response.field_value}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                        >
                                                            {/* Ikon Download Opsional */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                            Download
                                                        </a>
                                                    </div>
                                                ) : (
                                                    /* --- BAGIAN TEXT BIASA --- */
                                                    <span>{response.field_value}</span>
                                                )}
                                            </div>
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

            
        </JudgeLayout>
    );
}

export default Show;