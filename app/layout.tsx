import './globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Elweth's Blog",
  description: 'One more security blog',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={jetbrainsMono.className}>
        <div className="relative min-h-screen flex flex-col">
          <SiteHeader />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}