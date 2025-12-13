import { withApiHandler } from '@/lib/apiHandler';
import { Gemini } from '@/lib/gemini';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { Octokit } from 'octokit';

type GuthubUsername = {
  login: string;
  // [key: string]: any;
};

const searchRepo = async (req: NextRequest, user: { id: string }) => {
  const { repo, prompt } = await req.json();

  if (!repo || !prompt) {
    throw new Error('Missing required fields: repo, prompt');
  }

  const integration = await prisma.integration.findFirst({
    where: { userId: user.id, provider: 'github' },
  });

  if (!integration) {
    throw new Error('Github not connected');
  }

  const octokit = new Octokit({ auth: integration.accessToken });

  const ghUser = integration?.rawData as GuthubUsername;

  const findPath = await Gemini(`
    You are strictly supposed to find file path from the user prompt. 
    Nothing else, just file path as per user prompt:
    ${prompt}
      
    `);

  const path = findPath?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!path) {
    throw new Error('Failed to extract file path from AI response');
  }

  const baseRef = await octokit.rest.git.getRef({
    owner: ghUser.login,
    repo,
    ref: 'heads/main',
  });
  const baseSha = baseRef.data.object.sha;

  const branchName = `ai-change-${Date.now()}`;

  await octokit.rest.git.createRef({
    owner: ghUser.login,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  const { data } = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: ghUser.login,
      repo,
      path,
    }
  );

  if (Array.isArray(data) || data.type !== 'file') {
    throw new Error('Path is not a file');
  }

  const originalContent = Buffer.from(data.content, 'base64').toString('utf-8');

  const aiResponse = await Gemini(`
          You are a senior GitHub repository maintainer.

Your task is to MODIFY an EXISTING file.

STRICT RULES (do not violate):
- You are editing an existing file, NOT creating a new one.
- Preserve all unrelated logic, formatting, and comments.
- Make ONLY the changes explicitly requested by the user.
- Do NOT remove code unless the user explicitly asks.
- Return the FULL updated file content.
- Return RAW CODE ONLY.
- Do NOT include markdown, explanations, JSON, or extra text.

FILE CONTEXT:
- File path: ${path}
- This is the exact file you must edit.

ORIGINAL FILE CONTENT:
<<<
${originalContent}
>>>

USER REQUEST:
${prompt}

IMPORTANT:
- If the user request does NOT apply to this file path, return the original file unchanged.
- Do NOT guess or invent file paths.
- Do NOT reference any other files.

`);

  const fileSha = data.sha;

  const aiText = aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!aiText) {
    throw new Error('AI returned empty response');
  }

  const encodeContent = Buffer.from(aiText).toString('base64');

  const updateContent = await octokit.request(
    'PUT /repos/{owner}/{repo}/contents/{path}',
    {
      owner: ghUser.login,
      repo,
      path,
      message: 'updated by AI',
      content: encodeContent,
      sha: fileSha,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  return updateContent;
};

export const POST = withApiHandler(searchRepo);
