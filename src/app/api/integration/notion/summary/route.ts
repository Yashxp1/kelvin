import { withApiHandler } from '@/lib/api/apiHandler';
import { NextRequest } from 'next/server';
import { getNotionClient } from '@/lib/api/notion';
import { Gemini } from '@/lib/api/gemini';

const summary = async (req: NextRequest, user: { id: string }) => {
  const notion = await getNotionClient(user.id);

  const pageData = await notion.search({
    filter: { property: 'object', value: 'page' },
  });

  const res = await Promise.all(
    pageData.results.map(async (page: any) => {
      const blocks = await notion.blocks.children.list({
        block_id: page.id,
      });

      const content = blocks.results
        .map((block: any) => {
          const richText = block[block.type]?.rich_text;
          return richText?.map((t: any) => t.plain_text).join('') || '';
        })
        .join('\n');

      return {
        id: page.id,
        url: page.url,
        content: content,
      };
    })
  );

  const prompt = `
  
        You are a content summarizer. Your task is to create concise, informative summaries of Notion page content.

        Given the following Notion page content, provide:
        1. A brief 1-2 sentence summary of the main topic
        2. 3-5 key points or takeaways (if applicable)
        3. Any action items or important dates mentioned (if applicable)

        Keep the summary clear and factual. Don't add information that isn't in the content.

        Page Content:
        ${res}
        Summary:

  `;

  const summary = await Gemini(prompt);

  return summary;
};

export const GET = withApiHandler(summary);
