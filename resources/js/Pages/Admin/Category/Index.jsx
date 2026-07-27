import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DynamicIcon from '@/Components/DynamicIcon';
import { Pencil, Plus, FolderTree } from 'lucide-react';

export default function Index({ categories }) {
    return (
        <AuthenticatedLayout>
            <Head title="Kategori" />

            <div className="py-10">
                <div className="mx-auto max-w-4xl px-4 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2">
                            <FolderTree className="w-6 h-6 text-primary" />
                            <h1 className="font-bold text-2xl">Kategori</h1>
                        </div>
                        <Link href={route('admin.category.create')} className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-1" /> Tambah Kategori
                        </Link>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Icon</th>
                                        <th>Nama</th>
                                        <th>Slug</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 && (
                                        <tr><td colSpan={5} className="text-center text-gray-400 py-8">Belum ada kategori.</td></tr>
                                    )}
                                    {categories.map((category, index) => (
                                        <tr key={category.id} className="hover">
                                            <td className="text-gray-400">{index + 1}</td>
                                            <td>
                                                <span className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-primary">
                                                    <DynamicIcon name={category.icon} />
                                                </span>
                                            </td>
                                            <td className="font-medium">{category.name}</td>
                                            <td className="text-sm text-gray-500">{category.slug}</td>
                                            <td>
                                                <div className="flex justify-end">
                                                    <Link className="btn btn-sm btn-warning btn-outline" href={route('admin.category.edit', category)}>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
