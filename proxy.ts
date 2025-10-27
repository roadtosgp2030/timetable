import { jwtVerify } from 'jose'
import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const jwtSecret = process.env.JWT_SECRET_KEY
  if (!jwtSecret) {
    throw new Error('JWT_SECRET_KEY is not configured')
  }

  // Convert secret to Uint8Array for jose
  const secret = new TextEncoder().encode(jwtSecret)

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/signup']
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // For protected paths, verify authentication
  try {
    const token = request.cookies.get('token')?.value
    if (token) {
      await jwtVerify(token, secret)
      // If token is valid and user tries to access public path, redirect to home
      if (isPublicPath) return NextResponse.redirect(new URL('/', request.url))
      return NextResponse.next()
    }
    if (!isPublicPath) throw new Error('Authentication required')
    return NextResponse.next()
  } catch (error) {
    // If token verification fails, redirect to login page
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
