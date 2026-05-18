import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/products') || 
                           pathname.startsWith('/settings')
                           
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Auth routes (redirect to dashboard if already logged in)
  const isAuthRoute = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/settings/:path*', '/auth/:path*']
}
