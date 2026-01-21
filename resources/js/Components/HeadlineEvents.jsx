import React, { useState, useEffect, useCallback } from 'react'

import { Calendar, MapPin, ChevronLeft, ChevronRight, Ticket } from "lucide-react"
import Autoplay from 'embla-carousel-autoplay'

// Import Base Carousel Component kamu
import Carousel from './ui/Carousel'
import { Link } from '@inertiajs/react';


// Helper Formatter
const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

function HeadlineEvents({ listHeadline = [] }) {


    const [api, setApi] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Fungsi untuk update index saat slide berubah
    const onSelect = useCallback(() => {
        if (!api) return;
        setSelectedIndex(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if (!api) return;
        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);
    }, [api, onSelect]);

    const categoryColors = {
        music: "bg-pink-500 text-white",
        seminar: "bg-blue-500 text-white",
        sports: "bg-orange-500 text-white",
        exhibition: "bg-purple-500 text-white",
    };

    if (listHeadline.length === 0) return null;

    return (
        <section className="relative py-6 overflow-hidden">
            {/* Background Decor (Opsional) */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                        Event <span className="text-primary">Pilihan</span> Untukmu
                    </h2>
                    <p className="text-gray-500">Jangan lewatkan momen seru minggu ini</p>
                </div>

                <Carousel
                    setApi={setApi}
                    opts={{ align: "center", loop: true }}
                    plugins={[Autoplay({ delay: 5000 })]}
                    className="w-full"
                >
                    <Carousel.Content>
                        {listHeadline.map((event, index) => {
                            const isActive = index === selectedIndex;
                            const price = event.ticket_types?.[0]?.price || event.price || 0;

                            return (
                                <Carousel.Item
                                    key={event.id || index}
                                    className="basis-[100%] md:basis-[500px] transition-all duration-500 ease-in-out"
                                    style={{
                                        // Efek scaling: slide aktif 100%, slide samping 90%
                                        transform: isActive ? 'scale(1)' : 'scale(0.9)',
                                        opacity: isActive ? 1 : 0.5
                                    }}
                                >
                                    <Link href={`/event/${event.id}/${event.slug}`} className="block group">
                                        <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                                            <img
                                                src={'storage/' + event.image}
                                                alt={event.title}
                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Overlay Gradasi */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                            {/* Content di Atas Image */}
                                            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                                                <div className="flex justify-between items-start">
                                                    <div className="badge badge-primary">
                                                        {event.category.name}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-bold mb-4 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                                                        {event.title}
                                                    </h3>

                                                    <div className="space-y-2 mb-6">
                                                        {/*                                                       
                                                        {event.location && (
                                                            <div className="flex items-center gap-2 text-sm opacity-90">
                                                                <MapPin className="h-4 w-4 text-red-400" />
                                                                <span className="line-clamp-1">{event.location}</span>
                                                            </div>
                                                        )} */}
                                                    </div>

                                                    <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/20">
                                                        {event.start_date && event.end_date && (
                                                            <div className="flex items-center gap-2 text-sm opacity-90">
                                                                <Calendar className="h-4 w-4 text-blue-400" />
                                                                <span>{formatDate(event.start_date)}</span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-[10px] uppercase opacity-60">Mulai</p>
                                                            <p className="font-bold text-lg text-yellow-400">{formatIDR(price)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Carousel.Item>
                            );
                        })}
                    </Carousel.Content>

                    {/* Tombol Navigasi Custom Style */}

                </Carousel>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-10">
                    {listHeadline.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={`transition-all duration-300 rounded-full ${index === selectedIndex
                                ? "w-10 h-2 bg-primary"
                                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HeadlineEvents