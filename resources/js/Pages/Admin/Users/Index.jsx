
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function UserManagement({ users }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="mb-2 font-semibold text-2xl">List Users</h2>
                        <Link
                            className="btn btn-primary"
                            href={route("admin.users.create")}
                        >
                            Create User
                        </Link>
                    </div>
                    <div className="card bg-base-200 shadow-sm mb-8">
                        <div className=" overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="text-left font-bold">
                                        <th className="px-6 pt-6 pb-4">Name</th>
                                        <th className="px-6 pt-6 pb-4">Email</th>
                                        <th className="px-6 pt-6 pb-4">Role</th>
                                        <th className="px-6 pt-6 pb-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-100 focus-within:bg-gray-100">
                                            <td>
                                                {user.name}
                                            </td>
                                            <td>
                                                {user.email}
                                            </td>
                                            <td>
                                                <span className='badge badge-outline badge-primary capitalize'>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="flex flex-row gap-2">
                                                <Link
                                                    className="btn btn-warning btn-outline btn-sm"
                                                    href={route("admin.users.edit", user.id)}
                                                >
                                                    Edit
                                                </Link>
                                                {/* <button
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this user?")) {
                                                            Inertia.delete(route("admin.users.destroy", user.id));
                                                        }
                                                    }}
                                                    className="btn btn-error btn-outline btn-sm"
                                                >
                                                    Delete
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
