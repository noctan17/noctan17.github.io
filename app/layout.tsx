import type { Metadata } from 'next';
import { Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NOCTANA — Full Stack Developer',
  description: 'Full Stack Developer. 0-to-1 product, design systems, motion-heavy interfaces.',
  icons: {
    icon: '/assets/favicon-32.png',
    apple: '/assets/favicon.png',
  },
  openGraph: {
    title: 'NOCTANA — Full Stack Developer',
    description: 'Full Stack Developer. 0-to-1 product, design systems, motion-heavy interfaces.',
    url: 'https://noctan17.github.io',
    siteName: 'NOCTANA',
    images: [
      {
        url: 'https://noctan17.github.io/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NOCTANA — Full Stack Developer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOCTANA — Full Stack Developer',
    description: 'Full Stack Developer. 0-to-1 product, design systems, motion-heavy interfaces.',
    images: ['https://noctan17.github.io/assets/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
