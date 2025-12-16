'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Plug,
  ArrowUpRight,
  X,
  GitMerge,
  PlusIcon,
  ChevronDown,
  Command,
  Sparkles,
  Terminal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
  useGeneratePR,
  useGetRepos,
  useIssue,
  useSearchRepo,
  useSummary,
} from '@/hooks/Github';
import { Skeleton } from '@/components/ui/skeleton';
import { GithubActions, NotionActions, apps } from '@/app/api/utils/items';

type ActionProps = {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const Page = () => {
  const { data: repos, isLoading, error } = useGetRepos();
  const { mutate: generatePR, isPending } = useGeneratePR();
  const { mutate: summary, isPending: isSummaryPending } = useSummary();
  const { mutate: issue, isPending: isIssuePending } = useIssue();
  const { mutate: searchRepo, isPending: isSearchPending } = useSearchRepo();

  const [currentAction, setCurrentAction] = useState<ActionProps | null>(null);
  const [currentApp, setCurrentApp] = useState<ActionProps | null>(null);
  const [selectRepo, setSelectRepo] = useState<string | null>(null);
  const [agentPrompt, setagentPrompt] = useState('');
  const [agentSummary, setAgentSummary] = useState('');

  const handlePromptInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setagentPrompt(input);
    setAgentSummary('');
  };

  const handleCurrentApp = () => {
    if (!currentApp) {
      toast.error('Select an app');
      return;
    }
    setCurrentApp(currentApp);
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
        repo: selectRepo,
        prompt: agentPrompt,
      });
    } else if (currentAction.name === 'Search-repo') {
      searchRepo({
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

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-zinc-500">
        An error occurred loading the dashboard.
      </div>
    );

  const isLoadingAction =
    isPending || isSummaryPending || isIssuePending || isSearchPending;

  return (
    <div className="w-full  text-zinc-900 dark:text-zinc-100 flex flex-col items-center pt-24 pb-10 px-4">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      <div className="w-full max-w-3xl z-10 space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kelvin.
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Automate your workflow. Select a target, choose an action, and
            execute.
          </p>
        </div>

        <div className="group relative rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all focus-within:shadow-md focus-within:ring-1 focus-within:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:ring-zinc-700 shadow-lg ">
          <div className="p-4">
            <textarea
              value={agentPrompt}
              onChange={handlePromptInput}
              className="min-h-[120px] w-full resize-none bg-transparent text-base leading-relaxed placeholder:text-zinc-400 focus:outline-none dark:placeholder:text-zinc-600"
              placeholder="Describe the task for the agent..."
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/50 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700/80">
                    {currentApp ? (
                      <>
                        <currentApp.icon size={14} className="text-zinc-500" />
                        <span>{currentApp.name}</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon size={14} className="text-zinc-400" />
                        <span>Select App</span>
                      </>
                    )}
                    <ChevronDown size={12} className="ml-1 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel className="text-xs text-zinc-500 font-normal">
                    Integration
                  </DropdownMenuLabel>
                  {apps.map((app, idx) => (
                    <DropdownMenuItem
                      onClick={() => setCurrentApp(app)}
                      key={idx}
                      className="gap-2 text-xs py-2 cursor-pointer"
                    >
                      <app.icon size={14} className="text-zinc-500" />
                      {app.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {currentApp && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700/80 max-w-[200px]">
                      <Plug size={14} className="text-zinc-500" />
                      <span className="truncate">
                        {selectRepo || 'Select Repository'}
                      </span>
                      {selectRepo && (
                        <div
                          role="button"
                          onClick={handleUnselect}
                          className="ml-1 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                        >
                          <X size={12} />
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel className="text-xs text-zinc-500 font-normal">
                      Target Repository
                    </DropdownMenuLabel>
                    {isLoading ? (
                      <div className="flex justify-center p-4">
                        <Spinner />
                      </div>
                    ) : repos?.data && repos.data.length > 0 ? (
                      <>
                        {repos.data.map((repo) => (
                          <DropdownMenuItem
                            key={repo.id}
                            onClick={() => handleSelect(repo.name)}
                            className="flex justify-between gap-2 text-xs py-2 cursor-pointer"
                          >
                            <span className="truncate">{repo.name}</span>
                            <ArrowUpRight size={12} className="text-zinc-400" />
                          </DropdownMenuItem>
                        ))}
                      </>
                    ) : (
                      <div className="p-3 text-xs text-zinc-500">
                        No repositories found
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-[1px] bg-zinc-200 dark:bg-zinc-700" />

              {currentApp && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
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
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs text-zinc-500 font-normal">
                      Available Actions
                    </DropdownMenuLabel>
                    {GithubActions.map((action, idx) => (
                      <DropdownMenuItem
                        onClick={() => setCurrentAction(action)}
                        key={idx}
                        className="gap-2 text-xs py-2 cursor-pointer"
                      >
                        <action.icon size={14} className="text-zinc-500" />
                        {action.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <button
                onClick={handleAgentAction}
                disabled={isLoadingAction}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isLoadingAction ? (
                  <Spinner className="text-current" />
                ) : (
                  <ArrowRight size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        {(isSummaryPending || agentSummary) && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-500" />
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Agent Output
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 rounded-md border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <GitMerge size={12} />
                  Merge Request
                </Button>
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-start gap-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
                  <div className="mt-0.5 shrink-0 rounded-full bg-zinc-200 p-1 dark:bg-zinc-700">
                    <Command size={10} />
                  </div>
                  <span className="font-medium italic">"{agentPrompt}"</span>
                </div>

                {isSummaryPending ? (
                  <div className="space-y-3 py-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                  </div>
                ) : (
                  <div className="prose-sm text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {agentSummary.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
