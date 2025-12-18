'use client';

import { ExternalLink, FileText, Loader2 } from 'lucide-react';
import { useGetHistory } from '@/hooks/History';
import { FaGithub } from 'react-icons/fa';
import { RiNotionFill } from 'react-icons/ri';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const HistoryPage = () => {
  const { data, isLoading, isError } = useGetHistory();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isError) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="text-muted-foreground">Failed to load history data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Activity History
          </h1>
          <p className="text-muted-foreground">
            Manage and view your past generation requests.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-40 w-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((item) => (
              <HistoryItem key={item.id} item={item} formatDate={formatDate} />
            ))}

            {data?.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                No history found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryItem = ({
  item,
  formatDate,
}: {
  item: any;
  formatDate: (d: string) => string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer border-border/60 transition-all hover:bg-zinc-50 hover:border-foreground/20 hover:shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="font-medium">
                {item.provider === 'github' ? (
                  <FaGithub className=" h-4 w-4" />
                ) : item.provider === 'notion' ? (
                  <RiNotionFill className=" h-4 w-4" />
                ) : (
                  'AI'
                )}
                {item.provider || 'AI'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(item.createdAt)}
              </span>
            </div>
            <CardTitle className="line-clamp-1 text-base font-medium leading-none">
              Generated Content
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {item.prompt}
            </p>
          </CardContent>

          <CardFooter>
            <p className="text-xs font-medium text-primary underline-offset-4 group-hover:underline">
              View Details
            </p>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">History Details</DialogTitle>
          <DialogDescription>
            Recorded on {formatDate(item.createdAt)} via {item.provider}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-medium leading-none">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              Source URL
            </h4>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block w-fit max-w-full truncate rounded-md bg-muted/50 p-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                {item.url}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">URL not available</p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-medium leading-none">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Full Prompt
            </h4>
            <ScrollArea className="h-[200px] w-full rounded-md border bg-muted/20 p-4">
              <p className="text-sm leading-relaxed text-foreground">
                {item.prompt}
              </p>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryPage;
