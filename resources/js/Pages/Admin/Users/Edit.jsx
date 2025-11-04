
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ user }) {
    const { data, setData, put, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("admin.users.update", user.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit User
                </h2>
            }
        >
            <Head title="Edit User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    <span className="text-red-600">
                                        {errors.name}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                    />
                                    <span className="text-red-600">
                                        {errors.email}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                    />
                                    <span className="text-red-600">
                                        {errors.password}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Role</label>
                                    <select
                                        className="w-full px-4 py-2"
                                        value={data.role}
                                        onChange={(e) => setData("role", e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="organizer">Organizer</option>
                                    </select>
                                    <span className="text-red-600">
                                        {errors.role}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 font-bold text-white bg-green-500 rounded"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
