'use client'

import { useEffect } from 'react'
import { getUser } from '@/utils/user'
import { updateUserStreak } from '@/actions/streak'

export function useStreakUpdate() {
  useEffect(() => {
    const updateStreak = async () => {
      const user = getUser()
      if (user && user.id) {
        try {
          const result = await updateUserStreak(user.id)
          if (result.updated) {
            // Force a page refresh to update the user cookie
            window.location.reload()
          }
        } catch (error) {
          console.error('Failed to update streak:', error)
        }
      }
    }

    updateStreak()
  }, [])
}
