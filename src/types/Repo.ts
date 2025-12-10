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
