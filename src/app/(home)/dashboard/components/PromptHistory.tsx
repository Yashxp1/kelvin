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
import { History } from 'lucide-react';
import { RiNotionFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';
import { useState } from 'react';
import { RiHistoryFill } from "react-icons/ri";

const PromptHistory = () => {
  const { data: history, isLoading } = useGetHistory();
  const [open, setOpen] = useState(false);

  const HistoryItem = ({
    text,
    provider,
  }: {
    text: string;
    provider: string;
  }) => (
    <div className="rounded-full bg-zinc-50 border px-3 py-2 text-xs font-medium text-card-foreground transition-colors hover:bg-muted/50 flex justify-between items-center">
      {text}
      {provider === 'github' ? <FaGithub /> : <RiNotionFill />}
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
       <RiHistoryFill />
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
                <HistoryItem text={item.prompt} provider={item.provider} />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PromptHistory;
