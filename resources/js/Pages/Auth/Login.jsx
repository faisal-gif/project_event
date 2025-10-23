import ApplicationLogo from '@/Components/ApplicationLogo';
import ApplicationLogoWhite from '@/Components/ApplicationLogoWhite';
import Checkbox from '@/Components/Checkbox';
import GoogleLogo from '@/Components/GoogleLogo';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <div className='block md:hidden'>
                <ApplicationLogoWhite className="h-full w-52 my-8 mx-auto" />
            </div>
            <div className='hidden md:block'>
                <ApplicationLogo className="h-full w-52 my-8 mx-auto" />
            </div>


            <a href={route('auth.provider', 'google')} className="btn btn-outline bg-base-200 w-full h-12 text-base my-4">
                <GoogleLogo size={20} />
                Lanjutkan dengan Google
            </a>
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" className='text-white' />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="input input-bordered input-sm w-full mt-1"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" className='text-white' />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="input input-bordered input-sm w-full mt-1"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className='checkbox checkbox-sm bg-white'
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm lg:text-gray-600 text-white">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <div>


                    </div>


                </div>
                <div className='mt-8 block'>
                    <PrimaryButton className="w-full justify-center" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>

                <div className='mt-8 block'>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="btn btn-link btn-sm w-full text-white lg:text-black"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>
                <div className='mt-8 text-white lg:text-black  flex items-center justify-center gap-2'>
                    <span>Belum Punya Akun?</span>
                    <Link href={route('register')} className="btn btn-link btn-sm p-0 text-white lg:text-black">
                        Daftar Sekarang
                    </Link>
                </div>

            </form>
        </AuthLayout>
    );
}
