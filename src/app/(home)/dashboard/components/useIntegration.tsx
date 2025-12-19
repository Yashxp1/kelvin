import { useEffect, useState } from 'react';

type Connected = {
  github: boolean;
  notion: boolean;
};

export function useIntegrations() {
  const [connected, setConnected] = useState<Connected | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/integration/isConnected')
      .then((res) => res.json())
      .then((data) => {
        setConnected(data.connected);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { connected, loading };
}
