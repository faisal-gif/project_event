import { useForm } from '@inertiajs/react';
import React from 'react';

function FormAditionalQuestion({ ticket, fields }) {
    // 1. Membuat state awal untuk form
    const initialFormState = fields.reduce((acc, field) => {
        let existingValue = '';

        if (ticket?.submission?.submission_custom_fields) {
            const found = ticket.submission.submission_custom_fields.find(f => f.field_name === field.name);
            if (found) existingValue = found.field_value;
        } else if (ticket?.ticket_additional_questions?.[field.name]) {
            existingValue = ticket.ticket_additional_questions[field.name];
        }

        // --- [MODIFIKASI] ---
        // Jika tipenya checkbox dan ada opsi, pecah string menjadi array
        if (field.type === 'checkbox' && field.options) {
             acc[field.name] = existingValue ? existingValue.split(', ') : [];
        } 
        // File/Image selalu null di awal
        else if (field.type === 'file' || field.type === 'image') {
            acc[field.name] = null;
        } 
        // Default (Text, Textarea, Select, dll)
        else {
            acc[field.name] = existingValue || '';
        }
        
        return acc;
    }, {});

    const { data, setData, processing, errors, post } = useForm(initialFormState);

    // 2. Perbaiki fungsi handle input agar support multiple checkbox
    const handleInputChange = (field, e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            const hasOptions = field.options && field.options.length > 0;
            
            if (hasOptions) {
                // Checkbox Multiple Opsi (Hobby, Ukuran Baju) -> Array
                let currentArray = Array.isArray(data[name]) ? [...data[name]] : [];
                if (checked) {
                    currentArray.push(value);
                } else {
                    currentArray = currentArray.filter(v => v !== value);
                }
                setData(name, currentArray);
            } else {
                // Checkbox Single (Yes/No, Terms Agreement) -> Boolean
                setData(name, checked);
            }
        } else {
            // Input Text, Select, Radio, dll
            setData(name, value);
        }
    };

    const handleFileChange = (name, file) => {
        setData(name, file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ticket.additional', ticket.id), {
            preserveScroll: true,
        });
    };

    const hasExistingFile = (fieldName) => {
        if (ticket?.submission?.submission_custom_fields) {
            return ticket.submission.submission_custom_fields.some(f => f.field_name === fieldName && f.field_value);
        }
        return !!ticket?.ticket_additional_questions?.[fieldName];
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
                        onChange={(e) => handleInputChange(field, e)} // Pass 'field' object
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
                        onChange={(e) => handleInputChange(field, e)}
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
                const isFileUploaded = hasExistingFile(field.name);
                return (
                    <div className="space-y-2">
                        <input
                            type="file"
                            id={field.name}
                            accept={field.type === 'image' ? 'image/*' : undefined}
                            onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                            className={`file-input file-input-bordered w-full`}
                            required={field.is_required && !isFileUploaded}
                        />

                        <p className="text-xs text-gray-500">
                            Hanya bisa mengirim max {field.type === 'file' ? '5MB' : '2MB'}
                        </p>
                        
                        {value instanceof File ? (
                            <p className="text-xs text-blue-600 font-medium italic">File baru terpilih: {value.name}</p>
                        ) : isFileUploaded && (
                            <p className="text-xs text-green-600 italic font-medium">✅ File sudah terunggah. Biarkan kosong jika tidak ingin mengubah.</p>
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
                        onChange={(e) => handleInputChange(field, e)}
                        className={`input ${commonClass}`}
                        required={field.is_required}
                    />
                );

            case 'checkbox':
                const options = field.options ? (Array.isArray(field.options) ? field.options : field.options.split(',')) : [];
                if (options.length > 0) {
                    return (
                        <div className="flex flex-col gap-2 p-3 rounded-lg bg-secondary/30">
                            {options.map(option => {
                                const optVal = option.trim();
                                // Cek apakah value array termasuk opsi ini
                                const isChecked = Array.isArray(value) ? value.includes(optVal) : false;
                                
                                return (
                                    <label key={optVal} className="label cursor-pointer justify-start gap-3">
                                        <input
                                            type="checkbox" // Tetap checkbox (bukan radio) agar bisa pilih multiple
                                            name={field.name}
                                            value={optVal}
                                            checked={isChecked}
                                            onChange={(e) => handleInputChange(field, e)}
                                            className="checkbox checkbox-primary checkbox-sm"
                                        />
                                        <span className="label-text">{optVal}</span>
                                    </label>
                                );
                            })}
                        </div>
                    );
                }
                
                // Jika checkbox tidak memiliki opsi (Yes/No questions)
                return (
                    <label className="label cursor-pointer justify-start gap-3">
                        <input
                            type="checkbox"
                            name={field.name}
                            checked={!!value}
                            onChange={(e) => handleInputChange(field, e)}
                            className="checkbox checkbox-primary"
                            required={field.is_required}
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
                        onChange={(e) => handleInputChange(field, e)}
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