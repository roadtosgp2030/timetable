import { handleLogin } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Calendar, Clock, CheckCircle, BarChart3 } from 'lucide-react'

export default function page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center'>
        {/* Left Side - Branding & Features */}
        <div className='hidden lg:block space-y-8 pr-8'>
          <div className='space-y-4'>
            <h1 className='text-4xl font-bold text-gray-900'>
              TimeTable Manager
            </h1>
            <p className='text-xl text-gray-600 leading-relaxed'>
              Organize your schedule, track your tasks, and boost your
              productivity with our comprehensive time management solution.
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
        </div>

        {/* Right Side - Login Form */}
        <div className='w-full max-w-md mx-auto lg:mx-0'>
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6'>
            <div className='text-center space-y-2'>
              <h2 className='text-2xl font-bold text-gray-900'>Welcome Back</h2>
              <p className='text-gray-600'>
                Sign in to access your timetable dashboard
              </p>
            </div>

            <form action={handleLogin} className='space-y-5'>
              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-gray-700'>
                  Email Address
                </Label>
                <Input
                  type='text'
                  id='email'
                  name='email'
                  placeholder='Enter your email'
                  defaultValue={process.env.USER_EMAIL}
                  className='h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  autoFocus
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'>
                  Password
                </Label>
                <Input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Enter your password'
                  defaultValue={process.env.USER_PASS}
                  className='h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  required
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-gray-700'>
                    Remember me
                  </label>
                </div>
                <button
                  type='button'
                  className='text-sm text-blue-600 hover:text-blue-500 font-medium'>
                  Forgot password?
                </button>
              </div>

              <Button
                type='submit'
                className='w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg'>
                Sign In
              </Button>
            </form>

            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <button className='text-blue-600 hover:text-blue-500 font-medium'>
                  Contact administrator
                </button>
              </p>
            </div>
          </div>

          {/* Mobile Features Preview */}
          <div className='lg:hidden mt-8 grid grid-cols-2 gap-4'>
            <div className='text-center p-4 bg-white rounded-lg shadow-sm'>
              <Calendar className='w-6 h-6 text-blue-600 mx-auto mb-2' />
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
