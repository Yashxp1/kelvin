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
  const { data: pages, isLoading } = useGetNotionPages();

  const getPageTitle = (page: any) =>
    page.title?.properties?.title?.title
      ?.map((t: any) => t.plain_text)
      .join('') || 'Untitled page';

  return (
    <div className="flex items-center justify-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger className="text-xs" asChild>
          <Button variant="secondary" className="text-xs rounded-full border">
            <LibraryBig size={12} />
            <span className="truncate max-w-[100px]">
              {selectedPageName ? selectedPageName : 'Select Page'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isLoading ? (
            <div className="p-2">
              <Spinner />
            </div>
          ) : (
            pages?.map((page: any) => {
              const title = getPageTitle(page);
              return (
                <DropdownMenuItem
                  className="flex justify-between gap-2 text-xs py-2 cursor-pointer"
                  key={page.id}
                  onClick={() => onSelect(page.id, title)}
                >
                  <span className="truncate">{title}</span>
                  <ArrowUpRight size={12} className="text-zinc-400" />
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedPageName && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onClear();
          }}
          className="hover:bg-zinc-200 dark:hover:bg-zinc-700 bg-zinc-100 dark:bg-zinc-800 rounded-full p-0.5 border"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};

export default GetPages;
