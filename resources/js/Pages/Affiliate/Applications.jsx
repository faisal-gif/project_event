import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Card from '@/Components/ui/Card';
import FlashAlert from '@/Components/FlashAlert';
import { formatDateLong } from '@/Utils/formatter';
import { Users, Check, X } from 'lucide-react';

const BADGE = {
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-error',
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

export default function Applications({ applications }) {
    const { auth } = usePage().props;
    const prefix = auth.user.role === 'admin' ? 'admin' : 'organizer';

    const act = (id, action) =>
        router.patch(route(`${prefix}.affiliates.${action}`, id), {}, { preserveScroll: true });

    return (
        <AuthenticatedLayout>
            <Head title="Pengajuan Affiliate" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl px-4 lg:px-8 space-y-6">
                    <FlashAlert />

                    <div className="tabs tabs-boxed bg-base-200 w-fit">
                        <Link href={route(`${prefix}.affiliates.index`)} className="tab tab-active">Pengajuan</Link>
                        <Link href={route(`${prefix}.affiliates.report`)} className="tab">Komisi</Link>
                    </div>

                    <Card className="bg-base-100 p-4 sm:p-6 shadow-medium">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Pengajuan Affiliate</h2>
                        </div>

                        {/* Desktop: tabel */}
                        <div className="overflow-x-auto hidden md:block">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Diajukan</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.data.length === 0 && (
                                        <tr><td colSpan={5} className="text-center text-base-content/50 py-6">Belum ada pengajuan.</td></tr>
                                    )}
                                    {applications.data.map((u) => (
                                        <tr key={u.id}>
                                            <td className="font-medium">{u.name}</td>
                                            <td className="text-sm text-base-content/70">{u.email}</td>
                                            <td><span className={`badge ${BADGE[u.affiliate_status]}`}>{u.affiliate_status}</span></td>
                                            <td className="text-sm">{u.affiliate_requested_at ? formatDateLong(u.affiliate_requested_at) : '-'}</td>
                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    {u.affiliate_status !== 'approved' && (
                                                        <button type="button" onClick={() => act(u.id, 'approve')} className="btn btn-sm btn-success">
                                                            <Check className="w-4 h-4 mr-1" /> Setujui
                                                        </button>
                                                    )}
                                                    {u.affiliate_status !== 'rejected' && (
                                                        <button type="button" onClick={() => act(u.id, 'reject')} className="btn btn-sm btn-outline btn-error">
                                                            <X className="w-4 h-4 mr-1" /> Tolak
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile: card */}
                        <div className="md:hidden space-y-3">
                            {applications.data.length === 0 && (
                                <div className="text-center text-base-content/50 py-6">Belum ada pengajuan.</div>
                            )}
                            {applications.data.map((u) => (
                                <div key={u.id} className="card bg-base-100 border border-base-200 shadow-sm">
                                    <div className="card-body p-4 gap-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="font-semibold leading-snug truncate">{u.name}</p>
                                                <p className="text-sm text-base-content/60 truncate">{u.email}</p>
                                            </div>
                                            <span className={`badge shrink-0 ${BADGE[u.affiliate_status]}`}>{u.affiliate_status}</span>
                                        </div>
                                        <p className="text-sm text-base-content/60">
                                            Diajukan: <span className="text-base-content/80">{u.affiliate_requested_at ? formatDateLong(u.affiliate_requested_at) : '-'}</span>
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            {u.affiliate_status !== 'approved' && (
                                                <button type="button" onClick={() => act(u.id, 'approve')} className="btn btn-sm btn-success flex-1">
                                                    <Check className="w-4 h-4 mr-1" /> Setujui
                                                </button>
                                            )}
                                            {u.affiliate_status !== 'rejected' && (
                                                <button type="button" onClick={() => act(u.id, 'reject')} className="btn btn-sm btn-outline btn-error flex-1">
                                                    <X className="w-4 h-4 mr-1" /> Tolak
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination links={applications.links} />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
