import ApplicationLogo from '@/Components/ApplicationLogo';
import Carousel from '@/Components/ui/Carousel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, Calendar } from 'lucide-react';
import React from 'react';

function WidgetHorizontal({ events }) {
    console.log(events);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatPriceRange = (range) => {
        if (!range || range.length === 0) return "N/A";
        const [min, max] = range;

        if (min === max) {
            return formatPrice(min);
        }
        return <><span className="text-sm font-normal">Mulai dari</span> {formatPrice(min)}</>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const formatDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const startDay = startDate.getDate();
        const endDay = endDate.getDate();

        const startMonth = startDate.toLocaleDateString("id-ID", { month: "short" });
        const endMonth = endDate.toLocaleDateString("id-ID", { month: "short" });
        const year = startDate.getFullYear();

        if (startMonth === endMonth) {
            return `${startDay} ${startMonth} ${year} - ${endDay} ${endMonth} ${year}`;
        }

        return `${startDay} ${startMonth} ${year} - ${endDay} ${endMonth} ${year}`;
    };
    return (
        <>
            <Head title="Widget Event" />
            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-12">
                <div className='w-full relative bg-gradient-to-br from-base-100 via-base-200 to-base-300 rounded-3xl p-10 space-y-8 shadow-xl border border-border/50 overflow-hidden'>
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-accent opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 space-y-4 min-w-[300px]">
                            <div className="inline-block">
                                <div className="text-2xl font-extrabold bg-gradient-to-r from-[#b41d1d] to-[#3f154f] bg-clip-text text-transparent mb-4 px-4 py-2 border-l-4 border-primary">
                                    <a
                                        href={'https://event.times.co.id/'}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <ApplicationLogo className="w-full h-10" />
                                    </a>
                                </div>
                            </div>
                            <h2 className="text-xl md:text-4xl font-extrabold text-[#b41d1d] leading-tight">
                                Bingung Cari Acara Seru?
                            </h2>
                            <p className="text-sm md:text-lg text-[#3f154f] font-semibold flex items-center gap-2">
                                Temukan berbagai acara menarik dan tak terlupakan di sini!
                            </p>
                        </div>

                        <a
                            href={'https://event.times.co.id/'}
                            target='_blank'
                            rel='noopener noreferrer'
                            className="hidden group md:inline-flex items-center gap-2 text-primary font-medium hover:underline transition"
                        >
                            Tiket Lainnya
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                    <Carousel opts={{ align: "start", loop: true }} className="w-full" plugins={[Autoplay()]}>
                        <Carousel.Content className="-ml-4">
                            {events.map((event) => (
                                <Carousel.Item
                                    key={event.id}
                                    className=" min-w-0 shrink-0 grow-0 basis-10/12 lg:basis-1/3"
                                >
                                    <div className="h-full">
                                        <div key={event.id} className="card w-full h-96 md:h-[500px] bg-base-100 transition-shadow">
                                            <figure className="w-full bg-base-200 flex items-center justify-center overflow-hidden">
                                                {event.image && event.image !== '' ? (
                                                    <img
                                                        src={`/storage/${event.image}`}
                                                        alt={event.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <img
                                                        src={'https://picsum.photos/400/200'}
                                                        alt={event.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                )
                                                }
                                            </figure>
                                            <div className="card-body p-5 space-y-0 md:space-y-4">

                                                <h3 className="text-base font-bold text-card-foreground line-clamp-2 min-h-[48px] group-hover:text-[#4d0c0c] transition-colors duration-300">
                                                    {event.title}
                                                </h3>

                                                <div className="flex items-center gap-2 text-sm text-black/60 bg-secondary rounded-lg px-3 py-2 backdrop-blur-sm">
                                                    <Calendar className="w-4 h-4 text-[#b41d1d]" />
                                                    <span className="font-bold text-xs">{formatDateRange(event.start_date, event.end_date)}</span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="bg-gradient-to-t from-[#7b0f1f] to-[#3f154f] bg-clip-text text-transparent text-xl font-extrabold">
                                                        {formatPriceRange(event.price_range)}
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-t from-[#b41d1d]/30 to-[#3f154f]/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <div className="w-2 h-2 rounded-full bg-[#7b0f1f] animate-pulse" />
                                                    </div>
                                                </div>

                                                <a
                                                    href={route('events.guest.detail', { event: event.id, slug: event.slug })}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className="w-full text-white btn  bg-gradient-to-r from-[#b41d1d] to-[#3f154f] btn-sm md:w-auto">
                                                    Pesan Tiket
                                                </a>

                                                {/* <div className="card-actions flex flex-col md:flex-row  justify-between ">
                                                <div className="text-xl font-bold text-primary">
                                                    {formatPrice(event.price)}
                                                </div>
                                                <a
                                                    target='_blank'
                                                    href={route('events.guest.detail', { event: event.id, slug: event.slug })}
                                                    className="btn btn-primary btn-sm w-full md:w-auto"
                                                >
                                                    Lihat Detail
                                                </a>
                                            </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel.Content>
                    </Carousel>

                </div>
            </div>
        </>
    )
}

export default WidgetHorizontal