
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Faq() {
    return (
        <GuestLayout>
            <Head title="FAQ" />
            <div className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Pertanyaan yang Sering Diajukan</h2>
                        <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
                            <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                                <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">Apa itu TIMESEvents?</dt>
                                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                                    <p className="text-base leading-7 text-gray-600">TIMESEvents adalah platform untuk menemukan dan membuat acara. Tujuan kami adalah untuk mempermudah orang menemukan acara yang mereka sukai dan membantu penyelenggara acara untuk menjangkau audiens yang lebih luas.</p>
                                </dd>
                            </div>
                            <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                                <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">Bagaimana cara membuat akun?</dt>
                                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                                    <p className="text-base leading-7 text-gray-600">Anda dapat membuat akun dengan mengklik tombol "Daftar" di pojok kanan atas halaman kami. Ikuti langkah-langkah pendaftaran dengan mengisi informasi yang diperlukan.</p>
                                </dd>
                            </div>
                            <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                                <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">Metode pembayaran apa saja yang diterima?</dt>
                                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                                    <p className="text-base leading-7 text-gray-600">Kami menerima pembayaran melalui transfer bank, dan e-wallet (ShopeePay, Qris, Dana).</p>
                                </dd>
                            </div>
                            <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                                <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">Bagaimana cara menghubungi layanan pelanggan?</dt>
                                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                                    <p className="text-base leading-7 text-gray-600">Anda dapat menghubungi kami melalui email di redaksi@timesindonesia.co.id, atau melalui telepon di (0341) 563566 selama jam kerja.</p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
