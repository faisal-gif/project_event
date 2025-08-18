import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react'
import { data } from 'autoprefixer';
import { Eye } from 'lucide-react';
import React from 'react'

function Index({ tickets }) {


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
            case 'unused':
                return <div className="badge badge-success">VALID</div>;
            case 'used':
                return <div className="badge badge-warning">DIGUNAKAN</div>;
            case 'expired':
                return <div className="badge badge-error">KADALUARSA</div>;
            default:
                return <div className="badge badge-ghost">UNKNOWN</div>;
        }
    };


    return (
        <GuestLayout>
            <Head title="Tickets" />
            <div className="container mx-auto px-4 py-8">
                <div className="card bg-base-200 shadow-sm mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-2">Ticket Kamu</h2>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>No Ticket</th>
                                        <th className='hidden lg:table-cell'>Event</th>
                                        <th className='hidden lg:table-cell'>No Transaksi</th>
                                        <th className='hidden lg:table-cell'>Quantity</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {tickets.map((ticket) => (
                                        <tr>
                                            <td><Link href={route('tickets.show', ticket)} className='btn btn-link text-blue-800'>{ticket.ticket_code}</Link></td>
                                            <td className='hidden lg:table-cell'> {ticket.event.title}</td>
                                            <td className='hidden lg:table-cell'> {ticket.transaction.reference}</td>
                                            <td className='hidden lg:table-cell'>{ticket.quantity}</td>
                                            <td>{getStatusBadge(ticket.status)}</td>
                                            <td className='hidden lg:table-cell'>
                                                <Link className='btn btn-sm btn-primary' href={route('tickets.show', ticket)}>
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}


                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </GuestLayout >
    )
}

export default Index