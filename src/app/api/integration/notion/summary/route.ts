import { withApiHandler } from '@/lib/api/apiHandler';
import { NextRequest } from 'next/server';
import { getNotionClient } from '@/lib/api/notion';
import { Gemini } from '@/lib/api/gemini';

const summary = async (req: NextRequest, user: { id: string }) => {
  const { prompt, pageId } = await req.json();

  const notion = await getNotionClient(user.id);

  const page = await notion.pages.retrieve({
    page_id: pageId,
  });

  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });

  const content = blocks.results
    .map((block: any) => {
      const richText = block[block.type]?.rich_text;
      return richText?.map((t: any) => t.plain_text).join('') || '';
    })
    .join('\n');

  const pageUrl =
    'url' in page ? page.url : `https://notion.so/${pageId.replace(/-/g, '')}`;

  const res = {
    id: page.id,
    url: pageUrl,
    content,
  };

  const aiPrompt = `
  
                You are an AI assistant that summarizes Notion page content.

                Your task is to analyze the page content provided and return a clear, factual summary.

                Output format (strictly follow this structure):

                Summary:
                - concise short sentences describing the main topic of the page.

                Key Points:
                - 3–5 bullet points highlighting the most important ideas, decisions, or information.
                - If fewer than 3 points exist, include only what is relevant.
                - Do not invent or infer details.

                Action Items / Dates:
                - List any tasks, deadlines, or important dates mentioned.
                - If none are present, write: "None".

                Rules:
                - Use only the information present in the page content.
                - Be neutral and factual.
                - Do not add opinions, assumptions, or extra context.
                - Keep the language clear and concise.

                Always refer to the page identifier extracted from the user prompt : ${pageId}

                User Prompt:
                ${prompt}

                Notion Page Content:
               ${content}
  `;

  const summary = await Gemini(aiPrompt);

  return summary;
};

export const POST = withApiHandler(summary);
