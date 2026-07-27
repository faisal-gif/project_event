import { useForm, Head } from '@inertiajs/react';
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
import Step5_Affiliate from './Partials/Step5_Affiliate';

const steps = [
    "Detail Event",
    "Detail Tiket",
    "Pertanyaan Registrasi",
    "Pertanyaan Submisi",
    "Program Afiliasi",
    "Konfirmasi",
];
const REVIEW_STEP = steps.length; // last step = review & submit

function Create({ category }) {
    const [step, setStep] = useState(1);
    const [maxStep, setMaxStep] = useState(1);
    const [validating, setValidating] = useState(false);

    const { data, setData, post, processing, errors, setError, clearErrors, isDirty } = useForm({
        // Step 1
        image: null,
        title: '',
        category_id: '',
        start_date: '',
        end_date: '',
        location_type: 'online',
        location_details: '',
        description: '',
        requirements: '',
        is_headline: false,
        status: 'valid',
        // Step 2
        ticket_types: [{ name: 'Regular', price: '0', quota: '100', purchase_date: '', end_purchase_date: '', description: '', submission_rules: [] }],
        limit_ticket_user: 1,
        // Step 3
        need_additional_questions: false,
        event_fields: [], // For registration questions
        // Step 4
        needs_submission: false,
        submission_fields: [], // For submission questions

        is_affiliate_enabled: false,
        affiliate_type: 'percentage',
        affiliate_reward: '',
    });

    const stepFields = {
        1: ['image', 'title', 'category_id', 'start_date', 'end_date', 'location_type', 'location_details', 'description', 'requirements'],
        2: ['ticket_types', 'limit_ticket_user'],
        3: ['need_additional_questions', 'event_fields'],
        4: ['needs_submission', 'submission_fields'],
        5: ['is_affiliate_enabled', 'affiliate_type', 'affiliate_reward']
    };

    useEffect(() => {
        // Clear errors when component unmounts or step changes
        return () => {
            clearErrors();
        };
    }, [step]);

    // Warn before losing unsaved input on refresh/close/back.
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
        post(route('admin.events.store'), {
            transform: (data) => ({ ...data, _method: 'POST' }),
        });
    };

    const nextStep = async () => {
        setValidating(true);
        clearErrors(...stepFields[step]);

        try {
            await axios.post(route('admin.events.validateStep'), { step, ...data });
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

    // Jump to an already-reached step via the stepper.
    const goToStep = (target) => {
        clearErrors();
        setStep(target);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Event" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Stepper steps={steps} currentStep={step} maxStep={maxStep} onStepClick={goToStep} />

                    <form onSubmit={handleSubmit} className="p-4" noValidate>
                        {step === 1 && <Step1_EventDetails data={data} setData={setData} errors={errors} category={category} />}
                        {step === 2 && <Step2_TicketDetails data={data} setData={setData} errors={errors} />}
                        {step === 3 && <Step3_RegistrationQuestions data={data} setData={setData} errors={errors} />}
                        {step === 4 && <Step4_SubmissionQuestions data={data} setData={setData} errors={errors} />}
                        {step === 5 && <Step5_Affiliate data={data} setData={setData} errors={errors} />}
                        {step === REVIEW_STEP && <EventReview data={data} category={category} onEdit={goToStep} />}

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
                                        {processing ? 'Membuat...' : 'Buat Event'}
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

export default Create;
