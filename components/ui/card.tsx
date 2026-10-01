import * as React from 'react'; import {cn} from '@/lib/utils';
export function Card({className,...p}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn('rounded-xl border bg-card text-card-foreground shadow-sm',className)} {...p}/>}
export function CardHeader({className,...p}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn('p-6 pb-3',className)} {...p}/>}
export function CardTitle({className,...p}:React.HTMLAttributes<HTMLHeadingElement>){return <h3 className={cn('font-semibold tracking-tight',className)} {...p}/>}
export function CardContent({className,...p}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn('p-6 pt-3',className)} {...p}/>}
