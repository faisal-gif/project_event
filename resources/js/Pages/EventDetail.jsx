import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
// Hapus sweetalert2 dari import karena kita tidak memakainya lagi
import { Ticket, Calendar, MapPin, Minus, Plus, Tag, Share2, Copy, Check } from 'lucide-react'; // Tambahkan Check
import Card from '@/Components/ui/Card';
import Seo from '@/Components/Seo';
import { formatCompact } from '@/Utils/formatter';

function EventDetail({ event, seo }) {
    const { auth } = usePage().props;

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // State untuk melacak status copy link
    const [copiedStandard, setCopiedStandard] = useState(false);
    const [copiedAffiliate, setCopiedAffiliate] = useState(false);

    const formatDateRange = (start, end) => {
        // ... (Fungsi tetap sama seperti sebelumnya)
        const startDate = new Date(start);
        const endDate = new Date(end);

        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleDateString("id-ID", { month: "long" });
        const startYear = startDate.getFullYear();

        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString("id-ID", { month: "long" });
        const endYear = endDate.getFullYear();

        if (startDay === endDay && startMonth === endMonth && startYear === endYear) {
            return `${startDay} ${startMonth} ${startYear}`;
        }
        if (startMonth === endMonth && startYear === endYear) {
            return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
        }
        if (startYear === endYear) {
            return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
        }
        return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
    };

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
        setQuantity(1);
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            return Math.max(1, Math.min(newQuantity, selectedTicket.remaining_quota, event.limit_ticket_user));
        });
    };

    // --- LOGIKA COPY LINK (DIUBAH) ---
    const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
    const standardLink = currentUrl;
    const affiliateLink = auth?.user ? `${currentUrl}?ref=${auth.user.id}` : null;

    const handleCopy = (link, type) => {
        navigator.clipboard.writeText(link);

        // Ubah state berdasarkan tombol mana yang diklik
        if (type === 'standard') {
            setCopiedStandard(true);
            setTimeout(() => setCopiedStandard(false), 2000); // Kembalikan setelah 2 detik
        } else {
            setCopiedAffiliate(true);
            setTimeout(() => setCopiedAffiliate(false), 2000);
        }
    };
    // ---------------------------------

    return (
        <>
            <Seo
                title={seo.title}
                description={seo.description}
                image={seo.image}
                url={seo.url}
            />

            <GuestLayout>
                <div className="container max-w-7xl mx-auto px-2 py-8">
                    <div className="text-sm breadcrumbs mb-6">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href={route('events.guest')}>Event</Link></li>
                            <li>{event.title}</li>
                        </ul>
                    </div>

                    <div className="card rounded-2xl bg-gradient-to-br from-primary/5 via-background to-[#b41d1d]/20 p-2 md:p-12 shadow-lg mb-4">
                        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
                            {/* Event Poster */}
                            <div className="order-2 lg:order-1">
                                <div className="relative mx-auto max-w-md overflow-hidden rounded-xl shadow-xl transition-transform duration-500 hover:scale-[1.02] lg:mx-0 lg:max-w-[400px]">
                                    <img
                                        src={`/storage/${event.image}`}
                                        alt={event.title}
                                        className="h-auto w-full object-contain bg-base-100"
                                        style={{ maxHeight: '800px' }}
                                    />
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="order-1 flex flex-col justify-center lg:order-2">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="badge badge-warning flex items-center p-3 text-white">
                                        <Tag className="mr-2 h-3 w-3" />
                                        {event.category.name}
                                    </div>

                                    <button
                                        onClick={() => document.getElementById('share_modal').showModal()}
                                        className="btn btn-outline btn-sm shadow-sm"
                                    >
                                        <Share2 className="h-4 w-4 mr-1" /> Bagikan
                                    </button>
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
                            {/* Deskripsi */}
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

                                            const now = new Date();
                                            const hasStartDate = !!ticketType.purchase_date;
                                            const hasEndDate = !!ticketType.end_purchase_date;
                                            const startDate = hasStartDate ? new Date(ticketType.purchase_date) : null;
                                            const endDate = hasEndDate ? new Date(ticketType.end_purchase_date) : null;

                                            const isBeforePurchase = hasStartDate ? now < startDate : false;
                                            const isAfterPurchase = hasEndDate ? now > endDate : false;
                                            const isDisabled = isSoldOut || isBeforePurchase || isAfterPurchase;

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
                                                                    <span className="flex-1 text-xs mt-1">
                                                                        {hasStartDate ? formatDate(ticketType.purchase_date) : '-'} - <br />
                                                                        {hasEndDate ? formatDate(ticketType.end_purchase_date) : '-'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-gray-500 mt-1">Sisa kuota: {ticketType.remaining_quota}</p>

                                                            {isSoldOut && <span className="badge badge-error badge-sm mt-2">Habis</span>}
                                                            {!isSoldOut && isBeforePurchase && <span className="badge badge-outline badge-warning badge-sm mt-2">Belum dibuka</span>}
                                                            {!isSoldOut && isAfterPurchase && <span className="badge badge-outline badge-error badge-sm mt-2">Sudah ditutup</span>}
                                                        </div>

                                                        <div className='flex gap-2 items-center'>
                                                            <p className="font-bold text-primary text-lg">Rp. {formatCompact(ticketType.price)}</p>
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
                </div>
            </GuestLayout>

            {/* MODAL SHARE */}
            <dialog id="share_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-xl mb-4">Bagikan Event Ini</h3>

                    {/* Input Link Reguler */}
                    <div className="form-control w-full mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Link Event</span>
                        </label>
                        <div className="join w-full">
                            <input
                                type="text"
                                readOnly
                                value={standardLink}
                                className="input input-bordered join-item w-full bg-base-200 text-sm md:text-base"
                            />
                            <button
                                onClick={() => handleCopy(standardLink, 'standard')}
                                className={`btn join-item w-24 ${copiedStandard ? 'btn-success text-white' : 'btn-primary'}`}
                                title={copiedStandard ? "Tersalin!" : "Salin Link"}
                            >
                                {copiedStandard ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Input Link Afiliasi (Hanya Muncul Jika Fitur Aktif & User Login) */}
                    {!!event.is_affiliate_enabled && auth?.user && (
                        <div className="form-control w-full mb-2">
                            <label className="label">
                                <span className="label-text font-semibold">Link Afiliasi Anda</span>
                                <span className="label-text-alt text-success font-bold">Dapatkan Komisi!</span>
                            </label>
                            <div className="join w-full">
                                <input
                                    type="text"
                                    readOnly
                                    value={affiliateLink}
                                    className="input input-bordered input-success join-item w-full bg-base-200 text-sm md:text-base"
                                />
                                <button
                                    onClick={() => handleCopy(affiliateLink, 'affiliate')}
                                    className={`btn join-item w-24 text-white ${copiedAffiliate ? 'bg-green-700 hover:bg-green-800' : 'btn-success'}`}
                                    title={copiedAffiliate ? "Tersalin!" : "Salin Link Afiliasi"}
                                >
                                    {copiedAffiliate ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                </button>
                            </div>
                            <label className="label pt-1">
                                <span className="label-text-alt text-gray-500">
                                    Bagikan link ini dan dapatkan komisi dari setiap tiket yang terjual.
                                </span>
                            </label>
                        </div>
                    )}

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Tutup</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}

export default EventDetail;