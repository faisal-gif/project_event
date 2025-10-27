import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ users_count, events_count, tickets_count, transactions_count }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 md:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden bg-white shadow-sm rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Total Users
                                </h3>
                                <p className="mt-1 text-3xl font-semibold text-gray-700">
                                    {users_count}
                                </p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Total Events
                                </h3>
                                <p className="mt-1 text-3xl font-semibold text-gray-700">
                                    {events_count}
                                </p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Total Tickets
                                </h3>
                                <p className="mt-1 text-3xl font-semibold text-gray-700">
                                    {tickets_count}
                                </p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm rounded-lg">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}