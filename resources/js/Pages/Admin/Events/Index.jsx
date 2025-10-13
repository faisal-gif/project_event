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

    const formatPriceRange = (range) => {
        if (!range || range.length === 0) return "N/A";
        const [min, max] = range;

        if (min === max) {
            return min > 0 ? formatPrice(min) : 'Gratis';
        }
        return `${formatPrice(min)} - ${formatPrice(max)}`;
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
                                        <th>Price Range</th>
                                        <th>Total Quota</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {events.map((event, index) => (
                                        <tr key={event.id}>
                                            <td>{index + 1}</td>
                                            <td>{event.title}</td>
                                            <td>{event.category.name}</td>
                                            <td>{formatPriceRange(event.price_range)}</td>
                                            <td>{event.total_quota}</td>

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