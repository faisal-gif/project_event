import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Card from '@/Components/ui/Card';
import { Plus, Trash2, Ticket, ArrowUp, ArrowDown } from 'lucide-react';

function Step2_TicketDetails({ data, setData, errors }) {

    const handleTicketChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTicketTypes = [...data.ticket_types];
        updatedTicketTypes[index][name] = value;
        setData('ticket_types', updatedTicketTypes);
    };


    const addTicketType = () => {
        setData('ticket_types', [...data.ticket_types, { name: '', price: '', quota: '', purchase_date: '', end_purchase_date: '', description: '' }]);
    };

    const removeTicketType = (index) => {
        const updatedTicketTypes = data.ticket_types.filter((_, i) => i !== index);
        setData('ticket_types', updatedTicketTypes);
    };

    const moveTicket = (index, dir) => {
        const target = index + dir;
        if (target < 0 || target >= data.ticket_types.length) return;
        const arr = [...data.ticket_types];
        [arr[index], arr[target]] = [arr[target], arr[index]];
        setData('ticket_types', arr);
    };

    return (
        <div className="space-y-6">
            {data.ticket_types.map((ticket, index) => (
                <Card key={index} className="bg-base-100 p-4 sm:p-6 shadow-medium">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-primary" />
                            <label className="text-lg font-semibold">Jenis Tiket #{index + 1}</label>
                        </div>

                        {data.ticket_types.length > 1 && (
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button type="button" onClick={() => moveTicket(index, -1)} disabled={index === 0} className="btn btn-sm btn-ghost btn-square" title="Naikkan">
                                    <ArrowUp className="h-4 w-4" />
                                </button>
                                <button type="button" onClick={() => moveTicket(index, 1)} disabled={index === data.ticket_types.length - 1} className="btn btn-sm btn-ghost btn-square" title="Turunkan">
                                    <ArrowDown className="h-4 w-4" />
                                </button>
                                <DangerButton
                                    type="button"
                                    onClick={() => removeTicketType(index)}
                                    className="justify-center"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                </DangerButton>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <InputLabel htmlFor={`ticket_name_${index}`} value="Nama Tiket" required />
                            <TextInput
                                id={`ticket_name_${index}`}
                                name="name"
                                value={ticket.name}
                                onChange={(e) => handleTicketChange(index, e)}
                                className="mt-1 block w-full"
                                placeholder="cth. VIP, Reguler"
                            />
                            <InputError message={errors[`ticket_types.${index}.name`]} className="mt-2" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <InputLabel htmlFor={`price_${index}`} value="Harga" required />
                            <TextInput
                                id={`price_${index}`}
                                name="price"
                                type="number"
                                value={ticket.price}
                                onChange={(e) => handleTicketChange(index, e)}
                                className="mt-1 block w-full"
                                placeholder="Isi 0 untuk tiket gratis"
                            />
                            <InputError message={errors[`ticket_types.${index}.price`]} className="mt-2" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <InputLabel htmlFor={`quota_${index}`} value="Kuota" required />
                            <TextInput
                                id={`quota_${index}`}
                                name="quota"
                                type="number"
                                value={ticket.quota}
                                onChange={(e) => handleTicketChange(index, e)}
                                className="mt-1 block w-full"
                                placeholder="Jumlah tiket"
                            />
                            <InputError message={errors[`ticket_types.${index}.quota`]} className="mt-2" />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <InputLabel htmlFor={`purchase_date_${index}`} value="Mulai Pembelian" required />
                            <TextInput
                                id={`purchase_date_${index}`}
                                name="purchase_date"
                                type="datetime-local"
                                value={ticket.purchase_date}
                                onChange={(e) => handleTicketChange(index, e)} />
                            <InputError message={errors[`ticket_types.${index}.purchase_date`]} />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <InputLabel htmlFor={`end_purchase_date_${index}`} value="Akhir Pembelian" required />
                            <TextInput
                                id={`end_purchase_date_${index}`}
                                name="end_purchase_date"
                                type="datetime-local"
                                min={ticket.purchase_date || undefined}
                                value={ticket.end_purchase_date}
                                onChange={(e) => handleTicketChange(index, e)} />
                            <InputError message={errors[`ticket_types.${index}.end_purchase_date`]} />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-4">
                            <InputLabel htmlFor={`description_${index}`} value="Deskripsi" required />
                            <textarea
                                id={`description_${index}`}
                                name="description"
                                placeholder="Isi deskripsi tiket"
                                className="textarea textarea-bordered min-h-[80px] w-full"
                                value={ticket.description} onChange={(e) => handleTicketChange(index, e)} />
                            <InputError message={errors[`ticket_types.${index}.description`]} />
                        </div>
                    </div>
                </Card>
            ))}

            <div>
                <PrimaryButton type="button" onClick={addTicketType}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Jenis Tiket
                </PrimaryButton>
            </div>

            <Card className="bg-base-100 p-6 shadow-medium">
                <div className="max-w-xs">
                    <InputLabel htmlFor="limit_ticket_user" required>Maks. Tiket per Pengguna</InputLabel>
                    <TextInput
                        id="limit_ticket_user"
                        name="limit_ticket_user"
                        type="number"
                        value={data.limit_ticket_user}
                        onChange={(e) => setData('limit_ticket_user', e.target.value)}
                        className="mt-1 block w-full"
                        min="1"
                    />
                    <p className="mt-2 text-sm text-gray-600">Jumlah maksimum tiket yang dapat dibeli satu pengguna dalam satu transaksi.</p>
                    <InputError message={errors.limit_ticket_user} className="mt-2" />
                </div>
            </Card>
        </div>
    );
}

export default Step2_TicketDetails;
