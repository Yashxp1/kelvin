'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner'; // Assuming this exists based on your code
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiGithub, SiLinear, SiNotion } from 'react-icons/si';

const Page = () => {
  const items = [
    {
      title: 'Github',
      description: 'Sync repositories and issues.',
      provider: 'github',
      url: '/api/integration/github',
      icon: SiGithub,
      active: true,
    },
    {
      title: 'Notion',
      description: 'Connect workspaces and notes.',
      provider: 'notion',
      url: '/api/integration/notion',
      icon: SiNotion,
      active: true,
    },
    {
      title: 'Linear',
      description: 'Streamline issue tracking.',
      provider: 'linear',
      url: '#',
      icon: SiLinear,
      active: false,
    },
  ];

  const router = useRouter();
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/integration/isConnected')
      .then((res) => res.json())
      .then((data) => {
        setConnected(data.connected || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch integrations:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-white p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Integrations
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Connect your workflow with your favorite third-party tools.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isConnected = connected[item.provider];
            const isComingSoon = !item.active;

            return (
              <div
                key={item.provider}
                className={`
                  group relative flex flex-col justify-between rounded-xl border p-6 transition-all duration-200
                  ${
                    isComingSoon
                      ? 'border-dashed border-zinc-200 bg-zinc-50/50 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700'
                  }
                `}
              >
                {/* Header Section */}
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
                    <item.icon size={20} />
                  </div>
                  <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>

                {/* Action Section */}
                <div className="mt-8">
                  {loading ? (
                    <Button
                      variant="ghost"
                      disabled
                      className="w-full justify-start pl-0"
                    >
                      <Spinner className="mr-2 h-4 w-4" /> Loading...
                    </Button>
                  ) : isComingSoon ? (
                    <div className="flex h-10 w-full items-center justify-center rounded-md bg-zinc-100 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      Coming Soon
                    </div>
                  ) : isConnected ? (
                    <Button
                      variant="outline"
                      className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                    >
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Connected
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => router.push(item.url)}
                      className="w-full "
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
