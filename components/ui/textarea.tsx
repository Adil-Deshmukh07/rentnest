import * as React from 'react'; import {cn} from '@/lib/utils';
export function Textarea({className,...p}:React.TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea className={cn('min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-2',className)} {...p}/>}
