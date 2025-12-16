import {
  LandPlot,
  GitPullRequestArrow,
  FileScan,
  Bug,
  NotebookText,
  FilePenLine,
  ScanEye,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { RiNotionFill } from 'react-icons/ri';

export const GithubActions = [
  {
    name: 'Review',
    icon: LandPlot,
  },
  {
    name: 'Pull-request',
    icon: GitPullRequestArrow,
  },
  {
    name: 'Search-repo',
    icon: FileScan,
  },
  {
    name: 'Create-issue',
    icon: Bug,
  },
];

export const NotionActions = [
  {
    name: 'Create-page',
    icon: NotebookText,
  },
  {
    name: 'Update-page',
    icon: FilePenLine,
  },
  {
    name: 'Summarise',
    icon: ScanEye,
  },
];

export const apps = [
  {
    name: 'Github',
    icon: FaGithub,
  },
  {
    name: 'Notion',
    icon: RiNotionFill,
  },
];
