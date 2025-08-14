import QrCode from '@/Components/QrCode'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

function Index() {
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = (data) => {
        setIsScanning(false); // sembunyikan scanner

        router.post(route('ticket.validate'), { qr_data: data }, {
            onSuccess: (params) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'QR berhasil divalidasi.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: errors.message || 'QR tidak valid atau sudah digunakan.',
                });
            }
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Qr Scanner" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Ticket Card */}
                    <div className="card bg-base-100 shadow-2xl border">
                        <div className="card-body">
                            <h2 className="card-title">Qr Scanner</h2>
                        </div>
                        {!isScanning && (
                            <button
                                onClick={() => setIsScanning(true)}
                                className="bg-blue-600 text-white px-4 py-2 m-10 rounded"
                            >
                                Mulai Scan
                            </button>
                        )}

                        {isScanning && (
                            <div className="mt-4 mb-4">
                                <QrCode onScanSuccess={handleScan} />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default Index