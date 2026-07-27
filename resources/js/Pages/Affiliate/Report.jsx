import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Wallet, Download } from 'lucide-react';
import { formatRupiah } from '@/Utils/formatter';

export default function Report({ rows, total_commission, filters }) {
    const { auth } = usePage().props;
    const prefix = auth.user.role === 'admin' ? 'admin' : 'organizer';

    const [search, setSearch] = useState(filters?.search || '');
    const [eventOpt, setEventOpt] = useState(null);
    const isFirst = useRef(true);
    const searchTimer = useRef();
    const eventTimer = useRef();

    // Ambil daftar affiliate (promotor) dari server sesuai ketikan (maks 20), didebounce.
    const loadPromoters = (input) =>
        new Promise((resolve) => {
            clearTimeout(searchTimer.current);
            if (!input) {
                resolve([]);
                return;
            }
            searchTimer.current = setTimeout(() => {
                fetch(route(`${prefix}.affiliates.report.search`, { q: input }), { headers: { Accept: 'application/json' } })
                    .then((r) => r.json())
                    .then(resolve)
                    .catch(() => resolve([]));
            }, 300);
        });

    // Event yang punya komisi affiliate (untuk filter).
    const loadEvents = (input) =>
        new Promise((resolve) => {
            clearTimeout(eventTimer.current);
            eventTimer.current = setTimeout(() => {
                fetch(route(`${prefix}.affiliates.report.eventSearch`, { q: input }), { headers: { Accept: 'application/json' } })
                    .then((r) => r.json())
                    .then(resolve)
                    .catch(() => resolve([]));
            }, 250);
        });

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(
                route(`${prefix}.affiliates.report`),
                { search, event_id: eventOpt?.value || '' },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(t);
    }, [search, eventOpt]);

    return (
        <AuthenticatedLayout>
            <Head title="Komisi Affiliate" />

            <div className="py-10">
                <div className="mx-auto max-w-5xl px-4 lg:px-8">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-6 h-6 text-primary" />
                            <h1 className="font-bold text-2xl">Komisi Affiliate</h1>
                        </div>
                        <a
                            href={route(`${prefix}.affiliates.report.export`, { search: search || undefined, event_id: eventOpt?.value || undefined })}
                            className="btn btn-success btn-sm text-white gap-1"
                        >
                            <Download className="w-4 h-4" /> Export Excel
                        </a>
                    </div>

                    {/* Tab nav — approval/pengajuan hanya untuk admin */}
                    {prefix === 'admin' && (
                        <div className="tabs tabs-boxed bg-base-200 w-fit mb-6">
                            <Link href={route('admin.affiliates.index')} className="tab">Pengajuan</Link>
                            <Link href={route('admin.affiliates.report')} className="tab tab-active">Komisi</Link>
                        </div>
                    )}

                    {/* Ringkasan total */}
                    <div className="card bg-primary/10 border border-primary/20 mb-4">
                        <div className="card-body py-4">
                            <p className="text-sm text-gray-600">Total Komisi Terbayar</p>
                            <p className="text-2xl font-bold text-primary">{formatRupiah(total_commission)}</p>
                        </div>
                    </div>

                    {/* Filter: affiliate + event (AsyncSelect, server-side) */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="w-full sm:flex-1">
                            <AsyncSelect
                                cacheOptions
                                isClearable
                                loadOptions={loadPromoters}
                                onChange={(opt) => setSearch(opt ? opt.value : '')}
                                placeholder="Cari nama atau email affiliate..."
                                noOptionsMessage={({ inputValue }) => (inputValue ? 'Tidak ditemukan' : 'Ketik untuk mencari...')}
                                loadingMessage={() => 'Mencari...'}
                                styles={{ control: (base) => ({ ...base, minHeight: '3rem' }) }}
                            />
                        </div>
                        <div className="w-full sm:w-64">
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                isClearable
                                value={eventOpt}
                                loadOptions={loadEvents}
                                onChange={setEventOpt}
                                placeholder="Semua event"
                                noOptionsMessage={() => 'Tidak ada event'}
                                loadingMessage={() => 'Memuat...'}
                                styles={{ control: (base) => ({ ...base, minHeight: '3rem' }) }}
                            />
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Affiliate</th>
                                        <th className="text-right">Tiket Terjual</th>
                                        <th className="text-right">Transaksi</th>
                                        <th className="text-right">Komisi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length === 0 && (
                                        <tr><td colSpan={5} className="text-center text-gray-400 py-8">Belum ada komisi affiliate.</td></tr>
                                    )}
                                    {rows.map((row, i) => (
                                        <tr key={i} className="hover">
                                            <td className="font-medium max-w-[220px] truncate">{row.event}</td>
                                            <td>
                                                <div className="font-medium">{row.affiliate}</div>
                                                <div className="text-xs text-gray-500">{row.affiliate_email}</div>
                                            </td>
                                            <td className="text-right">{row.tickets}</td>
                                            <td className="text-right">{row.trx_count}</td>
                                            <td className="text-right font-semibold text-primary">{formatRupiah(row.commission)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
