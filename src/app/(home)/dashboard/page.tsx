'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
  useGeneratePR,
  useIssue,
  useSearchRepo,
  useSummary,
} from '@/hooks/Github';
import { ActionItem, AppItem } from '@/lib/types';
import AppSelector from './components/AppSelector';
import RepoSelector from './components/RepoSelector';
import GetPages from './components/GetPages';
import ActionSelector from './components/ActionSelector';
import AgentOutput from './components/AgentOutput';
import { useCreateNotionPage, useNotionSummary } from '@/hooks/notion';

const Page = () => {
  // --- Hooks ---
  const { mutate: generatePR, isPending: isPRPending } = useGeneratePR();
  const { mutate: summary, isPending: isSummaryPending } = useSummary();
  const { mutate: issue, isPending: isIssuePending } = useIssue();
  const { mutate: searchRepo, isPending: isSearchPending } = useSearchRepo();

  const { mutate: notionPage, isPending: isNotionSummaryPending } =
    useNotionSummary();

  const { mutate: notionPageCreate, isPending: isNotionPageCreatePending } =
    useCreateNotionPage();

  // --- State ---
  const [currentApp, setCurrentApp] = useState<AppItem | null>(null);
  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [agentPrompt, setAgentPrompt] = useState('');
  const [repoSummary, setAgentRepoSummary] = useState('');
  const [notionSummary, setAgentNotionSummary] = useState('');

  const isLoadingAction =
    isPRPending ||
    isSummaryPending ||
    isIssuePending ||
    isSearchPending ||
    isNotionSummaryPending ||
    isNotionPageCreatePending;

  // --- Handlers ---
  const handleAgentAction = () => {
    if (!currentApp) return toast.error('Select an app');
    if (!selectedTarget)
      return toast.error('Select a target (Repository or Page)');
    if (!currentAction) return toast.error('Select an action');
    if (!agentPrompt.trim()) return toast.error('Prompt cannot be empty');

    const GithubPayload = { repo: selectedTarget.name, prompt: agentPrompt };
    // const NotionPayload = { pageId: selectedTarget.id, prompt: agentPrompt };

    switch (currentAction.name) {
      case 'Pull-request':
        generatePR({
          owner: 'Yashxp1',
          repo: selectedTarget.name,
          prompt: agentPrompt,
        });
        break;
      case 'Review':
        summary(GithubPayload, {
          onSuccess: (data) => {
            const text =
              data?.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            setAgentRepoSummary(text);
          },
        });
        break;
      case 'Create-issue':
        issue(GithubPayload);
        break;
      case 'Search-repo':
        searchRepo(GithubPayload);
        break;
      case 'Create-page':
        notionPageCreate({
          prompt: agentPrompt,
        });
        break;
      case 'Update-page':
      case 'Summarise':
        notionPage(
          { pageId: selectedTarget.id, prompt: agentPrompt },
          {
            onSuccess: (data) => {
              const text =
                data?.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
              setAgentNotionSummary(text);
            },
          }
        );
        break;
      default:
        toast.error('Action not recognized');
    }
  };

  return (
    <div className="w-full rounded-t-lg text-zinc-900 dark:text-zinc-100 flex flex-col items-center pt-24 pb-10 px-4 bg-gradient-to-b from-blue-700/80 to-transparent dark:from-blue-900/25">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="w-full max-w-3xl z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center space-y-2 text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-white dark:text-zinc-50">
            Kelvin.
          </h1>
          <p className="text-sm text-white dark:text-zinc-300">
            Automate your workflow. Select a target, choose an action, and
            execute.
          </p>
        </div>

        {/* Main Input Box */}
        <div className="group relative rounded-2xl border border-zinc-200 bg-white shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-900">
          <div className="p-4">
            <textarea
              value={agentPrompt}
              onChange={(e) => {
                setAgentPrompt(e.target.value);
                setAgentRepoSummary('');
              }}
              className="min-h-[120px] w-full resize-none bg-transparent text-base leading-relaxed placeholder:text-zinc-400 focus:outline-none dark:placeholder:text-zinc-600"
              placeholder="Describe the task for the agent..."
              autoFocus
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/50 rounded-b-2xl">
            <div className="flex items-center gap-2">
              {/* 1. App Selector */}
              <AppSelector
                currentApp={currentApp}
                onSelect={(app) => {
                  setCurrentApp(app);
                  setSelectedTarget(null); // Reset target when app changes
                  setCurrentAction(null); // Reset action when app changes
                }}
              />

              {/* 2. Target Selector (Dynamic based on App) */}
              {currentApp?.name === 'Github' ? (
                <RepoSelector
                  selectedRepo={selectedTarget?.name || null}
                  onSelect={(name) => setSelectedTarget({ id: name, name })}
                  onClear={() => setSelectedTarget(null)}
                />
              ) : currentApp ? (
                <GetPages
                  selectedPageName={selectedTarget?.name || null}
                  onSelect={(id, title) =>
                    setSelectedTarget({ id, name: title })
                  }
                  onClear={() => setSelectedTarget(null)}
                />
              ) : null}
            </div>

            {/* 3. Action Selector & Execute Button */}
            <div className="flex items-center gap-3">
              {currentApp && (
                <ActionSelector
                  appName={currentApp.name}
                  currentAction={currentAction}
                  onSelect={setCurrentAction}
                />
              )}

              <div className="h-5 w-[1px] bg-zinc-200 dark:bg-zinc-700" />

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

        <AgentOutput
          prompt={agentPrompt}
          summary={repoSummary || notionSummary}
          isPending={isSummaryPending || isNotionSummaryPending}
        />
      </div>
    </div>
  );
};

export default Page;
