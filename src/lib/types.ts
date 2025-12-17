//github-----------------

import { LucideIcon } from 'lucide-react';

export interface RepoResponse {
  success: boolean;
  data: Repo[];
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
}

export interface PullRequestResponse {
  owner?: string;
  repo: string;
  pullNumber?: number;
  prompt?: string;
}

export interface IssuePayload {
  prompt: string;
  repo: string;
  owner?: string;
}

export interface SearchRepo {
  owner?: string;
  repo: string;
  prompt: string;
  path?: string;
}

//notion -------------------------

//others-----------------------

export type ActionItem = {
  name: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
};

export type AppItem = ActionItem;
