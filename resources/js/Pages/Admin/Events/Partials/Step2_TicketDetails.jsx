import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Card from '@/Components/ui/Card';
import { Plus, Trash2, Ticket } from 'lucide-react';

function Step2_TicketDetails({ data, setData, errors }) {

    const handleTicketChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTicketTypes = [...data.ticket_types];
        updatedTicketTypes[index][name] = value;
        setData('ticket_types', updatedTicketTypes);
    };

    const addTicketType = () => {
        setData('ticket_types', [...data.ticket_types, { name: '', price: '', quota: '' }]);
    };

    const removeTicketType = (index) => {
        const updatedTicketTypes = data.ticket_types.filter((_, i) => i !== index);
        setData('ticket_types', updatedTicketTypes);
    };

    return (
        <div className="space-y-6">
            {data.ticket_types.map((ticket, index) => (
                <Card key={index} className="bg-base-100 p-6 shadow-medium relative">
                    <div className="flex items-center gap-2 mb-4">
                        <Ticket className="w-5 h-5 text-primary" />
                        <label className="text-lg font-semibold">Ticket Type #{index + 1}</label>
                    </div>

                    {data.ticket_types.length > 1 && (
                        <div className="absolute top-4 right-4">
                            <DangerButton
                                type="button"
                                onClick={() => removeTicketType(index)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                            </DangerButton>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <InputLabel htmlFor={`ticket_name_${index}`} value="Ticket Name" />
                            <TextInput
                                id={`ticket_name_${index}`}
                                name="name"
                                value={ticket.name}
                                onChange={(e) => handleTicketChange(index, e)}
                                className="mt-1 block w-full"
                                placeholder="e.g., VIP, Regular"
                            />
                            <InputError message={errors[`ticket_types.${index}.name`]} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor={`price_${index}`} value="Price" />
                            <TextInput
                                id={`price_${index}`}
                                name="price"
                                type="number"
                                value={ticket.price}
                                onChange={(e) => handleTicketChange(index, e)}
                                className="mt-1 block w-full"
                                placeholder="0 for free ticket"
                            />
                            <InputError message={errors[`ticket_types.${index}.price`]} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor={`quota_${index}`} value="Quota" />
                            <TextInput
                                id={`quota_${index}`}
                                name="quota"
                                type="number"
                                value={ticket.quota}
                                onChange={(e) => handleTicketChange(index, e)}
                                className="mt-1 block w-full"
                                placeholder="Number of tickets"
                            />
                            <InputError message={errors[`ticket_types.${index}.quota`]} className="mt-2" />
                        </div>
                    </div>
                </Card>
            ))}

            <div>
                <PrimaryButton type="button" onClick={addTicketType}>
                    <Plus className="mr-2 h-4 w-4" /> Add Another Ticket Type
                </PrimaryButton>
            </div>

            <Card className="bg-base-100 p-6 shadow-medium">
                 <div className="max-w-xs">
                    <InputLabel htmlFor="limit_ticket_user">Max Tickets Per User</InputLabel>
                    <TextInput
                        id="limit_ticket_user"
                        name="limit_ticket_user"
                        type="number"
                        value={data.limit_ticket_user}
                        onChange={(e) => setData('limit_ticket_user', e.target.value)}
                        className="mt-1 block w-full"
                        min="1"
                    />
                    <p className="mt-2 text-sm text-gray-600">The maximum number of tickets a single user can buy in one transaction.</p>
                    <InputError message={errors.limit_ticket_user} className="mt-2" />
                </div>
            </Card>
        </div>
    );
}

export default Step2_TicketDetails;