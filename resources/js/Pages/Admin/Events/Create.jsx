import { useForm, Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useState } from 'react'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Card from '@/Components/ui/Card'
import { CalendarIcon, DollarSign, MapPin, Tags, Type, Upload, Users } from 'lucide-react'
import { FileUpload } from '@/Components/FileUpload'


function Create({ category }) {
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
        location_type: 'online',
        location_details: '',
        description: '',
        requirements: '',
        limit: '',
        headline: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('events.store'))
    }

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Create News" />

                <div className="py-12">

                    <div className="breadcrumbs text-sm p-6">
                        <ul>
                            <li><a>Event</a></li>
                            <li>Create</li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                        {/* Thumbnail Upload - Large Featured Card */}
                        <Card className="bg-base-100 lg:col-span-5 p-6 shadow-medium hover:shadow-glow transition-all duration-300 bg-gradient-accent border-0">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Upload className="w-5 h-5 text-primary" />
                                    <label className="text-lg font-semibold">Event Thumbnail</label>
                                </div>
                                {/* Tempat Upload */}
                                <FileUpload
                                    name="thumbnail"
                                    onChange={(file) => setData("image", file)}
                                />
                                {errors.image && <div className="text-red-500 text-sm font-semibold mt-2">{errors.image}</div>}
                            </div>
                        </Card>

                        {/* Title & Headline */}
                        <Card className="lg:col-span-7 bg-base-100 p-6 shadow-medium hover:shadow-glow transition-all duration-300">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Type className="w-4 h-4 text-primary" />
                                        <label htmlFor="title" className="font-medium">Title</label>
                                    </div>
                                    <input
                                        id="title"
                                        placeholder="Enter event title"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        className="input input-md w-full bg-secondary/50 focus:bg-background transition-colors"
                                    />
                                    {errors.title && <div className="text-red-500 text-sm font-semibold mt-2">{errors.title}</div>}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tags className="w-4 h-4 text-primary" />
                                        <label className="font-medium">Headline</label>
                                    </div>
                                    <div className="space-y-3">
                                        <div key="headline" className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="headline"
                                                onChange={(e) => setData("headline", e.target.checked)}
                                                className="checkbox checkbox-sm" // kalau pakai DaisyUI
                                            />
                                            <label
                                                htmlFor="headline"
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                Iya
                                            </label>
                                        </div>
                                        {errors.headline && <div className="text-red-500 text-sm font-semibold mt-2">{errors.headline}</div>}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Category - Now Full Width */}
                        <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium hover:shadow-glow transition-all duration-300">
                            <div className="max-w-md">
                                <div className="space-y-2">
                                    <label className="font-medium">Category</label>
                                    <Select
                                        options={category.map((cat) => ({
                                            value: cat.id,
                                            label: cat.name,
                                        }))}
                                        onChange={(selected) => setData('category', selected?.value)}
                                        className="react-select-container"
                                    />
                                    {errors.category && <div className="text-red-500 text-sm font-semibold mt-2">{errors.category}</div>}
                                </div>
                            </div>
                        </Card>

                        {/* Dates */}
                        <Card className="bg-base-100 lg:col-span-6 p-6 shadow-medium hover:shadow-glow transition-all duration-300">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <CalendarIcon className="w-4 h-4 text-primary" />
                                    <label className="font-medium">Event Duration</label>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="startDate" className="text-sm text-black/50">Start Date</label>
                                        <input
                                            id="startDate"
                                            type="datetime-local"
                                            value={data.start_date}
                                            onChange={(e) => setData("start_date", e.target.value)}
                                            className="input input-md border-0 bg-secondary/50 focus:bg-background"
                                        />
                                        {errors.start_date && <div className="text-red-500 text-sm font-semibold mt-2">{errors.start_date}</div>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="endDate" className="text-sm text-black/50">End Date</label>
                                        <input
                                            id="endDate"
                                            type="datetime-local"
                                            value={data.end_date}
                                            onChange={(e) => setData("end_date", e.target.value)}
                                            className="input input-md border-0 bg-secondary/50 focus:bg-background"
                                        />
                                        {errors.end_date && <div className="text-red-500 text-sm font-semibold mt-2">{errors.end_date}</div>}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Location */}
                        <Card className="bg-base-100 lg:col-span-6 p-6 shadow-medium hover:shadow-glow transition-all duration-300">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <label className="font-medium">Location</label>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="locationType" className="text-sm text-black/50">Location Type</label>
                                        <select name="location_type"
                                            className='select select-bordered w-full bg-secondary/50 focus:bg-background'
                                            value={data.location_type}
                                            onChange={(e) => setData('location_type', e.target.value)} >
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                        {errors.location_type && <div className="text-red-500 text-sm font-semibold mt-2">{errors.location_type}</div>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="locationDetail" className="text-sm text-black/50">Location Details</label>
                                        <textarea
                                            id="locationDetail"
                                            placeholder="Enter venue details, address, or online platform info"
                                            className="textarea min-h-[80px] border-0 bg-secondary/50 focus:bg-background resize-none w-full"
                                            value={data.location_details}
                                            onChange={(e) => setData("location_details", e.target.value)}
                                        />
                                        {errors.location_details && <div className="text-red-500 text-sm font-semibold mt-2">{errors.location_details}</div>}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Description - Full Width */}
                        <Card className="bg-base-100 lg:col-span-12 p-6 shadow-medium hover:shadow-glow transition-all duration-300">
                            <div className="space-y-4">
                                <label htmlFor="description" className="font-medium">Description</label>
                                <ReactQuill
                                    value={data.description}
                                    className=' bg-secondary/50 focus:bg-background resize-none'
                                    modules={module}
                                    onChange={(value) => setData('description', value)} />
                                {errors.description && <div className="text-red-500 text-sm font-semibold mt-2">{errors.description}</div>}
                            </div>
                        </Card>

                        {/* Requirements - Full Width */}
                        <Card className="bg-base-100 lg:col-span-12 p-6 shadow-medium hover:shadow-glow transition-all duration-300">
                            <div className="space-y-4">
                                <label htmlFor="requirement" className="font-medium">Requirements</label>
                                <ReactQuill
                                    value={data.requirements}
                                    className=' bg-secondary/50 focus:bg-background resize-none'
                                    modules={module}
                                    onChange={(value) => setData('requirements', value)} />
                                {errors.requirements && <div className="text-red-500 text-sm font-semibold mt-2">{errors.requirements}</div>}
                            </div>
                        </Card>

                        {/* Quota & Purchase Limit */}
                        <Card className="bg-base-100 lg:col-span-6 p-6 shadow-medium hover:shadow-glow transition-all duration-300">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-4 h-4 text-primary" />
                                    <label className="font-medium">Capacity</label>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="quota" className="text-sm text-black/50">Total Quota</label>
                                        <input
                                            id="quota"
                                            type="number"
                                            placeholder="100"
                                            value={data.quota}
                                            onChange={(e) => setData("quota", e.target.value)}
                                            className="input w-full border-0 bg-secondary/50 focus:bg-background"
                                        />
                                        {errors.quota && <div className="text-red-500 text-sm font-semibold mt-2">{errors.quota}</div>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="purchaseLimit" className="text-sm text-black/50">Purchase Limit</label>
                                        <input
                                            id="purchaseLimit"
                                            type="number"
                                            placeholder="5"
                                            value={data.limit}
                                            onChange={(e) => setData("limit", e.target.value)}
                                            className="input w-full border-0 bg-secondary/50 focus:bg-background"
                                        />
                                        {errors.limit && <div className="text-red-500 text-sm font-semibold mt-2">{errors.limit}</div>}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Price */}
                        <Card className="bg-base-100 lg:col-span-6 p-6 shadow-medium hover:shadow-glow transition-all duration-300">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    <label htmlFor="price" className="font-medium">Price</label>
                                </div>
                                <input
                                    id="price"
                                    type="number"
                                    placeholder="299000"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    className="input w-full border-0 bg-secondary/50 focus:bg-background text-xl font-semibold"
                                />
                                <p className="text-sm text-muted-foreground">Price in IDR</p>
                                {errors.price && <div className="text-red-500 text-sm font-semibold mt-2">{errors.price}</div>}
                            </div>
                        </Card>

                        {/* Submit Button - Full Width */}
                        <div className="lg:col-span-12">
                            <button
                                type="submit"
                                className="btn btn-soft btn-primary w-full text-lg font-semibold"
                            >
                                Create Event
                            </button>
                        </div>


                    </form>
                </div >


            </AuthenticatedLayout >
        </>
    )
}

export default Create