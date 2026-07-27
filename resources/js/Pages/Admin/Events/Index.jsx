import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Search, Plus, Eye, Pencil, CalendarDays } from 'lucide-react';

const STATUS_BADGE = { valid: 'badge-success', expired: 'badge-ghost' };
const STATUSES = ['valid', 'expired'];

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

const formatPriceRange = (range) => {
    if (!range || range.length === 0) return 'N/A';
    const [min, max] = range;
    if (min === max) return min > 0 ? formatPrice(min) : 'Gratis';
    return `${formatPrice(min)} - ${formatPrice(max)}`;
};

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

export default function Index({ events, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('admin.events.index'), { search, status }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);
        return () => clearTimeout(t);
    }, [search, status]);

    return (
        <AuthenticatedLayout>
            <Head title="Events" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl px-4 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-6 h-6 text-primary" />
                            <h1 className="font-bold text-2xl">Events</h1>
                        </div>
                        <Link href={route('admin.events.create')} className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-1" /> Tambah Event
                        </Link>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <label className="input input-bordered flex items-center gap-2 w-full sm:flex-1 h-12">
                            <Search className="w-4 h-4 opacity-60 shrink-0" />
                            <input
                                type="text"
                                className="grow w-full bg-transparent"
                                placeholder="Cari judul, creator, atau kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>
                        <select
                            className="select select-bordered w-full sm:w-48 h-12"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            {STATUSES.map((s) => (
                                <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nama Event</th>
                                        <th>Creator</th>
                                        <th>Kategori</th>
                                        <th>Harga</th>
                                        <th>Kuota</th>
                                        <th>Status</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.data.length === 0 && (
                                        <tr><td colSpan={8} className="text-center text-gray-400 py-8">Tidak ada event yang cocok.</td></tr>
                                    )}
                                    {events.data.map((event, index) => (
                                        <tr key={event.id} className="hover">
                                            <td className="text-gray-400">{events.from + index}</td>
                                            <td className="font-medium max-w-[220px] truncate">{event.title}</td>
                                            <td className="text-sm">{event.creator?.name}</td>
                                            <td className="text-sm">{event.category?.name}</td>
                                            <td className="text-sm">{formatPriceRange(event.price_range)}</td>
                                            <td className="text-sm">{event.total_quota}</td>
                                            <td><span className={`badge capitalize ${STATUS_BADGE[event.status] || 'badge-neutral'}`}>{event.status}</span></td>
                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    <Link className="btn btn-sm btn-primary btn-outline" href={route('admin.events.show', event)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link className="btn btn-sm btn-warning btn-outline" href={route('admin.events.edit', event)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination links={events.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
