import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'
import { data } from 'autoprefixer';
import { Eye } from 'lucide-react';
import React from 'react'

function Index({ events }) {


    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'unused': return 'badge-warning';
            case 'used': return 'badge-success';
            case 'expired': return 'badge-error';
            default: return 'badge-neutral';
        }
    };


    return (
        <AuthenticatedLayout>
            <Head title="Events" />
            <div className="container mx-auto px-4 py-8">
                <div className="card bg-base-200 shadow-sm mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-2">Events</h2>
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <p className="card-text">Here is the list of events</p>
                            <Link href={route('events.create')} className='btn btn-primary mt-10'>Tambah Event</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nama Event</th>
                                      
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Quota</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {events.map((event, index) => (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{event.title}</td>
                                            <td>{event.category.name}</td>
                                            <td>{formatPrice(event.price)}</td>
                                            <td>{event.quota}</td>

                                            <td> <div className='flex gap-2'>
                                                <Link className='btn btn-sm btn-primary' href={route('events.show', event)}>
                                                    Detail
                                                </Link>

                                                <Link className='btn btn-sm btn-warning' href={route('events.edit', event)}>
                                                    Edit
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
        </AuthenticatedLayout >
    )
}

export default Index