import './globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Elweth Blog',
  description: 'Blog personnel sur la sécurité informatique et le développement',
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