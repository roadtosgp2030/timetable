import { User } from '@/types/user'

/* get user info from cookie */
export function getUser(): User | null {
  if (document === undefined) return null
  const userCookie = document?.cookie
    .split('; ')
    .find(row => row.startsWith('user='))
  if (!userCookie) return null
  const userValue = userCookie.split('=')[1]
  try {
    return JSON.parse(decodeURIComponent(userValue))
  } catch {
    return null
  }
}
