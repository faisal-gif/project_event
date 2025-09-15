import Card from '@/Components/ui/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react'
import { data } from 'autoprefixer';
import { Clock, Eye, Ticket } from 'lucide-react';
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

                {/* Tickets Grid */}
                {tickets.length === 0 ? (
                    <Card className="shadow-medium">
                        <Card.Body className="p-12 text-center">
                            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? "Try adjusting your search terms." : "You haven't purchased any tickets yet."}
                            </p>
                        </Card.Body>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {tickets.map((ticket) => (
                            <Card key={ticket.id} className="shadow-medium hover:shadow-glow transition-all duration-300 group">
                                <div className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <Card.Title className="text-lg leading-tight mb-2">
                                                {ticket.event.name}
                                            </Card.Title>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(ticket.status)}
                                                <div
                                                    className={'badge '}
                                                >
                                                    {ticket.locationType}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Card.Body className="space-y-4">
                                    {/* Event Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(ticket.event.start_date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>

                                        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{ticket.event.start_date} WIB</span>
                                        </div> */}

                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span className="break-words">{ticket.event.location_type}</span>
                                        </div>
                                    </div>

                                    {/* Ticket Info */}
                                    <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Ticket Code:</span>
                                            <span className="font-mono font-medium">{ticket.ticket_code}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Quantity:</span>
                                            <span className="font-medium">{ticket.quantity}x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Price:</span>
                                            <span className="font-medium">{formatPrice(ticket.event.price)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <button className="btn btn-primary flex-1 gap-2">
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </button>
                                       
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}

            </div>
        </GuestLayout >
    )
}

export default Index