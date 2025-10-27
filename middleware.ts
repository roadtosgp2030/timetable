import { jwtVerify } from 'jose'
import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
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

  // If accessing public paths, check if user is already authenticated
  if (isPublicPath) {
    try {
      const token = request.cookies.get('token')?.value
      if (token) {
        await jwtVerify(token, secret)
        // If authenticated and trying to access login/signup, redirect to home
        const homeUrl = new URL('/', request.url)
        return NextResponse.redirect(homeUrl)
      }
      // No token, allow access to public paths
      return NextResponse.next()
    } catch (error) {
      // Invalid token, allow access to public paths
      return NextResponse.next()
    }
  }

  // For protected paths, verify authentication
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      throw new Error('No token found')
    }
    await jwtVerify(token, secret)
    // Allow request to protected path
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
