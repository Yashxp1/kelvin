import React from 'react';
import {
  Paperclip,
  ArrowRight,
  Settings2,
  PanelRight,
  Plug,
  Wrench,
  Code2,
  Lightbulb,
  Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Page = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center p-8 transition-colors">
      <div className="w-full max-w-2xl space-y-2">
        <div className="relative  w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <textarea
            className="h-24 font-semibold w-full  resize-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
            placeholder='Plan a new task for Tembo to handle... (use "@" to mention apps or files)'
          />

          <div className="mt-2 flex items-center justify-between">
            <Button className="text-xs font-normal rounded-full">
              <Plug size={16} />
              <span>Connect codebase</span>
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 mr-2 dark:border-zinc-700">
                <IconButton icon={<Settings2 className="size-4" />} />
                <IconButton icon={<PanelRight className="size-4" />} />
                <IconButton icon={<Paperclip className="size-4" />} />
              </div>

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

const IconButton = ({ icon }: { icon: React.ReactNode }) => (
  <button className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
    {icon}
  </button>
);

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
