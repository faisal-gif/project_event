import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ tickets_count, transactions_count, participated_events, recommended_events }) {
    return (
        <GuestLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Total Tickets
                                </h3>
                                <p className="mt-1 text-3xl font-semibold text-gray-700">
                                    {tickets_count}
                                </p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Total Transactions
                                </h3>
                                <p className="mt-1 text-3xl font-semibold text-gray-700">
                                    {transactions_count}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Events You've Joined
                        </h3>
                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                            {participated_events.map((event) => (
                                <div key={event.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900">
                                        <h4 className="text-base font-medium leading-6 text-gray-900">
                                            {event.title}
                                        </h4>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(event.start_date).toLocaleDateString()}
                                        </p>
                                        <Link href={route('events.guest.detail', { event: event.id, slug: event.slug })} className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                            View Event
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Recommended Events
                        </h3>
                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                            {recommended_events.map((event) => (
                                <div key={event.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900">
                                        <h4 className="text-base font-medium leading-6 text-gray-900">
                                            {event.title}
                                        </h4>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(event.start_date).toLocaleDateString()}
                                        </p>
                                        <Link href={route('events.guest.detail', { event: event.id, slug: event.slug })} className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                            View Event
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
