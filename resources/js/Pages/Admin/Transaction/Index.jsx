import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Receipt } from 'lucide-react';
import { formatRupiah, formatDateLong } from '@/Utils/formatter';

// Ambil opsi transaksi dari server sesuai ketikan (maks 20), didebounce.
let trxSearchTimer;
const loadTransactions = (input) =>
    new Promise((resolve) => {
        clearTimeout(trxSearchTimer);
        if (!input) {
            resolve([]);
            return;
        }
        trxSearchTimer = setTimeout(() => {
            fetch(route('admin.transactions.search', { q: input }), { headers: { Accept: 'application/json' } })
                .then((r) => r.json())
                .then(resolve)
                .catch(() => resolve([]));
        }, 300);
    });

let trxEventTimer;
const loadTransactionEvents = (input) =>
    new Promise((resolve) => {
        clearTimeout(trxEventTimer);
        trxEventTimer = setTimeout(() => {
            fetch(route('admin.transactions.eventSearch', { q: input }), { headers: { Accept: 'application/json' } })
                .then((r) => r.json())
                .then(resolve)
                .catch(() => resolve([]));
        }, 250);
    });

const STATUS_BADGE = {
    PAID: 'badge-success',
    UNPAID: 'badge-warning',
    EXPIRED: 'badge-error',
};
const STATUSES = ['UNPAID', 'PAID', 'EXPIRED'];

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;
    return (
        <div className="flex justify-center mt-6 gap-1 flex-wrap">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    preserveScroll
                    preserveState
                    className={`btn btn-sm ${link.active ? 'btn-primary' : 'btn-outline'} ${!link.url ? 'btn-disabled opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

export default function Index({ transactions, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [eventOpt, setEventOpt] = useState(null);
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(
                route('admin.transactions.index'),
                { search, status, event_id: eventOpt?.value || '' },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(t);
    }, [search, status, eventOpt]);

    return (
        <AuthenticatedLayout>
            <Head title="Transaksi" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl px-4 lg:px-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Receipt className="w-6 h-6 text-primary" />
                        <h1 className="font-bold text-2xl">Transaksi</h1>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="w-full sm:flex-1">
                            <AsyncSelect
                                cacheOptions
                                isClearable
                                loadOptions={loadTransactions}
                                onChange={(opt) => setSearch(opt ? opt.value : '')}
                                placeholder="Cari referensi, user, atau event..."
                                noOptionsMessage={({ inputValue }) => (inputValue ? 'Tidak ditemukan' : 'Ketik untuk mencari...')}
                                loadingMessage={() => 'Mencari...'}
                                styles={{ control: (base) => ({ ...base, minHeight: '3rem' }) }}
                            />
                        </div>
                        <div className="w-full sm:w-56">
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                isClearable
                                value={eventOpt}
                                loadOptions={loadTransactionEvents}
                                onChange={setEventOpt}
                                placeholder="Semua event"
                                noOptionsMessage={() => 'Tidak ada event'}
                                loadingMessage={() => 'Memuat...'}
                                styles={{ control: (base) => ({ ...base, minHeight: '3rem' }) }}
                            />
                        </div>
                        <select
                            className="select select-bordered w-full sm:w-44 h-12"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Referensi</th>
                                        <th>User</th>
                                        <th>Event</th>
                                        <th className="text-right">Jumlah</th>
                                        <th>Status</th>
                                        <th>Dibayar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.length === 0 && (
                                        <tr><td colSpan={6} className="text-center text-base-content/50 py-8">Tidak ada transaksi yang cocok.</td></tr>
                                    )}
                                    {transactions.data.map((trx) => (
                                        <tr key={trx.id} className="hover">
                                            <td className="font-mono text-xs">{trx.reference}</td>
                                            <td>
                                                <div className="font-medium">{trx.user?.name}</div>
                                                <div className="text-xs text-base-content/60">{trx.user?.email}</div>
                                            </td>
                                            <td className="max-w-[200px] truncate">{trx.event?.title}</td>
                                            <td className="text-right font-semibold">{formatRupiah(trx.amount)}</td>
                                            <td><span className={`badge ${STATUS_BADGE[trx.status] || 'badge-neutral'}`}>{trx.status}</span></td>
                                            <td className="text-sm">{trx.paid_at ? formatDateLong(trx.paid_at) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination links={transactions.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
