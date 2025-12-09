import { withApiHandler } from '@/lib/apiHandler';
import { NextRequest } from 'next/server';
import { Octokit } from 'octokit';
import prisma from '@/lib/prisma';

const createPR = async (req: NextRequest, user: { id: string }) => {
  const { owner, repo, branchName, title, body } = await req.json();

  if (!owner || !repo || !title || !body || !branchName) {
    throw new Error('Missing owner, repo, title, body, head, or base');
  }

  const integration = await prisma.integration.findFirst({
    where: {
      userId: user.id,
      provider: 'github',
    },
  });

  if (!integration) {
    throw new Error('Github not connected');
  }

  const octokit = new Octokit({ auth: integration.accessToken });

  return await octokit.rest.pulls.create({
    owner,
    repo,
    head: branchName,
    base: 'main',
    title,
    body,
  });
};

const deletePR = async (req: NextRequest, user: { id: string }) => {};

export const POST = withApiHandler(createPR);
export const DELETE = withApiHandler(deletePR);
