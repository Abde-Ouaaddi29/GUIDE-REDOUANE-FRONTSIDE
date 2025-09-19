import { NextResponse, NextRequest } from 'next/server';

// Basic path prefixes that require auth (client token in storage -> not ideal for security, but per current pattern)
const PROTECTED = ['/nimda'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needs = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!needs) return NextResponse.next();

  // Cannot access localStorage here. If you move to httpOnly cookies, read them here.
  // For now, rely on client AuthGuard; middleware can just proceed.
  return NextResponse.next();
}

export const config = { matcher: ['/nimda/:path*'] };
