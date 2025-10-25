import { Calendar, Clock, CheckCircle, BarChart3, UserPlus } from 'lucide-react'
import Link from 'next/link'
import SignupForm from '@/components/SignupForm'

export default function SignupPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center'>
        {/* Left Side - Branding & Features */}
        <div className='hidden lg:block space-y-8 pr-8'>
          <div className='space-y-4'>
            <h1 className='text-4xl font-bold text-gray-900'>
              Join TimeTable Manager
            </h1>
            <p className='text-xl text-gray-600 leading-relaxed'>
              Start organizing your schedule, tracking your tasks, and boosting
              your productivity with our comprehensive time management solution.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <Calendar className='w-5 h-5 text-blue-600' />
                </div>
                <span className='font-semibold text-gray-900'>
                  Smart Calendar
                </span>
              </div>
              <p className='text-sm text-gray-600'>
                Intuitive calendar interface with drag & drop functionality
              </p>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-green-100 rounded-lg'>
                  <CheckCircle className='w-5 h-5 text-green-600' />
                </div>
                <span className='font-semibold text-gray-900'>
                  Task Tracking
                </span>
              </div>
              <p className='text-sm text-gray-600'>
                Monitor progress with status updates and completion tracking
              </p>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <Clock className='w-5 h-5 text-purple-600' />
                </div>
                <span className='font-semibold text-gray-900'>
                  Time Management
                </span>
              </div>
              <p className='text-sm text-gray-600'>
                Efficiently manage your time with smart scheduling features
              </p>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-orange-100 rounded-lg'>
                  <BarChart3 className='w-5 h-5 text-orange-600' />
                </div>
                <span className='font-semibold text-gray-900'>Analytics</span>
              </div>
              <p className='text-sm text-gray-600'>
                Get insights into your productivity with detailed analytics
              </p>
            </div>
          </div>

          <div className='p-6 bg-green-50 rounded-xl border border-green-200'>
            <div className='flex items-center gap-3 mb-3'>
              <UserPlus className='w-5 h-5 text-green-600' />
              <span className='font-semibold text-green-800'>
                Free to Get Started
              </span>
            </div>
            <p className='text-sm text-green-700'>
              Create your account now and start managing your time more
              effectively. No credit card required!
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className='w-full max-w-md mx-auto lg:mx-0'>
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6'>
            <div className='text-center space-y-2'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Create Account
              </h2>
              <p className='text-gray-600'>
                Sign up to start managing your timetable
              </p>
            </div>

            <SignupForm />

            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Already have an account?{' '}
                <Link
                  href='/login'
                  className='text-green-600 hover:text-green-500 font-medium'>
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Features Preview */}
          <div className='lg:hidden mt-8 grid grid-cols-2 gap-4'>
            <div className='text-center p-4 bg-white rounded-lg shadow-sm'>
              <Calendar className='w-6 h-6 text-green-600 mx-auto mb-2' />
              <p className='text-sm font-medium text-gray-900'>
                Smart Calendar
              </p>
            </div>
            <div className='text-center p-4 bg-white rounded-lg shadow-sm'>
              <BarChart3 className='w-6 h-6 text-green-600 mx-auto mb-2' />
              <p className='text-sm font-medium text-gray-900'>Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
