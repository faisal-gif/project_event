import { useForm, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect } from 'react';
import { ChevronsRight, ArrowLeft, Loader } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Stepper from '@/Components/ui/Stepper';
import EventReview from '@/Components/EventReview';
import axios from 'axios';

import Step1_EventDetails from './Partials/Step1_EventDetails';
import Step2_TicketDetails from './Partials/Step2_TicketDetails';
import Step3_RegistrationQuestions from './Partials/Step3_RegistrationQuestions';
import Step4_SubmissionQuestions from './Partials/Step4_SubmissionQuestions';

const steps = [
    "Detail Event",
    "Detail Tiket",
    "Pertanyaan Registrasi",
    "Pertanyaan Submisi",
    "Konfirmasi",
];
const REVIEW_STEP = steps.length;

function Edit({ event, category }) {
    const [step, setStep] = useState(1);
    const [maxStep, setMaxStep] = useState(1);
    const [validating, setValidating] = useState(false);

    const { data, setData, processing, errors, setError, clearErrors, isDirty } = useForm({
        // Step 1
        image: null, // Will not be pre-filled, only for new upload
        title: event.title || '',
        category_id: event.category_id || '',
        start_date: event.start_date || '',
        end_date: event.end_date || '',
        location_type: event.location_type || 'online',
        location_details: event.location_details || '',
        description: event.description || '',
        requirements: event.requirements || '',
        is_headline: event.is_headline || false,
        // Step 2
        ticket_types: event.ticket_types || [],
        limit_ticket_user: event.limit_ticket_user || 1,
        // Step 3
        need_additional_questions: event.need_additional_questions || false,
        event_fields: event.event_fields || [],
        // Step 4
        needs_submission: event.needs_submission || false,
        submission_fields: event.event_submission_fields || [],
    });

    const stepFields = {
        1: ['image', 'title', 'category_id', 'start_date', 'end_date', 'location_type', 'location_details', 'description', 'requirements'],
        2: ['ticket_types', 'limit_ticket_user'],
        3: ['need_additional_questions', 'event_fields'],
        4: ['needs_submission', 'submission_fields']
    };

    useEffect(() => {
        return () => clearErrors();
    }, [step]);

    // Warn before losing unsaved edits on refresh/close.
    useEffect(() => {
        const warn = (e) => {
            if (isDirty && !processing) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [isDirty, processing]);

    const scrollToFirstError = () => {
        requestAnimationFrame(() => {
            document.querySelector('.text-red-600')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('organizer.events.update', event.id), {
            _method: 'patch',
            ...data,
        });
    };

    const nextStep = async () => {
        setValidating(true);
        clearErrors(...stepFields[step]);

        try {
            await axios.post(route('organizer.events.validateStep.edit', { event: event.id }), { step, ...data });
            const target = step + 1;
            setStep(target);
            setMaxStep((m) => Math.max(m, target));
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                Object.keys(validationErrors).forEach((key) => {
                    setError(key, validationErrors[key][0]);
                });
                scrollToFirstError();
            }
        } finally {
            setValidating(false);
        }
    };

    const prevStep = () => {
        clearErrors();
        setStep((prev) => prev - 1);
    };

    const goToStep = (target) => {
        clearErrors();
        setStep(target);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Event: ${event.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Stepper steps={steps} currentStep={step} maxStep={maxStep} onStepClick={goToStep} />

                    <form onSubmit={handleSubmit} className="p-6" noValidate>
                        {step === 1 && <Step1_EventDetails data={data} setData={setData} errors={errors} category={category} existingImageUrl={event.image ? `/storage/${event.image}` : null} />}
                        {step === 2 && <Step2_TicketDetails data={data} setData={setData} errors={errors} />}
                        {step === 3 && <Step3_RegistrationQuestions data={data} setData={setData} errors={errors} />}
                        {step === 4 && <Step4_SubmissionQuestions data={data} setData={setData} errors={errors} />}
                        {step === REVIEW_STEP && <EventReview data={data} category={category} onEdit={goToStep} existingImageUrl={event.image ? `/storage/${event.image}` : null} />}

                        <div className="flex justify-between mt-8">
                            <div>
                                {step > 1 && (
                                    <SecondaryButton onClick={prevStep} disabled={validating || processing}><ArrowLeft className="mr-2" /> Kembali</SecondaryButton>
                                )}
                            </div>
                            <div>
                                {step < REVIEW_STEP && (
                                    <PrimaryButton type="button" onClick={nextStep} disabled={validating || processing}>
                                        {validating ? <><Loader className="animate-spin mr-2" /> Memeriksa...</> : <>Lanjut <ChevronsRight className="ml-2" /></>}
                                    </PrimaryButton>
                                )}
                                {step === REVIEW_STEP && (
                                    <PrimaryButton type="submit" disabled={validating || processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Edit;
