import { NotionPage, NotionPageCreate, NotionSummary } from '@/types/Notion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

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

export function useNotionSummary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: NotionSummary) => {
      const res = await axios.post(`${baseUrl}/summary`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notion-pages', 'notion-summary'] });
      toast.success('Summary generated successfully!');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to generate summary');
    },
  });
}

export function useCreateNotionPage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: NotionPageCreate) => {
      const res = await axios.post(`${baseUrl}/create`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notion-pages'] });
      toast.success('Page created successfully!');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to create page');
    },
  });
}
