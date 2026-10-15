export const dynamic='force-dynamic';
import type {MetadataRoute} from 'next';
import {liveData} from '../lib/portfolio-store';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://shanmukhdatta.github.io').replace(/\/$/,'');const {projects}=await liveData();return [{url:base+'/',changeFrequency:'monthly',priority:1},{url:base+'/projects/',changeFrequency:'weekly',priority:.9},{url:base+'/research/',changeFrequency:'monthly',priority:.8},...projects.map(p=>({url:base+'/projects/'+p.slug+'/',changeFrequency:'monthly' as const,priority:.6}))];}
