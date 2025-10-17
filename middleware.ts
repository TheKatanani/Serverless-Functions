// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // --- Authentication for POST routes ---
  if (
    req.method === 'POST' &&
    ['/api/books', '/api/reviews'].includes(req.nextUrl.pathname)
  ) {
    const apiKey = req.headers.get('x-api-key');
    const SECRET_API_KEY = process.env.SECRET_API_KEY ?? 'amana-secret-key-123';

    if (apiKey !== SECRET_API_KEY) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized: A valid API key is required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
