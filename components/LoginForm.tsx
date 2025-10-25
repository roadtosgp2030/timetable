'use client'

import { handleLogin } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { useState } from 'react'

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError('')

    try {
      await handleLogin(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className='space-y-5'>
      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}

      <div className='space-y-2'>
        <Label htmlFor='email' className='text-sm font-medium text-gray-700'>
          Email Address
        </Label>
        <Input
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email'
          defaultValue={process.env.USER_EMAIL}
          className='h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
          autoFocus
          required
          disabled={isSubmitting}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password' className='text-sm font-medium text-gray-700'>
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
          disabled={isSubmitting}
        />
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember-me'
            name='remember-me'
            type='checkbox'
            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            disabled={isSubmitting}
          />
          <label
            htmlFor='remember-me'
            className='ml-2 block text-sm text-gray-700'>
            Remember me
          </label>
        </div>
        <button
          type='button'
          className='text-sm text-blue-600 hover:text-blue-500 font-medium'
          disabled={isSubmitting}>
          Forgot password?
        </button>
      </div>

      <Button
        type='submit'
        className='w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg'
        disabled={isSubmitting}>
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  )
}
