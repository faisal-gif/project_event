import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';

export default function CompleteSocialiteRegistration({ name, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        phone_number: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('socialite.register.complete'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Complete Registration" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" className='text-white' />

                    <TextInput
                        id="name"
                        name="name"
                        value={name}
                        className="mt-1 input-bordered w-full input-sm bg-gray-100"
                        autoComplete="name"
                        disabled
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" className='text-white' />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        className="mt-1 input-bordered w-full input-sm bg-gray-100"
                        autoComplete="username"
                        disabled
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone_number" value="Phone Number" className='text-white' />

                    <TextInput
                        id="phone_number"
                        name="phone_number"
                        value={data.phone_number}
                        className="mt-1 input-bordered w-full input-sm"
                        autoComplete="tel"
                        isFocused={true}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        required
                    />

                    <InputError message={errors.phone_number} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" className='text-white'/>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 input-bordered w-full input-sm"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className='text-white'
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 input-bordered w-full input-sm"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
}
