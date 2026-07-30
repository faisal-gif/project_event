
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Partnership() {
    return (
        <GuestLayout>
            <Head title="Partnership" />
            <div className="bg-base-100 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">Info Partnership</h2>
                        <p className="mt-6 text-lg leading-8 text-base-content/70">
                            Selamat datang di halaman kemitraan TIMESEvents! Kami percaya bahwa kolaborasi adalah kunci untuk pertumbuhan dan inovasi yang berkelanjutan. TIMESEvents berkomitmen untuk membangun hubungan yang saling menguntungkan dengan para mitra yang memiliki visi dan nilai yang sejalan.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
                        <h3 className="text-2xl font-bold tracking-tight text-base-content">Mengapa Bermitra dengan Kami?</h3>
                        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="border-t border-base-300 pt-4">
                                <h4 className="font-semibold text-base-content">Peluang Pertumbuhan Bisnis</h4>
                                <p className="mt-2 text-base-content/70">Akses ke pasar baru dan basis pelanggan kami yang luas, membuka potensi pendapatan tambahan bagi Anda.</p>
                            </div>
                            <div className="border-t border-base-300 pt-4">
                                <h4 className="font-semibold text-base-content">Dukungan Penuh</h4>
                                <p className="mt-2 text-base-content/70">Tim kami akan memberikan dukungan yang komprehensif, mulai dari materi pemasaran, pelatihan produk, hingga manajer akun khusus.</p>
                            </div>
                            <div className="border-t border-base-300 pt-4">
                                <h4 className="font-semibold text-base-content">Inovasi Bersama</h4>
                                <p className="mt-2 text-base-content/70">Kesempatan untuk berkolaborasi dalam pengembangan produk atau layanan baru, memanfaatkan keahlian dan sumber daya kedua belah pihak.</p>
                            </div>
                        </div>
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold tracking-tight text-base-content">Jenis Kemitraan</h3>
                            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <div className="border-t border-base-300 pt-4">
                                    <h4 className="font-semibold text-base-content">Kemitraan Strategis</h4>
                                    <p className="mt-2 text-base-content/70">Untuk perusahaan yang ingin berintegrasi lebih dalam dengan layanan atau produk kami, menciptakan solusi bersama yang inovatif.</p>
                                </div>
                                <div className="border-t border-base-300 pt-4">
                                    <h4 className="font-semibold text-base-content">Kemitraan Afiliasi</h4>
                                    <p className="mt-2 text-base-content/70">Dapatkan komisi menarik dengan mereferensikan produk atau layanan kami kepada jaringan Anda.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold tracking-tight text-base-content">Siap untuk Bermitra?</h3>
                            <p className="mt-6 text-lg leading-8 text-base-content/70">
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
