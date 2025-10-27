import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export interface AuthUser {
  id: string
  email: string
  name?: string
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookie = await cookies()
    const token = cookie.get('token')?.value
    const userCookie = cookie.get('user')?.value

    if (!token || !userCookie) return null

    const userData = JSON.parse(userCookie) as AuthUser

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser()
  return user !== null
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export function validatePassword(password: string): {
  isValid: boolean
  message?: string
} {
  if (!password) {
    return { isValid: false, message: 'Password is required' }
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    }
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    }
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    }
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    }
  }

  return { isValid: true }
}

export function validateEmail(email: string): {
  isValid: boolean
  message?: string
} {
  if (!email) {
    return { isValid: false, message: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' }
  }

  return { isValid: true }
}
