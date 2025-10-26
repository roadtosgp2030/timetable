export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function shouldResetStreak(lastActiveDate: Date | null): boolean {
  if (!lastActiveDate) return false

  const today = new Date()
  const daysDiff = getDaysDifference(lastActiveDate, today)

  // If more than 1 day has passed, reset streak
  return daysDiff > 1
}

export function shouldIncrementStreak(lastActiveDate: Date | null): boolean {
  if (!lastActiveDate) return true // First time user

  // Only increment if last active was yesterday or earlier (not today)
  return !isToday(lastActiveDate)
}
