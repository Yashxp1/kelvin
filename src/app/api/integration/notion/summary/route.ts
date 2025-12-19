import { NextRequest, NextResponse } from 'next/server';
import { getNotionClient } from '@/lib/api/notion';
import { Gemini } from '@/lib/api/gemini';
import prisma from '@/lib/api/prisma';
import { auth } from '@/lib/auth/auth';
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, pageId } = (await req.json()) as {
      prompt: string;
      pageId: string;
    };

    const notion = await getNotionClient(session.user.id);

    const page = await notion.pages.retrieve({
      page_id: pageId,
    });

    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    const content = blocks.results
      .map((b) => {
        const block = b as BlockObjectResponse | PartialBlockObjectResponse;
        if (!('type' in block)) return '';

        const blockContent = (
          block as unknown as Record<
            string,
            { rich_text?: RichTextItemResponse[] }
          >
        )[block.type];
        const richText = blockContent?.rich_text;

        return richText?.map((t) => t.plain_text).join('') || '';
      })
      .join('\n');

    const pageUrl =
      'url' in page
        ? page.url
        : `https://notion.so/${pageId.replace(/-/g, '')}`;

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

    const aiResponse = await Gemini(aiPrompt);

    await prisma.aI_Response.create({
      data: {
        provider: 'notion',
        prompt,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseData: aiResponse as any,
        url: pageUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, data: aiResponse });
  } catch (error) {
    console.error('Error in Notion summary:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
