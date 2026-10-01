import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
export type Session = { userId: string; role: 'OWNER' | 'TENANT'; name: string; email: string };
const key = new TextEncoder().encode(process.env.JWT_SECRET ?? 'rentnest-local-development-secret-change-in-production');
export async function createSession(session: Session) {
  const token = await new SignJWT(session).setProtectedHeader({ alg:'HS256' }).setIssuedAt().setExpirationTime('7d').sign(key);
  (await cookies()).set('rentnest_session', token, { httpOnly:true, secure:process.env.NODE_ENV === 'production', sameSite:'lax', path:'/', maxAge:60*60*24*7 });
}
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get('rentnest_session')?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key)).payload as unknown as Session; } catch { return null; }
}
export async function requireUser(role?: 'OWNER'|'TENANT') {
  const session = await getSession();
  if (!session) redirect('/login');
  if (role && session.role !== role) redirect(session.role === 'OWNER' ? '/owner' : '/tenant');
  const user = await db.user.findUnique({ where:{id:session.userId} });
  if (!user) redirect('/login');
  return user;
}
export async function clearSession() { (await cookies()).delete('rentnest_session'); }
