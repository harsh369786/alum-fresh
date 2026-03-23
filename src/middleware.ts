import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/manage');
  
  if (isAdminRoute && !request.cookies.has('admin_token')) {
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }
}

export const config = {
  matcher: '/manage/:path*',
}
