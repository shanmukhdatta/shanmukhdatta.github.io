import type { Metadata } from 'next';
import './globals.css';
import { liveData } from '../lib/portfolio-store';
import { RouteTransition } from '../components/RouteTransition';

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await liveData();
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://shanmukhdatta.github.io';
  return {
    metadataBase: new URL(base),
    title: { default: seo.title, template: `%s | ${site.shortName}` },
    description: seo.description,
    applicationName: site.brand,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: base,
      type: 'website',
      images: [seo.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <RouteTransition />
        {children}
      </body>
    </html>
  );
}
