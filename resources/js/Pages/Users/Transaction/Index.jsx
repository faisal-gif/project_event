import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react'
import { data } from 'autoprefixer';
import { Eye } from 'lucide-react';
import React from 'react'

function Index({ transactions }) {


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
            case 'PAID': return 'badge-success';
            case 'UNPAID': return 'badge-warning';
            case 'EXPIRED': return 'badge-error';
            default: return 'badge-neutral';
        }
    };


    return (
        <GuestLayout>
            <Head title="Transaction" />
            <div className="container mx-auto px-4 py-8">
                <div className="card bg-base-200 shadow-sm mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-2">Transaksi Kamu</h2>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>No Transaksi</th>
                                        <th>Event</th>
                                        <th>Payment Method</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {transactions.map((transaction) => (
                                        <tr>
                                            <td>{transaction.reference}</td>
                                            <td>{transaction.event.title}</td>
                                            <td>{transaction.payment_method}</td>
                                            <td>{transaction.quantity}</td>
                                            <td>{formatPrice(transaction.subtotal)}</td>
                                            <td><div className={`badge ${getStatusBadge(transaction.status)} badge-md mb-4 mx-auto`}>
                                                {transaction.status}
                                            </div></td>
                                            <td>
                                                <Link className='btn btn-accent btn-sm text-white' href={route('transactions.status',{'tripay_reference' : transaction.reference})} >
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