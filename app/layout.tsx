import type { Metadata } from 'next';
import './globals.css';
import { profile } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://shanmukhdatta.vercel.app'),
  title: `${profile.name} (${profile.shortName}) · Student's Blackboard Portfolio`,
  description: 'Notebook-inspired portfolio of Boda Shanmukh Datta: projects, ongoing research, machine learning, open-source contributions, and experience.',
  keywords: [
    'Boda Shanmukh Datta',
    'Shanmukh Datta',
    'shanXAI',
    'AI Engineer',
    'Machine Learning',
    'Portfolio',
    'NIT Jalandhar',
    'Student Blackboard Portfolio'
  ],
  authors: [{ name: 'Boda Shanmukh Datta', url: 'https://shanmukhdatta.vercel.app' }],
  creator: 'Boda Shanmukh Datta',
  publisher: 'Boda Shanmukh Datta',
  alternates: {
    canonical: 'https://shanmukhdatta.vercel.app',
  },
  openGraph: {
    title: `${profile.name} · Student's Blackboard`,
    description: 'Projects, research, engineering work, and experience of Boda Shanmukh Datta.',
    url: 'https://shanmukhdatta.vercel.app',
    siteName: "Shanmukh Datta's Blackboard",
    images: [
      {
        url: '/images/shanmukh-hero.webp',
        width: 800,
        height: 800,
        alt: 'Boda Shanmukh Datta',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} · Portfolio`,
    description: 'Projects, research, engineering work, and experience of Boda Shanmukh Datta.',
    images: ['/images/shanmukh-hero.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
