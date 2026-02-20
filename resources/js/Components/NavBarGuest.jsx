import { Link, usePage } from '@inertiajs/react'
import React from 'react'
import Dropdown from './Dropdown'
import { User } from 'lucide-react'
import ApplicationLogoWhite from './ApplicationLogoWhite';

function NavBarGuest() {
  const user = usePage().props.auth.user;
  return (
    <div className="navbar bg-gradient-to-br from-[#7f0b1a] to-[#3f154f] text-primary-content shadow-lg">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xs lg:text-xl font-bold">
          <ApplicationLogoWhite className="w-full h-8 " />
        </Link>
      </div>

      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" className="hover:bg-primary-focus font-inter font-semibold">
              Beranda
            </Link>
          </li>
          <li>
            <Link href="/event" className="hover:bg-primary-focus font-inter font-semibold">
              Event
            </Link>
          </li>
          <li><Link className="hover:bg-primary-focus font-inter font-semibold" href={route('tickets.index')}>Tiket</Link></li>
          <li><Link className="hover:bg-primary-focus font-inter font-semibold" href={route('transactions.index')}>Transaksi</Link></li>
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
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
               {user.role === 'judge' && (
                <Dropdown.Link href={route('judge.dashboard')}>
                  Judge Dashboard
                </Dropdown.Link>
              )}
              <Dropdown.Link href={route('logout')} method="post" as="button">
                Log Out
              </Dropdown.Link>
            </Dropdown.Content>
          </Dropdown>
        ) : (
          <div className='flex'>
            <Link href="/login" className="btn btn-ghost btn-sm font-inter font-semibold">
              Masuk
            </Link>
            <Link href="/register" className="btn border-none bg-gradient-to-t from-cyan-500 to-blue-500 btn-sm font-inter font-semibold">
              Daftar
            </Link>
          </div>

        )
        }


        {/* <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-base-content">
            <li><Link href="/event">List Event</Link></li>
            <li><Link href={route('tickets.index')}>Tiket</Link></li>
            <li><Link href={route('transactions.index')}>Transaksi</Link></li>
            <li><Link href="/login" >
              Login
            </Link></li>
            <li>
              <Link href="/register">
                Register
              </Link>
            </li>
          </ul>
        </div> */}
      </div >
    </div >
  )
}

export default NavBarGuest;