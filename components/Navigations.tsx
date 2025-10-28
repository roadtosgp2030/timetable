'use client'

import { handleLogout } from '@/actions/auth'
import { getUser } from '@/utils/user'
import Link from 'next/link'
import {
  Home,
  Calendar,
  LogOut,
  User,
  Menu,
  X,
  DollarSign,
  ChevronDown,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import type { User as UserType } from '@/types/user'
import StreakDisplay from './StreakDisplay'

export default function Navigations() {
  const [user, setUser] = useState<UserType | null>(null)
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
              <Link href='/' className='text-xl font-bold text-gray-900'>
                <span className='text-blue-600'>Time</span>table
              </Link>
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
            <Link
              href='/budgets'
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive('/budgets')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
              <DollarSign size={16} className='mr-2' />
              Budgets
            </Link>
          </nav>

          {/* Desktop User Section */}
          <div className='hidden md:flex items-center space-x-4'>
            {user ? (
              <div className='flex items-center space-x-3'>
                <StreakDisplay />
                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm'>
                      <User size={16} className='text-white' />
                    </div>
                    <span className='text-gray-900 font-medium'>
                      {user.name || 'User'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50'>
                      <div className='px-4 py-2 border-b border-gray-100'>
                        <p className='text-sm text-gray-900 font-medium'>
                          {user.name}
                        </p>
                        <p className='text-xs text-gray-500'>{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsDropdownOpen(false)
                        }}
                        className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200'>
                        <LogOut size={16} className='mr-2' />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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
            <Link
              href='/budgets'
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/budgets')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}>
              <DollarSign size={18} className='mr-3' />
              Budgets
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
