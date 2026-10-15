export const dynamic='force-static';
import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots {const base=process.env.NEXT_PUBLIC_SITE_URL||'https://shanmukhdatta.github.io';return {rules:{userAgent:'*',allow:'/',disallow:['/control-center/','/api/admin/']},sitemap:base.replace(/\/$/,'')+'/sitemap.xml'};}
