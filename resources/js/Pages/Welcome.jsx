import EventList from '@/Components/EventList';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Ticket, Shield, Award, ArrowRight } from 'lucide-react';

export default function Welcome({ listEvents }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-gray-800">
                <GuestLayout>
                    <main>
                        <div className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
                            <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
                                    <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                        Temukan dan Ikuti Event Terbaik di Indonesia
                                    </h1>
                                    <p className="mt-6 text-lg leading-8 text-gray-600">
                                        TIMES Events adalah platform terpercaya untuk menemukan, membeli tiket, dan berpartisipasi dalam berbagai event dan kompetisi menarik di seluruh negeri.
                                    </p>
                                    <div className="mt-10 flex items-center gap-x-6">
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Daftar Sekarang
                                        </Link>
                                        <Link href="" className="text-sm font-semibold leading-6 text-gray-900">
                                            Pelajari lebih lanjut <span aria-hidden="true">→</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                                    <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                                        <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                            <img
                                                src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                                alt="App screenshot"
                                                width={2432}
                                                height={1442}
                                                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="features" className="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Mengapa Memilih TIMES Events?</h2>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Kami menyediakan platform yang aman, terpercaya, dan mudah digunakan untuk semua kebutuhan event Anda.
                                </p>
                            </div>
                            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                                    <div className="relative pl-16">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">
                                            <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                                <Ticket className="h-6 w-6 text-white" />
                                            </div>
                                            Tiket Resmi & Terjamin
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">
                                            Semua tiket yang dijual di TIMES Events dijamin keasliannya. Bekerja sama langsung dengan penyelenggara event terkemuka.
                                        </dd>
                                    </div>
                                    <div className="relative pl-16">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">
                                            <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                                <Shield className="h-6 w-6 text-white" />
                                            </div>
                                            Pembayaran Aman & Mudah
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">
                                            Nikmati proses pembayaran yang cepat dan aman dengan berbagai pilihan metode pembayaran yang terintegrasi.
                                        </dd>
                                    </div>
                                    <div className="relative pl-16">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">
                                            <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                                <Award className="h-6 w-6 text-white" />
                                            </div>
                                            Event & Kompetisi Berkualitas
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">
                                            Kami mengurasi event dan kompetisi untuk memastikan Anda mendapatkan pengalaman terbaik dari penyelenggara terpercaya.
                                        </dd>
                                    </div>
                                    <div className="relative pl-16">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">
                                            <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                                <ArrowRight className="h-6 w-6 text-white" />
                                            </div>
                                            Proses Pendaftaran Mudah
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">
                                            Daftarkan diri Anda atau tim Anda untuk berbagai kompetisi dengan proses yang ringkas dan mudah diikuti.
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className='w-full bg-base-300 mt-10'>
                            <EventList events={listEvents} />
                        </div>


                        <div className="mt-32 bg-white py-24 sm:py-32">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <div className="mx-auto max-w-2xl lg:text-center">
                                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Jadilah Bagian dari Kami</h2>
                                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                        Punya event atau kompetisi yang ingin dipublikasikan?
                                    </p>
                                    <p className="mt-6 text-lg leading-8 text-gray-600">
                                        Jangkau audiens yang lebih luas dan kelola event Anda dengan mudah bersama EventHub. Kami menyediakan alat yang Anda butuhkan untuk sukses.
                                    </p>
                                    <div className="mt-10 flex items-center justify-center gap-x-6">
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Daftar Sebagai Penyelenggara
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </GuestLayout>

            </div>
        </>
    );
}