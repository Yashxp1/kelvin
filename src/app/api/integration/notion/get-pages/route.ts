import { NextResponse } from 'next/server';
import { getNotionClient } from '@/lib/api/notion';
import { auth } from '@/lib/auth/auth';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const notion = await getNotionClient(session.user.id);

    const searchRes = await notion.search({
      filter: { property: 'object', value: 'page' },
      page_size: 50,
    });

    const pages = searchRes.results
      .filter(
        (p): p is PageObjectResponse | PartialPageObjectResponse => 'id' in p
      )
      .map((page) => {
        const titleProp =
          'properties' in page
            ? Object.values(page.properties).find(
                (prop) => prop.type === 'title'
              )
            : null;

        const title =
          titleProp && titleProp.type === 'title'
            ? titleProp.title.map((t) => t.plain_text).join('')
            : 'Untitled';

        return {
          id: page.id,
          title,
          url: 'url' in page ? page.url : '',
        };
      });

    return NextResponse.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error('Notion page fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
