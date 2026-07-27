import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Search, Plus, Pencil, Users as UsersIcon } from 'lucide-react';

const ROLE_BADGE = {
    admin: 'badge-error',
    organizer: 'badge-primary',
    judge: 'badge-accent',
    user: 'badge-ghost',
};

const ROLES = ['user', 'admin', 'organizer', 'judge'];

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

export default function UserManagement({ users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [role, setRole] = useState(filters?.role || '');
    const isFirst = useRef(true);

    // Debounced live filtering.
    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('admin.users.index'), { search, role }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);
        return () => clearTimeout(t);
    }, [search, role]);

    return (
        <AuthenticatedLayout>
            <Head title="User Management" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl px-4 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2">
                            <UsersIcon className="w-6 h-6 text-primary" />
                            <h1 className="font-bold text-2xl">Manajemen User</h1>
                        </div>
                        <Link className="btn btn-primary" href={route('admin.users.create')}>
                            <Plus className="w-4 h-4 mr-1" /> Tambah User
                        </Link>
                    </div>

                    {/* Toolbar: search + filter role */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <label className="input input-bordered flex items-center gap-2 w-full sm:flex-1 h-12">
                            <Search className="w-4 h-4 opacity-60 shrink-0" />
                            <input
                                type="text"
                                className="grow w-full bg-transparent"
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>
                        <select
                            className="select select-bordered w-full sm:w-52 h-12"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Semua Role</option>
                            {ROLES.map((r) => (
                                <option key={r} value={r} className="capitalize">{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length === 0 && (
                                        <tr><td colSpan={4} className="text-center text-gray-400 py-8">Tidak ada user yang cocok.</td></tr>
                                    )}
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-600">{user.email}</td>
                                            <td>
                                                <span className={`badge badge-outline capitalize ${ROLE_BADGE[user.role] || 'badge-ghost'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex justify-end">
                                                    <Link className="btn btn-warning btn-outline btn-sm" href={route('admin.users.edit', user.id)}>
                                                        <Pencil className="w-4 h-4 mr-1" /> Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination links={users.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
