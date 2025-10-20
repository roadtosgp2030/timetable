'use client'

import { handleLogout } from '@/actions/auth'
import { getUser } from '@/utils/user'
import Link from 'next/link'

export default function Navigations() {
  const user = getUser()!

  return (
    <header>
      <Link href='/'>Home</Link> | <Link href='/tasks'>Tasks</Link> |{' '}
      {user ? (
        <span>
          Welcome, {user.email}!{' - '}
          <Link href='/logout' onClick={handleLogout}>
            Logout
          </Link>
        </span>
      ) : (
        <Link href='/login'>Login</Link>
      )}
    </header>
  )
}
