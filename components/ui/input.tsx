import * as React from 'react'; import {cn} from '@/lib/utils';
export function Input({className,...p}:React.InputHTMLAttributes<HTMLInputElement>){return <input className={cn('h-10 w-full rounded-md border bg-background px-3 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 disabled:opacity-50',className)} {...p}/>}
