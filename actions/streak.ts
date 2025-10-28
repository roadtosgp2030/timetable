'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { shouldResetStreak, shouldIncrementStreak } from '@/utils/streak'
import { revalidatePath } from 'next/cache';

export async function updateUserStreak(
  userId: string
): Promise<{ streak: number; updated: boolean }> {
  try {
    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, lastActiveDate: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const today = new Date()
    let newStreak = user.streak
    let updated = false

    // Check if we should reset the streak
    if (shouldResetStreak(user.lastActiveDate)) {
      newStreak = 1 // Start fresh
      updated = true
    }
    // Check if we should increment the streak
    else if (shouldIncrementStreak(user.lastActiveDate)) {
      newStreak = user.streak + 1
      updated = true
    }
    // If user was already active today, no change needed
    else {
      return { streak: user.streak, updated: false }
    }

    // Update the user's streak and last active date
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
      streak: newStreak,
      lastActiveDate: today,
      },
      select: {
      id: true,
      email: true,
      name: true,
      streak: true,
      lastActiveDate: true,
      },
    })

    // Update the user cookie with new streak info
    if (updated) {
      const cookie = await cookies()
      cookie.set({
        name: 'user',
        value: JSON.stringify({
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          streak: updatedUser.streak,
          lastActiveDate: updatedUser.lastActiveDate?.toISOString(),
        }),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      
      // Revalidate multiple paths to ensure all pages are updated
      revalidatePath('/')
      revalidatePath('/tasks')
    }

    return { streak: newStreak, updated }
  } catch (error) {
    console.error('Error updating user streak:', error)
    return { streak: 0, updated: false }
  }
}

export async function getUserStreak(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true },
    })
    return user?.streak || 0
  } catch (error) {
    console.error('Error getting user streak:', error)
    return 0
  }
}
