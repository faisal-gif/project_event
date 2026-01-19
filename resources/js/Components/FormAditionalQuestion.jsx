import { useForm } from '@inertiajs/react';
import React from 'react';

function FormAditionalQuestion({ ticket, fields }) {
    // Membuat state awal untuk form
    const initialFormState = fields.reduce((acc, field) => {
        // Jika tipe file/image, inisialisasi dengan null, selain itu string kosong
        const existingValue = ticket?.ticket_additional_questions?.[field.name];
        acc[field.name] = (field.type === 'file' || field.type === 'image') ? null : (existingValue || '');
        return acc;
    }, {});

    const { data, setData, processing, errors, post } = useForm(initialFormState);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Handle checkbox tunggal jika diperlukan
        setData(name, type === 'checkbox' ? checked : value);
    };

    const handleFileChange = (name, file) => {
        setData(name, file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Inertia otomatis mendeteksi objek File dan mengirimkan sebagai multipart/form-data
        post(route('ticket.additional', ticket.id), {
            preserveScroll: true,
        });
    };

    const renderField = (field) => {
        const commonClass = "border-0 bg-secondary/50 focus:bg-white w-full";
        const value = data[field.name];

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder || ''}
                        className={`textarea ${commonClass}`}
                        value={value || ''}
                        onChange={handleInputChange}
                        required={field.is_required}
                    />
                );

            case 'select':
                const selectOptions = field.options ? (Array.isArray(field.options) ? field.options : field.options.split(',')) : [];
                return (
                    <select
                        id={field.name}
                        name={field.name}
                        className={`select ${commonClass}`}
                        value={value || ''}
                        onChange={handleInputChange}
                        required={field.is_required}
                    >
                        <option value="" disabled>Pilih {field.label}</option>
                        {selectOptions.map(opt => (
                            <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                        ))}
                    </select>
                );

            case 'image':
            case 'file':
                return (
                    <div className="space-y-2">
                        <input
                            type="file"
                            id={field.name}
                            accept={field.type === 'image' ? 'image/*' : undefined}
                            onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                            className={`file-input file-input-bordered w-full`}
                            required={field.is_required && !ticket?.ticket_additional_questions?.[field.name]}
                        />
                        {/* Menampilkan indikator jika sudah ada file lama atau file baru terpilih */}
                        {value instanceof File ? (
                            <p className="text-xs text-blue-600 font-medium italic">File baru terpilih: {value.name}</p>
                        ) : ticket?.ticket_additional_questions?.[field.name] && (
                            <p className="text-xs text-green-600 italic">File sudah terunggah (biarkan kosong jika tidak ingin mengubah)</p>
                        )}
                    </div>
                );

            case 'time':
                return (
                    <input
                        type="time"
                        id={field.name}
                        name={field.name}
                        value={value || ''}
                        onChange={handleInputChange}
                        className={`input ${commonClass}`}
                        required={field.is_required}
                    />
                );

            case 'checkbox':
                // Logika radio group jika ada opsi (konsisten dengan checkout)
                const options = field.options ? (Array.isArray(field.options) ? field.options : field.options.split(',')) : [];
                if (options.length > 0) {
                    return (
                        <div className="flex flex-col gap-2 p-3 rounded-lg bg-secondary/30">
                            {options.map(option => (
                                <label key={option.trim()} className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="radio"
                                        name={field.name}
                                        value={option.trim()}
                                        checked={value === option.trim()}
                                        onChange={handleInputChange}
                                        className="radio radio-primary radio-sm"
                                        required={field.is_required}
                                    />
                                    <span className="label-text">{option.trim()}</span>
                                </label>
                            ))}
                        </div>
                    );
                }
                return (
                    <label className="label cursor-pointer justify-start gap-3">
                        <input
                            type="checkbox"
                            name={field.name}
                            checked={!!value}
                            onChange={handleInputChange}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text">{field.placeholder || field.label}</span>
                    </label>
                );

            case 'url':
            case 'text':
            case 'number':
            default:
                return (
                    <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder || ''}
                        value={value || ''}
                        onChange={handleInputChange}
                        className={`input ${commonClass}`}
                        required={field.is_required}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="py-6" encType="multipart/form-data">
            <div className="mb-6">
                <h2 className='font-semibold text-lg text-primary'>
                    {ticket.event.submission_title || 'Form Karya / Data Tambahan'}
                </h2>
                <p className="text-sm text-base-content/70">
                    {ticket.event.submission_description || 'Lengkapi data-data berikut untuk menyelesaikan pendaftaran Anda.'}
                </p>
            </div>

            <div className="space-y-4">
                {fields.map((field) => (
                    <div key={field.id} className="form-control w-full">
                        <label htmlFor={field.name} className="label py-1">
                            <span className="label-text font-bold text-black/70">
                                {field.label}
                                {field.is_required ? <span className="text-red-500 ml-1">*</span> : ''}
                            </span>
                        </label>
                        {renderField(field)}
                        {errors[field.name] && (
                            <div className="text-red-500 text-xs font-semibold mt-1">
                                {errors[field.name]}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-6 flex justify-end">
                <button 
                    type='submit' 
                    className='btn btn-primary px-8' 
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Menyimpan...
                        </>
                    ) : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
}

export default FormAditionalQuestion;