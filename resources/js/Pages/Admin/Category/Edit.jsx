import { useForm, Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css'


function Edit({ category }) {
    

    const { data: editData, setData: setEditData, post, processing, errors } = useForm({
        name: category.name
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        router.post(route('category.update', category), {
            preserveScroll: true,
            _method: 'PUT',
            ...editData
        })
    }

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Create Category" />

                <div className="py-12">
                    <div className="card bg-base-100 shadow-sm md:max-w-6xl md:mx-auto mx-2 p-6">
                        <div className="card-body">
                            <h2 className="card-title mb-2">Category Edit</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className="form-control w-full">
                                    <label className="label">Name Category</label>
                                    <input type="text" value={editData.name} onChange={(e) => setEditData('name', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.name && <div className="text-red-500 mt-2 text-md">{errors.name}</div>}
                                </div>
                                {/* Submit */}
                                <button type="submit" disabled={processing} className="btn btn-primary w-full">
                                    {processing ? 'Saving...' : 'Update Category'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div >


            </AuthenticatedLayout >
        </>
    )
}

export default Edit