'use client'

import { useState, useEffect } from 'react'
import { getUser } from '@/utils/user'
import { Flame, TrendingUp } from 'lucide-react'

export function StreakStats() {
  const [streak, setStreak] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const user = getUser()
    if (user && typeof user.streak === 'number') {
      setStreak(user.streak)
      setIsVisible(true)
    }
  }, [])

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
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <div className='p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg'>
            <Flame className={`w-5 h-5 ${getStreakColor(streak)}`} />
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>Daily Streak</h3>
        </div>
        <TrendingUp className='w-5 h-5 text-gray-400' />
      </div>

      <div className='space-y-2'>
        <div className='flex items-baseline space-x-2'>
          <span className='text-3xl font-bold text-gray-900'>{streak}</span>
          <span className='text-sm text-gray-500'>
            day{streak !== 1 ? 's' : ''}
          </span>
        </div>
        <p className={`text-sm font-medium ${getStreakColor(streak)}`}>
          {getStreakMessage(streak)}
        </p>
        <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
          <p className='text-xs text-gray-600'>
            Keep logging in and creating tasks to maintain your streak!
          </p>
        </div>
      </div>
    </div>
  )
}
