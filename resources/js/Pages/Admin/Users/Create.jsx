
import Card from '@/Components/ui/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({events}) {
    const { data, setData, post, errors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        event_ids: [],
    });

    const handleEventChange = (eventId) => {
        let selectedEvents = [...data.event_ids];
        if (selectedEvents.includes(eventId)) {
            selectedEvents = selectedEvents.filter(id => id !== eventId);
        } else {
            selectedEvents.push(eventId);
        }
        setData("event_ids", selectedEvents);
    };

    function handleSubmit(e) {
        e.preventDefault();
        post(route("admin.users.store"));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create User
                </h2>
            }
        >
            <Head title="Create User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        className="input w-full"
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
                                        className="input w-full px-4 py-2"
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
                                        className="input w-full"
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
                                        className="select w-full"
                                        value={data.role}
                                        onChange={(e) => setData("role", e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="organizer">Organizer</option>
                                        <option value="judge">Judge</option>
                                    </select>
                                    <span className="text-red-600">
                                        {errors.role}
                                    </span>
                                </div>
                                {/* Tampilkan pilihan event HANYA jika role yang dipilih adalah 'judge' */}
                                {data.role === 'judge' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Assign to Events</label>
                                        <Card className="max-h-40 p-2 overflow-y-auto bg-base-300 rounded">
                                            {events.map((event) => (
                                                <div key={event.id} className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`event-${event.id}`}
                                                        className="checkbox checkbox-xs mr-2"
                                                        checked={data.event_ids.includes(event.id)}
                                                        onChange={() => handleEventChange(event.id)}
                                                    />
                                                    <label htmlFor={`event-${event.id}`} className="text-sm">
                                                        {event.title}
                                                    </label>
                                                </div>
                                            ))}
                                        </Card>
                                        {errors.event_ids && <span className="text-red-600">{errors.event_ids}</span>}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 font-bold text-white bg-green-500 rounded"
                                    >
                                        Save
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
