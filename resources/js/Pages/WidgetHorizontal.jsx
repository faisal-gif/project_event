import ApplicationLogo from '@/Components/ApplicationLogo';
import Carousel from '@/Components/ui/Carousel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, Calendar } from 'lucide-react';
import React from 'react';

function WidgetHorizontal({ events }) {


    const formatPrice = (price) => {
        if (price == 0) {
            return "Gratis";
        }
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

    // --- FUNGSI YANG DIPERBARUI ---
    const formatDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Ambil komponen tanggal, bulan, dan tahun
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleDateString("id-ID", { month: "short" });
        const startYear = startDate.getFullYear();

        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString("id-ID", { month: "short" });
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
    // --- AKHIR FUNGSI YANG DIPERBARUI ---

    return (
        <>
            <Head title="Widget Event" />
            <div className="max-w-7xl mx-auto py-2 md:py-8">
                <div className='w-full relative bg-gradient-to-br from-[#b41d1d]/30 via-base-200 to-base-300 md:rounded-3xl p-4 md:p-10  space-y-8 shadow-xl border border-border/50 overflow-hidden'>
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
                            {events.map((event) => {
                                // Tentukan URL gambar di sini
                                const imageUrl = event.image && event.image !== ''
                                    ? `/storage/${event.image}`
                                    : 'https://picsum.photos/400/200';

                                return (
                                    <Carousel.Item
                                        key={event.id}
                                        className=" min-w-0 shrink-0 grow-0 basis-10/12 lg:basis-1/5"
                                    >
                                        <a
                                            href={route('events.guest.detail', { event: event.id, slug: event.slug })}
                                            target='_blank'
                                            rel='noopener noreferrer'>
                                            <div className="h-full">
                                                <div
                                                    key={event.id}
                                                    className="card w-full h-96 md:h-[380px] transition-shadow overflow-hidden"
                                                    style={{
                                                        backgroundImage: `url(${imageUrl})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                >
                                                    <div className="card-body h-full p-5 space-y-0 md:space-y-4 flex flex-col justify-end bg-black/40 text-base-100">

                                                        <h3 className="text-sm font-bold text-white line-clamp-2 min-h-[48px] group-hover:text-white/90 transition-colors duration-300">
                                                            {event.title}
                                                        </h3>

                                                        <div className="flex items-center gap-2 text-sm text-white/90 bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                                                            <Calendar className="w-4 h-4 text-white" />
                                                            {/* Tidak ada perubahan di baris ini, tapi fungsinya sudah diubah */}
                                                            {event.start_date && event.end_date && (
                                                                <span className="font-bold text-xs">{formatDateRange(event.start_date, event.end_date)}</span>
                                                            )
                                                            }

                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="text-white text-xl font-extrabold">
                                                                {formatPriceRange(event.price_range)}
                                                            </div>
                                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Carousel.Item>
                                );
                            })}
                        </Carousel.Content>
                    </Carousel>

                </div>
            </div >
        </>
    )
}

export default WidgetHorizontal