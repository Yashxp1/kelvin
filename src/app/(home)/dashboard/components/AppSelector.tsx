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
import { apps } from '@/app/api/utils/items';

interface AppSelectorProps {
  currentApp: AppItem | null;
  onSelect: (app: AppItem) => void;
}

const AppSelector = ({ currentApp, onSelect }: AppSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="text-xs rounded-full border">
          {currentApp ? (
            <>
              <currentApp.icon size={15} />
              <span className="text-xs ">{currentApp.name}</span>
            </>
          ) : (
            <>
              <PlusIcon size={15} />
              <span className="text-xs">Select App</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="text-xs text-zinc-500 font-normal">
          Integration
        </DropdownMenuLabel>
        {apps.map((app, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => onSelect(app)}
            className="gap-2 text-xs py-2 cursor-pointer"
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
