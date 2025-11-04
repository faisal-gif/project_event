import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { User } from 'lucide-react';
import { useState } from 'react';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="drawer lg:drawer-open bg-base-300">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                <div className="navbar bg-gradient-to-br from-blue-50 to-green-50 shadow-sm ">
                    <div className="hidden md:flex-none">
                        <button className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                        </button>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="flex-none">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="btn btn-ghost flex items-center gap-2">
                                    <User size={20} />
                                    <span>{user.name}</span>
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                 {user.role === 'admin' && (
                                    <Dropdown.Link href={route('admin.dashboard')}>
                                        Admin Dashboard
                                    </Dropdown.Link>
                                )}
                                {user.role === 'organizer' && (
                                    <Dropdown.Link href={route('organizer.dashboard')}>
                                        Organizer Dashboard
                                    </Dropdown.Link>
                                )}
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
                <main>{children}</main>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-72 p-4">
                    <li>
                        <Link href="/">
                            <ApplicationLogo className="h-10 w-auto mx-auto" />
                        </Link>
                    </li>
                    {/* Sidebar content here */}
                    <li className='mb-3 pt-10'>
                        <h2 className="menu-title">Menu</h2>
                        <ul>
                            {user.role === 'admin' && (
                                <>
                                    <li>
                                        <Link href={route('admin.category.index')}>
                                            Category
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('admin.events.index')}>
                                            Event
                                        </Link>
                                    </li>
                                    <li><Link href={route('admin.ticket.scan')}>QR Scanner</Link></li>
                                    <li><Link href={route('admin.transactions.index')}>Transaction</Link></li>
                                    <li><Link href={route('admin.users.index')}>Users</Link></li>
                                </>
                            )}

                            {user.role === 'organizer' && (
                                <>
                                    <li>
                                        <Link href={route('organizer.dashboard')}>
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('organizer.events.index')}>
                                            My Events
                                        </Link>
                                    </li>
                                </>
                            )}

                             {user.role === 'user' && (
                                <>
                                    <li>
                                        <Link href={route('user.dashboard')}>
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('events.user.index')}>
                                            Events
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}
