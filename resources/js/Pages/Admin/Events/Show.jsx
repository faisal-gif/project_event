import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Card from '@/Components/ui/Card';
import Modal from '@/Components/Modal';
import QrCode from '@/Components/QrCode';
import { QrCodeIcon, Search, Download } from 'lucide-react';
import { formatRupiah } from '@/Utils/formatter';

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

const getStatusTransactionBadge = (status) => {
    switch (status) {
        case 'PAID':
            return <div className="badge badge-success">PAID</div>;
        case 'UNPAID':
            return <div className="badge badge-warning">UNPAID</div>;
        case 'EXPIRED':
            return <div className="badge badge-error">EXPIRED</div>;
        default:
            return <div className="badge badge-ghost">UNKNOWN</div>;
    }
};

const Pagination = ({ links }) => {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex justify-center mt-6 gap-1 flex-wrap">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    preserveScroll
                    preserveState
                    className={`btn btn-sm ${link.active ? 'btn-primary' : 'btn-outline'} ${!link.url ? 'btn-disabled opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
};

// --- TAMBAHKAN PROPS "summary" ---
function Show({ event, tickets, transactions, filters, summary }) {

    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || 'Detail';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [isScannerModalOpen, setScannerModalOpen] = useState(false);

    const [searchTicket, setSearchTicket] = useState(filters?.search_ticket || '');
    const [searchTransaction, setSearchTransaction] = useState(filters?.search_transaction || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTicket !== (filters?.search_ticket || '') || searchTransaction !== (filters?.search_transaction || '')) {
                router.get(route('admin.events.show', event.id), {
                    search_ticket: searchTicket,
                    search_transaction: searchTransaction
                }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTicket, searchTransaction]);


    const handleScanSuccess = (decodedText) => {
        setScannerModalOpen(false);
        router.post(route('ticket.validate'), { qr_data: decodedText }, {
            onSuccess: (params) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'QR berhasil divalidasi.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: errors.message || 'QR tidak valid atau sudah digunakan.',
                });
            }
        });
    };

    if (!event) {
        return (
            <AuthenticatedLayout>
                <div className="text-center p-16">Event not found.</div>
            </AuthenticatedLayout>
        );
    }

    const closeScannerModal = () => {
        setScannerModalOpen(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`View Event: ${event.title}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* ===== Manual Tab Navigation ===== */}
                    <div className="tabs tabs-border">
                        {['Detail', 'Participants', 'Transaction'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`tab ${activeTab === tab
                                    ? 'tab-active'
                                    : 'hover:bg-base-300 text-base-content'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ===== Tab Content ===== */}
                    {activeTab === 'Detail' && (
                        // ... Bagian Tampilan Detail Event tetap sama ...
                        <div className='space-y-6'>
                            <div className="grid md:grid-cols-5 gap-4 px-2 md:px-0 items-start">
                                <Card className="md:col-span-2">
                                    <img src={`/storage/${event.image}`} alt={event.title} className="w-full h-full object-contain rounded" />
                                </Card>
                                <Card className="bg-base-100 shadow-xl md:col-span-3">
                                    {/* ... isi card ... */}
                                    <div className="card-body">
                                        <h1 className="text-3xl font-bold my-4">{event.title}</h1>
                                        <div className="badge badge-outline badge-lg">{event.category?.name}</div>
                                        <div className="divider"></div>
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex"><div className="font-semibold w-32">Start Date</div><div>: {formatDate(event.start_date)}</div></div>
                                                <div className="flex"><div className="font-semibold w-32">End Date</div><div>: {formatDate(event.end_date)}</div></div>
                                                <div className="flex"><div className="font-semibold w-32">Location Type</div><div className="capitalize">: {event.location_type}</div></div>
                                                {event.location_details && (
                                                    <div className="flex"><div className="font-semibold w-32">Details</div><div>: {event.location_details}</div></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            <div className="collapse collapse-arrow bg-base-100 shadow-xl border border-base-300">
                                <input type="checkbox" />
                                <div className="collapse-title font-semibold">Deskripsi</div>
                                <div className="collapse-content text-sm w-full">
                                    <div className="prose prose-sm prose-p:my-2 prose-h2:mb-1 prose-li:my-0 m-4 max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                                </div>
                            </div>
                            <Card className="bg-base-100 shadow-xl p-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Ticket Information</h3>
                                    {event.ticket_types?.length ? (
                                        <ul className="space-y-3">
                                            {event.ticket_types.map((ticketType) => (
                                                <li key={ticketType.id} className="p-3 bg-base-200 rounded-lg flex justify-between items-center">
                                                    <div>
                                                        <span className="font-semibold">{ticketType.name}</span>
                                                        <p className="text-xs">{ticketType.description}</p>
                                                        <div className="text-sm text-base-content/60">Quota: {ticketType.quota}</div>
                                                        <div className="text-xs">{formatDate(ticketType.purchase_date)} - {formatDate(ticketType.end_purchase_date)}</div>
                                                    </div>
                                                    <div className="font-bold text-lg">{formatPrice(ticketType.price)}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (<p>No ticket types configured for this event.</p>)}
                                    <div className="divider my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Max Tickets per User</span>
                                        <span className="font-bold">{event.limit_ticket_user}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* --- TAB PARTICIPANTS DENGAN SUMMARY --- */}
                    {activeTab === 'Participants' && (
                        <div className='px-2 md:px-0 space-y-6'>
                            
                            {/* --- WIDGET SUMMARY TIKET --- */}
                            <div className="stats stats-vertical lg:stats-horizontal shadow w-full border border-base-200 bg-base-100">
                                <div className="stat">
                                    <div className="stat-title text-sm font-semibold">Total Seluruh Tiket</div>
                                    <div className="stat-value">{summary?.total_tickets || 0}</div>
                                </div>
                                {summary?.tickets_by_type?.map((type, index) => (
                                    <div key={index} className="stat">
                                        <div className="stat-title text-sm">{type.name}</div>
                                        <div className="stat-value text-primary text-2xl">
                                            {type.sold} <span className="text-sm font-normal text-base-content/70">terjual</span>
                                        </div>
                                        <div className="stat-desc text-success">{formatRupiah(type.amount)}</div>
                                    </div>
                                ))}
                            </div>

                            <Card className="bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
                                        <h2 className="card-title">Participants</h2>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <div className="relative w-full sm:w-64">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Search className="h-4 w-4 text-base-content/50" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Cari Tiket / Nama..."
                                                    className="input input-sm input-bordered w-full pl-10"
                                                    value={searchTicket}
                                                    onChange={(e) => setSearchTicket(e.target.value)}
                                                />
                                            </div>
                                            <button onClick={() => setScannerModalOpen(true)} className="btn btn-sm btn-primary shrink-0">
                                                <QrCodeIcon size={16} className="mr-1" /> Scan QR
                                            </button>
                                            <a href={route('admin.events.export.participants', event.id)} className="btn btn-sm btn-success text-white shrink-0">
                                                <Download size={16} className="mr-1" /> Export
                                            </a>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr>
                                                    <th>Ticket Code</th>
                                                    <th>Ticket Kategori</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tickets?.data && tickets.data.length > 0 ? (
                                                    tickets.data.map((ticket) => (
                                                        <tr key={ticket.id}>
                                                            <td>{ticket.ticket_code}</td>
                                                            <td>{ticket.ticket_type?.name}</td>
                                                            <td>{ticket.user?.name}</td>
                                                            <td>{ticket.user?.email}</td>
                                                            <td>{getStatusBadge(ticket.status)}</td>
                                                            <td className="space-x-2">
                                                                <Link href={route('admin.participant.show', ticket.id)} className="btn btn-sm btn-info text-white">
                                                                    Detail Profil
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="6" className="text-center">No participants found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination links={tickets?.links} />
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* --- TAB TRANSACTION DENGAN SUMMARY --- */}
                    {activeTab === 'Transaction' && (
                        <div className='px-2 md:px-0 space-y-6'>
                            
                            {/* --- WIDGET SUMMARY TRANSAKSI --- */}
                            <div className="stats stats-vertical lg:stats-horizontal shadow w-full md:w-2/3 border border-base-200 bg-base-100">
                                <div className="stat">
                                    <div className="stat-title text-sm font-semibold">Total Seluruh Transaksi</div>
                                    <div className="stat-value">{summary?.total_transactions || 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title text-sm">Transaksi Paid</div>
                                    <div className="stat-value text-success">{summary?.paid_transactions || 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title text-sm">Total Pendapatan (Paid)</div>
                                    <div className="stat-value text-primary text-2xl">{formatRupiah(summary?.total_revenue || 0)}</div>
                                </div>
                            </div>

                            <Card className="bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
                                        <h2 className="card-title">Riwayat Transaksi</h2>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <div className="relative w-full sm:w-64">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Search className="h-4 w-4 text-base-content/50" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Cari Invoice / Nama..."
                                                    className="input input-sm input-bordered w-full pl-10"
                                                    value={searchTransaction}
                                                    onChange={(e) => setSearchTransaction(e.target.value)}
                                                />
                                            </div>
                                            <a href={route('admin.events.export.transactions', event.id)} className="btn btn-sm btn-success text-white shrink-0">
                                                <Download size={16} className="mr-1" /> Export
                                            </a>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr>
                                                    <th>Kode Transaksi</th>
                                                    <th>Nama</th>
                                                    <th>Email</th>
                                                    <th>Status</th>
                                                    <th>Harga Tiket</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions?.data && transactions.data.length > 0 ? (
                                                    transactions.data.map((transaction) => (
                                                        <tr key={transaction.id}>
                                                            <td>{transaction.reference}</td>
                                                            <td>{transaction.user?.name}</td>
                                                            <td>{transaction.user?.email}</td>
                                                            <td>{getStatusTransactionBadge(transaction.status)}</td>
                                                            <td>{formatRupiah(transaction.amount)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">No transactions found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination links={transactions?.links} />
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal QR Scanner */}
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