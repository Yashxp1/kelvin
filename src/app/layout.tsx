import type { Metadata } from 'next';
import { Inter, Roboto, Manrope } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const manrope = Manrope({
  variable: '--font-geist-manrope',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-geist-roboto',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'kelvin',
  description: 'AI-powered control for your Notion and GitHub.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} ${roboto.variable}   antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
