import { ViewTransitions } from 'next-view-transitions';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Soluciones Integrales AS SAS | Técnicos Club House',
  description: 'Servicio técnico premium y mantenimiento de electrodomésticos de alta gama en Colombia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="es" className={inter.className} suppressHydrationWarning>
        <body suppressHydrationWarning>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
