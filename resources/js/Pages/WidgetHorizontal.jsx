import Carousel from '@/Components/ui/Carousel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

function WidgetHorizontal({ events }) {
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
    }
    return (
        <>
            <Head title="Widget Event" />

            <div className=' flex flex-col justify-center items-center gap-4'>
                <h2 className='text-2xl lg:text-4xl font-bold text-[#b51d1d]'>Jenuh dengan kesibukan?</h2>
                <h4 className='text-sm lg:text-2xl text-center'>Mulai akhir pekanmu dengan seru, pilih event favoritmu sekarang!</h4>
                <Carousel opts={{ align: "start", loop: true }} className="w-full" plugins={[Autoplay()]}>
                    <Carousel.Content className="-ml-4">
                        {events.map((event) => (
                            <Carousel.Item
                                key={event.id}
                                className="pl-4 min-w-0 shrink-0 grow-0 basis-9/12 lg:basis-1/4"
                            >
                                <div className="p-2 h-full">
                                    <div key={event.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                        <figure className="w-full h-48 bg-base-200 flex items-center justify-center overflow-hidden">
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
                                        <div className="card-body">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className={`badge ${event.type === 'competition' ? 'badge-neutral' : 'badge-primary'}`}>
                                                    {event.type === 'competition' ? 'Competition' : 'Event'}
                                                </div>
                                                <div className="badge badge-outline">{event.category}</div>
                                            </div>

                                            <h2 className="card-title text-sm mb-2 text-base-content">{event.title}</h2>

                                            <div className="card-actions flex flex-col md:flex-row  justify-between ">
                                                <div className="text-xl font-bold text-primary">
                                                    {formatPrice(event.price)}
                                                </div>
                                                <a
                                                target='_blank'
                                                    href={route('events.guest.detail', event)}
                                                    className="btn btn-primary btn-sm w-full md:w-auto"
                                                >
                                                    Lihat Detail
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel.Content>
                </Carousel>
                
            </div>
        </>
    )
}

export default WidgetHorizontal