import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-400 text-base-content focus:border-indigo-700'
                    : 'border-transparent text-base-content/60 hover:border-base-300 hover:text-base-content/80 focus:border-base-300 focus:text-base-content/80') +
                className
            }
        >
            {children}
        </Link>
    );
}
