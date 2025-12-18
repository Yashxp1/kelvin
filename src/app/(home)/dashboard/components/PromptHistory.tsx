'use client';

import { useGetHistory } from '@/hooks/History';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Maximize2 } from 'lucide-react';
import { useState } from 'react';

const PromptHistory = () => {
  const { data: history, isLoading } = useGetHistory();
  const [open, setOpen] = useState(false);

  const HistoryItem = ({ text }: { text: string }) => (
    <div className="rounded-full dark:bg-zinc-800 bg-zinc-50 border bg-card px-3 py-2 text-xs font-medium text-card-foreground transition-colors hover:bg-muted/50">
      {text}
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-34 w-full animate-pulse rounded-lg border bg-muted/20" />
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex h-34 w-full items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
        No prompts recorded yet.
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="group relative h-34 w-full cursor-pointer overflow-hidden rounded-lg border bg-background p-3 transition-all hover:border-primary/50 border-2">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <History className="h-3 w-3" />
            <span>Recent Prompts</span>
          </div>

          <div className="space-y-2 opacity-80 group-hover:opacity-100">
            {history.slice(0, 5).map((item) => (
              <HistoryItem key={item.id} text={item.prompt} />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/90 to-transparent flex items-end justify-center pb-2">
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-3 w-3" />
              Click to explore all
            </span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Prompt History
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="mt-2 h-[400px] pr-4">
          <ul className="space-y-3">
            {history.map((item) => (
              <li key={item.id}>
                <HistoryItem text={item.prompt} />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PromptHistory;
