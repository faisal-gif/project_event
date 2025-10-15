import { router, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';


function FormAditionalQuestion({ ticket, fields }) {

    // Membuat state awal untuk form dari fields yang diberikan
    const initialFormState = fields.reduce((acc, field) => {
        acc[field.name] = ticket?.ticket_additional_questions?.[field.name] || '';
        return acc;
    }, {});

    const { data, setData, processing, errors, post } = useForm(initialFormState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (name, file) => {
        setData(name, file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gunakan method POST dari useForm yang sudah menangani multipart data
        post(route('ticket.additional', ticket), {
            preserveScroll: true,
        });
    };

    // Helper untuk merender input berdasarkan tipe field
    const renderField = (field) => {
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder || ''}
                        className="textarea border-0 bg-secondary/50 focus:bg-white w-full"
                        value={data[field.name]}
                        onChange={handleInputChange}
                    />
                );
            case 'url':
            case 'text':
            default:
                return (
                    <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder || ''}
                        value={data[field.name]}
                        onChange={handleInputChange}
                        className="input border-0 bg-secondary/50 focus:bg-white w-full"
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="py-6">
            <div>
                <h2 className='font-semibold text-lg'>
                    {ticket.event.submission_title || 'Form Karya'}
                </h2>
                <p className="text-sm text-base-content/70">
                    {ticket.event.submission_description || 'Lengkapi data-data berikut untuk menyelesaikan pendaftaran Anda.'}
                </p>
            </div>

            {fields.map((field) => (
                <div key={field.id} className="space-y-2 py-2">
                    <label htmlFor={field.name} className="text-sm font-semibold text-black/70">
                        {field.label}
                        {field.is_required ? <span className="text-red-500">*</span> : ''}
                    </label>
                    {renderField(field)}
                    {errors[field.name] && <div className="text-red-500 text-sm font-semibold mt-1">{errors[field.name]}</div>}
                </div>
            ))}

            <div className="space-y-2 py-2 flex justify-end">
                <button type='submit' className='btn btn-sm btn-primary' disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}

export default FormAditionalQuestion;
