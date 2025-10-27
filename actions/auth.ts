'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { validateEmail, validatePassword } from '@/lib/auth'

export async function handleLogin(formData: FormData) {
  try {
    const email = formData.get('email')
    const password = formData.get('password')

    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email: String(email) },
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password
    )

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // Set authentication cookies
    const cookie = await cookies()
    const jwtSecret = process.env.JWT_SECRET_KEY
    if (!jwtSecret) {
      throw new Error('JWT_SECRET_KEY is not configured')
    }
    const secret = new TextEncoder().encode(jwtSecret)
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(secret)
    cookie.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookie.set({
      name: 'user',
      value: JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        streak: user.streak ?? 0,
        lastActiveDate: user.lastActiveDate?.toISOString(),
      }),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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

    // Validate email format
    const emailValidation = validateEmail(String(email))
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message || 'Invalid email')
    }

    // Validate password strength
    const passwordValidation = validatePassword(String(password))
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message || 'Invalid password')
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: String(email) },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash the password before storing
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(String(password), saltRounds)

    // Create new user with hashed password
    const newUser = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email),
        password: hashedPassword,
        streak: 0,
        lastActiveDate: null,
      },
    })

    // Set cookies for automatic login after signup
    const cookie = await cookies()
    const jwtSecret = process.env.JWT_SECRET_KEY
    if (!jwtSecret) {
      throw new Error('JWT_SECRET_KEY is not configured')
    }
    const secret = new TextEncoder().encode(jwtSecret)
    const token = await new SignJWT({ userId: newUser.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(secret)

    cookie.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookie.set({
      name: 'user',
      value: JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        streak: newUser.streak ?? 0,
        lastActiveDate: newUser.lastActiveDate?.toISOString(),
      }),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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
