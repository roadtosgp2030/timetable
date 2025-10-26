'use client'

import { useState, useEffect } from 'react'
import { getUser } from '@/utils/user'
import { Flame } from 'lucide-react'

export default function StreakDisplay() {
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
