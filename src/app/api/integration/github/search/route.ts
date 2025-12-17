import { createGithubBranch } from '@/app/api/utils/createBranch';
import { withApiHandler } from '@/lib/api/apiHandler';
import { Gemini } from '@/lib/api/gemini';
import prisma from '@/lib/api/prisma';
import { NextRequest } from 'next/server';
import { Octokit } from 'octokit';

const searchRepo = async (req: NextRequest, user: { id: string }) => {
  const { repo, prompt } = await req.json();

  if (!repo || !prompt) {
    throw new Error('Missing repo or prompt');
  }

  const integration = await prisma.integration.findFirst({
    where: { userId: user.id, provider: 'github' },
  });

  if (!integration) throw new Error('Github not connected');

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
  if (!path) throw new Error('Failed to extract file path');

  if (path.includes('..')) throw new Error('Invalid file path');

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
  } catch (err: any) {
    if (err.status !== 404) throw err;
  }

  const branchName = `ai-${Date.now()}`;

  await createGithubBranch({
    octokit,
    owner: ghUser.login,
    repo,
    branchName,
  });

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

  if (!aiText) throw new Error('AI returned empty content');

  const encodedContent = Buffer.from(aiText).toString('base64');

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: ghUser.login,
    repo,
    path,
    message: existingFile ? 'AI update file' : 'AI create file',
    content: encodedContent,
    sha: existingFile?.sha,
    branch: branchName,
  });

  const setPRText =
    (await Gemini(`
  You are profession github title and body creator. 

   Create a clean GitHub pull request title and body from user prompt and changes made by AI.
    Output exactly in this JSON format:
    {
      "title": "...",
      "body": "..."
    }

    User prompt: "${prompt}"
   
  `)) ?? '';

  const jsonText = setPRText?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const cleaned = jsonText.trim().replace(/```json|```/g, '');

  const PRText = JSON.parse(cleaned);

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

  return {
    success: true,
    created: !existingFile,
    path,
  };
};

export const POST = withApiHandler(searchRepo);
