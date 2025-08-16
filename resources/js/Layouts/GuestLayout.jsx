import ApplicationLogo from '@/Components/ApplicationLogo';
import NavBarGuest from '@/Components/NavBarGuest';
import { Link } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-base-100">
            <NavBarGuest />
            {children}

            <footer className="hidden lg:block bg-gray-900" aria-labelledby="footer-heading">
                <h2 id="footer-heading" className="sr-only">
                    Footer
                </h2>
                <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div className="space-y-8">
                           <ApplicationLogo className="h-12"/>
                            <p className="text-sm leading-6 text-gray-300">
                                Platform event terdepan untuk menemukan dan membuat acaramu sendiri.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-white">Informasi</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li>
                                            <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                                                Tentang Kami
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                                                Info Partner Ship
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-10 md:mt-0">
                                    <h3 className="text-sm font-semibold leading-6 text-white">Bantuan</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li>
                                            <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                                                FAQ
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                                                Hubungi Kami
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li>
                                            <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                                                Privacy Policy
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                        <p className="text-xs leading-5 text-gray-400">&copy; 2024 EventHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Bottom Nav */}
            <BottomNav />
        </div>

    );
}
