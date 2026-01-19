import Card from '@/Components/ui/Card'
import { formatDate, formatRupiah } from '@/Utils/formatter';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react'
import React from 'react'

function TicketQr({ data }) {   
    console.log(data);
    
    return (
        <Card className="overflow-hidden bg-base-100 shadow-2xl">
            {/* Header */}
            <div className="bg-primary text-primary-content p-6">
                <h2 className="text-xl font-bold mb-1">{data.event.title}</h2>
                <p className="opacity-90">{data.transaction.ticket_type.name}</p>
            </div>

            <div className="p-6">
                {/* QR Code */}
                <div className="flex justify-center mb-6">
                    <div className="p-12 bg-white rounded-lg border-2 border-base-300 border-dashed">
                        {data.qr_image ? (
                            <img
                                src={`/storage/${data.qr_image}`}
                                alt="QR Code Tiket"
                                className="mx-auto w-48"
                            />
                        ) : (
                            <div className="w-48 h-48 flex items-center justify-center">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mb-6">
                    Tunjukkan QR Code ini di pintu masuk
                </p>

                <div className="text-center mb-6 p-3 bg-base-300 rounded-lg">
                    <p className="text-xs text-muted-foreground">Kode Tiket</p>
                    <p className="font-mono font-bold text-lg tracking-wider">{data.ticket_code}</p>
                </div>

                <hr className="my-6" />

                {/* Event Details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span>{formatDate(data.event?.start_date)}</span> - <span>{formatDate(data.event?.end_date)}</span>
                    </div>

                    {data.event.location_details ? (
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <span>{data.event.location_details}</span>
                        </div>
                    ) : ""
                    }
                </div>

                <hr className="my-6" />

                {/* Buyer Details */}
                <div className="space-y-3">
                    <h3 className="font-semibold">Data Pembeli</h3>
                    <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{data.user.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{data.user.email}</span>
                    </div>
                    {data.user.phone && (
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{data.user.phone}</span>
                        </div>
                    )}

                </div>

                <hr className="my-6" />

                {/* Order Details */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Jumlah Tiket</p>
                        <p className="font-medium">{data.quantity} tiket</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                        <p className="font-bold text-lg text-primary">{formatRupiah(data.transaction.subtotal)}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-base-300/50 p-4 text-center text-xs text-muted-foreground">
                <p>Order ID: {data.transaction.reference}</p>
                <p>Dibeli pada: {new Date(data.transaction.updated_at).toLocaleString("id-ID")}</p>
            </div>
        </Card>
    )
}

export default TicketQr