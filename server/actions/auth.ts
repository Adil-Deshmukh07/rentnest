'use server';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { clearSession, createSession } from '@/lib/auth';
import { loginSchema, registerSchema } from '@/lib/validations';
import type { ActionResult } from '@/lib/utils';
export async function loginAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed=loginSchema.safeParse(Object.fromEntries(formData));
  if(!parsed.success) return {success:false,error:'Check your email and password.',fields:parsed.error.flatten().fieldErrors};
  const user=await db.user.findUnique({where:{email:parsed.data.email.toLowerCase()}});
  if(!user || !(await bcrypt.compare(parsed.data.password,user.passwordHash))) return {success:false,error:'Email or password is incorrect.'};
  await createSession({userId:user.id,role:user.role,name:user.name,email:user.email});
  redirect(user.role==='OWNER'?'/owner':'/tenant');
}
export async function registerAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed=registerSchema.safeParse(Object.fromEntries(formData));
  if(!parsed.success) return {success:false,error:'Please fix the highlighted fields.',fields:parsed.error.flatten().fieldErrors};
  if(await db.user.findUnique({where:{email:parsed.data.email.toLowerCase()}})) return {success:false,error:'An account with this email already exists.'};
  const {name,email,phone,password,role}=parsed.data;
  const user=await db.user.create({data:{name,email:email.toLowerCase(),phone,role,passwordHash:await bcrypt.hash(password,12)}});
  await createSession({userId:user.id,role:user.role,name:user.name,email:user.email});
  redirect(user.role==='OWNER'?'/owner':'/tenant');
}
export async function logoutAction(){ await clearSession(); redirect('/'); }
