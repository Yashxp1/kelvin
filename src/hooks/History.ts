import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { IconType } from 'react-icons/lib';

export type PromptHistoryItem = {
  id: string;
  prompt: string;
  url?: string;
  provider: string;
  icon: IconType;
  createdAt: string;
};

const baseUrl = '/api/history';

export function useGetHistory() {
  return useQuery<PromptHistoryItem[]>({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await axios.get(baseUrl);
      return res.data.data;
    },
  });
}
