import { useState, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import axios from "axios";
import MySwal from "sweetalert2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";

const Create = ({ event, channel }) => {
    const { props } = usePage();
    const { data, setData, post, processing, errors } = useForm({
        quantity: 1,
        paymentMethod: 'BRIVA',
        name: '',
        email: '',
        phone: '',
        usia: '',
        pekerjaan: '',
        terms: false,
    });

    if (!event) {
        return (
            <>
                <AuthenticatedLayout>
                    <Head title="Checkout" />
                    <div className="container mx-auto px-4 py-16 text-center">
                        <h1 className="text-4xl font-bold mb-4">Event Tidak Ditemukan</h1>
                        <Link href="/events" className="btn btn-primary">
                            Kembali ke Daftar Event
                        </Link>
                    </div>
                </AuthenticatedLayout>
            </>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const totalPrice = event.price * data.quantity;
    const selectedChannel = channel.find((ch) => ch.code == data.paymentMethod);
    const adminFee = selectedChannel?.fee_customer?.flat ?? 0;
    const finalPrice = totalPrice + adminFee;

    const handlePayment = (e) => {
        e.preventDefault()

        MySwal.fire({
            title: 'Yakin ingin membeli tiket ini?',
            showCancelButton: true,
            confirmButtonText: 'Ya, Beli Tiket',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-ghost',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('transactions.store', event), {
                    preserveScroll: true,
                });
            }
        });

    }
    
    return (
        <>
            <AuthenticatedLayout>
                <Head title="Checkout" />
                <div className="container mx-auto px-4 py-8">
                    <div className=" mx-auto">
                        {/* Checkout Form */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Payment Form */}
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h3 className="text-xl font-bold mb-6">Detail Pendaftar</h3>

                                        {/* Pendaftar Info */}
                                        <div className="bg-base-200 rounded-lg p-4 mb-6">
                                            <div className="flex flex-col justify-between items-start gap-4">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label className="label-text font-medium">Nama Lengkap Sesuai KTP</label>
                                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Lengkap Sesuai KTP" className="input input-bordered w-full " required />
                                                    <InputError className={errors.name ? 'invalid' : ''} message={errors.name} />
                                                </div>
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label className="label-text font-medium">Email</label>
                                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="email@gmail.com" className="input input-bordered w-full " required />
                                                    <InputError className={errors.email ? 'invalid' : ''} message={errors.email} />
                                                </div>
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label className="label-text font-medium">Nomor HP</label>
                                                    <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="0895389118844" className="input input-bordered w-full " required />
                                                    <InputError className={errors.phone ? 'invalid' : ''} message={errors.phone} />
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-semibold mb-6">Silahkan isi pertanyaan dibahwah ini untuk melanjukat pendaftaran</h3>
                                        {/* Pendaftar Info */}
                                        <div className=" rounded-lg p-4 mb-6">
                                            <div className="flex flex-col justify-between items-start gap-4">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label className="label-text font-medium">Usia</label>
                                                    <input type="number" value={data.usia} onChange={(e) => setData('usia', e.target.value)} placeholder="19" className="input input-bordered w-full input-md" required />
                                                    <InputError className={errors.usia ? 'invalid' : ''} message={errors.usia} />
                                                </div>
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label className="label-text font-medium">Pekerjaan</label>
                                                    <input type="text" value={data.pekerjaan} onChange={(e) => setData('pekerjaan', e.target.value)} placeholder="Pekerjaan" className="input input-bordered w-full " required />
                                                    <InputError className={errors.pekerjaan ? 'invalid' : ''} message={errors.pekerjaan} />
                                                </div>

                                                <div className="flex flex-col gap-2 w-full">
                                                    <label className="label cursor-pointer">
                                                        <input type="checkbox" checked={data.terms} onChange={(e) => setData('terms', e.target.checked)} className="checkbox checkbox-sm" required />
                                                        <span className="mx-4 label-text">I agree with detikEvent Terms &amp; Conditions, and <a className="btn btn-link" href="https://www.detik.com/privacy-policy">detikEvent Privacy Policy</a>. Accept agreement and click continue to process your order.
                                                        </span>
                                                    </label>
                                                    <InputError className={errors.terms ? 'invalid' : ''} message={errors.terms} />
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h3 className="text-xl font-bold mb-6">Detail Pembelian</h3>

                                        {/* Event Info */}
                                        <div className="bg-base-200 rounded-lg p-4 mb-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-lg">{event.title}</h4>
                                                    <div className={`badge ${event.type === 'lomba' ? 'badge-secondary' : 'badge-primary'} mt-1`}>
                                                        {event.type === 'lomba' ? 'Lomba' : 'Event'}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-primary">
                                                        {formatPrice(event.price)}
                                                    </div>
                                                    <div className="text-sm text-base-content/70">per tiket</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity Selection */}
                                        <div className="form-control mb-6">
                                            <label className="label">
                                                <span className="label-text font-medium">Jumlah Tiket</span>
                                                <span className="label-text-alt">Max: {event.remainingQuota}</span>
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}
                                                    className="btn btn-circle btn-outline btn-sm"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={data.quantity}
                                                    onChange={(e) => setData('quantity', Math.max(1, Math.min(event.remainingQuota, parseInt(e.target.value) || 1)))}
                                                    className="input input-bordered w-20 text-center"
                                                    min="1"
                                                    max={event.remainingQuota}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setData('quantity', Math.min(event.remainingQuota, data.quantity + 1))}
                                                    className="btn btn-circle btn-outline btn-sm"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="form-control mb-6">
                                            <label className="label">
                                                <span className="label-text font-medium">Metode Pembayaran</span>
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {channel.map(method => (
                                                    <label key={method.code} className="cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="payment-method"
                                                            value={method.code}
                                                            onChange={(e) => setData('paymentMethod', e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`border-2 rounded-lg p-4 transition-colors ${data.paymentMethod === method.code
                                                            ? 'border-primary bg-primary/10'
                                                            : 'border-base-300 hover:border-primary/50'
                                                            }`}>
                                                            <div className="flex items-center space-x-3">
                                                                <img src={method.icon_url} className="w-16" alt={method.name} />
                                                                <span className="font-medium">{method.name}</span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="card bg-base-100 shadow-xl sticky top-8">
                                    <div className="card-body">
                                        <h3 className="text-xl font-bold mb-4">Ringkasan Pesanan</h3>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between">
                                                <span>Tiket ({data.quantity}x)</span>
                                                <span>{formatPrice(totalPrice)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-base-content/70">
                                                <span>Biaya Admin </span>
                                                <span>{formatPrice(adminFee)}</span>
                                            </div>
                                            <div className="divider my-2"></div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total</span>
                                                <span className="text-primary">{formatPrice(finalPrice)}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            className="btn btn-primary w-full btn-lg"
                                        >
                                            Bayar Sekarang
                                        </button>

                                        <div className="text-center mt-4">
                                            <Link to={`/events/${event.id}`} className="btn btn-ghost btn-sm">
                                                ← Kembali ke Detail Event
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </AuthenticatedLayout>
        </>

    );
};

export default Create;