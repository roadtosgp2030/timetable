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

export async function handleLogout() {
  const cookie = await cookies()
  cookie.delete('token')
  cookie.delete('user')
  redirect('/login')
}
