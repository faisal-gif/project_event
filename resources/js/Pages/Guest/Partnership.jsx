
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Partnership() {
    return (
        <GuestLayout>
            <Head title="Partnership" />
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Info Partnership</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Selamat datang di halaman kemitraan TIMESEvents! Kami percaya bahwa kolaborasi adalah kunci untuk pertumbuhan dan inovasi yang berkelanjutan. TIMESEvents berkomitmen untuk membangun hubungan yang saling menguntungkan dengan para mitra yang memiliki visi dan nilai yang sejalan.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">Mengapa Bermitra dengan Kami?</h3>
                        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-semibold text-gray-900">Peluang Pertumbuhan Bisnis</h4>
                                <p className="mt-2 text-gray-600">Akses ke pasar baru dan basis pelanggan kami yang luas, membuka potensi pendapatan tambahan bagi Anda.</p>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-semibold text-gray-900">Dukungan Penuh</h4>
                                <p className="mt-2 text-gray-600">Tim kami akan memberikan dukungan yang komprehensif, mulai dari materi pemasaran, pelatihan produk, hingga manajer akun khusus.</p>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-semibold text-gray-900">Inovasi Bersama</h4>
                                <p className="mt-2 text-gray-600">Kesempatan untuk berkolaborasi dalam pengembangan produk atau layanan baru, memanfaatkan keahlian dan sumber daya kedua belah pihak.</p>
                            </div>
                        </div>
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Jenis Kemitraan</h3>
                            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-semibold text-gray-900">Kemitraan Strategis</h4>
                                    <p className="mt-2 text-gray-600">Untuk perusahaan yang ingin berintegrasi lebih dalam dengan layanan atau produk kami, menciptakan solusi bersama yang inovatif.</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-semibold text-gray-900">Kemitraan Afiliasi</h4>
                                    <p className="mt-2 text-gray-600">Dapatkan komisi menarik dengan mereferensikan produk atau layanan kami kepada jaringan Anda.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Siap untuk Bermitra?</h3>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Kami sangat antusias untuk menjajaki peluang kolaborasi dengan Anda. Mari bersama-sama menciptakan nilai dan mencapai tujuan yang lebih besar.
                            </p>
                            <div className="mt-10">
                                <a href="#" className="text-base font-semibold leading-7 text-indigo-600">Hubungi Kami <span aria-hidden="true">&rarr;</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
