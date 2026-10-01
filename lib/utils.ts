import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
export const formatDate = (value: Date | string) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
export const titleCase = (value: string) => value.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
export const FACILITIES = ['Parking','WiFi','Air conditioning','Lift','Power backup','24/7 security','Gym','Water supply','Pet friendly','Balcony','CCTV','Clubhouse'];
export type ActionResult<T = undefined> = { success: true; data?: T; message: string; error?: never; fields?: never } | { success: false; error: string; fields?: Record<string, string[]>; data?: never; message?: never };
