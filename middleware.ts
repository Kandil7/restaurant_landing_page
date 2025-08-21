import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only ensure default data in production runtime, not during build
  if (process.env.NODE_ENV === 'production') {
    try {
      const { ensureDefaultData } = await import('@/lib/seed');
      await ensureDefaultData();
    } catch (error) {
      console.error('Error ensuring default data in middleware:', error);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};