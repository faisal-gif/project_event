import { Link, usePage } from '@inertiajs/react';
import { Home, Calendar, User, Ticket, Share2 } from 'lucide-react';
import React from 'react';

const BottomNav = () => {
    const { url } = usePage();
    const user = usePage().props.auth.user;

    const getLinkClass = (path) => {
        return url === path ? 'text-primary active' : 'text-primary';
    };

    const handleUserClick = () => {
        if (user) {
            const routeName = user.role === 'admin' ? 'admin.dashboard' : 'user.dashboard';
            return route(routeName);
        } else {
            return route('login');
        }
    };


    return (
        <div className="dock md:hidden  text-xs">
            <Link href="/" className={getLinkClass('/')}>
                <Home size={24} />
                <span className="dock-label">Beranda</span>
            </Link>
            <Link href="/event" className={getLinkClass('/event')}>
                <Calendar size={24} />
                <span className="dock-label">Event</span>
            </Link>
            <Link href={route('tickets.index')} className={getLinkClass(route('tickets.index'))}>
                <Ticket size={24} />
                <span className="dock-label">Aktivitas</span>
            </Link>
            {user?.role === 'user' && (
                <Link href={route('affiliate.me')} className={getLinkClass(route('affiliate.me'))}>
                    <Share2 size={24} />
                    <span className="dock-label">Affiliate</span>
                </Link>
            )}
            {/* <Link href={handleUserClick()} className={getLinkClass('/login')}>
                <User size={24} />
                <span className="btm-nav-label">Akun</span>
            </Link> */}
        </div>
    );
};

export default BottomNav;