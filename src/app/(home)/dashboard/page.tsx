'use client';
import React, { useState } from 'react';
import {
  ArrowRight,
  Plug,
  Wrench,
  Code2,
  Lightbulb,
  Gauge,
  Plus,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useGetRepos from '@/hooks/get-repos';
import { Spinner } from '@/components/ui/spinner';

const Page = () => {
  const { data: repos, isLoading, error } = useGetRepos();

  const [selectRepo, setSelectRepo] = useState<string | null>(null);

  const handleSelect = (repoName: string) => {
    setSelectRepo(repoName);
  };

  const handleUnselect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectRepo(null);
  };

  if (error) return <p>An error occured</p>;

  return (
    <div className="flex w-full flex-col items-center justify-center p-8 transition-colors">
      <div className="w-full max-w-2xl space-y-2">
        <div className="relative w-full rounded-xl border-3 border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <textarea
            className="h-24 w-full resize-none bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
            placeholder="Plan a new task..."
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full text-xs font-normal">
                    <Plug size={16} />
                    <span>
                      {selectRepo !== null ? selectRepo : 'Connect repo'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                {selectRepo !== null && (
                  <button
                    onClick={handleUnselect}
                    className=" mx-1 hover:dark:bg-zinc-700 hover:bg-zinc-200 bg-zinc-100 transition-all duration-200 dark:bg-zinc-800  rounded-full p-1 border"
                  >
                    <X size={15} />
                  </button>
                )}
                <DropdownMenuContent align="start" className="w-56">
                  {isLoading ? (
                    <div className="flex items-center justify-center px-3 py-2">
                      <Spinner />
                    </div>
                  ) : repos?.data && repos.data.length > 0 ? (
                    <>
                      {repos.data.map((repo) => (
                        <DropdownMenuItem
                          key={repo.id}
                          onClick={() => handleSelect(repo.name)}
                          className="flex cursor-pointer items-center justify-between text-xs"
                        >
                          <span className="truncate">{repo.name}</span>
                          <ArrowUpRight
                            size={14}
                            className="ml-2 shrink-0 opacity-50"
                          />
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-xs">
                        <Plus size={14} className="mr-1" /> More
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <div className="px-3 py-2 text-xs text-zinc-500">
                      No repositories found
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white transition-all hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionPill icon={<Wrench className="h-3.5 w-3.5" />} label="Fix" />
          <ActionPill
            icon={<Code2 className="h-3.5 w-3.5" />}
            label="Refactor"
          />
          <ActionPill
            icon={<Lightbulb className="h-3.5 w-3.5" />}
            label="Implement"
          />
          <ActionPill
            icon={<Gauge className="h-3.5 w-3.5" />}
            label="Optimize"
          />
        </div>
      </div>
    </div>
  );
};

const ActionPill = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
    {icon}
    <span>{label}</span>
  </button>
);

export default Page;
