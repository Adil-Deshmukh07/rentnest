'use client';
import {motion} from 'motion/react';
export function Reveal({children,className}:{children:React.ReactNode;className?:string}){return <motion.div className={className} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} transition={{duration:.35,ease:'easeOut'}}>{children}</motion.div>}
