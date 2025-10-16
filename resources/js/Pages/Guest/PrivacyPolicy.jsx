
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function PrivacyPolicy() {
    return (
        <GuestLayout>
            <Head title="Privacy & Policy" />
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Kebijakan Privasi</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Terakhir diperbarui: 15 Oktober 2025
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">1. Informasi yang Kami Kumpulkan</h3>
                                <p className="mt-4 text-gray-600">
                                    Kami mengumpulkan berbagai jenis informasi untuk berbagai tujuan guna menyediakan dan meningkatkan Layanan kami kepada Anda. Ini termasuk data pribadi seperti nama, email, dan nomor telepon, serta data penggunaan seperti alamat IP dan jenis browser.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">2. Bagaimana Kami Menggunakan Informasi Anda</h3>
                                <p className="mt-4 text-gray-600">
                                    Informasi yang kami kumpulkan digunakan untuk menyediakan dan memelihara layanan kami, untuk mengelola akun Anda, untuk menghubungi Anda, dan untuk memberi Anda berita dan penawaran khusus.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">3. Berbagi Informasi Anda</h3>
                                <p className="mt-4 text-gray-600">
                                    Kami dapat membagikan informasi Anda dengan penyedia layanan, afiliasi, dan mitra bisnis kami. Kami juga dapat membagikan informasi Anda jika diharuskan oleh hukum.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">4. Keamanan Informasi Anda</h3>
                                <p className="mt-4 text-gray-600">
                                    Keamanan informasi Anda penting bagi kami, tetapi ingat bahwa tidak ada metode transmisi melalui Internet, atau metode penyimpanan elektronik yang 100% aman.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">5. Perubahan pada Kebijakan Privasi Ini</h3>
                                <p className="mt-4 text-gray-600">
                                    Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberi tahu Anda tentang setiap perubahan dengan memposting Kebijakan Privasi baru di halaman ini.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">6. Hubungi Kami</h3>
                                <p className="mt-4 text-gray-600">
                                    Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, Anda dapat menghubungi kami di redaksi@timesindonesia.co.id.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
