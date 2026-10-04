import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add preload headers for critical resources
  if (request.nextUrl.pathname === '/') {
    response.headers.set(
      'Link',
      [
        '</fonts/YekanBakhFaNum-Bold-CMNT45Oa.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous',
        '</fonts/YekanBakhFaNum-ExtraBold-CdMhak6a.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous',
      ].join(', ')
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
