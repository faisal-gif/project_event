import Card from '@/Components/ui/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react'
import { data } from 'autoprefixer';
import { Calendar, Clock, Eye, MapPin, QrCode, Ticket } from 'lucide-react';
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
                return <div className="badge badge-success badge-outline">Valid</div>;
            case 'used':
                return <div className="badge badge-warning badge-outline">Digunakan</div>;
            case 'expired':
                return <div className="badge badge-error badge-outline">Kadaluarsa</div>;
            default:
                return <div className="badge badge-ghost">UNKNOWN</div>;
        }
    };


    return (
        <GuestLayout>
            <Head title="Tickets" />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-2">Tiket Saya</h1>
                <p className="text-secondary mb-8">
                    Kelola semua tiket event Anda di sini
                </p>
                {/* Tickets Grid */}
                {tickets.length === 0 ? (
                    <Card className="shadow-medium">
                        <Card.Body className="p-12 text-center">
                            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                            <p className="text-muted-foreground">
                                {tickets ? "Try adjusting your search terms." : "You haven't purchased any tickets yet."}
                            </p>
                        </Card.Body>
                    </Card>
                ) : (
                    <div className="grid gap-6 grid-cols-1">
                        {tickets.map((ticket) => (
                            <Link href={route('tickets.show', ticket)} >
                                <Card key={ticket.id} className="shadow-md hover:shadow-glow transition-all duration-300 group rounded-lg border border-2 border-primary">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="sm:w-36 h-36 sm:h-auto relative">
                                            <img
                                                src={'/storage/' + ticket.event.image}
                                                alt={ticket.event.title}
                                                className="w-full h-full object-cover rounded-l-lg"
                                            />

                                        </div>
                                        <div className="flex-1 p-4">
                                            <div className="pb-4 flex items-start justify-between">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-2 ">
                                                        {getStatusBadge(ticket.status)}
                                                        <div
                                                            className={'badge badge-primary badge-outline capitalize'}
                                                        >
                                                            {ticket.event.location_type}
                                                        </div>
                                                    </div>
                                                    <Card.Title className="text-lg leading-tight">
                                                        {ticket.event.title}
                                                    </Card.Title>

                                                </div>
                                                <QrCode className={`h-5 w-5 text-primary`} />
                                            </div>

                                            <div className="pb-4 space-y-2">
                                                {/* Event Details */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-secondary">
                                                        <Calendar className="h-4 w-4 " />
                                                        <span>{new Date(ticket.event.start_date).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}</span>
                                                    </div>

                                                    {ticket.event.location_details ? (
                                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                            <span className="break-words">{ticket.event.location_type}</span>
                                                        </div>
                                                    ) : ""
                                                    }

                                                </div>

                                                {/* Ticket Info */}


                                                {/* Actions */}

                                            </div>

                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-300">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Ticket className="h-4 w-4" />
                                                    <span>{ticket.quantity} tiket</span>
                                                </div>
                                                <span className={`font-semibold text-primary`}>
                                                    {formatPrice(ticket.transaction.subtotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </GuestLayout >
    )
}

export default Index