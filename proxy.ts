import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const key = new TextEncoder().encode(process.env.JWT_SECRET ?? 'rentnest-local-development-secret-change-in-production');
export async function proxy(request: NextRequest) {
  const token = request.cookies.get('rentnest_session')?.value;
  const path = request.nextUrl.pathname;
  if (!token) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
  try {
    const { payload } = await jwtVerify(token,key);
    if (path.startsWith('/owner') && payload.role !== 'OWNER') return NextResponse.redirect(new URL('/tenant',request.url));
    if (path.startsWith('/tenant') && payload.role !== 'TENANT') return NextResponse.redirect(new URL('/owner',request.url));
    return NextResponse.next();
  } catch { const res=NextResponse.redirect(new URL('/login',request.url)); res.cookies.delete('rentnest_session'); return res; }
}
export const config = { matcher:['/owner/:path*','/tenant/:path*','/settings/:path*','/requests/:path*','/receipts/:path*','/notifications/:path*'] };
