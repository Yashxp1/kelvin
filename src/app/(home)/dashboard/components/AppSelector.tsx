'use client';

import { AppItem } from '@/lib/types';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppSelectorProps {
  apps: AppItem[]; // already filtered (connected only)
  currentApp: AppItem | null;
  onSelect: (app: AppItem) => void;
}

const AppSelector = ({ apps, currentApp, onSelect }: AppSelectorProps) => {
  if (!apps.length) return null; // no integrations = no selector

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2 rounded-full border text-xs"
        >
          {currentApp ? (
            <>
              <currentApp.icon size={15} />
              <span>{currentApp.name}</span>
            </>
          ) : (
            <>
              <PlusIcon size={15} />
              <span>Select App</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="text-xs font-normal text-zinc-500">
          Integrations
        </DropdownMenuLabel>

        {apps.map((app, id) => (
          <DropdownMenuItem
            key={id}
            onClick={() => onSelect(app)}
            className="flex cursor-pointer items-center gap-2 py-2 text-xs"
          >
            <app.icon size={15} />
            {app.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppSelector;
