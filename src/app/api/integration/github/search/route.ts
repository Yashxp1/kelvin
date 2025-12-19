import { createGithubBranch } from '@/app/api/utils/createBranch';
import { Gemini } from '@/lib/api/gemini';
import prisma from '@/lib/api/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { auth } from '@/lib/auth/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repo, prompt } = await req.json();

    if (!repo || !prompt) {
      return NextResponse.json(
        { error: 'Missing repo or prompt' },
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

    const octokit = new Octokit({ auth: integration.accessToken });
    const ghUser = integration.rawData as { login: string };

    const pathRes = await Gemini(
      `Return ONLY the file path mentioned in the prompt.
No explanations.
No formatting.
Prompt:
${prompt}`
    );

    const path = pathRes?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!path) {
      return NextResponse.json(
        { error: 'Failed to extract file path' },
        { status: 400 }
      );
    }

    if (path.includes('..')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    let existingFile: { sha: string; content: string } | null = null;

    try {
      const res = await octokit.rest.repos.getContent({
        owner: ghUser.login,
        repo,
        path,
        ref: 'main',
      });

      if ('content' in res.data) {
        existingFile = {
          sha: res.data.sha,
          content: Buffer.from(res.data.content, 'base64').toString('utf-8'),
        };
      }
    } catch (error) {
      console.log(error);

      return NextResponse.json(
        { error: `GitHub API error: ${error}` },
        { status: 502 }
      );
    }

    const branchName = `ai-${Date.now()}`;

    try {
      await createGithubBranch({
        octokit,
        owner: ghUser.login,
        repo,
        branchName,
      });
    } catch (error) {
      console.error('Failed to create branch:', error);
      return NextResponse.json(
        { error: `Failed to create branch: ${error}` },
        { status: 502 }
      );
    }

    const aiPrompt = existingFile
      ? `You are editing an existing file.
Here is the current file content:
${existingFile.content}

Instruction:
${prompt}

Return the FULL updated file.`
      : `You are creating a NEW file at path "${path}".
Write the COMPLETE file content.

Instruction:
${prompt}`;

    const aiRes = await Gemini(aiPrompt);
    const aiText = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      return NextResponse.json(
        { error: 'AI returned empty content' },
        { status: 500 }
      );
    }

    const encodedContent = Buffer.from(aiText).toString('base64');

    try {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: ghUser.login,
        repo,
        path,
        message: existingFile ? 'AI update file' : 'AI create file',
        content: encodedContent,
        sha: existingFile?.sha,
        branch: branchName,
      });
    } catch (error) {
      console.error('Failed to create/update file:', error);
      return NextResponse.json(
        { error: `Failed to create/update file: ${error}` },
        { status: 502 }
      );
    }

    const setPRText = await Gemini(`
  You are profession github title and body creator. 

   Create a clean GitHub pull request title and body from user prompt and changes made by AI.
    Output exactly in this JSON format:
    {
      "title": "...",
      "body": "..."
    }

    User prompt: "${prompt}"
   
  `);

    const jsonText =
      setPRText?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const cleaned = jsonText.trim().replace(/```json|```/g, '');

    let PRText;
    try {
      PRText = JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse PR text JSON:', error);

      PRText = {
        title: existingFile ? 'AI Update' : 'AI Create',
        body: `Changes made based on prompt: ${prompt}`,
      };
    }

    try {
      await octokit.rest.pulls.create({
        owner: ghUser.login,
        repo,
        title: existingFile
          ? `AI update: ${PRText.title}`
          : `AI create: ${PRText.title}`,
        body: PRText.body,
        head: branchName,
        base: 'main',
      });
    } catch (error) {
      console.error('Failed to create PR:', error);
      return NextResponse.json(
        { error: `Failed to create PR: ${error}` },
        { status: 502 }
      );
    }

    const res = await prisma.aI_Response.create({
      data: {
        provider: 'github',
        prompt,
        responseData: aiRes.data || '',
        url: `https://github.com/${ghUser.login}/${repo}/pull/${branchName}`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      created: !existingFile,
      path,
      res,
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
