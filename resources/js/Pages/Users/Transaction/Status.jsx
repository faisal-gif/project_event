import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react'

function Status({ trx, event }) {

    const { flash } = usePage().props

    useEffect(() => {
        if (flash?.checkout_url) {
            window.location.href = flash.checkout_url
        }
    }, [flash])

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID': return 'text-success';
            case 'UNPAID': return 'text-warning';
            case 'EXPIRED': return 'text-error';
            default: return 'text-base-content';
        }
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
        <AuthenticatedLayout>
            <Head title="Status Pembayaran" />
            <div className="container mx-auto px-4 py-8">
                <div className=" mx-auto">
                    {/* Breadcrumb */}


                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4">Checkout Pembayaran</h1>
                        <p className="text-lg text-base-content/70">
                            Selesaikan pembelian tiket Anda
                        </p>
                    </div>

                    <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
                        <div className="card-body text-center">

                            <div className="text-6xl mb-4">
                                {trx.status === 'PAID' ? '✅' :
                                    trx.status === 'UNPAID' ? '⏳' : '❌'}
                            </div>
                            <div className={`badge ${getStatusBadge(trx.status)} badge-lg mb-4 mx-auto`}>
                                {trx.status}
                            </div>

                            <h2 className="text-2xl font-bold mb-4">Status Pembayaran</h2>
                            <div className="bg-base-200 rounded-lg p-2 lg:p-6 text-left lg:mx-56 ">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span>Reference ID:</span>
                                        <span className="font-mono text-sm">{trx.reference}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Event:</span>
                                        <span className="font-medium">{trx.event.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Metode:</span>
                                        <span>{trx.payment_method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total:</span>
                                        <span className="font-bold">{formatPrice(trx.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status:</span>
                                        <span className={`font-bold ${getStatusColor(trx.status)}`}>
                                            {trx.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-x-4">
                                {trx.status === 'UNPAID' && (
                                    <a
                                        href={trx.checkout_url}
                                        className="btn btn-primary"
                                    >
                                        Coba Bayar Lagi
                                    </a>
                                )}
                                <Link href={route('events.user.index')} className="btn btn-ghost">
                                    Kembali ke Event
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default Status