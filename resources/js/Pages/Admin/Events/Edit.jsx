import { useForm, Head, Link, router } from '@inertiajs/react'
import React, { useState } from 'react'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'


function Edit({ event }) {
    const module = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['code-block'],
            ['clean'] // remove formatting
        ],
    }

    const [imagePreview, setImagePreview] = useState(
        event.image ? `/storage/${event.image}` : '/placeholder.svg'
    )

    const { data: editData, setData: setEditData, processing, errors } = useForm({
        image: null,
        title: event.title,
        category: event.category,
        type: event.type,
        start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 10) : '',
        end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 10) : '',
        quota: event.quota,
        price: event.price,
        lokasi: event.location,
        description: event.description,
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setEditData('image', file)
            setImagePreview(URL.createObjectURL(file))
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        router.post(route('events.update', event), { 
            preserveScroll: true, 
            _method: 'PUT',
            ...editData 
        })
    }

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Create News" />

                <div className="py-12">
                    <div className="card bg-base-100 shadow-sm md:max-w-6xl md:mx-auto mx-2 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Thumbnail */}
                            <div>
                                <label className="label">Thumbnail</label>
                                {imagePreview && (
                                    <div className="my-4 ">
                                        <img src={imagePreview} alt="Thumbnail Preview"
                                            className="rounded-xl max-h-60 border border-base-300" />
                                    </div>
                                )}
                                <input type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input file-input-bordered w-full" />
                                {errors.image && <div className="text-red-500 text-sm">{errors.image}</div>}

                            </div>
                            {/* Title */}
                            <div>
                                <label className="label">Title</label>
                                <input type="text" value={editData.title} onChange={(e) => setEditData('title', e.target.value)}
                                    className="input input-bordered w-full" />
                                {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                            </div>

                            <div className='grid md:grid-cols-2 gap-2'>

                                {/* Category */}
                                <div>
                                    <label className="label">Category</label>
                                    <Select
                                        options={[
                                            {
                                                value: 'lomba',
                                                label: 'Lomba',
                                            },
                                            {
                                                value: 'workshop',
                                                label: 'Workshop',
                                            },
                                            {
                                                value: 'webinar',
                                                label: 'Webinar',
                                            },

                                        ]}
                                        onChange={(selected) => setEditData('category', selected?.value)}
                                        defaultValue={[
                                            {
                                                value: 'lomba',
                                                label: 'Lomba',
                                            },
                                            {
                                                value: 'workshop',
                                                label: 'Workshop',
                                            },
                                            {
                                                value: 'webinar',
                                                label: 'Webinar',
                                            },

                                        ].find((option) => option.value === editData.category)}
                                        className="react-select-container"
                                    />
                                    {errors.category && <div className="text-red-500 text-sm">{errors.category}</div>}
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="label">Type</label>
                                    <Select
                                        options={[
                                            {
                                                value: 'event',
                                                label: 'Event',
                                            },
                                            {
                                                value: 'competition',
                                                label: 'Competition',
                                            },

                                        ]}
                                        onChange={(selected) => setEditData('type', selected?.value)}
                                        defaultValue={[
                                            {
                                                value: 'event',
                                                label: 'Event',
                                            },
                                            {
                                                value: 'competition',
                                                label: 'Competition',
                                            },

                                        ].find((option) => option.value === editData.type)}
                                        className="react-select-container"
                                    />
                                    {errors.type && <div className="text-red-500 text-sm">{errors.type}</div>}
                                </div>

                                {/* Tanggal Mulai */}
                                <div>
                                    <label className="label">Tanggal Mulai</label>
                                    <input type="date" value={editData.start_date} onChange={(e) => setEditData('start_date', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.start_date && <div className="text-red-500 text-sm">{errors.start_date}</div>}
                                </div>

                                {/* Tanggal Selesai */}
                                <div>
                                    <label className="label">Tanggal Selesai</label>
                                    <input type="date" value={editData.end_date} onChange={(e) => setEditData('end_date', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.end_date && <div className="text-red-500 text-sm">{errors.end_date}</div>}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="label">Deskripsi</label>
                                <ReactQuill
                                    value={editData.description}
                                    className='bg-white'
                                    modules={module}
                                    onChange={(value) => setEditData('description', value)} />
                                {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                            </div>

                            <div className='grid md:grid-cols-2 gap-2'>
                                {/* Quota */}
                                <div>
                                    <label className="label">Quota</label>
                                    <input type="number" value={editData.quota} onChange={(e) => setEditData('quota', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.quota && <div className="text-red-500 text-sm">{errors.quota}</div>}
                                </div>

                                {/* Harga */}
                                <div>
                                    <label className="label">Harga</label>
                                    <input type="text" value={editData.price} onChange={(e) => setEditData('price', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
                                </div>

                            </div>

                            {/* Lokasi */}
                            <div>
                                <label className="label">Lokasi</label>
                                <textarea value={editData.lokasi}
                                    onChange={(e) => setEditData('lokasi', e.target.value)}
                                    className="textarea textarea-bordered w-full" />
                                {errors.lokasi && <div className="text-red-500 text-sm">{errors.lokasi}</div>}
                            </div>


                            {/* Submit */}
                            <button type="submit" disabled={processing} className="btn btn-primary w-full">
                                {processing ? 'Saving...' : 'Edit Event'}
                            </button>
                        </form>
                    </div>
                </div>


            </AuthenticatedLayout>
        </>
    )
}

export default Edit;