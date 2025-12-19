import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import prisma from '@/lib/api/prisma';
import { auth } from '@/lib/auth/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integration = await prisma.integration.findFirst({
      where: {
        userId: session.user.id,
        provider: 'github',
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'GitHub integration not found' },
        { status: 404 }
      );
    }

    const octokit = new Octokit({
      auth: integration.accessToken,
    });

    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'created',
    });

    return NextResponse.json({
      success: true,
      data: data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
      })),
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
