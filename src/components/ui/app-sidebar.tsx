import { Home, PlugIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ModeToggle } from '../darkmode/ModeToggle';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Integrations',
    url: '/integrations',
    icon: PlugIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="flex items-center">
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="dark:text-zinc-300/90 text-zinc-600 stroke-2.8" />
                      <span className="dark:text-zinc-300/90 text-zinc-600 font-semibold">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
