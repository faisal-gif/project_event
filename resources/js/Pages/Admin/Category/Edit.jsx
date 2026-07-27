import { useForm, Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DynamicIcon from '@/Components/DynamicIcon';
import { FolderCog, ArrowLeft } from 'lucide-react';

export default function Edit({ category }) {
    const { data, setData, processing, errors } = useForm({
        name: category.name || '',
        icon: category.icon || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('admin.category.update', category), { ...data });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Kategori" />

            <div className="py-10">
                <div className="mx-auto max-w-2xl px-4 lg:px-8">
                    <Link href={route('admin.category.index')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke daftar kategori
                    </Link>

                    <Card className="bg-base-100 p-6 shadow-medium">
                        <div className="flex items-center gap-2 mb-6">
                            <FolderCog className="w-5 h-5 text-primary" />
                            <h1 className="text-lg font-semibold">Edit Kategori</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Kategori" required />
                                <TextInput
                                    id="name"
                                    className="mt-1 w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="cth. Konser, Workshop"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="icon" value="Icon" required />
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                                        <DynamicIcon name={data.icon} />
                                    </span>
                                    <TextInput
                                        id="icon"
                                        className="w-full"
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value)}
                                        placeholder="cth. Music, Ticket"
                                    />
                                </div>
                                <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary">Lihat daftar icon</a>
                                <InputError message={errors.icon} className="mt-1" />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Link href={route('admin.category.index')}>
                                    <SecondaryButton type="button">Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
