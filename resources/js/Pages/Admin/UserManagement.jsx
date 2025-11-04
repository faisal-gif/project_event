
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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="card bg-base-200 shadow-sm mb-8">
                   <div className="card-body">

                        <div className="flex items-center justify-between mb-6">
                            <Link
                                className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none"
                                href={route("admin.users.create")}
                            >
                                Create User
                            </Link>
                        </div>

                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="table-auto w-full">
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
                                            <td className="border-t px-6 py-4">
                                                {user.name}
                                            </td>
                                            <td className="border-t px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="border-t px-6 py-4">
                                                {user.role}
                                            </td>
                                            <td className="border-t px-6 py-4">
                                                <Link
                                                    className="px-4 py-1 text-sm text-white bg-blue-500 rounded"
                                                    href={route("admin.users.edit", user.id)}
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this user?")) {
                                                            Inertia.delete(route("admin.users.destroy", user.id));
                                                        }
                                                    }}
                                                    className="px-4 py-1 text-sm text-white bg-red-500 rounded ml-2"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                   </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
