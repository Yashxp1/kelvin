import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { Gemini } from '@/lib/api/gemini';
import prisma from '@/lib/api/prisma';
import { Octokit } from 'octokit';

type GithubUsername = {
  login: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, repo, owner } = await req.json();

    if (!prompt || !repo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const integration = await prisma.integration.findFirst({
      where: { userId: session.user.id, provider: 'github' },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'Github not connected' },
        { status: 400 }
      );
    }

    const ghUser = integration?.rawData as GithubUsername;

    const octokit = new Octokit({ auth: integration?.accessToken });

    const aiResponse = await Gemini(`
  You are profession github issue creator. 

   Create a clean GitHub issue.
    Output exactly in this JSON format:
    {
      "title": "...",
      "body": "..."
    }

    User prompt: "${prompt}"
    Repo: "${owner}/${repo}"
  `);

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'Failed to generate issue from AI' },
        { status: 500 }
      );
    }

    const jsonText =
      aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const cleaned = jsonText.trim().replace(/```json|```/g, '');

    const issueData = JSON.parse(cleaned);

    const issue = await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: ghUser.login,
      repo,
      title: issueData.title,
      body: issueData.body,
    });

    await prisma.aI_Response.create({
      data: {
        provider: 'github',
        prompt,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseData: issue.data as any,
        url: `https://github.com/${ghUser.login}/${repo}/issues/${issue.data.number}`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
