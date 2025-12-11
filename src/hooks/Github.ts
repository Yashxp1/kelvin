import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

const baseUrl = '/api/integration/github';

export function useGetRepos() {
  return useQuery<RepoResponse>({
    queryKey: ['repo'],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/repo`);
      return res.data;
    },
  });
}

export function useGeneratePR() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PullRequestResponse) => {
      return await axios.post('/api/integration/github/pull-request', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['generate-pr'] });
      toast.success("Pull request created successfully!");
    },
    onError: (error) => {
      console.log(error)
      toast.error( "Failed to create PR");
    },
  });
}