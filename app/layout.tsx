import type { Metadata } from 'next';
import './globals.css';
import { site } from '../content/site';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://shanmukhdatta.github.io'),
  title: { default: `${site.shortName} — AI Research & Engineering`, template: `%s | ${site.shortName}` },
  description: site.description,
  applicationName: 'shanXAI',
  keywords: ['AI research','machine learning','MCP','multilingual AI','quantum machine learning','portfolio'],
  openGraph: { title: `${site.shortName} — AI Research & Engineering`, description: site.description, url:'https://shanmukhdatta.github.io', type:'website' },
  robots: { index:true, follow:true },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" suppressHydrationWarning><body><a className="skip-link" href="#content">Skip to content</a>{children}</body></html>;
}
