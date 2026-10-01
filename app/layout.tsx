import type {Metadata} from 'next'; import {Geist,Geist_Mono} from 'next/font/google'; import './globals.css'; import {Providers} from '@/components/providers';
const geist=Geist({subsets:['latin'],variable:'--font-geist'}); const mono=Geist_Mono({subsets:['latin'],variable:'--font-geist-mono'});
export const metadata:Metadata={title:{default:'RentNest — Find a place that feels like home',template:'%s · RentNest'},description:'Rental property and tenancy management, made effortless.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${geist.variable} ${mono.variable}`}><body className="antialiased"><Providers>{children}</Providers></body></html>}
