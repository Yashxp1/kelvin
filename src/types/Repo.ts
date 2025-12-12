interface RepoResponse {
  success: boolean;
  data: Repo[];
}

interface Repo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
}

interface PullRequestResponse {
  owner?: string;
  repo: string;
  pullNumber?: number;
  prompt?: string;
  // filePath: string;
}

interface IssuePayload {
  prompt: string;
  repo: string;
  owner: string;
}
