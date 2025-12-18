import {
  IssuePayload,
  PullRequestResponse,
  RepoResponse,
  SearchRepo,
} from '@/lib/types';
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
      return await axios.post(`${baseUrl}/pull-request`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['generate-pr'] });
      toast.success('Pull request created successfully!');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to create PR');
    },
  });
}

export function useSummary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PullRequestResponse) => {
      const res = await axios.post(`${baseUrl}/summary`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['summary'] });
      toast.success('Summary generated successfully!');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to generate summary');
    },
  });
}

export function useIssue() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IssuePayload) => {
      const res = await axios.post(`${baseUrl}/issues`, payload);

      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['issue'] });
      toast.success('Issue created successfully!');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to create issue');
    },
  });
}

export function useSearchRepo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SearchRepo) => {
      const res = await axios.post(`${baseUrl}/search`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['update-file'] });
      toast.success('Repo searched successfully!');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to search repo');
    },
  });
}
