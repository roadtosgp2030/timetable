'use client'

import { useState, useEffect } from 'react'
import { getUser } from '@/utils/user'
import { Flame } from 'lucide-react'

export default function StreakDisplay() {
  const [streak, setStreak] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(false)

  const updateStreak = () => {
    const user = getUser()
    if (user && typeof user.streak === 'number') {
      setStreak(user.streak)
      setIsVisible(true)
    }
  }

  useEffect(() => {
    updateStreak()

    // Listen for custom events that might indicate streak updates
    const handleStreakUpdate = () => {
      updateStreak()
    }

    // Add event listener for custom events
    window.addEventListener('streakUpdated', handleStreakUpdate)
    
    // Also check for cookie changes periodically (fallback)
    const interval = setInterval(() => {
      const user = getUser()
      if (user && user.streak !== streak) {
        updateStreak()
      }
    }, 1000) // Check every second

    return () => {
      window.removeEventListener('streakUpdated', handleStreakUpdate)
      clearInterval(interval)
    }
  }, [streak])

  if (!isVisible) {
    return null
  }

  return (
    <div className='flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-full border border-orange-200'>
      <Flame
        size={18}
        className={`${
          streak > 0 ? 'text-orange-500' : 'text-gray-400'
        } transition-colors duration-200`}
      />
      <span className='text-sm font-medium text-gray-700'>
        {streak} day{streak !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
