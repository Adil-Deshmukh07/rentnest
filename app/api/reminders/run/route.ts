import {NextRequest,NextResponse} from 'next/server';
import {runReminderSweep} from '@/lib/reminders';
export async function POST(request:NextRequest){const supplied=request.headers.get('authorization')?.replace(/^Bearer\s+/,'')??request.headers.get('x-reminder-secret');if(!process.env.REMINDER_CRON_SECRET||supplied!==process.env.REMINDER_CRON_SECRET)return NextResponse.json({error:'Unauthorized'},{status:401});const result=await runReminderSweep();return NextResponse.json({ok:true,...result})}
