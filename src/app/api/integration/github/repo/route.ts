import { withApiHandler } from '@/lib/apiHandler';
import prisma from '@/lib/prisma';
import { Octokit } from 'octokit';
import { NextRequest } from 'next/server';

const getRepos = async (req: NextRequest, user: { id: string }) => {
  const integration = await prisma.integration.findFirst({
    where: {
      userId: user.id,
      provider: 'github',
    },
  });

  if (!integration) {
    throw new Error('Github not connected');
  }

  const octokit = new Octokit({
    auth: integration.accessToken,
  });

  const repos = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 3,
    sort: 'created',
    ref: 'heads/main',
  });

  return repos;

  
};



export const GET = withApiHandler(getRepos);

