import { Copy, Check, Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface AgentOutputProps {
  prompt: string;
  summary: string;
  isPending: boolean;
}

const AgentOutput = ({ prompt, summary, isPending }: AgentOutputProps) => {
  const [copied, setCopied] = useState(false);

  if (!isPending && !summary) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="px-6 py-5 space-y-6">
          {/* Prompt */}
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Prompt</p>
            <p className="text-sm text-zinc-800 dark:text-zinc-200">{prompt}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

          {/* Response */}
          <div className="group relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Bot size={14} />
                <span>Kelvin</span>
              </div>

              {!isPending && summary && (
                <button
                  onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 transition text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>

            {isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {summary.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentOutput;
