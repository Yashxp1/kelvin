import axios from 'axios';
import { Gemini } from '@/lib/api/gemini';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/api/prisma';

type GithubUsername = {
  login: string;
  [key: string]: any;
};

export async function POST(req: NextRequest, res: NextResponse) {
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

    const extracted = getPRs.data.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
      body: pr.body,
    }));

    const pullNumberMatch = prompt.match(/(\d+)/);
    const pullNumber = pullNumberMatch ? Number(pullNumberMatch[1]) : null;

    const target = extracted.find((pr: any) => pr.number === pullNumber);

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
        - Diff: ${getPRs.data.find((pr: any) => pr.number === pullNumber)?.diff}
      

      `);

      if (!aiResponse) {
        throw new Error('AI quota exceeded. Try again later.');
      }

      const summary = await prisma.aI_Response.create({
        data: {
          provider: 'github',
          prompt,
          responseData: aiResponse.data || '',
          url: `https://github.com/${ghUser.login}/${repo}/pull/${pullNumber}`,
          userId: owner,
        },
      });

      return NextResponse.json({ success: true, data: summary });
    } catch (error) {
      console.error('AI quota exceeded.');
      return NextResponse.json(
        { error: 'AI quota exceeded. Try again later.' },
        { status: 429 }
      );
    }
  } catch (err: any) {
    console.error('Unexpected server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
