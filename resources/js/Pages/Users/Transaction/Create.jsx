import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import MySwal from "sweetalert2";
import InputError from "@/Components/InputError";

const RenderField = ({ field, value, onChange, error }) => {
    // Gunakan props yang tidak menyertakan 'value' untuk tipe file/image
    const commonProps = {
        id: field.name,
        name: field.name,
        required: !!field.is_required,
    };

    const label = (
        <label htmlFor={field.name} className="label-text font-medium">
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
                        onChange={(e) => onChange(field, e)} // Gunakan onChange langsung
                        required={field.is_required}
                    // PENTING: Jangan berikan prop 'value' di sini
                    />
                    {/* Tampilkan nama file jika sudah ada di state */}
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
            const options = field.options ? (Array.isArray(field.options) ? field.options : field.options.split(',')) : [];
            inputElement = (
                <select
                    {...commonProps}
                    value={value || ''}
                    onChange={(e) => onChange(field, e)}
                    className="select select-bordered w-full"
                >
                    <option value="" disabled>Pilih {field.label}</option>
                    {options.map(opt => <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>)}
                </select>
            );
            break;

        // ... case lainnya (textarea, checkbox, dll) pastikan menggunakan onChange bukan onBlur untuk file
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
        <div className="flex flex-col gap-2 w-full">
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

    const handleFieldChange = (field, event) => {
        const { name, type } = field;
        const target = event.target;

        let value;
        if (type === 'checkbox' && !field.options) {
            value = target.checked;
        } else if (type === 'file') {
            value = target.files[0];
        } else {
            value = target.value;
        }

        setData('field_responses', { ...data.field_responses, [name]: value });
    };



    const totalPrice = ticketType.price * data.quantity;
    const selectedChannel = channel.find((ch) => ch.code == data.paymentMethod);
    const adminFee =
        (selectedChannel?.fee_customer?.flat ?? 0) +
        ((amount * (selectedChannel?.fee_customer?.percent ?? 0)) / 100);
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
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="text-xl font-bold mb-6">Detail Pendaftar</h3>
                                <div className="bg-base-200 rounded-lg p-4 mb-6">
                                    <div className="flex flex-col justify-between items-start gap-4">
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Nama Lengkap Sesuai KTP</label>
                                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Lengkap Sesuai KTP" className="input input-bordered w-full " required />
                                            <InputError className={errors.name ? 'invalid' : ''} message={errors.name} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Email</label>
                                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="email@gmail.com" className="input input-bordered w-full " required />
                                            <InputError className={errors.email ? 'invalid' : ''} message={errors.email} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Nomor HP</label>
                                            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="0895389118844" className="input input-bordered w-full " required />
                                            <InputError className={errors.phone ? 'invalid' : ''} message={errors.phone} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Usia</label>
                                            <input type="number" value={data.usia} onChange={(e) => setData('usia', e.target.value)} placeholder="Usia" className="input input-bordered w-full " required />
                                            <InputError className={errors.usia ? 'invalid' : ''} message={errors.usia} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="label-text font-medium">Pekerjaan</label>
                                            <input type="text" value={data.pekerjaan} onChange={(e) => setData('pekerjaan', e.target.value)} placeholder="Pekerjaan" className="input input-bordered w-full " required />
                                            <InputError className={errors.pekerjaan ? 'invalid' : ''} message={errors.pekerjaan} />
                                        </div>
                                    </div>
                                </div>

                                {event.need_additional_questions != 0 && event.event_fields.length > 0 && (
                                    <>
                                        <h3 className="text-xl font-semibold mb-6">Informasi Tambahan</h3>
                                        <div className="rounded-lg p-4 mb-6 space-y-4">
                                            {event.event_fields.map(field => (
                                                <RenderField
                                                    key={field.id}
                                                    field={field}
                                                    value={data.field_responses[field.name] || ''}
                                                    onChange={handleFieldChange}
                                                    error={errors[`field_responses.${field.name}`]}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}


                                <div className="flex flex-col gap-2 w-full mt-4">
                                    <label className="label cursor-pointer">
                                        <input type="checkbox" checked={data.terms} onChange={(e) => setData('terms', e.target.checked)} className="checkbox checkbox-sm mr-2" required />
                                        I agree with TIMESEvent Terms &amp; Conditions, and TIMESEvent Privacy Policy. Accept agreement and click continue to process your order.
                                    </label>
                                    <InputError className={errors.terms ? 'invalid' : ''} message={errors.terms} />
                                </div>

                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
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
                                            <div className={`border-2 rounded-lg p-4 transition-colors ${data.paymentMethod === method.code ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'}`}>
                                                <div className="flex items-center space-x-3">
                                                    <img src={method.icon_url} className="w-16" alt={method.name} />
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
                        <div className="card bg-base-100 shadow-xl sticky top-8">
                            <div className="card-body">
                                <h3 className="text-xl font-bold mb-4">Ringkasan Pesanan</h3>
                                <div className="bg-base-200 rounded-lg p-4 mb-4">
                                    <h4 className="font-semibold text-lg">{event.title}</h4>
                                    <p className="text-sm text-gray-500">Tipe Tiket: {ticketType.name}</p>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span>Harga Tiket ({data.quantity}x)</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-base-content/70">
                                        <span>Biaya Admin</span>
                                        <span>{formatPrice(adminFee)}</span>
                                    </div>
                                    <div className="divider my-2"></div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">{formatPrice(finalPrice)}</span>
                                    </div>
                                </div>
                                <button onClick={handlePayment} className="btn btn-primary w-full btn-lg" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Bayar Sekarang'}
                                </button>
                                <div className="text-center mt-4">
                                    <Link href={route('events.guest.detail', { event: event.id, slug: event.slug })} className="btn btn-ghost btn-sm">
                                        ← Kembali ke Detail Event
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