import { getNotionClient } from '@/lib/api/notion';
import { withApiHandler } from '@/lib/api/apiHandler';
import { NextRequest } from 'next/server';

const getPages = async (req: NextRequest, user: { id: string }) => {
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
        title: page,
        url: page.url,
        content: content,
      };
    })
  );

  return res;
};

export const GET = withApiHandler(getPages);
