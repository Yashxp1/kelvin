import { withApiHandler } from '@/lib/apiHandler';
import { NextRequest } from 'next/server';
import { Octokit } from 'octokit';
import prisma from '@/lib/prisma';
import { Gemini } from '@/lib/gemini';

const createPR = async (req: NextRequest, user: { id: string }) => {
  const { owner, repo, prompt } = await req.json();

  // const aiRes = Gemini()

  if (!owner || !repo || !prompt) {
    throw new Error('Missing field');
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

  const aiResponse = await Gemini(prompt);

  const aiRawText = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!aiRawText) {
    throw new Error('AI returned no text');
  }

  const { filePath, updatedContent, prTitle, prBody } = JSON.parse(aiRawText);

  if (!filePath || !updatedContent || !prTitle || !prBody) {
    throw new Error('AI response is missing required fields');
  }

  const branchName = `ai-change-${Date.now()}`;

  const baseRef = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: 'head/main',
  });

  const baseSha = baseRef.data.object.sha;

  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
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

  return {
    url: pr.data.html_url,
    number: pr.data.number,
  };
};

export const POST = withApiHandler(createPR);
