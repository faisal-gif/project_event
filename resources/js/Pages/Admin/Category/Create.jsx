import { useForm, Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css'


function Create() {

    const { data, setData, post, processing, errors } = useForm({
        name: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('category.store'))
    }

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Create Category" />

                <div className="py-12">
                    <div className="card bg-base-100 shadow-sm md:max-w-6xl md:mx-auto mx-2 p-6">
                        <div className="card-body">
                            <h2 className="card-title mb-2">Category Create</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className="form-control w-full">
                                    <label className="label">Name Category</label>
                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                                </div>
                                {/* Submit */}
                                <button type="submit" disabled={processing} className="btn btn-primary w-full">
                                    {processing ? 'Saving...' : 'Create Category'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div >


            </AuthenticatedLayout >
        </>
    )
}

export default Create