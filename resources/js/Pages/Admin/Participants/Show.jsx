import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import Card from '@/Components/ui/Card';
import { ArrowLeft, Download, Image as ImageIcon } from 'lucide-react';

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

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Peserta: ${ticket.detail_pendaftar?.nama || ticket.user?.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Header Action */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.events.show', { event: ticket.event_id, tab: 'Participants' })} className="btn btn-sm btn-ghost">
                                <ArrowLeft size={16} /> Kembali ke Participants
                            </Link>
                            <h2 className="text-2xl font-bold leading-tight text-base-content">
                                Profil Peserta
                            </h2>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 items-start">
                        {/* --- KOLOM KIRI: INFO TIKET & PENDAFTAR --- */}
                        <div className="md:col-span-1 space-y-6">

                            {/* Card 1: Status Tiket */}
                            <Card className="bg-base-100 shadow-xl">
                                <div className="card-body p-6">
                                    <h3 className="card-title text-lg border-b pb-2 mb-2">Informasi Tiket</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-base-content/60 font-semibold text-xs">KODE TIKET</p>
                                            <p className="font-mono text-lg font-bold">{ticket.ticket_code}</p>
                                        </div>
                                        <div>
                                            <p className="text-base-content/60 font-semibold text-xs">EVENT</p>
                                            <p className="font-medium">{ticket.event?.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-base-content/60 font-semibold text-xs">KATEGORI TIKET</p>
                                            <p className="font-medium">{ticket.ticket_type?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-base-content/60 font-semibold text-xs">STATUS</p>
                                            <div className="mt-1">{getStatusBadge(ticket.status)}</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Card 2: Detail Pendaftar */}
                            <Card className="bg-base-100 shadow-xl">
                                <div className="card-body p-6">
                                    <h3 className="card-title text-lg border-b pb-2 mb-2">Data Personal</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-base-content/60 font-semibold text-xs">NAMA LENGKAP</p>
                                            <p className="font-medium">{ticket.detail_pendaftar?.nama || ticket.user?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-base-content/60 font-semibold text-xs">EMAIL</p>
                                            <p className="font-medium">{ticket.detail_pendaftar?.email || ticket.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-base-content/60 font-semibold text-xs">NOMOR HP</p>
                                            <p className="font-medium">{ticket.detail_pendaftar?.no_hp || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* --- KOLOM KANAN: KUESIONER & SUBMISSION --- */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Card 3: Event Fields (Pertanyaan Pendaftaran) */}
                            <Card className="bg-base-100 shadow-xl">
                                <div className="card-body p-6">
                                    <h3 className="card-title text-lg border-b pb-2 mb-4">Jawaban Pendaftaran (Event Fields)</h3>

                                    {ticket.event_field_responses && ticket.event_field_responses.length > 0 ? (
                                        <div className="space-y-4">
                                            {ticket.event_field_responses.map(response => (
                                                <div key={response.id} className="bg-base-200 p-4 rounded-lg">
                                                    <p className="text-sm font-semibold capitalize mb-2 text-base-content/80">
                                                        {response.field_name.replace(/_/g, ' ')}
                                                    </p>
                                                    <div className="text-base text-base-content">
                                                        {RenderFieldValue(response.field_type, response.field_value, response.field_name)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-base-content/60 text-sm italic">Tidak ada data jawaban tambahan.</p>
                                    )}
                                </div>
                            </Card>

                            {/* Card 4: Submission Fields (Jika event mewajibkan submission) */}
                            {ticket.event?.needs_submission === 1 && (
                                <Card className="bg-base-100 shadow-xl border border-primary/20">
                                    <div className="card-body p-6">
                                        <h3 className="card-title text-lg text-primary border-b pb-2 mb-4">Dokumen Submission</h3>

                                        {ticket.submission && ticket.submission.submission_custom_fields?.length > 0 ? (
                                            <div className="space-y-4">
                                                {ticket.submission.submission_custom_fields.map(response => (
                                                    <div key={response.id} className="bg-base-200/50 p-4 rounded-lg">
                                                        <p className="text-sm font-semibold capitalize mb-2 text-primary">
                                                            {response.field_name.replace(/_/g, ' ')}
                                                        </p>
                                                        <div className="text-base text-base-content">
                                                            {RenderFieldValue(response.field_type, response.field_value, response.field_name)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-base-content/60 text-sm italic">Peserta belum mengunggah dokumen submission.</p>
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
                <a href={'/storage/' + value} target="_blank" rel="noopener noreferrer">
                    <img
                        src={'/storage/' + value}
                        alt={name}
                        className="max-w-[250px] h-auto rounded-lg border border-base-300 shadow-sm hover:opacity-90 transition"
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
                    className="btn btn-sm btn-primary"
                >
                    <Download size={16} /> Download File
                </a>
            </div>
        );
    }

    return <span>{value}</span>;
};

export default ShowParticipant;