import { Octokit } from 'octokit';

export async function createGithubBranch({
  octokit,
  owner,
  repo,
  branchName,
  baseBranch = 'main',
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  branchName: string;
  baseBranch?: string;
}) {
  const base = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });

  const baseSha = base.data.object.sha;

  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });
}
