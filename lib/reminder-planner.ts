import {dueDateFor,monthKey} from './rent-status';
export type ReminderKind='THREE_DAYS_BEFORE'|'DUE_DATE'|'OVERDUE'|'MANUAL';
export type ReminderTenancy={id:string;rentDueDay:number;gracePeriodDays:number};
export function reminderTypeFor(t:ReminderTenancy,now=new Date()):ReminderKind|null{const due=dueDateFor(now,t.rentDueDay);const delta=Math.round((due.getTime()-new Date(now.getFullYear(),now.getMonth(),now.getDate(),12).getTime())/86_400_000);if(delta===3)return'THREE_DAYS_BEFORE';if(delta===0)return'DUE_DATE';if(delta< -t.gracePeriodDays)return'OVERDUE';return null}
export function createReminderPlan<T extends ReminderTenancy>(tenancies:T[],paidIds:Set<string>,existing:Set<string>,now=new Date()){const month=monthKey(now);return tenancies.flatMap(t=>{if(paidIds.has(t.id))return[];const reminderType=reminderTypeFor(t,now);if(!reminderType||existing.has(`${t.id}:${month}:${reminderType}`))return[];return[{tenancy:t,month,reminderType}]})}
