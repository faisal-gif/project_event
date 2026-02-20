import JudgeLayout from '@/Layouts/JudgeLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

function Dashboard({ events_count }) {
    return (
        <JudgeLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 md:px-8">
                    <div className="w-96 overflow-hidden bg-white shadow-sm rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Total Events
                            </h3>
                            <p className="mt-1 text-3xl font-semibold text-gray-700">
                                {events_count}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </JudgeLayout>
    )
}

export default Dashboard