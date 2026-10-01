'use server';
import {revalidatePath} from 'next/cache';
import {requireUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {formatCurrency} from '@/lib/utils';
import {dueDateFor,monthKey} from '@/lib/rent-status';
import type {ActionResult} from '@/lib/utils';
export async function markAllNotificationsReadAction():Promise<ActionResult>{const user=await requireUser();await db.notification.updateMany({where:{userId:user.id,isRead:false},data:{isRead:true}});revalidatePath('/notifications');revalidatePath('/owner');revalidatePath('/tenant');return{success:true,message:'Notifications marked as read.'}}
export async function markNotificationReadAction(id:string):Promise<ActionResult>{const user=await requireUser();await db.notification.updateMany({where:{id,userId:user.id},data:{isRead:true}});revalidatePath('/notifications');return{success:true,message:'Notification marked as read.'}}
export async function sendManualReminderAction(tenancyId:string):Promise<ActionResult>{
  const user=await requireUser('OWNER');
  const t=await db.tenancy.findFirst({where:{id:tenancyId,active:true,property:{ownerId:user.id}},include:{tenant:true,property:true}});
  if(!t)return{success:false,error:'Active tenancy not found.'};
  const now=new Date(),dayKey=`manual:${now.toISOString().slice(0,10)}`;
  try{
    await db.$transaction(async tx=>{
      await tx.reminder.create({data:{tenancyId:t.id,month:dayKey,reminderType:'MANUAL'}});
      await tx.notification.create({data:{userId:t.tenantId,tenancyId:t.id,month:monthKey(now),type:'RENT_MANUAL',title:'Friendly rent reminder',message:`A reminder from ${user.name}: ${formatCurrency(t.monthlyRent)} rent for ${now.toLocaleString('en-IN',{month:'long',year:'numeric'})} is due on ${dueDateFor(now,t.rentDueDay).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}.`,link:'/tenant/payments'}});
    });
  }catch{return{success:false,error:'A reminder was already sent today.'}}
  revalidatePath('/owner');return{success:true,message:'Reminder sent to the tenant.'};
}
export async function updateTenancyTermsAction(tenancyId:string,formData:FormData):Promise<ActionResult>{const user=await requireUser('OWNER');const rentDueDay=Number(formData.get('rentDueDay')),gracePeriodDays=Number(formData.get('gracePeriodDays'));if(!Number.isInteger(rentDueDay)||rentDueDay<1||rentDueDay>28||!Number.isInteger(gracePeriodDays)||gracePeriodDays<0||gracePeriodDays>14)return{success:false,error:'Use a due day from 1–28 and a grace period from 0–14 days.'};const result=await db.tenancy.updateMany({where:{id:tenancyId,property:{ownerId:user.id}},data:{rentDueDay,gracePeriodDays}});if(!result.count)return{success:false,error:'Tenancy not found.'};revalidatePath('/owner/tenancies');revalidatePath('/owner/calendar');return{success:true,message:'Rent schedule updated.'}}

