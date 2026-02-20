import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import JudgeLayout from '@/Layouts/JudgeLayout';
import { Head, Link } from '@inertiajs/react'

import React from 'react'

function Index({ events }) {
    return (
        <JudgeLayout>
            <Head title="Events" />
            <div className="container mx-auto px-4 py-8">
                <div className="card bg-base-200 shadow-sm mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-2">Events</h2>
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <p className="card-text">Here is the list of events</p>
                          </div>

                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nama Event</th>
                                        <th>Category</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {events.map((event, index) => (
                                        <tr key={event.id}>
                                            <td>{index + 1}</td>
                                            <td>{event.title}</td>
                                            <td>{event.category.name}</td>

                                            <td> <div className='flex gap-2'>
                                                <Link className='btn btn-sm btn-primary' href={route('judge.event.penjurian', event.id)}>
                                                  Penjurian
                                                </Link>

                                                {/* <Link className='btn btn-sm btn-warning' href={route('admin.events.edit', event)}>
                                                    Edit
                                                </Link> */}
                                            </div>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </JudgeLayout>
    )
}

export default Index