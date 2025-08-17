import { useForm, Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useState } from 'react'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


function Create() {
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

    const [imagePreview, setImagePreview] = useState('/placeholder.svg')

    const { data, setData, post, processing, errors } = useForm({
        image: null,
        title: '',
        category: '',
        type: '',
        start_date: '',
        end_date: '',
        quota: '',
        price: '',
        lokasi: '',
        description: '',
        limit: '',
        headline: '0',
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setData('image', file)
            setImagePreview(URL.createObjectURL(file))
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('events.store'))
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
                            <div className='grid md:grid-cols-3 gap-2'>
                                <div className='col-span-2'>
                                    <label className="label">Title</label>
                                    <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                                </div>
                                {/* Category */}
                                <div>
                                    <label className="label">Headline</label>
                                    <select name="headline"
                                        className='select select-bordered w-full'
                                        value={data.headline}
                                        onChange={(e) => setData('headline', e.target.value)} >
                                        <option value="0">Tidak</option>
                                        <option value="1">Iya</option>
                                    </select>

                                    {errors.headline && <div className="text-red-500 text-sm">{errors.headline}</div>}
                                </div>
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
                                        onChange={(selected) => setData('category', selected?.value)}
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
                                        onChange={(selected) => setData('type', selected?.value)}
                                        className="react-select-container"
                                    />
                                    {errors.type && <div className="text-red-500 text-sm">{errors.type}</div>}
                                </div>

                                {/* Tanggal Mulai */}
                                <div>
                                    <label className="label">Tanggal Mulai</label>
                                    <input type="datetime-local" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.start_date && <div className="text-red-500 text-sm">{errors.start_date}</div>}
                                </div>

                                {/* Tanggal Selesai */}
                                <div>
                                    <label className="label">Tanggal Selesai</label>
                                    <input type="datetime-local" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.end_date && <div className="text-red-500 text-sm">{errors.end_date}</div>}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="label">Deskripsi</label>
                                <ReactQuill
                                    value={data.description}
                                    className='bg-white'
                                    modules={module}
                                    onChange={(value) => setData('description', value)} />
                                {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                            </div>

                            <div className='grid md:grid-cols-3 gap-2'>
                                {/* Quota */}
                                <div>
                                    <label className="label">Quota</label>
                                    <input type="number" value={data.quota} onChange={(e) => setData('quota', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.quota && <div className="text-red-500 text-sm">{errors.quota}</div>}
                                </div>

                                {/* Quota */}
                                <div>
                                    <label className="label">Limit Pembelian</label>
                                    <input type="number" value={data.limit} onChange={(e) => setData('limit', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.limit && <div className="text-red-500 text-sm">{errors.limit}</div>}
                                </div>

                                {/* Harga */}
                                <div>
                                    <label className="label">Harga</label>
                                    <input type="text" value={data.price} onChange={(e) => setData('price', e.target.value)}
                                        className="input input-bordered w-full" />
                                    {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
                                </div>

                            </div>

                            {/* Lokasi */}
                            <div>
                                <label className="label">Lokasi</label>
                                <textarea value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    className="textarea textarea-bordered w-full" />
                                {errors.lokasi && <div className="text-red-500 text-sm">{errors.lokasi}</div>}
                            </div>


                            {/* Submit */}
                            <button type="submit" disabled={processing} className="btn btn-primary w-full">
                                {processing ? 'Saving...' : 'Create Events'}
                            </button>
                        </form>
                    </div>
                </div >


            </AuthenticatedLayout >
        </>
    )
}

export default Create