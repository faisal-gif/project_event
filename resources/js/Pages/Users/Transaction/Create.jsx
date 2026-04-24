import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import MySwal from "sweetalert2";
import InputError from "@/Components/InputError";

const RenderField = ({ field, value, onChange, error }) => {
    const commonProps = {
        id: field.name,
        name: field.name,
        required: !!field.is_required,
    };

    const label = (
        <label htmlFor={field.name} className="label-text font-medium mb-1 inline-block">
            {field.label}
            {field.is_required ? <span className="text-red-500 ml-1">*</span> : ''}
        </label>
    );

    let inputElement;

    switch (field.type) {
        case 'image':
        case 'file':
            inputElement = (
                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        accept={field.type === 'image' ? "image/*" : undefined}
                        id={field.name}
                        name={field.name}
                        className="file-input file-input-bordered w-full"
                        onChange={(e) => onChange(field, e)}
                        required={field.is_required}
                    />
                    {value && value instanceof File && (
                        <p className="text-xs text-blue-600 font-medium mt-1 italic">
                            File terpilih: {value.name}
                        </p>
                    )}
                </div>
            );
            break;

        case 'time':
            inputElement = (
                <input
                    type="time"
                    {...commonProps}
                    value={value || ''}
                    onChange={(e) => onChange(field, e)}
                    className="input input-bordered w-full"
                />
            );
            break;

        case 'select':
            const selectOptions = field.options ? (Array.isArray(field.options) ? field.options : field.options.split(',')) : [];
            inputElement = (
                <select
                    {...commonProps}
                    value={value || ''}
                    onChange={(e) => onChange(field, e)}
                    className="select select-bordered w-full"
                >
                    <option value="" disabled>Pilih {field.label}</option>
                    {selectOptions.map(opt => <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>)}
                </select>
            );
            break;

        // --- TAMBAHAN UNTUK TEXTAREA ---
        case 'textarea':
            inputElement = (
                <textarea
                    {...commonProps}
                    value={value || ''}
                    onChange={(e) => onChange(field, e)}
                    placeholder={`Masukkan ${field.label.toLowerCase()}`}
                    className="textarea textarea-bordered w-full min-h-[100px]"
                ></textarea>
            );
            break;

        // --- TAMBAHAN UNTUK CHECKBOX ---
        case 'checkbox':
            const cbOptions = field.options ? (Array.isArray(field.options) ? field.options : field.options.split(',')) : [];
            
            if (cbOptions.length > 0) {
                // Skenario 1: Checkbox Pilihan Ganda (Banyak Opsi)
                inputElement = (
                    <div className="flex flex-col gap-2 mt-1">
                        {cbOptions.map(opt => {
                            const optValue = opt.trim();
                            // Pastikan value adalah array saat mengecek 'includes'
                            const isChecked = Array.isArray(value) ? value.includes(optValue) : false;
                            
                            return (
                                <label key={optValue} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={field.name}
                                        value={optValue}
                                        checked={isChecked}
                                        onChange={(e) => onChange(field, e)}
                                        className="checkbox checkbox-primary checkbox-sm"
                                    />
                                    <span className="text-sm">{optValue}</span>
                                </label>
                            );
                        })}
                    </div>
                );
            } else {
                // Skenario 2: Single Checkbox (Boolean / Yes-No)
                // Kita hide label utama, karena label akan di sebelah checkbox
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <label className="flex items-center gap-3 cursor-pointer mt-2">
                            <input
                                type="checkbox"
                                {...commonProps}
                                checked={!!value}
                                onChange={(e) => onChange(field, e)}
                                className="checkbox checkbox-primary"
                            />
                            <span className="label-text font-medium">
                                {field.label} {field.is_required && <span className="text-red-500">*</span>}
                            </span>
                        </label>
                        {error && <p className="text-xs text-error mt-1">{error}</p>}
                    </div>
                );
            }
            break;

        default:
            inputElement = (
                <input
                    type={field.type}
                    {...commonProps}
                    value={value || ''}
                    onChange={(e) => onChange(field, e)}
                    placeholder={field.label}
                    className="input input-bordered w-full"
                />
            );
            break;
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            {label}
            {inputElement}
            {error && <p className="text-xs text-error mt-1">{error}</p>}
        </div>
    );
};

