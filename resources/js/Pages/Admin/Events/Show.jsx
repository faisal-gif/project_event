import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Stepper from '@/Components/ui/Stepper';
import { Head, Link } from '@inertiajs/react';
import { LocateIcon, MapPin, Video, Check, X } from 'lucide-react';
import React, { useState } from 'react';
import Card from '@/Components/ui/Card';

// Helper function from original file
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'unused':
            return <div className="badge badge-success">VALID</div>;
        case 'used':
            return <div className="badge badge-warning">USED</div>;
        case 'expired':
            return <div className="badge badge-error">EXPIRED</div>;
        default:
            return <div className="badge badge-ghost">UNKNOWN</div>;
    }
};

// Step 1: Event Details View
const EventDetailsView = ({ event }) => {
    const urgency = event.remainingQuota <= 10 ? 'low' : event.remainingQuota <= 50 ? 'medium' : 'high';

    return (
        <div className="grid grid-cols-1 gap-8">
            <Card className="bg-base-100 shadow-xl">
                <figure className="p-4">
                    <img src={`/storage/${event.image}`} alt={event.title} className="w-full max-h-96 object-cover rounded" />
                </figure>
                <div className="card-body">
                    <div className="badge badge-outline badge-lg">{event.category.name}</div>
                    <h1 className="text-3xl font-bold my-4">{event.title}</h1>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                    <div className="divider"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Event Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="font-semibold w-32">Start Date</div>
                                    <div className="flex-1">: {formatDate(event.start_date)}</div>
                                </div>
                                <div className="flex items-start">
                                    <div className="font-semibold w-32">End Date</div>
                                    <div className="flex-1">: {formatDate(event.end_date)}</div>
                                </div>
                                <div className="flex items-start">
                                    <div className="font-semibold w-32">Location Type</div>
                                    <div className="flex-1 capitalize">: {event.location_type}</div>
                                </div>
                                {event.location_details && (
                                    <div className="flex items-start">
                                        <div className="font-semibold w-32">Details</div>
                                        <div className="flex-1">: {event.location_details}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Ticket Information</h3>
                            {event.ticket_types && event.ticket_types.length > 0 ? (
                                <ul className="space-y-3">
                                    {event.ticket_types.map(ticketType => (
                                        <li key={ticketType.id} className="p-3 bg-base-200 rounded-lg flex justify-between items-center">
                                            <div>
                                                <span className="font-semibold">{ticketType.name}</span>
                                                <div className="text-sm text-gray-500">Quota: {ticketType.quota}</div>
                                            </div>
                                            <div className="font-bold text-lg">{formatPrice(ticketType.price)}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No ticket types configured for this event.</p>
                            )}
                            <div className="divider my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Max Tickets per User</span>
                                <span className="font-bold">{event.limit_ticket_user}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Participants</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Ticket Code</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.tickets && event.tickets.length > 0 ? (
                                    event.tickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td>{ticket.ticket_code}</td>
                                            <td>{ticket.user.name}</td>
                                            <td>{ticket.user.email}</td>
                                            <td>{getStatusBadge(ticket.status)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center">No participants yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// Step 2: Registration Answers View
const RegistrationAnswersView = ({ event }) => {
    if (!event.need_additional_questions) {
        return <Card className="p-6 text-center">No additional registration questions for this event.</Card>;
    }

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Registration Question Answers</h2>
            <div className="space-y-6">
                {event.event_fields && event.event_fields.length > 0 ? (
                    event.event_fields.map(field => (
                        <div key={field.id}>
                            <h3 className="font-semibold text-lg">{field.label} {field.is_required ? '*' : ''}</h3>
                            <div className="overflow-x-auto mt-2">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th>Participant</th>
                                            <th>Answer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Assuming field.responses is an array of answers */}
                                        {field.responses && field.responses.length > 0 ? (
                                            field.responses.map(response => (
                                                <tr key={response.id}>
                                                    <td>{response.user.name}</td>
                                                    <td>{response.value}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="2" className="text-center">No answers yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No questions configured.</p>
                )}
            </div>
        </Card>
    );
};

// Step 3: Submissions View
const SubmissionsView = ({ event }) => {
    if (!event.needs_submission) {
        return <Card className="p-6 text-center">Submissions are not required for this event.</Card>;
    }

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Participant Submissions</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Participant</th>
                            <th>Submitted At</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {event.submissions && event.submissions.length > 0 ? (
                            event.submissions.map(submission => (
                                <tr key={submission.id}>
                                    <td>{submission.user.name}</td>
                                    <td>{formatDate(submission.created_at)}</td>
                                    <td>
                                        {submission.submission_field_responses.map(response => (
                                            <div key={response.id} className="text-sm">
                                                <span className="font-semibold">{response.event_submission_field.label}: </span>
                                                <span>{response.value}</span>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" className="text-center">No submissions yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

function Show({ event }) {
    const [step, setStep] = useState(1);

    if (!event) {
        return (
            <AuthenticatedLayout>
                <div className="text-center p-16">Event not found.</div>
            </AuthenticatedLayout>
        );
    }

    const steps = ["Details", "Registrations", "Submissions"];

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <EventDetailsView event={event} />;
            case 2:
                return <RegistrationAnswersView event={event} />;
            case 3:
                return <SubmissionsView event={event} />;
            default:
                return <EventDetailsView event={event} />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`View Event: ${event.title}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stepper navigation can be implemented here if desired */}
                    {/* For now, we just render the content based on a conceptual step */}
                    {/* Or use tabs */}
                    <div role="tablist" className="tabs tabs-lifted">
                        <a role="tab" className={`tab ${step === 1 ? 'tab-active' : ''}`} onClick={() => setStep(1)}>Details</a>
                        <a role="tab" className={`tab ${step === 2 ? 'tab-active' : ''}`} onClick={() => setStep(2)}>Registrations</a>
                        <a role="tab" className={`tab ${step === 3 ? 'tab-active' : ''}`} onClick={() => setStep(3)}>Submissions</a>
                    </div>
                    <div className="p-6 bg-base-100 rounded-b-box shadow-lg">
                        {renderStepContent()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Show;
