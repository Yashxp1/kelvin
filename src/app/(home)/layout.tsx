import Navbar from '@/components/Navbar';
import { QueryProvider } from '@/components/query-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <Navbar />
      <main className="text-zinc-700 w-full px-2">{children}</main>
    </QueryProvider>
  );
}
