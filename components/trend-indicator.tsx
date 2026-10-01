import {ArrowDownRight,ArrowUpRight} from 'lucide-react';
export function TrendIndicator({value}:{value:number}){return <p className={`mt-2 flex items-center text-[11px] font-medium ${value>0?'text-emerald-600':value<0?'text-red-600':'text-muted-foreground'}`}>{value>0?<ArrowUpRight className="size-3"/>:value<0?<ArrowDownRight className="size-3"/>:null}{Math.abs(value)}% vs last month</p>}
