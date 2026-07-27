import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Ticket, Receipt, Calendar, ChevronRight, QrCode } from 'lucide-react';
import { formatRupiah, formatDateLong } from '@/Utils/formatter';

const ticketStatus = {
    unused: { label: 'Valid', cls: 'badge-success' },
    used: { label: 'Digunakan', cls: 'badge-warning' },
    expired: { label: 'Kadaluarsa', cls: 'badge-error' },
};

const trxStatus = {
    PAID: 'badge-success',
    UNPAID: 'badge-warning',
    EXPIRED: 'badge-error',
};

export default function Index({ tickets = [], transactions = [] }) {
    const initial = new URLSearchParams(window.location.search).get('tab') === 'transactions' ? 'transactions' : 'tickets';
    const [tab, setTab] = useState(initial);

    const rowClass = 'flex items-center gap-4 p-3 sm:p-4 rounded-2xl border border-base-200 bg-base-100 hover:border-primary/40 hover:shadow-md transition-all';

    return (
        <GuestLayout>
            <Head title="Tiket & Transaksi" />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold">Tiket & Transaksi</h1>
                <p className="text-sm text-gray-500 mt-1 mb-6">Semua tiket dan riwayat transaksi Anda dalam satu tempat.</p>

                {/* Tabs */}
                <div role="tablist" className="inline-flex p-1 rounded-full bg-base-200 mb-6">
                    <button
                        role="tab"
                        onClick={() => setTab('tickets')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${tab === 'tickets' ? 'bg-base-100 shadow text-primary' : 'text-gray-500'}`}
                    >
                        <Ticket className="w-4 h-4" /> Tiket
                        <span className="badge badge-sm">{tickets.length}</span>
                    </button>
                    <button
                        role="tab"
                        onClick={() => setTab('transactions')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${tab === 'transactions' ? 'bg-base-100 shadow text-primary' : 'text-gray-500'}`}
                    >
                        <Receipt className="w-4 h-4" /> Transaksi
                        <span className="badge badge-sm">{transactions.length}</span>
                    </button>
                </div>

                {/* Tiket */}
                {tab === 'tickets' && (
                    <div className="space-y-3">
                        {tickets.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <Ticket className="w-10 h-10 mx-auto mb-3" />
                                <p>Anda belum memiliki tiket.</p>
                            </div>
                        )}
                        {tickets.map((t) => (
                            <Link key={t.id} href={route('tickets.show', t)} className={rowClass}>
                                <img
                                    src={t.event?.image ? `/storage/${t.event.image}` : '/placeholder.svg'}
                                    alt={t.event?.title}
                                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-base-200"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`badge badge-sm badge-outline ${ticketStatus[t.status]?.cls || 'badge-ghost'}`}>
                                            {ticketStatus[t.status]?.label || t.status}
                                        </span>
                                        <span className="badge badge-sm badge-outline badge-primary capitalize">{t.event?.location_type}</span>
                                    </div>
                                    <p className="font-semibold truncate">{t.event?.title}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="truncate">{formatDateLong(t.event?.start_date)}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-semibold text-primary">{formatRupiah(t.transaction?.subtotal)}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                                        <QrCode className="w-3.5 h-3.5" /> {t.quantity} tiket
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 hidden sm:block" />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Transaksi */}
                {tab === 'transactions' && (
                    <div className="space-y-3">
                        {transactions.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <Receipt className="w-10 h-10 mx-auto mb-3" />
                                <p>Belum ada transaksi.</p>
                            </div>
                        )}
                        {transactions.map((trx) => (
                            <Link
                                key={trx.reference}
                                href={route('transactions.status', { tripay_reference: trx.reference })}
                                className={rowClass}
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Receipt className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{trx.event?.title}</p>
                                    <p className="text-xs text-gray-400 font-mono truncate">{trx.reference}</p>
                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                        {trx.payment_method || 'Belum pilih pembayaran'} · {trx.quantity} tiket · {formatDateLong(trx.created_at)}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-semibold">{formatRupiah(trx.subtotal)}</p>
                                    <span className={`badge badge-sm mt-1 ${trxStatus[trx.status] || 'badge-neutral'}`}>{trx.status}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 hidden sm:block" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
