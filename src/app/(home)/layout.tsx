import { ThemeProvider } from '@/components/darkmode/theme-provider';
import { QueryProvider } from '@/components/query-provider';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="text-zinc-700 w-full dark:text-zinc-200 px-2">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
