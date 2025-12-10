
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseUrl = '/api/integration/github';

export default function useGetRepos() {
  return useQuery<RepoResponse>({
    queryKey: ['repo'],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/repo`);
      return res.data;
    },
  });
}
