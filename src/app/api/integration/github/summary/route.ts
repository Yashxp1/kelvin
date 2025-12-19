import axios from 'axios';
import { Gemini } from '@/lib/api/gemini';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/api/prisma';

type GithubUsername = {
  login: string;
};

type PullRequestType = {
  number: number;
  title: string;
  body: string;
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, repo, owner } = await req.json();

    if (!prompt || !repo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const integration = await prisma.integration.findFirst({
      where: { userId: owner, provider: 'github' },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'Github not connected' },
        { status: 400 }
      );
    }

    const ghUser = integration.rawData as GithubUsername;

    const getPRs = await axios.get(
      `https://api.github.com/repos/${ghUser.login}/${repo}/pulls`
    );

    const extracted = getPRs.data.map((pr: PullRequestType) => ({
      number: pr.number,
      title: pr.title,
      body: pr.body,
    }));

    const pullNumberMatch = prompt.match(/(\d+)/);
    const pullNumber = pullNumberMatch ? Number(pullNumberMatch[1]) : null;

    const target = extracted.find(
      (pr: PullRequestType) => pr.number === pullNumber
    );

    if (!target) {
      return NextResponse.json(
        { error: `PR #${pullNumber} not found` },
        { status: 404 }
      );
    }

    if (extracted.length === 0) {
      return NextResponse.json({ error: 'No PRs found' }, { status: 404 });
    }

    try {
      const aiResponse = await Gemini(`
       You are a professional software engineer who summarizes a GitHub pull request.
        Give a short, plain, without any kind of text formatting and also provide the url of the pull request. Answer based on:
        - Question: ${prompt}
        - PR number or Pull number: ${target.number}
        - PR Title: ${target.title}
        - PR Body: ${target.body}
        - Diff: ${
          getPRs.data.find((pr: PullRequestType) => pr.number === pullNumber)
            ?.diff
        }
      

      `);

      if (!aiResponse) {
        throw new Error('AI quota exceeded. Try again later.');
      }

      await prisma.aI_Response.create({
        data: {
          provider: 'github',
          prompt,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          responseData: (aiResponse as any) || '',
          url: `https://github.com/${ghUser.login}/${repo}/pull/${pullNumber}`,
          userId: owner,
        },
      });

      return NextResponse.json({ success: true, data: aiResponse });
    } catch (error) {
      console.error(error, 'AI quota exceeded.');
      return NextResponse.json(
        { error: 'AI quota exceeded. Try again later.' },
        { status: 429 }
      );
    }
  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
