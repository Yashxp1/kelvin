'use client';

import { useState } from 'react';
import {
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
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
import PromptHistory from './components/PromptHistory';
import { cn } from '@/lib/utils';
const Page = () => {
  const { mutate: generatePR, isPending: isPRPending } = useGeneratePR();
  const { mutate: summary, isPending: isSummaryPending } = useSummary();
  const { mutate: issue, isPending: isIssuePending } = useIssue();
  const { mutate: searchRepo, isPending: isSearchPending } = useSearchRepo();

  const { mutate: notionPage, isPending: isNotionSummaryPending } =
    useNotionSummary();

  const { mutate: notionPageCreate, isPending: isNotionPageCreatePending } =
    useCreateNotionPage();

  const [currentApp, setCurrentApp] = useState<AppItem | null>(null);
  const [currentAction, setCurrentAction] = useState<ActionItem | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [agentPrompt, setAgentPrompt] = useState('');
  const [repoSummary, setAgentRepoSummary] = useState('');
  const [notionSummary, setAgentNotionSummary] = useState('');

  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const isLoadingAction =
    isPRPending ||
    isSummaryPending ||
    isIssuePending ||
    isSearchPending ||
    isNotionSummaryPending ||
    isNotionPageCreatePending;

  const handleAgentAction = () => {
    if (!currentApp) return toast.error('Select an app');
    if (!selectedTarget)
      return toast.error('Select a target (Repository or Page)');
    if (!currentAction) return toast.error('Select an action');
    if (!agentPrompt.trim()) return toast.error('Prompt cannot be empty');

    const GithubPayload = { repo: selectedTarget.name, prompt: agentPrompt };

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
      case 'Update-file':
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

  const SubmitButton = ({ className }: { className?: string }) => (
    <button
      onClick={handleAgentAction}
      disabled={isLoadingAction}
      className={cn(
        'flex items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:hover:scale-100',
        className
      )}
    >
      {isLoadingAction ? (
        <Spinner className="text-current" />
      ) : (
        <ArrowRight size={16} />
      )}
    </button>
  );

  return (
    <div className="flex w-full flex-col items-center rounded-t-lg bg-linear-to-b from-[#5438DC]/80 to-transparent px-4 pb-10 pt-16 text-zinc-900 md:pt-24">
      <div className="pointer-events-none fixed inset-0" />

      <div className="z-10 w-full max-w-3xl space-y-8">
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <h1 className="font-manrope text-3xl font-bold tracking-tight text-white md:text-5xl">
            Kelvin.
          </h1>
          <p className="max-w-[80%] text-sm text-white/90 md:text-base">
            Automate your workflow. Select a target, choose an action, and
            execute.
          </p>
        </div>

        <div className="group relative rounded-2xl border border-zinc-200 bg-white shadow-md transition-all">
          <div className="p-4">
            <textarea
              value={agentPrompt}
              onChange={(e) => {
                setAgentPrompt(e.target.value);
                setAgentRepoSummary('');
              }}
              className="min-h-[120px] w-full resize-none bg-transparent text-base leading-relaxed placeholder:text-zinc-400 focus:outline-none"
              placeholder="Describe the task for the agent..."
              autoFocus
            />
          </div>

          <div className="rounded-b-2xl border-t border-zinc-100 bg-zinc-50/50 px-3 py-2.5">
            <div className="flex items-center justify-between md:hidden">
              <button
                onClick={() => setShowMobileOptions(!showMobileOptions)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200/50"
              >
                <SlidersHorizontal size={14} />
                {showMobileOptions ? 'Hide Options' : 'Configure Agent'}
                {showMobileOptions ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>

              <SubmitButton className="h-8 w-8 hover:scale-105" />
            </div>
            <div
              className={cn(
                'md:flex md:flex-row md:items-center md:justify-between md:gap-0',
                showMobileOptions
                  ? 'mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2'
                  : 'hidden'
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <PromptHistory />
                <div className="hidden h-5 w-px bg-zinc-200 md:block" />
                <AppSelector
                  currentApp={currentApp}
                  onSelect={(app) => {
                    setCurrentApp(app);
                    setSelectedTarget(null);
                    setCurrentAction(null);
                  }}
                />
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

              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                {currentApp && (
                  <ActionSelector
                    appName={currentApp.name}
                    currentAction={currentAction}
                    onSelect={setCurrentAction}
                  />
                )}

                <div className="hidden h-5 w-px bg-zinc-200 md:block" />

                <SubmitButton className="hidden h-8 w-8 hover:scale-105 md:flex" />
              </div>
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
