import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';
import Card from '@/Components/ui/Card';
import { ArrowLeft, Download, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';

// Helper function untuk status
const getStatusBadge = (status) => {
    switch (status) {
        case 'unused': return <div className="badge badge-success">VALID</div>;
        case 'used': return <div className="badge badge-warning">USED</div>;
        case 'expired': return <div className="badge badge-error">EXPIRED</div>;
        default: return <div className="badge badge-ghost">UNKNOWN</div>;
    }
};

function ShowParticipant({ ticket }) {
    if (!ticket) return <div className="text-center p-16">Data tiket tidak ditemukan.</div>;

    const handleStatusChange = (ticketId, newStatus) => {
        router.patch(route('organizer.events.participants.update-status', { event: ticket.event_id, ticket: ticketId }), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Status berhasil diperbarui'
                });
            },
            onError: () => {
                Swal.fire('Error', 'Gagal memperbarui status', 'error');
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Peserta: ${ticket.detail_pendaftar?.nama || ticket.user?.name}`} />

            <div className="py-6 sm:py-12"> 
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">

                    {/* Header Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link 
                                href={route('organizer.events.show', { event: ticket.event_id, tab: 'Participants' })} 
                                className="btn btn-sm btn-ghost px-2 sm:px-3"
                            >
                                <ArrowLeft size={16} /> 
                                <span className="hidden sm:inline">Kembali ke Participants</span>
                                <span className="sm:hidden">Kembali</span>
                            </Link>
                            <h2 className="text-xl sm:text-2xl font-bold leading-tight text-gray-800">
                                Profil Peserta
                            </h2>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6 items-start">
                        {/* --- KOLOM KIRI: INFO TIKET & PENDAFTAR --- */}
                        <div className="md:col-span-1 space-y-4 sm:space-y-6">

                            {/* Card 1: Status Tiket & Tampilan QR Code */}
                            <Card className="bg-base-100 shadow-xl overflow-hidden">
                                <div className="card-body p-4 sm:p-6"> 
                                    <h3 className="card-title text-lg border-b pb-2 mb-4">Informasi Tiket</h3>
                                    
                                    <div className="flex flex-col items-center sm:items-start gap-6">
                                        
                                        {/* Menampilkan Gambar QR Code dari Database */}
                                        {ticket.qr_image ? (
                                            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-fit">
                                                <a href={`/storage/${ticket.qr_image}`} target="_blank" rel="noopener noreferrer">
                                                    <img 
                                                        src={`/storage/${ticket.qr_image}`} 
                                                        alt={`QR Code ${ticket.ticket_code}`} 
                                                        className="w-[150px] h-[150px] object-cover hover:opacity-80 transition-opacity"
                                                    />
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="w-[150px] h-[150px] bg-gray-100 flex items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm text-center p-4">
                                                QR Code tidak tersedia
                                            </div>
                                        )}

                                        <div className="space-y-3 text-sm w-full">
                                            <div>
                                                <p className="text-gray-500 font-semibold text-xs">KODE TIKET</p>
                                                <p className="font-mono text-lg font-bold">{ticket.ticket_code}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-semibold text-xs">EVENT</p>
                                                <p className="font-medium">{ticket.event?.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-semibold text-xs">KATEGORI TIKET</p>
                                                <p className="font-medium">{ticket.ticket_type?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-semibold text-xs mb-1">STATUS</p>
                                                <select
                                                    className={`select select-bordered select-sm w-full ${
                                                        ticket.status === 'used' ? 'select-success text-success' : 'select-warning text-warning'
                                                    }`}
                                                    value={ticket.status}
                                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                                >
                                                    <option value="unused">Belum Hadir (Unused)</option>
                                                    <option value="used">Sudah Hadir (Used)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Card 2: Detail Pendaftar */}
                            <Card className="bg-base-100 shadow-xl">
                                <div className="card-body p-4 sm:p-6">
                                    <h3 className="card-title text-lg border-b pb-2 mb-3">Data Personal</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-500 font-semibold text-xs">NAMA LENGKAP</p>
                                            <p className="font-medium">{ticket.detail_pendaftar?.nama || ticket.user?.name}</p>
                                        </div>
                                        <div className="break-all">
                                            <p className="text-gray-500 font-semibold text-xs">EMAIL</p>
                                            <p className="font-medium">{ticket.detail_pendaftar?.email || ticket.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-semibold text-xs">NOMOR HP</p>
                                            <p className="font-medium">{ticket.detail_pendaftar?.no_hp || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* --- KOLOM KANAN: KUESIONER & SUBMISSION --- */}
                        <div className="md:col-span-2 space-y-4 sm:space-y-6">

                            {/* Card 3: Event Fields */}
                            <Card className="bg-base-100 shadow-xl">
                                <div className="card-body p-4 sm:p-6">
                                    <h3 className="card-title text-lg border-b pb-2 mb-4">Jawaban Pendaftaran</h3>

                                    {ticket.event_field_responses && ticket.event_field_responses.length > 0 ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            {ticket.event_field_responses.map(response => (
                                                <div key={response.id} className="bg-base-200 p-3 sm:p-4 rounded-lg break-words">
                                                    <p className="text-xs sm:text-sm font-semibold capitalize mb-1 sm:mb-2 text-gray-700">
                                                        {response.field_name.replace(/_/g, ' ')}
                                                    </p>
                                                    <div className="text-sm sm:text-base text-gray-900">
                                                        {RenderFieldValue(response.field_type, response.field_value, response.field_name)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">Tidak ada data jawaban tambahan.</p>
                                    )}
                                </div>
                            </Card>

                            {/* Card 4: Submission Fields */}
                            {ticket.event?.needs_submission === 1 && (
                                <Card className="bg-base-100 shadow-xl border border-primary/20">
                                    <div className="card-body p-4 sm:p-6">
                                        <h3 className="card-title text-lg text-primary border-b pb-2 mb-4">Dokumen Submission</h3>

                                        {ticket.submission && ticket.submission.submission_custom_fields?.length > 0 ? (
                                            <div className="space-y-3 sm:space-y-4">
                                                {ticket.submission.submission_custom_fields.map(response => (
                                                    <div key={response.id} className="bg-base-200/50 p-3 sm:p-4 rounded-lg break-words">
                                                        <p className="text-xs sm:text-sm font-semibold capitalize mb-1 sm:mb-2 text-primary">
                                                            {response.field_name.replace(/_/g, ' ')}
                                                        </p>
                                                        <div className="text-sm sm:text-base text-gray-900">
                                                            {RenderFieldValue(response.field_type, response.field_value, response.field_name)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">Peserta belum mengunggah dokumen submission.</p>
                                        )}
                                    </div>
                                </Card>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Komponen mini untuk merender file, image, atau text
const RenderFieldValue = (type, value, name) => {
    if (!value) return <span>-</span>;

    if (type === 'image') {
        return (
            <div className="mt-2">
                <a href={'/storage/' + value} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                        src={'/storage/' + value}
                        alt={name}
                        className="w-full sm:max-w-[250px] h-auto rounded-lg border border-gray-300 shadow-sm hover:opacity-90 transition"
                    />
                </a>
            </div>
        );
    }

    if (type === 'file') {
        return (
            <div className="mt-2 flex items-center gap-3">
                <a
                    href={'/storage/' + value}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="btn btn-sm btn-primary w-full sm:w-auto" 
                >
                    <Download size={16} /> <span className="truncate">Download File</span>
                </a>
            </div>
        );
    }

    return <span>{value}</span>;
};

export default ShowParticipant;