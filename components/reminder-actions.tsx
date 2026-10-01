'use client';
import Link from 'next/link';
import {useTransition} from 'react';
import {BellRing,Loader2,MessageCircle,Receipt} from 'lucide-react';
import {toast} from 'sonner';
import {sendManualReminderAction} from '@/server/actions/notifications';
import {Button} from '@/components/ui/button';
export function ReminderActions({tenancyId,whatsappUrl}:{tenancyId:string;whatsappUrl:string}){const[pending,start]=useTransition();return <div className="flex flex-wrap gap-2"><Link href={`/owner/payments?tenancy=${tenancyId}`}><Button size="sm"><Receipt className="size-3.5"/>Record payment</Button></Link><Button size="sm" variant="outline" disabled={pending} onClick={()=>start(async()=>{const r=await sendManualReminderAction(tenancyId);if(r.success)toast.success(r.message);else toast.error(r.error)})}>{pending?<Loader2 className="size-3.5 animate-spin"/>:<BellRing className="size-3.5"/>}Send reminder</Button><a href={whatsappUrl} target="_blank" rel="noreferrer"><Button size="sm" variant="outline"><MessageCircle className="size-3.5"/>WhatsApp</Button></a></div>}

