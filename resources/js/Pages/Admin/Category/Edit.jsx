import { useForm, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import DynamicIcon from '@/Components/DynamicIcon';

function Edit({ category }) {
    const { data: editData, setData: setEditData, post, processing, errors } = useForm({
        name: category.name,
        icon: category.icon,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('category.update', category), {
            ...editData,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Category" />

            <div className="py-12">
                <div className="card bg-base-100 shadow-sm md:max-w-6xl md:mx-auto mx-2 p-6">
                    <div className="card-body">
                        <h2 className="card-title mb-2">Category Edit</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label">Name Category</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    className="input input-bordered w-full"
                                />
                                {errors.name && <div className="text-red-500 mt-2 text-md">{errors.name}</div>}
                            </div>
                            <div className="form-control w-full">
                                <label className="label">Icon</label>
                                <div className="flex items-center gap-2">
                                    <DynamicIcon name={editData.icon} />
                                    <input
                                        type="text"
                                        value={editData.icon}
                                        onChange={(e) => setEditData('icon', e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <a href="https://lucide.dev/icons/" target="_blank" className="text-sm text-blue-500">Browse icons</a>
                                {errors.icon && <div className="text-red-500 mt-2 text-md">{errors.icon}</div>}
                            </div>
                            <button type="submit" disabled={processing} className="btn btn-primary w-full">
                                {processing ? 'Saving...' : 'Update Category'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Edit;