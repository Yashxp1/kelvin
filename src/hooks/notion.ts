import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseUrl = '/api/integration/notion';

export function useGetNotionPages() {
  return useQuery<NotionPage[]>({
    queryKey: ['notion-pages'],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/get-pages`);
      return res.data.data;
    },
  });
}
