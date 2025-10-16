
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function About() {
    return (
        <GuestLayout>
            <Head title="About" />
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tentang Kami</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Selamat datang di TIMES Event! Kami adalah platform event terdepan yang berdedikasi untuk membantu Anda menemukan dan membuat acara yang tak terlupakan. Kami percaya bahwa setiap orang berhak mendapatkan akses mudah untuk berpartisipasi dalam acara yang berkualitas.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        <div>
                            <h3 className="border-l border-indigo-600 pl-6 font-semibold text-gray-900">Visi Kami</h3>
                            <div className="mt-2 pl-6 text-gray-600">
                                Menjadi platform event nomor satu di Indonesia yang memberdayakan komunitas dan individu untuk terhubung melalui acara yang bermakna.
                            </div>
                        </div>
                        <div>
                            <h3 className="border-l border-indigo-600 pl-6 font-semibold text-gray-900">Misi Kami</h3>
                            <div className="mt-2 pl-6 text-gray-600">
                                <ul className="list-disc list-inside">
                                    <li>Menyediakan platform yang mudah digunakan untuk membuat dan mengelola event.</li>
                                    <li>Menghubungkan penyelenggara acara dengan audiens yang tepat.</li>
                                    <li>Memberikan pengalaman terbaik bagi para peserta acara.</li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3 className="border-l border-indigo-600 pl-6 font-semibold text-gray-900">Nilai-nilai Kami</h3>
                            <div className="mt-2 pl-6 text-gray-600">
                                <ul className="list-disc list-inside">
                                    <li>Inovasi</li>
                                    <li>Integritas</li>
                                    <li>Kolaborasi</li>
                                    <li>Fokus pada Pelanggan</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
