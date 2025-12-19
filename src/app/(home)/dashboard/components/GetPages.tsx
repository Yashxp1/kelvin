import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { useGetNotionPages } from '@/hooks/notion';
import { ArrowUpRight, LibraryBig, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GetPagesProps {
  selectedPageName: string | null;
  onSelect: (pageId: string, pageTitle: string) => void;
  onClear: () => void;
}

const GetPages = ({ selectedPageName, onSelect, onClear }: GetPagesProps) => {
  const { data, isLoading } = useGetNotionPages();

  const pages = data?.data ?? [];

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="text-xs rounded-full border">
            <LibraryBig size={12} />
            <span className="truncate max-w-[100px]">
              {selectedPageName || 'Select Page'}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64">
          {isLoading ? (
            <div className="p-3 flex justify-center">
              <Spinner />
            </div>
          ) : pages.length > 0 ? (
            pages.map((page) => (
              <DropdownMenuItem
                key={page.id}
                onClick={() => onSelect(page.id, page.title)}
                className="flex justify-between gap-2 text-xs py-2 cursor-pointer"
              >
                <span className="truncate">{page.title}</span>
                <ArrowUpRight size={12} className="text-zinc-400" />
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-3 text-xs text-zinc-500">No pages found</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedPageName && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onClear();
          }}
          className="hover:bg-zinc-200 bg-zinc-100 rounded-full p-0.5 border"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};

export default GetPages;
