'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleLogin(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  const user = await prisma.user.findFirst({
    where: { email: String(email) },
  })

  const cookie = await cookies()
  cookie.set({
    name: 'token',
    value: 'logged-in',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  cookie.set({
    name: 'user',
    value: JSON.stringify({
      id: user?.id,
      email: user?.email,
    }),
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  if (user && user.password === password) {
    redirect('/')
  }
}

export async function handleSignup(formData: FormData) {
  try {
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      throw new Error('All fields are required')
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }

    if (String(password).length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(email))) {
      throw new Error('Please enter a valid email address')
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: String(email) },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email),
        password: String(password), // In production, you should hash this password
      },
    })

    // Set cookies for automatic login after signup
    const cookie = await cookies()
    cookie.set({
      name: 'token',
      value: 'logged-in',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookie.set({
      name: 'user',
      value: JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      }),
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    redirect('/')
  } catch (error) {
    // If it's already a redirect error, re-throw it
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    // For other errors, re-throw them so they can be handled by the client
    throw error
  }
}

export async function handleLogout() {
  const cookie = await cookies()
  cookie.delete('token')
  cookie.delete('user')
  redirect('/login')
}
