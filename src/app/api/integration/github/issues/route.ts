import { withApiHandler } from '@/lib/api/apiHandler';
import { Gemini } from '@/lib/api/gemini';
import prisma from '@/lib/api/prisma';
import { NextRequest } from 'next/server';
import { Octokit } from 'octokit';

type GithubUsername = {
  login: string;
  [key: string]: any;
};

const createIssue = async (req: NextRequest, user: { id: string }) => {
  const { prompt, repo, owner } = await req.json();

  if (!prompt || !repo) {
    throw new Error('Missing required fields');
  }

  const integration = await prisma.integration.findFirst({
    where: { userId: user.id, provider: 'github' },
  });

  if (!integration) {
    throw new Error('Github not connected');
  }

  const ghUser = integration?.rawData as GithubUsername;

  const octokit = new Octokit({ auth: integration?.accessToken });

  const aiResponse =
    (await Gemini(`
  You are profession github issue creator. 

   Create a clean GitHub issue.
    Output exactly in this JSON format:
    {
      "title": "...",
      "body": "..."
    }

    User prompt: "${prompt}"
    Repo: "${owner}/${repo}"
  `)) ?? '';

  const jsonText = aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const cleaned = jsonText.trim().replace(/```json|```/g, '');

  const issueData = JSON.parse(cleaned);

  const issue = await octokit.request('POST /repos/{owner}/{repo}/issues', {
    owner: ghUser.login,
    repo,
    title: issueData.title,
    body: issueData.body,
  });

  return issue;
};

export const POST = withApiHandler(createIssue);
