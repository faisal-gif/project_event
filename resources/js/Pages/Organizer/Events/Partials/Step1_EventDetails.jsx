import React from 'react';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Card from '@/Components/ui/Card';
import { CalendarIcon, MapPin, Upload } from 'lucide-react';
import { FileUpload } from '@/Components/FileUpload';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const Step1_EventDetails = ({ data, setData, errors, category }) => {
    const module = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['code-block'],
            ['clean']
        ],
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="bg-base-100 lg:col-span-5 p-6 shadow-medium">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Upload className="w-5 h-5 text-primary" />
                        <label className="text-lg font-semibold">Event Thumbnail</label>
                    </div>
                    <FileUpload name="thumbnail" onChange={(file) => setData("image", file)} />
                    <InputError message={errors.image} />
                </div>
            </Card>

            <Card className="lg:col-span-7 bg-base-100 p-6 shadow-medium">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput id="title" placeholder="Enter event title" value={data.title} onChange={(e) => setData("title", e.target.value)} className="w-full" />
                        <InputError message={errors.title} />
                    </div>
                    <div className="space-y-2">
                        <InputLabel value="Headline" />
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="headline" onChange={(e) => setData("is_headline", e.target.checked)} className="checkbox checkbox-sm" checked={data.is_headline} />
                            <label htmlFor="headline" className="text-sm font-normal cursor-pointer">Set as Headline Event</label>
                        </div>
                        <InputError message={errors.is_headline} />
                    </div>
                </div>
            </Card>

            <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium">
                <div className="max-w-md">
                    <InputLabel value="Category" />
                    <Select
                        options={category.map((cat) => ({ value: cat.id, label: cat.name }))}
                        onChange={(selected) => setData('category_id', selected?.value)}
                        className="react-select-container"
                        value={category.find(cat => cat.id === data.category_id) ? { value: data.category_id, label: category.find(cat => cat.id === data.category_id).name } : null}
                    />
                    <InputError message={errors.category_id} />
                </div>
            </Card>

            <Card className="bg-base-100 lg:col-span-6 p-6 shadow-medium">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        <label className="font-medium">Event Duration</label>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <InputLabel htmlFor="startDate" value="Start Date" />
                            <TextInput id="startDate" type="datetime-local" value={data.start_date} onChange={(e) => setData("start_date", e.target.value)} />
                            <InputError message={errors.start_date} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <InputLabel htmlFor="endDate" value="End Date" />
                            <TextInput id="endDate" type="datetime-local" value={data.end_date} onChange={(e) => setData("end_date", e.target.value)} />
                            <InputError message={errors.end_date} />
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="bg-base-100 lg:col-span-6 p-6 shadow-medium">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-primary" />
                        <label className="font-medium">Location</label>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <InputLabel htmlFor="locationType" value="Location Type" />
                            <select name="location_type" className='select select-bordered w-full' value={data.location_type} onChange={(e) => setData('location_type', e.target.value)}>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                            <InputError message={errors.location_type} />
                        </div>
                        <div className="space-y-2">
                            <InputLabel htmlFor="locationDetail" value="Location Details" />
                            <textarea id="locationDetail" placeholder="Enter venue details, address, or online platform info" className="textarea textarea-bordered min-h-[80px] w-full" value={data.location_details} onChange={(e) => setData("location_details", e.target.value)} />
                            <InputError message={errors.location_details} />
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="bg-base-100 lg:col-span-12 p-6 shadow-medium">
                <div className="space-y-4">
                    <InputLabel htmlFor="description" value="Description" />
                    <ReactQuill value={data.description} modules={module} onChange={(value) => setData('description', value)} />
                    <InputError message={errors.description} />
                </div>
            </Card>

            <Card className="bg-base-100 lg:col-span-12 p-6 shadow-medium">
                <div className="space-y-4">
                    <InputLabel htmlFor="requirement" value="Requirements" />
                    <ReactQuill value={data.requirements} modules={module} onChange={(value) => setData('requirements', value)} />
                    <InputError message={errors.requirements} />
                </div>
            </Card>
        </div>
    );
};

export default Step1_EventDetails;
