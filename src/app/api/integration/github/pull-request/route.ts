import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import prisma from '@/lib/api/prisma';
import { Gemini } from '@/lib/api/gemini';
import { auth } from '@/lib/auth/auth';

function extractJson(text: string) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owner, repo, prompt } = await req.json();

    if (!owner || !repo || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const integration = await prisma.integration.findFirst({
      where: {
        userId: session.user.id,
        provider: 'github',
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'Github not connected' },
        { status: 400 }
      );
    }

    const ghUser = integration.rawData as { login: string };
    const octokit = new Octokit({ auth: integration.accessToken });

    const aiResponse = await Gemini(`
You MUST return ONLY valid JSON.
NO markdown, NO comments, NO explanation, NO backticks.
Return EXACTLY this shape:
{
  "filePath": "path/to/file",
  "updatedContent": "string content or code",
  "prTitle": "string",
  "prBody": "string"
}
User prompt: ${prompt}
`);

    const aiRawText =
      aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const parsed = extractJson(aiRawText);

    if (!parsed) {
      return NextResponse.json(
        { error: 'AI returned invalid JSON' },
        { status: 500 }
      );
    }

    const { filePath, updatedContent, prTitle, prBody } = parsed;

    if (!filePath || !updatedContent || !prTitle || !prBody) {
      return NextResponse.json(
        { error: 'AI response missing required fields' },
        { status: 500 }
      );
    }

    let baseRef;
    try {
      baseRef = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: 'heads/main',
      });
    } catch (e) {
      console.error('Failed to get base ref:', e);
      return NextResponse.json(
        { error: 'Failed to access repository or main branch' },
        { status: 400 }
      );
    }

    const baseSha = baseRef.data.object.sha;
    const branchName = `ai-change-${Date.now()}`;

    try {
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: baseSha,
      });

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath || '',
        message: prTitle,
        content: Buffer.from(updatedContent).toString('base64'),
        branch: branchName,
      });

      const pr = await octokit.rest.pulls.create({
        owner,
        repo,
        head: branchName,
        base: 'main',
        title: prTitle,
        body: prBody,
      });

      const res = await prisma.aI_Response.create({
        data: {
          provider: 'github',
          prompt,
          responseData: aiResponse?.data || '',
          url: `https://github.com/${ghUser.login}/${repo}/pull/${branchName}`,
          userId: session.user.id,
        },
      });

      return NextResponse.json(
        {
          url: pr.data.html_url,
          number: pr.data.number,
          res,
        },
        { status: 201 }
      );
    } catch (e) {
      console.error('GitHub API error:', e);
      return NextResponse.json(
        { error: `GitHub API error: ${e}` },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
