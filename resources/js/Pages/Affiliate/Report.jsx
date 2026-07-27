import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Search, Wallet } from 'lucide-react';
import { formatRupiah } from '@/Utils/formatter';

export default function Report({ rows, total_commission, filters }) {
    const { auth } = usePage().props;
    const prefix = auth.user.role === 'admin' ? 'admin' : 'organizer';

    const [search, setSearch] = useState(filters?.search || '');
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route(`${prefix}.affiliates.report`), { search }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    return (
        <AuthenticatedLayout>
            <Head title="Komisi Affiliate" />

            <div className="py-10">
                <div className="mx-auto max-w-5xl px-4 lg:px-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Wallet className="w-6 h-6 text-primary" />
                        <h1 className="font-bold text-2xl">Komisi Affiliate</h1>
                    </div>

                    {/* Tab nav */}
                    <div className="tabs tabs-boxed bg-base-200 w-fit mb-6">
                        <Link href={route(`${prefix}.affiliates.index`)} className="tab">Pengajuan</Link>
                        <Link href={route(`${prefix}.affiliates.report`)} className="tab tab-active">Komisi</Link>
                    </div>

                    {/* Ringkasan total */}
                    <div className="card bg-primary/10 border border-primary/20 mb-4">
                        <div className="card-body py-4">
                            <p className="text-sm text-gray-600">Total Komisi Terbayar</p>
                            <p className="text-2xl font-bold text-primary">{formatRupiah(total_commission)}</p>
                        </div>
                    </div>

                    {/* Search */}
                    <label className="input input-bordered flex items-center gap-2 w-full h-12 mb-4">
                        <Search className="w-4 h-4 opacity-60 shrink-0" />
                        <input
                            type="text"
                            className="grow w-full bg-transparent"
                            placeholder="Cari event atau nama affiliate..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>

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
