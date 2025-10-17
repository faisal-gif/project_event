import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Ticket, Calendar, MapPin, Minus, Plus } from 'lucide-react';
import Card from '@/Components/ui/Card';
import Seo from '@/Components/Seo';

function EventDetail({ event, seo }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);

    if (!event) {
        return (
            <GuestLayout>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Event Tidak Ditemukan</h1>
                    <Link href={route('events.guest')} className="btn btn-primary">
                        Kembali ke Daftar Event
                    </Link>
                </div>
            </GuestLayout>
        );
    }

    const formatPrice = (price) => {
        if (price === 0) return 'Gratis';
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

    const handleTicketSelect = (ticketType) => {
        setSelectedTicket(ticketType);
        setQuantity(1); // Reset quantity to 1 when a new ticket is selected
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            // Clamp the quantity between 1 and the available quota/limit
            return Math.max(1, Math.min(newQuantity, selectedTicket.remaining_quota, event.limit_ticket_user));
        });
    };

    return (
        <>
            <Seo
                title={seo.title}
                description={seo.description}
                image={seo.image}
                url={seo.url}
                type="article"
            />

            <GuestLayout>
                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <div className="text-sm breadcrumbs mb-6">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href={route('events.guest')}>Event</Link></li>
                            <li>{event.title}</li>
                        </ul>
                    </div>

                    <div className='grid md:grid-cols-5 gap-4'>

                        <Card className={'bg-base-100 shadow-xl rounded-xl h-full lg:h-[50vw] md:col-span-2'}>
                            <img src={`/storage/${event.image}`} alt={event.title} className="w-full h-full object-cover rounded-xl" />
                        </Card>
                        <div className='flex flex-col gap-4 w-full md:col-span-3'>
                            <Card className="bg-base-100 shadow-xl  border border-base-300 ">
                                <div className="card-body">
                                    <div className="badge badge-outline">{event.category.name}</div>
                                    <h1 className="card-title text-3xl font-bold">{event.title}</h1>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 my-2">
                                        <div className="flex items-center"><Calendar size={16} className="mr-1" /> {formatDate(event.start_date)}</div>
                                        <div className="flex items-center"><MapPin size={16} className="mr-1" /> {event.location_type}</div>
                                    </div>
                                    {event.location_details && (
                                        <div className='space-y-4'>
                                            <div className="flex items-center gap-2"><MapPin size={16} className="my-2" /> Location Details </div>
                                            <div className='text-sm'>
                                                {event.location_details}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                            {/* Deskrpsi */}
                            <div className="collapse collapse-arrow bg-base-100 shadow-xl border border-base-300">
                                <input type="checkbox" defaultChecked />
                                <div className="collapse-title font-semibold">Deskripsi</div>
                                <div className="collapse-content text-sm w-full">
                                    <div className="prose prose-sm prose-p:my-2 prose-h2:mb-1 prose-li:my-0 m-4 max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                                </div>
                            </div>

                            {/* Requirements*/}
                            <div className="collapse collapse-arrow bg-base-100 shadow-xl border border-base-300">
                                <input type="checkbox" />
                                <div className="collapse-title font-semibold">Requirements</div>
                                <div className="collapse-content text-sm">
                                    <div className="prose prose-sm prose-p:my-2 prose-h2:mb-1 prose-li:my-0 prose-ul:list-disc prose-ul:pl-5 m-4 max-w-none" dangerouslySetInnerHTML={{ __html: event.requirements }} />
                                </div>
                            </div>


                        </div>

                    </div>

                    <div className='grid md:grid-cols-5 gap-4'>
                        {/* Ticket Selection Section */}
                        <div className="mt-8 md:col-span-3">
                            <h2 className="text-2xl font-bold mb-4 flex items-center"><Ticket className="mr-2" /> Pilih Tiket Anda</h2>
                            <div className="space-y-4">
                                {event.ticket_types && event.ticket_types.length > 0 ? (
                                    event.ticket_types.map(ticketType => {
                                        const isSoldOut = ticketType.remaining_quota === 0;
                                        const isSelected = selectedTicket && selectedTicket.id === ticketType.id;

                                        return (
                                            <div
                                                key={ticketType.id}
                                                className={`card bg-base-200 shadow-md transition-all hover:shadow-lg cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''} ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => !isSoldOut && handleTicketSelect(ticketType)}
                                            >
                                                <div className="card-body flex-row justify-between items-center">
                                                    <div>
                                                        <h3 className="card-title text-xl">{ticketType.name}</h3>
                                                        <p className="font-bold text-primary text-lg">{formatPrice(ticketType.price)}</p>
                                                        <p className="text-sm text-gray-500">Sisa kuota: {ticketType.remaining_quota}</p>
                                                        {isSoldOut && <span className="badge badge-error badge-lg mt-2">Habis</span>}
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="ticket-type"
                                                        className="radio radio-primary"
                                                        checked={isSelected}
                                                        onChange={() => !isSoldOut && handleTicketSelect(ticketType)}
                                                        disabled={isSoldOut}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="card bg-base-200"><div className="card-body"><p>Tiket untuk event ini belum tersedia.</p></div></div>
                                )}
                            </div>
                        </div>

                        {/* Purchase Summary Section */}
                        <div className=" md:col-span-2 mt-8 card bg-base-100 shadow-xl border border-base-300">
                            <div className="card-body">
                                <h2 className="card-title text-2xl">Detail Pembelian</h2>
                                <div className='divider'></div>
                                {selectedTicket ? (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className='font-semibold text-lg'>{selectedTicket.name}</p>
                                                <p className="font-bold text-primary text-xl">{formatPrice(selectedTicket.price)}</p>
                                            </div>
                                            <div className="join">
                                                <button onClick={() => handleQuantityChange(-1)} className="btn join-item" disabled={quantity <= 1}>-</button>
                                                <input type="text" readOnly value={quantity} className="input input-bordered join-item w-16 text-center" />
                                                <button onClick={() => handleQuantityChange(1)} className="btn join-item" disabled={quantity >= selectedTicket.remaining_quota || quantity >= event.limit_ticket_user}>+</button>
                                            </div>
                                        </div>
                                        <div className="divider"></div>
                                        <div className="flex justify-between items-center font-bold text-xl">
                                            <span>Total Harga</span>
                                            <span>{formatPrice(selectedTicket.price * quantity)}</span>
                                        </div>
                                        <div className="card-actions justify-end mt-4">
                                            <Link
                                                href={route('transactions.checkout', { ticket_type: selectedTicket.id, quantity: quantity })}
                                                className={`btn btn-primary ${quantity === 0 ? 'btn-disabled' : ''}`}
                                                as="button"
                                                disabled={quantity === 0}
                                            >
                                                Beli Tiket
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">Pilih salah satu tiket untuk melanjutkan.</p>
                                        </div>
                                        <div className="divider"></div>
                                        <div className="flex justify-between items-center font-bold text-xl">
                                            <span>Total Harga</span>
                                            <span>{formatPrice(0)}</span>
                                        </div>
                                        <div className="card-actions justify-end mt-4">
                                            <button className="btn btn-primary" disabled>Beli Tiket</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </GuestLayout>
        </>
    )
}

export default EventDetail