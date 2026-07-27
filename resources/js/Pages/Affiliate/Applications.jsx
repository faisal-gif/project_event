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
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <FlashAlert />

                    <Card className="bg-base-100 p-4 sm:p-6 shadow-medium">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Pengajuan Affiliate</h2>
                        </div>

                        <div className="overflow-x-auto">
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
                                        <tr><td colSpan={5} className="text-center text-gray-400 py-6">Belum ada pengajuan.</td></tr>
                                    )}
                                    {applications.data.map((u) => (
                                        <tr key={u.id}>
                                            <td className="font-medium">{u.name}</td>
                                            <td className="text-sm text-gray-600">{u.email}</td>
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

                        <Pagination links={applications.links} />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
