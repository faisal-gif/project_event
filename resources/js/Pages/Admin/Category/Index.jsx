import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import React from 'react';
import DynamicIcon from '@/Components/DynamicIcon';

function Index({ categories }) {
    return (
        <AuthenticatedLayout>
            <Head title="Events" />
            <div className="container mx-auto px-4 py-8">
                <div className="card bg-base-200 shadow-sm mb-8">
                    <div className="card-body">
                        <h2 className="card-title">Category</h2>
                        <div className="flex flex-wrap gap-4 justify-end items-center">
                            <Link href={route('category.create')} className='btn btn-primary btn-md mt-10'>
                                Tambah Event
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Icon</th>
                                        <th>Name</th>
                                        <th>Slug</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {categories.map((category, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <DynamicIcon name={category.icon} />
                                            </td>
                                            <td>{category.name}</td>
                                            <td>{category.slug}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <Link
                                                        className="btn btn-sm btn-warning"
                                                        href={route('category.edit', category)}
                                                    >
                                                        <Edit size={16} />
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

export default Index;