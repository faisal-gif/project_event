import ApplicationLogo from '@/Components/ApplicationLogo';
import NavBarGuest from '@/Components/NavBarGuest';
import { Link } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';
import { Locate, Mail, MapPin, Phone } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-base-100">
            <NavBarGuest />
            {children}

            <footer
                className="relative bg-white before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#b41d1d] before:to-[#3f154f]"
                aria-labelledby="footer-heading"
            >
                <h2 id="footer-heading" className="sr-only">
                    Footer
                </h2>
                <div className="mx-auto max-w-full px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-16">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                        <div className="">
                            <ApplicationLogo className="h-12" />
                            <p className="text-sm leading-6 mt-4">
                                Platform event terdepan untuk menemukan dan membuat acaramu sendiri.
                            </p>
                            <div className='flex flex-col gap-2 mt-2'>
                                <div className='flex flex-row gap-2 items-center'>
                                    <span className='font-semibold '><Mail size={20} /> </span>
                                    <a href="mailto:redaksi@timesindonesia.co.id" className="text-sm leading-6 ">
                                        redaksi@timesindonesia.co.id
                                    </a>
                                </div>
                                <div className='flex flex-row gap-2 items-center'>
                                    <span className='font-semibold'><Phone size={20} /> </span>
                                    <a href="tel:+62341563566" className="text-sm leading-6 ">
                                        (0341) 563566
                                    </a>
                                </div>
                                <div className='flex flex-row gap-2 items-center'>
                                    <span className='font-semibold'><MapPin size={20} /> </span>
                                    <p className="text-sm leading-6">
                                        Jl. Besar Ijen No.90, Oro-oro Dowo, Kec. Klojen, Kota Malang, Jawa Timur 65116
                                    </p>
                                </div>
                            </div>

                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 text-center mt-4 md:mt-0">
                            <Link href={route('about')} className="text-sm font-semibold leading-6 ">
                                Tentang Kami
                            </Link>
                            <Link href={route('partnership')} className="text-sm font-semibold leading-6 ">
                                Partnership
                            </Link>
                            <Link href={route('faq')} className="text-sm font-semibold leading-6 ">
                                FAQ
                            </Link>
                            <Link href={route('contact')} className="text-sm font-semibold leading-6 ">
                                Hubungi Kami
                            </Link>
                            <Link href={route('privacy-policy')} className="text-sm font-semibold leading-6 ">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-[#b41d1d] pt-8 ">
                        <p className="text-xs leading-5 ">&copy; 2025 TIMES Event. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            <div className='mb-20 sm:mb-0'></div>
            {/* Bottom Nav */}
            <BottomNav />
        </div>

    );
}
