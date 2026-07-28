import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import Card from '@/Components/ui/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import FlashAlert from '@/Components/FlashAlert';
import { formatRupiah, formatDateLong } from '@/Utils/formatter';
import { Plus, Pencil, Trash2, TicketPercent } from 'lucide-react';

const emptyForm = { code: '', event_id: '', type: 'fixed', value: '', max_discount: '', quota: '', valid_until: '' };

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;
    return (
        <div className="flex justify-center mt-6 gap-1 flex-wrap">
            {links.map((link, i) => (
                <Link key={i} href={link.url || '#'} preserveScroll preserveState
                    className={`btn btn-sm ${link.active ? 'btn-primary' : 'btn-outline'} ${!link.url ? 'btn-disabled opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
        </div>
    );
}

export default function Index({ vouchers, events }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(emptyForm);

    const openCreate = () => {
        clearErrors();
        reset();
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (v) => {
        clearErrors();
        setData({
            code: v.code,
            event_id: v.event_id ?? '',
            type: v.type,
            value: v.value,
            max_discount: v.max_discount ?? '',
            quota: v.quota,
            valid_until: v.valid_until ? v.valid_until.slice(0, 16) : '',
        });
        setEditing(v);
        setOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: () => { setOpen(false); reset(); setEditing(null); } };
        if (editing) put(route('admin.vouchers.update', editing.id), opts);
        else post(route('admin.vouchers.store'), opts);
    };

    const destroy = (v) => {
        if (confirm(`Hapus voucher ${v.code}?`)) {
            router.delete(route('admin.vouchers.destroy', v.id), { preserveScroll: true });
        }
    };

    const discountLabel = (v) => (v.type === 'percent' ? `${v.value}%${v.max_discount ? ` (maks ${formatRupiah(v.max_discount)})` : ''}` : formatRupiah(v.value));

    return (
        <AuthenticatedLayout>
            <Head title="Voucher" />

            <div className="py-10">
                <div className="mx-auto max-w-5xl px-4 lg:px-8 space-y-4">
                    <FlashAlert />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <TicketPercent className="w-6 h-6 text-primary" />
                            <h1 className="font-bold text-2xl">Voucher</h1>
                        </div>
                        <button onClick={openCreate} className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-1" /> Tambah Voucher
                        </button>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Kode</th>
                                        <th>Event</th>
                                        <th>Diskon</th>
                                        <th className="text-right">Kuota</th>
                                        <th>Berlaku s/d</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vouchers.data.length === 0 && (
                                        <tr><td colSpan={6} className="text-center text-gray-400 py-8">Belum ada voucher.</td></tr>
                                    )}
                                    {vouchers.data.map((v) => (
                                        <tr key={v.id} className="hover">
                                            <td className="font-mono font-semibold">{v.code}</td>
                                            <td className="text-sm">{v.event?.title ?? <span className="text-gray-400">Semua event</span>}</td>
                                            <td className="text-sm">{discountLabel(v)}</td>
                                            <td className="text-right">{v.quota}</td>
                                            <td className="text-sm">{v.valid_until ? formatDateLong(v.valid_until) : '-'}</td>
                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openEdit(v)} className="btn btn-sm btn-warning btn-outline"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => destroy(v)} className="btn btn-sm btn-error btn-outline"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination links={vouchers.links} />
                </div>
            </div>

            {/* Modal form */}
            <Modal show={open} onClose={() => setOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">{editing ? 'Edit Voucher' : 'Tambah Voucher'}</h3>

                    <div>
                        <InputLabel htmlFor="code" value="Kode Voucher" required />
                        <TextInput id="code" className="mt-1 w-full uppercase" value={data.code}
                            onChange={(e) => setData('code', e.target.value.toUpperCase())} placeholder="cth. DISKON10" />
                        <InputError message={errors.code} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="event_id" value="Berlaku untuk" />
                        <select id="event_id" className="select select-bordered w-full mt-1" value={data.event_id}
                            onChange={(e) => setData('event_id', e.target.value)}>
                            <option value="">Semua event</option>
                            {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                        </select>
                        <InputError message={errors.event_id} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <InputLabel htmlFor="type" value="Tipe" required />
                            <select id="type" className="select select-bordered w-full mt-1" value={data.type}
                                onChange={(e) => setData('type', e.target.value)}>
                                <option value="fixed">Nominal (Rp)</option>
                                <option value="percent">Persentase (%)</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="value" value={data.type === 'percent' ? 'Persentase (%)' : 'Nominal (Rp)'} required />
                            <TextInput id="value" type="number" min="1" className="mt-1 w-full" value={data.value}
                                onChange={(e) => setData('value', e.target.value)} placeholder={data.type === 'percent' ? '10' : '15000'} />
                            <InputError message={errors.value} className="mt-1" />
                        </div>
                    </div>

                    {data.type === 'percent' && (
                        <div>
                            <InputLabel htmlFor="max_discount" value="Maksimal Potongan (opsional)" />
                            <TextInput id="max_discount" type="number" min="0" className="mt-1 w-full" value={data.max_discount}
                                onChange={(e) => setData('max_discount', e.target.value)} placeholder="cth. 50000" />
                            <InputError message={errors.max_discount} className="mt-1" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <InputLabel htmlFor="quota" value="Kuota" required />
                            <TextInput id="quota" type="number" min="0" className="mt-1 w-full" value={data.quota}
                                onChange={(e) => setData('quota', e.target.value)} placeholder="cth. 100" />
                            <InputError message={errors.quota} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="valid_until" value="Berlaku s/d (opsional)" />
                            <TextInput id="valid_until" type="datetime-local" className="mt-1 w-full" value={data.valid_until}
                                onChange={(e) => setData('valid_until', e.target.value)} />
                            <InputError message={errors.valid_until} className="mt-1" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <SecondaryButton type="button" onClick={() => setOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
