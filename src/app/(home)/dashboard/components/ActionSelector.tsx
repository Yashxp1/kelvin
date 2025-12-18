import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GithubActions, NotionActions } from '@/app/api/utils/items';
import { ActionItem } from '@/lib/types';

interface ActionSelectorProps {
  appName: string;
  currentAction: ActionItem | null;
  onSelect: (action: ActionItem) => void;
}
const ActionSelector = ({
  appName,
  currentAction,
  onSelect,
}: ActionSelectorProps) => {
  const actions = appName === 'Github' ? GithubActions : NotionActions;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-xs border rounded-full" variant="secondary">
          {currentAction ? (
            <>
              <currentAction.icon size={14} />
              {currentAction.name}
            </>
          ) : (
            <>
              <Terminal size={14} />
              <span>Select Action</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-zinc-500 font-normal">
          Available Actions
        </DropdownMenuLabel>
        {actions.map((action, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => onSelect(action)}
            className="gap-2 text-xs py-2 cursor-pointer"
          >
            <action.icon size={14} className="text-zinc-500" />
            {action.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionSelector;
