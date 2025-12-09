import { withApiHandler } from '@/lib/apiHandler';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { Octokit } from 'octokit';

const createBranch = async (req: NextRequest, user: { id: string }) => {
  const findRepo = await prisma.integration.findFirst({
    where: {
      userId: user.id,
      provider: 'github',
    },
  });

  if (!findRepo) {
    throw new Error('Repositiory doesnot exist');
  }

  const { owner, repo, branchName } = await req.json();

  if (!owner || !repo || !branchName) {
    throw new Error('Missing owner, repo, or branchName');
  }

  const octokit = new Octokit({ auth: findRepo.accessToken });

  const base = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: 'heads/main',
  });

  const baseSha = base.data.object.sha;

  const createBranch = await octokit.rest.git.createRef({
    owner: user.id,
    repo: findRepo.id,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  return createBranch;
};

// const updateBranch = async (req: NextRequest, user: { id: string }) => {
//   const findBranch = await prisma.integration.findFirst({
//     where: { userId: user.id, provider: 'github' },
//   });

//   if (!findBranch) {
//     throw new Error('No branch found');
//   }

//   const updateBranch = await prisma

// };

export const POST = withApiHandler(createBranch);
