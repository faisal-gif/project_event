import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Ticket, Calendar, MapPin, Minus, Plus, Tag } from 'lucide-react';
import Card from '@/Components/ui/Card';
import Seo from '@/Components/Seo';

function EventDetail({ event, seo }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const formatDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Ambil komponen tanggal, bulan, dan tahun
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleDateString("id-ID", { month: "long" });
        const startYear = startDate.getFullYear();

        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString("id-ID", { month: "long" });
        const endYear = endDate.getFullYear();

        // 1. Jika tanggal, bulan, dan tahunnya sama (acara satu hari)
        if (startDay === endDay && startMonth === endMonth && startYear === endYear) {
            return `${startDay} ${startMonth} ${startYear}`;
        }

        // 2. Jika bulan dan tahun sama (acara beberapa hari di bulan yg sama)
        if (startMonth === endMonth && startYear === endYear) {
            return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
        }

        // 3. Jika tahun sama, tapi bulan beda
        if (startYear === endYear) {
            return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
        }

        // 4. Default: Jika beda tahun
        return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
    };

    // Definisikan 'now' sekali di luar map untuk efisiensi
    const now = new Date();

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

                    <div className="card rounded-2xl bg-gradient-to-br from-primary/5 via-background to-[#b41d1d]/20 p-4 md:p-12 shadow-lg mb-4">

                        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
                            {/* Event Poster - Portrait */}
                            <div className="order-2 lg:order-1">
                                <div className="relative mx-auto max-w-md overflow-hidden rounded-xl shadow-xl transition-transform duration-500 hover:scale-[1.02] lg:mx-0 lg:max-w-[400px]">
                                    <img
                                        src={`/storage/${event.image}`}
                                        alt={event.title}
                                        className="h-auto w-full object-contain"
                                        style={{ maxHeight: '800px' }}
                                    />
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="order-1 flex flex-col justify-center lg:order-2">
                                <div className="badge badge-warning flex items-center p-3 text-white">
                                    <Tag className="mr-2 h-3 w-3" />
                                    {event.category.name}
                                </div>

                                <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                                    {event.title}
                                </h1>

                                <div className="space-y-4">
                                    {event.start_date && event.end_date && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Calendar className="h-5 w-5 text-primary shrink-0" />
                                            <span className="font-bold text-lg">{formatDateRange(event.start_date, event.end_date)}</span>
                                        </div>
                                    )}
                                    {event.location_details && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <MapPin className="h-5 w-5 text-primary shrink-0" />
                                            <span className="text-sm md:text-lg">{event.location_details}</span>
                                        </div>
                                    )}

                                    <div className="badge badge-outline badge-accent flex items-center p-2 ">Event {event.location_type}</div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className='grid md:grid-cols-5 gap-4'>
                        <div className='flex flex-col gap-4 w-full md:col-span-3'>

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
                        <div className='flex flex-col gap-4 w-full md:col-span-2'>
                            {/* Ticket Selection Section */}

                            <div className="md:col-span-3">
                                <div className="space-y-4">
                                    {event.ticket_types && event.ticket_types.length > 0 ? (
                                        event.ticket_types.map(ticketType => {
                                            const isSoldOut = ticketType.remaining_quota === 0;
                                            const isSelected = selectedTicket && selectedTicket.id === ticketType.id;

                                            // --- LOGIKA TANGGAL DIMULAI ---
                                            const now = new Date();

                                            const hasStartDate = !!ticketType.purchase_date;
                                            const hasEndDate = !!ticketType.end_purchase_date;

                                            const startDate = hasStartDate ? new Date(ticketType.purchase_date) : null;
                                            const endDate = hasEndDate ? new Date(ticketType.end_purchase_date) : null;

                                            const isBeforePurchase = hasStartDate ? now < startDate : false;
                                            const isAfterPurchase = hasEndDate ? now > endDate : false;

                                            // Gabungkan semua kondisi disabled
                                            const isDisabled = isSoldOut || isBeforePurchase || isAfterPurchase;
                                            // --- LOGIKA TANGGAL SELESAI ---

                                            return (
                                                <div
                                                    key={ticketType.id}
                                                    className={`card bg-base-200 shadow-md transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
                                                        } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                                                    onClick={() => !isDisabled && handleTicketSelect(ticketType)}
                                                >
                                                    <div className="card-body flex-row justify-between items-center">
                                                        <div>
                                                            <h3 className="card-title text-xl">{ticketType.name}</h3>
                                                            <p className='text-sm'>{ticketType.description}</p>
                                                            {ticketType.purchase_date && ticketType.end_purchase_date && (
                                                                <div className="flex items-start">
                                                                    <span className="flex-1 text-xs">
                                                                        {hasStartDate ? formatDate(ticketType.purchase_date) : '-'} -
                                                                        <br />
                                                                        {hasEndDate ? formatDate(ticketType.end_purchase_date) : '-'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-gray-500">Sisa kuota: {ticketType.remaining_quota}</p>

                                                            {/* --- TAMBAHKAN BADGE KONDISI --- */}
                                                            {isSoldOut && <span className="badge badge-error badge-sm mt-2">Habis</span>}
                                                            {!isSoldOut && isBeforePurchase && <span className="badge badge-outline badge-warning badge-sm mt-2">Belum dibuka</span>}
                                                            {!isSoldOut && isAfterPurchase && <span className="badge badge-outline badge-error badge-sm mt-2">Sudah ditutup</span>}
                                                            {/* --- BADGE SELESAI --- */}
                                                        </div>

                                                        <div className='flex gap-2 items-center'>
                                                            <p className="font-bold text-primary text-lg">{formatPrice(ticketType.price)}</p>
                                                            <input
                                                                type="radio"
                                                                name="ticket-type"
                                                                className="radio radio-primary"
                                                                checked={isSelected}
                                                                onChange={() => !isDisabled && handleTicketSelect(ticketType)}
                                                                disabled={isDisabled}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="card bg-base-200">
                                            <div className="card-body">
                                                <p>Tiket untuk event ini belum tersedia.</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Purchase Summary Section */}
                            <div className="md:col-span-2 card bg-base-100 shadow-xl border border-base-300">
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

                    <div className='grid md:grid-cols-5 gap-4'>
                        {/* Ticket Selection Section */}

                    </div>

                </div>
            </GuestLayout >
        </>
    )
}

export default EventDetail