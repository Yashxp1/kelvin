import { Octokit } from 'octokit';
import { createGithubBranch } from './createBranch';
import { Gemini } from '@/lib/gemini';

export async function getRepoContent({
  octokit,
  owner,
  repo,
  path,
  prompt,
  ref = 'main',
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  path: string;
  prompt: string;
  ref?: string;
}) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    return res.data;
  } catch (err: any) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function updateRepoContent({
  octokit,
  owner,
  repo,
  path,
  prompt,
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  path: string;
  prompt: string;
}) {
  const fileData = await getRepoContent({
    octokit,
    owner,
    repo,
    path,
    ref: 'main',
    prompt,
  });

  if (!fileData || Array.isArray(fileData) || fileData.type !== 'file') {
    throw new Error('Target path is not a valid file');
  }

  const originalContent = Buffer.from(fileData.content, 'base64').toString(
    'utf-8'
  );

  const aiResponse = await Gemini(`
You are editing an EXISTING file.
Return FULL updated file.
RAW CODE ONLY.

Original:
<<<
${originalContent}
>>>

User request:
${prompt}
`);

  const updatedCode =
    aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!updatedCode) {
    throw new Error('AI returned empty code');
  }

  return {
    encodedContent: Buffer.from(updatedCode).toString('base64'),
    sha: fileData.sha,
  };
}
