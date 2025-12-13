import { NextRequest } from 'next/server';
import { Octokit } from 'octokit';
import prisma from '@/lib/prisma';
import { Gemini } from '@/lib/gemini';
import { withApiHandler } from '@/lib/apiHandler';

type GithubUsername = {
  login: string;
  [key: string]: any;
};

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

const createPR = async (req: NextRequest, user: { id: string }) => {
  const { owner, repo, prompt } = await req.json();
  if (!owner || !repo || !prompt) {
    throw new Error('Missing field');
  }
  const integration = await prisma.integration.findFirst({
    where: {
      userId: user.id,
      provider: 'github',
    },
  });
  if (!integration) throw new Error('Github not connected');

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

  if (!parsed) throw new Error('AI returned invalid JSON');

  const { filePath, updatedContent, prTitle, prBody } = parsed;

  if (!filePath || !updatedContent || !prTitle || !prBody) {
    throw new Error('AI response missing required fields');
  }

  const baseRef = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: 'heads/main',
  });
  const baseSha = baseRef.data.object.sha;

  const branchName = `ai-change-${Date.now()}`;

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

  return {
    url: pr.data.html_url,
    number: pr.data.number,
  };
};

const getPr = async (req: NextRequest, user: { id: string }) => {
  const integration = await prisma.integration.findFirst({
    where: {
      provider: 'github',
      userId: user.id,
    },
  });

  if (!integration) throw new Error('Github not connected');

  const { repo, owner } = await req.json();

  const octokit = new Octokit({ auth: integration.accessToken });

  const ghUser = integration.rawData as GithubUsername;

  const { data } = await octokit.rest.pulls.list({
    owner: ghUser.login,
    repo,
    state: 'all',
  });

  return data;
};

export const POST = withApiHandler(createPR);
// export const POST = withApiHandler(getPr);
