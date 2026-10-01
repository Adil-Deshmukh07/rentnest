'use client';
import {useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {CheckCheck,Loader2} from 'lucide-react';
import {toast} from 'sonner';
import {markAllNotificationsReadAction} from '@/server/actions/notifications';
import {Button} from '@/components/ui/button';
export function MarkAllReadButton(){const[pending,start]=useTransition(),router=useRouter();return <Button variant="outline" disabled={pending} onClick={()=>start(async()=>{const r=await markAllNotificationsReadAction();if(r.success){toast.success(r.message);router.refresh()}else toast.error(r.error)})}>{pending?<Loader2 className="size-4 animate-spin"/>:<CheckCheck className="size-4"/>}Mark all as read</Button>}

