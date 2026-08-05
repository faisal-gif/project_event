import Card from '@/Components/ui/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function Create({ events }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
        event_ids: [],
    });

    const handleEventChange = (eventId) => {
        const selected = data.event_ids.includes(eventId)
            ? data.event_ids.filter((id) => id !== eventId)
            : [...data.event_ids, eventId];
        setData('event_ids', selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah User" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl px-4 lg:px-8">
                    <Link href={route('admin.users.index')} className="inline-flex items-center gap-1 text-sm text-base-content/60 hover:text-primary mb-4">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke daftar user
                    </Link>

                    <Card className="bg-base-100 p-6 shadow-medium">
                        <div className="flex items-center gap-2 mb-6">
                            <UserPlus className="w-5 h-5 text-primary" />
                            <h1 className="text-lg font-semibold">Tambah User</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nama" required />
                                <TextInput
                                    id="name"
                                    className="mt-1 w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama lengkap"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" required />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@contoh.com"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" required />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Role" required />
                                <select
                                    id="role"
                                    className="select select-bordered w-full mt-1"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="organizer">Organizer</option>
                                    <option value="judge">Judge</option>
                                </select>
                                <InputError message={errors.role} className="mt-1" />
                            </div>

                            {/* Pilihan event hanya untuk role judge */}
                            {data.role === 'judge' && (
                                <div>
                                    <InputLabel value="Tugaskan ke Event" required />
                                    <div className="max-h-48 p-3 overflow-y-auto bg-base-200 rounded-lg mt-1 space-y-2">
                                        {events.length === 0 && <p className="text-sm text-base-content/60">Belum ada event.</p>}
                                        {events.map((event) => (
                                            <label key={event.id} htmlFor={`event-${event.id}`} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id={`event-${event.id}`}
                                                    className="checkbox checkbox-sm"
                                                    checked={data.event_ids.includes(event.id)}
                                                    onChange={() => handleEventChange(event.id)}
                                                />
                                                <span className="text-sm">{event.title}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.event_ids} className="mt-1" />
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <Link href={route('admin.users.index')}>
                                    <SecondaryButton type="button">Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
