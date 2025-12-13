import { createGithubBranch } from '@/app/api/utils/createBranch';
import { updateRepoContent } from '@/app/api/utils/repoContent';
import { withApiHandler } from '@/lib/apiHandler';
import { Gemini } from '@/lib/gemini';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { Octokit } from 'octokit';

const searchRepo = async (req: NextRequest, user: { id: string }) => {
  const { repo, prompt } = await req.json();

  const integration = await prisma.integration.findFirst({
    where: { userId: user.id, provider: 'github' },
  });
  if (!integration) throw new Error('Github not connected');

  const octokit = new Octokit({ auth: integration.accessToken });
  const ghUser = integration.rawData as { login: string };

  const pathRes = await Gemini(
    `Return ONLY the file path mentioned in the prompt. 
    No explanations. 
    No formatting. No markdown. 
    Prompt:\n${prompt}`
  );

  const path = pathRes?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!path) throw new Error('Failed to extract file path');

  const branchName = `AI-Change-${Date.now()}`;

  await createGithubBranch({
    octokit,
    owner: ghUser.login,
    repo,
    branchName,
  });

  const { encodedContent, sha } = await updateRepoContent({
    octokit,
    owner: ghUser.login,
    repo,
    path,
    prompt,
  });

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: ghUser.login,
    repo,
    path,
    message: 'AI update',
    content: encodedContent,
    sha,
    branch: branchName,
  });

  await octokit.rest.pulls.create({
    owner: ghUser.login,
    repo,
    title: 'AI update',
    head: branchName,
    base: 'main',
  });

  return { success: true };
};

export const POST = withApiHandler(searchRepo);