const Create = ({ ticketType, event, channel, quantity }) => {

    const { data, setData, post, processing, errors } = useForm({
        quantity: quantity || 1,
        paymentMethod: 'BRIVA',
        name: '',
        email: '',
        phone: '',
        usia: '',
        pekerjaan: '',
        field_responses: {},
        terms: false,
    });

    if (!event || !ticketType) {
        return (
            <GuestLayout>
                <Head title="Checkout" />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Event atau Tiket Tidak Ditemukan</h1>
                    <Link href={route('events.guest')} className="btn btn-primary">
                        Kembali ke Daftar Event
                    </Link>
                </div>
            </GuestLayout>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // --- PERBAIKAN LOGIKA HANDLE CHANGE ---
    const handleFieldChange = (field, eventData) => {
        const { name, type } = field;
        const target = eventData.target;

        let newValue;

        if (type === 'checkbox') {
            const hasOptions = field.options && field.options.length > 0;
            
            if (hasOptions) {
                // Ambil data array lama, atau jadikan array kosong jika belum ada
                const currentArray = Array.isArray(data.field_responses[name]) ? [...data.field_responses[name]] : [];
                
                if (target.checked) {
                    currentArray.push(target.value); // Tambah pilihan
                } else {
                    const index = currentArray.indexOf(target.value);
                    if (index > -1) currentArray.splice(index, 1); // Hapus pilihan
                }
                newValue = currentArray;
            } else {
                // Jika single checkbox (boolean)
                newValue = target.checked;
            }
        } else if (type === 'file' || type === 'image') {
            newValue = target.files[0];
        } else {
            newValue = target.value;
        }

        setData('field_responses', { ...data.field_responses, [name]: newValue });
    };

    const totalPrice = ticketType.price * data.quantity;
    const selectedChannel = channel.find((ch) => ch.code == data.paymentMethod);
    const adminFee =
        (selectedChannel?.fee_customer?.flat ?? 0) +
        ((totalPrice * (selectedChannel?.fee_customer?.percent ?? 0)) / 100);
    const finalPrice = totalPrice + adminFee;

    const handlePayment = (e) => {
        e.preventDefault();

        MySwal.fire({
            title: 'Yakin ingin membeli tiket ini?',
            showCancelButton: true,
            confirmButtonText: 'Ya, Beli Tiket',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-ghost',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('transactions.store', ticketType.id), {
                    preserveScroll: true,
                });
            }
        });
    }

    return (
        <GuestLayout>
            <Head title="Checkout" />
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body p-6 md:p-8">
                                <h3 className="text-xl font-bold mb-6">Detail Pendaftar</h3>
                                <div className="bg-base-200/50 rounded-lg p-5 md:p-6 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Nama Lengkap Sesuai KTP <span className="text-error">*</span></label>
                                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Lengkap" className="input input-bordered w-full bg-white" required />
                                            <InputError className={errors.name ? 'invalid' : ''} message={errors.name} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Email <span className="text-error">*</span></label>
                                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="email@domain.com" className="input input-bordered w-full bg-white" required />
                                            <InputError className={errors.email ? 'invalid' : ''} message={errors.email} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Nomor HP <span className="text-error">*</span></label>
                                            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="08..." className="input input-bordered w-full bg-white" required />
                                            <InputError className={errors.phone ? 'invalid' : ''} message={errors.phone} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Usia <span className="text-error">*</span></label>
                                            <input type="number" value={data.usia} onChange={(e) => setData('usia', e.target.value)} placeholder="Contoh: 25" className="input input-bordered w-full bg-white" required />
                                            <InputError className={errors.usia ? 'invalid' : ''} message={errors.usia} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full md:col-span-2">
                                            <label className="label-text font-medium">Pekerjaan <span className="text-error">*</span></label>
                                            <input type="text" value={data.pekerjaan} onChange={(e) => setData('pekerjaan', e.target.value)} placeholder="Pekerjaan" className="input input-bordered w-full bg-white" required />
                                            <InputError className={errors.pekerjaan ? 'invalid' : ''} message={errors.pekerjaan} />
                                        </div>
                                    </div>
                                </div>

                                {event.need_additional_questions != 0 && event.event_fields.length > 0 && (
                                    <>
                                        <div className="divider mb-6"></div>
                                        <h3 className="text-xl font-semibold mb-6">Informasi Tambahan</h3>
                                        <div className="bg-base-200/50 rounded-lg p-5 md:p-6 mb-6 space-y-5">
                                            {event.event_fields.map(field => (
                                                <RenderField
                                                    key={field.id}
                                                    field={field}
                                                    value={data.field_responses[field.name]}
                                                    onChange={handleFieldChange}
                                                    error={errors[`field_responses.${field.name}`]}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="flex flex-col gap-2 w-full mt-4 bg-primary/5 p-4 rounded-lg border border-primary/20">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.terms}
                                            onChange={(e) => setData('terms', e.target.checked)}
                                            className="checkbox checkbox-primary shrink-0 mt-0.5"
                                            required
                                        />
                                        <span className="text-sm leading-snug break-words">
                                            Saya setuju dengan Syarat & Ketentuan, dan Kebijakan Privasi TIMESEvent. Lanjutkan pesanan dengan menyetujui pernyataan ini.
                                        </span>
                                    </label>
                                    <InputError className={errors.terms ? 'invalid' : ''} message={errors.terms} />
                                </div>

                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body p-6 md:p-8">
                                <h3 className="text-xl font-bold mb-6">Metode Pembayaran</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {channel.map(method => (
                                        <label key={method.code} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="payment-method"
                                                value={method.code}
                                                onChange={(e) => setData('paymentMethod', e.target.value)}
                                                className="sr-only"
                                                checked={data.paymentMethod === method.code}
                                            />
                                            <div className={`border-2 rounded-xl p-4 transition-all duration-200 ${data.paymentMethod === method.code ? 'border-primary bg-primary/5 shadow-sm' : 'border-base-200 hover:border-primary/40 hover:bg-base-200/50'}`}>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-10 flex items-center justify-center bg-white rounded p-1 border">
                                                        <img src={method.icon_url} className="max-h-full max-w-full object-contain" alt={method.name} />
                                                    </div>
                                                    <span className="font-medium">{method.name}</span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card bg-base-100 shadow-xl border border-base-200 sticky top-8">
                            <div className="card-body p-6">
                                <h3 className="text-xl font-bold mb-4">Ringkasan Pesanan</h3>
                                <div className="bg-base-200/50 rounded-lg p-4 mb-6 border border-base-200">
                                    <h4 className="font-bold text-base leading-tight mb-2">{event.title}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                        <span className="badge badge-primary badge-sm"></span>
                                        {ticketType.name}
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between font-medium">
                                        <span className="text-gray-600">Harga Tiket ({data.quantity}x)</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Biaya Layanan</span>
                                        <span className="font-medium text-gray-700">{formatPrice(adminFee)}</span>
                                    </div>
                                    <div className="divider my-2"></div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">{formatPrice(finalPrice)}</span>
                                    </div>
                                </div>
                                <button onClick={handlePayment} className="btn btn-primary w-full btn-lg" disabled={processing || !data.terms}>
                                    {processing ? 'Memproses...' : 'Bayar Sekarang'}
                                </button>
                                <div className="text-center mt-6">
                                    <Link href={route('events.guest.detail', { event: event.id, slug: event.slug })} className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        Kembali ke Detail Event
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default Create;