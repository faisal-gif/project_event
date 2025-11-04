import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';

function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        icon: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.category.store'), {
            data,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Category" />

            <div className="py-12">
                <div className="card bg-base-100 shadow-sm md:max-w-6xl md:mx-auto mx-2 p-6">
                    <div className="card-body">
                        <h2 className="card-title mb-2">Category Create</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label">Name Category</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="input input-bordered w-full"
                                />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>
                            <div className="form-control w-full">
                                <label className="label">Icon</label>
                                <input
                                    type="text"
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    className="input input-bordered w-full"
                                />
                                <a href="https://lucide.dev/icons/" target="_blank" className="text-sm text-blue-500">Browse icons</a>
                                {errors.icon && <div className="text-red-500 text-sm">{errors.icon}</div>}
                            </div>
                            <button type="submit" disabled={processing} className="btn btn-primary w-full">
                                {processing ? 'Saving...' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Create;