'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiGithub, SiLinear, SiNotion } from 'react-icons/si';

const Page = () => {
  const items = [
    {
      title: 'Github',
      provider: 'github',
      url: '/api/integration/github',
      icon: SiGithub,
    },
    {
      title: 'Notion',
      provider: 'notion',
      url: '/api/integration/notion',
      icon: SiNotion,
    },
    {
      title: 'Linear',
      provider: 'linear',
      url: '#',
      icon: SiLinear,
    },
  ];

  const router = useRouter();

  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/integration/isConnected')
      .then((res) => res.json())
      .then((data) => {
        setConnected(data.connected);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch integrations:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="font-semibold text-2xl mb-6">Integrations</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isConnected = connected[item.provider];

          return (
            <div
              key={item.provider}
              className="border rounded-md p-6 flex flex-col items-center dark:bg-zinc-900/80 bg-zinc-100/40"
            >
              <item.icon size={40} />

              <div className="flex flex-col items-center gap-2 w-full pt-6">
                <h2 className="text-lg font-medium">{item.title}</h2>

                {loading ? (
                  <Button disabled className="w-full">
                    <Spinner />
                  </Button>
                ) : isConnected ? (
                  <Button
                    disabled
                    className="
                      w-full 
                      bg-green-100 
                      text-green-700 
                      border border-green-300
                      dark:bg-green-900/40 
                      dark:text-green-300 
                      dark:border-green-800
                    "
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></span>
                      Connected
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push(item.url)}
                    className="
                      w-full 
                      bg-blue-500 text-white 
                      hover:bg-blue-600
                      dark:bg-blue-600 
                      dark:hover:bg-blue-700
                    "
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
  );
};

export default Page;
