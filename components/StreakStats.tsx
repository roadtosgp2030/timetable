'use client'

import { useState, useEffect } from 'react'
import { getUser } from '@/utils/user'
import { Flame, Info } from 'lucide-react'

export function StreakStats() {
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

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your journey today!'
    if (streak === 1) return 'Great start!'
    if (streak < 7) return 'Building momentum!'
    if (streak < 30) return "You're on fire!"
    return 'Incredible dedication!'
  }

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-500'
    if (streak < 7) return 'text-orange-500'
    if (streak < 30) return 'text-red-500'
    return 'text-purple-500'
  }

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <div className='flex items-center'>
            <div className='p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 mr-4'>
              <Flame className={`w-6 h-6 ${getStreakColor(streak)}`} />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600'>Daily Streak</p>
              <p className='text-2xl font-bold text-gray-900'>
                {streak} day{streak !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <p className={`text-sm font-medium mt-2 ${getStreakColor(streak)}`}>
            {getStreakMessage(streak)}
          </p>
        </div>
        <div className='relative group'>
          <Info className='w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help transition-colors' />
          <div className='absolute right-0 top-full mt-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10'>
            Keep logging in and creating tasks to maintain your streak!
          </div>
        </div>
      </div>
    </div>
  )
}
