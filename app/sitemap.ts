import type { MetadataRoute } from 'next';
import { projects } from '../content/projects';
export default function sitemap(): MetadataRoute.Sitemap {
 const base='https://shanmukhdatta.github.io';return [{url:base+'/',priority:1},{url:base+'/projects/',priority:.8},{url:base+'/research/',priority:.8},...projects.map(p=>({url:`${base}/projects/${p.slug}/`,priority:p.featured ? 0.7 : 0.5}))];
}
