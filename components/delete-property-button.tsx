'use client';
import {useTransition} from 'react'; import {useRouter} from 'next/navigation'; import {Trash2} from 'lucide-react'; import {toast} from 'sonner'; import {deletePropertyAction} from '@/server/actions/properties'; import {Button} from './ui/button';
export function DeletePropertyButton({id}:{id:string}){
 const[pending,start]=useTransition();const router=useRouter();
 function remove(){if(!confirm('Delete this property? This cannot be undone.'))return;start(async()=>{const r=await deletePropertyAction(id);if(r.success)toast.success(r.message);else toast.error(r.error);router.refresh()})}
 return <Button size="sm" variant="ghost" disabled={pending} aria-label="Delete property" onClick={remove}><Trash2 className="size-4"/></Button>
}
