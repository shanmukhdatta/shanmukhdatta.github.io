import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/control-center', '/api/admin/'],
      },
    ],
    sitemap: 'https://shanmukhdatta.vercel.app/sitemap.xml',
  };
}
