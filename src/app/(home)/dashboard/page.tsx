'use client';
import React, { useState } from 'react';
import {
  ArrowRight,
  Plug,
  Plus,
  ArrowUpRight,
  X,
  Bot,
  FileScan,
  GitPullRequestArrow,
  LandPlot,
  Asterisk,
  GitMerge,
  Bug,
} from 'lucide-react';

import { HiSlash } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

import { Spinner } from '@/components/ui/spinner';
import {
  useGeneratePR,
  useGetRepos,
  useIssue,
  useSummary,
} from '@/hooks/Github';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

type ActionProps = {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const actions = [
  {
    name: 'Review',
    icon: LandPlot,
  },
  {
    name: 'Pull-request',
    icon: GitPullRequestArrow,
  },
  {
    name: 'Search repo',
    icon: FileScan,
  },
  {
    name: 'Create-issue',
    icon: Bug,
  },
];

const Page = () => {
  const { data: repos, isLoading, error } = useGetRepos();
  const { mutate: generatePR, isPending } = useGeneratePR();
  const {
    mutate: summary,
    data: summaryData,
    isPending: isSummaryPending,
  } = useSummary();

  const [currentAction, setCurrentAction] = useState<ActionProps | null>(null);
  const [selectRepo, setSelectRepo] = useState<string | null>(null);
  const [agentPrompt, setagentPrompt] = useState('');
  const [agentSummary, setAgentSummary] = useState('');
  const { mutate: issue, isPending: isIssuePending } = useIssue();

  const handlePromptInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setagentPrompt(input);
    setAgentSummary('');
  };

  const handleAgentAction = () => {
    if (!selectRepo) {
      toast.error('Select a repository');
      return;
    }

    if (!agentPrompt.trim()) {
      toast.error('Prompt cannot be empty');
      return;
    }

    if (!currentAction) {
      toast.error('Select an action');
      return;
    }

    if (currentAction.name === 'Pull-request') {
      generatePR({
        owner: 'Yashxp1',
        repo: selectRepo,
        prompt: agentPrompt,
      });
    } else if (currentAction.name === 'Review') {
      summary(
        {
          repo: selectRepo,
          prompt: agentPrompt,
        },
        {
          onSuccess: (data) => {
            const text =
              data?.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

            setAgentSummary(text);
          },
        }
      );
    } else if (currentAction.name === 'Create-issue') {
      issue({
        owner: 'Yashxp1',
        repo: selectRepo,
        prompt: agentPrompt,
      });
    } else {
      toast.error('This action is not accepted of PR');
    }
  };

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
            value={agentPrompt}
            onChange={handlePromptInput}
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
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="dark:bg-zinc-800/90 dark:hover:bg-zinc-800/50 bg-zinc-100 hover:bg-zinc-200/30 transition-all duration-300 p-1 rounded-full flex text-xs justify-center items-center border">
                      {currentAction ? (
                        <div className=" gap-1 flex text-xs justify-center items-center px-1">
                          <currentAction.icon className="size-4 " />
                          {currentAction.name}
                        </div>
                      ) : (
                        <HiSlash className="size-4" />
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="flex text-xs gap-1 justify-center items-center">
                      <Bot size={16} /> Agent actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {actions.map((action, idx) => (
                      <DropdownMenuItem
                        onClick={() => setCurrentAction(action)}
                        key={idx}
                        className="text-xs"
                      >
                        <action.icon size={10} />
                        {action.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border-l h-4" />

              <button
                onClick={handleAgentAction}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white transition-all hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                {isPending || isSummaryPending || isIssuePending ? (
                  <Spinner />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto mt-6">
        {(isSummaryPending || agentSummary) && (
          <div className="relative bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between text-xs gap-2 mb-3">
              <div className="px-2 gap-0.5 flex justify-center items-center font-semibold bg-zinc-100 dark:bg-zinc-800 py-1 w-fit rounded-full">
                <Asterisk size={15} className="text-yellow-500" />
                <p className="">{agentPrompt}</p>
              </div>
              <Button className="px-2 text-xs h-6 text-purple-500 hover:text-purple-500 hover:bg-purple-500/20">
                <GitMerge size={15} />
                Merge
              </Button>
            </div>

            {isSummaryPending ? (
              <div className="space-y-2">
                <Skeleton className="h-[20px] w-[100% ] rounded-full" />
                <Skeleton className="h-[20px] w-[50% ] rounded-full" />
                {/* <Skeleton className="h-[20px] w-[70% ] rounded-full" /> */}
              </div>
            ) : (
              <div className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {agentSummary}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
