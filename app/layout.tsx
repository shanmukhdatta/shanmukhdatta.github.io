import type { Metadata } from 'next';
import './globals.css';
import { profile } from '@/content/site';
export const metadata: Metadata = {
 title:`${profile.shortName} · Student's Blackboard`,
 description:'Notebook-inspired portfolio of Shanmukh Datta: projects, ongoing research, open-source contributions, education and experience.',
 keywords:['Shanmukh Datta','AI engineering','portfolio','research','NIT Jalandhar'],
 robots:{index:true,follow:true},
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body>{children}</body></html>;
}
