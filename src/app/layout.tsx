import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
        className={`${geistSans.variable} ${geistMono.variable}   antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster position='top-center'/>
        </SessionProvider>
      </body>
    </html>
  );
}
