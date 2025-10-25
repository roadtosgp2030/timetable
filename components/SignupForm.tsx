'use client'

import { handleSignup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { useState } from 'react'

export default function SignupForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError('')

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsSubmitting(false)
      return
    }

    try {
      await handleSignup(formData)
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
        <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
          Full Name
        </Label>
        <Input
          type='text'
          id='name'
          name='name'
          placeholder='Enter your full name'
          className='h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg'
          autoFocus
          required
          disabled={isSubmitting}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email' className='text-sm font-medium text-gray-700'>
          Email Address
        </Label>
        <Input
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email'
          className='h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg'
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
          placeholder='Create a strong password'
          className='h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg'
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {password && password.length < 6 && (
          <p className='text-xs text-amber-600'>
            Password must be at least 6 characters
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='confirmPassword'
          className='text-sm font-medium text-gray-700'>
          Confirm Password
        </Label>
        <Input
          type='password'
          id='confirmPassword'
          name='confirmPassword'
          placeholder='Confirm your password'
          className={`h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg ${
            confirmPassword && password !== confirmPassword
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : ''
          }`}
          minLength={6}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {confirmPassword && password !== confirmPassword && (
          <p className='text-xs text-red-600'>Passwords do not match</p>
        )}
      </div>

      <div className='flex items-center'>
        <input
          id='terms'
          name='terms'
          type='checkbox'
          className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
          required
          disabled={isSubmitting}
        />
        <label htmlFor='terms' className='ml-2 block text-sm text-gray-700'>
          I agree to the{' '}
          <button
            type='button'
            className='text-green-600 hover:text-green-500 font-medium'
            disabled={isSubmitting}>
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type='button'
            className='text-green-600 hover:text-green-500 font-medium'
            disabled={isSubmitting}>
            Privacy Policy
          </button>
        </label>
      </div>

      <Button
        type='submit'
        className='w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg'
        disabled={
          isSubmitting || password !== confirmPassword || password.length < 6
        }>
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}
