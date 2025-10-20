'use client'

import { handleLogout } from '@/actions/auth'
import { getUser } from '@/utils/user'
import Link from 'next/link'
import { Home, Calendar, LogOut, User, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navigations() {
  const user = getUser()!
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className='bg-white border-b border-gray-200 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo/Brand */}
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <h1 className='text-xl font-bold text-gray-900'>
                <span className='text-blue-600'>Time</span>table
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className='hidden md:flex space-x-8'>
            <Link
              href='/'
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
              <Home size={16} className='mr-2' />
              Home
            </Link>
            <Link
              href='/tasks'
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive('/tasks')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
              <Calendar size={16} className='mr-2' />
              Tasks
            </Link>
          </nav>

          {/* Desktop User Section */}
          <div className='hidden md:flex items-center space-x-4'>
            {user ? (
              <div className='flex items-center space-x-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm'>
                    <User size={18} className='text-white' />
                  </div>
                  <div className='text-sm'>
                    <p className='text-gray-900 font-medium'>Welcome back!</p>
                    <p className='text-gray-500 text-xs'>{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className='inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all duration-200'>
                  <LogOut size={16} className='mr-2' />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href='/login'
                className='inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200'>
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={toggleMobileMenu}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200'
              aria-expanded='false'>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className='md:hidden border-t border-gray-200 bg-gray-50'>
          <div className='px-4 py-3 space-y-2'>
            <Link
              href='/'
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}>
              <Home size={18} className='mr-3' />
              Home
            </Link>
            <Link
              href='/tasks'
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/tasks')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}>
              <Calendar size={18} className='mr-3' />
              Tasks
            </Link>

            {/* Mobile User Section */}
            <div className='pt-3 border-t border-gray-200'>
              {user ? (
                <div className='space-y-2'>
                  <div className='flex items-center px-3 py-2'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3'>
                      <User size={16} className='text-white' />
                    </div>
                    <div className='text-sm'>
                      <p className='text-gray-900 font-medium'>Welcome!</p>
                      <p className='text-gray-500 text-xs'>{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className='flex items-center w-full px-3 py-3 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200'>
                    <LogOut size={18} className='mr-3' />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href='/login'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex items-center justify-center w-full px-4 py-3 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200'>
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
