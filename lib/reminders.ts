import {createTransport} from 'nodemailer';
import {db} from '@/lib/db';
import {dueDateFor,monthKey} from '@/lib/rent-status';
import {formatCurrency} from '@/lib/utils';
import {createReminderPlan} from '@/lib/reminder-planner';

async function maybeEmail(to:string,subject:string,text:string){
  if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS)return;
  const transport=createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
  await transport.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to,subject,text}).catch(()=>undefined);
}
export async function runReminderSweep(now=new Date()){
  const month=monthKey(now);
  const tenancies=await db.tenancy.findMany({where:{active:true},include:{tenant:{select:{id:true,name:true,email:true}},property:{select:{title:true,ownerId:true,owner:{select:{email:true}}}}}});
  const [payments,logs]=await Promise.all([db.payment.findMany({where:{month:now.getMonth()+1,year:now.getFullYear()},select:{tenancyId:true}}),db.reminder.findMany({where:{month},select:{tenancyId:true,reminderType:true}})]);
  const plan=createReminderPlan(tenancies,new Set(payments.map(p=>p.tenancyId)),new Set(logs.map(r=>`${r.tenancyId}:${month}:${r.reminderType}`)),now);
  for(const job of plan){
    const t=job.tenancy,due=dueDateFor(now,t.rentDueDay),monthLabel=now.toLocaleString('en-IN',{month:'long',year:'numeric'});
    const overdue=job.reminderType==='OVERDUE',title=overdue?'Rent overdue':job.reminderType==='DUE_DATE'?'Rent due today':'Rent due soon';
    const message=`Your rent of ${formatCurrency(t.monthlyRent)} for ${monthLabel} is due on ${due.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}.`;
    try{
      await db.$transaction(async tx=>{
        await tx.reminder.create({data:{tenancyId:t.id,month,reminderType:job.reminderType}});
        await tx.notification.create({data:{userId:t.tenant.id,tenancyId:t.id,month,type:overdue?'RENT_OVERDUE':job.reminderType==='DUE_DATE'?'RENT_DUE':'RENT_UPCOMING',title,message,link:'/tenant/payments'}});
        if(overdue)await tx.notification.create({data:{userId:t.property.ownerId,tenancyId:t.id,month,type:'RENT_OVERDUE',title:`Overdue rent · ${t.property.title}`,message:`${t.tenant.name}'s ${monthLabel} rent of ${formatCurrency(t.monthlyRent)} is overdue.`,link:'/owner/calendar'}});
      });
    }catch{/* another sweep created the unique reminder first */}
    await maybeEmail(t.tenant.email,title,message);
  }
  return{created:plan.length};
}
