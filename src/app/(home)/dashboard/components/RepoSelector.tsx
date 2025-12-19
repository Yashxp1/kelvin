import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetRepos } from '@/hooks/Github';
import { ArrowUpRight, Plug, X } from 'lucide-react';

interface RepoSelectorProps {
  selectedRepo: string | null;
  onSelect: (repo: string) => void;
  onClear: () => void;
}

const RepoSelector = ({
  selectedRepo,
  onSelect,
  onClear,
}: RepoSelectorProps) => {
  const { data, isLoading, error } = useGetRepos();

  if (error) {
    return (
      <div className="text-xs text-red-500">Failed to load repositories</div>
    );
  }

  const repos = data?.data ?? [];

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="text-xs rounded-full border">
            <Plug size={14} />
            <span className="truncate max-w-[100px]">
              {selectedRepo || 'Select Repository'}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Spinner />
            </div>
          ) : repos.length > 0 ? (
            repos.map((repo) => (
              <DropdownMenuItem
                key={repo.id}
                onClick={() => onSelect(repo.name)}
                className="flex justify-between gap-2 text-xs py-2 cursor-pointer"
              >
                <span className="truncate">{repo.name}</span>
                <ArrowUpRight size={12} className="text-zinc-400" />
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-3 text-xs text-zinc-500">
              No repositories found
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedRepo && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onClear();
          }}
          className="hover:bg-zinc-200 bg-zinc-100 rounded-full p-0.5 border"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default RepoSelector;
