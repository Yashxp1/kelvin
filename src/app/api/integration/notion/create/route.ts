import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { Gemini } from '@/lib/api/gemini';
import { getNotionClient } from '@/lib/api/notion';
import prisma from '@/lib/api/prisma';
import { auth } from '@/lib/auth/auth';

type CreatePageParameters = Parameters<Client['pages']['create']>[0];
type Block = NonNullable<CreatePageParameters['children']>[number];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = (await req.json()) as { prompt: string };

    const notion = await getNotionClient(session.user.id);

    const MAX = 2000;

    function chunkText(text: string, size = MAX) {
      const chunks = [];
      for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
      }
      return chunks;
    }

    const aiRaw = await Gemini(`
          You are a professional Notion content writer.
          STRICT RULES:
          - Output PLAIN TEXT only.
          - Do NOT use markdown.
          - Do NOT use *, **, #, -, or bullet symbols.
          - Do NOT use emojis.
          - Use short paragraphs.
          - Use clear section titles written as normal sentences.
          - Separate sections using a blank line.
          - Keep total length under 1800 characters.

          Write clean, readable Notion-ready content based on the prompt below.

          Prompt:
          ${prompt}

`);

    const aiText = aiRaw?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text)
      .join('')
      .trim();

    if (!aiText) {
      return NextResponse.json(
        { error: 'AI returned empty content' },
        { status: 500 }
      );
    }

    const [rawTitle, ...rest] = aiText.split('\n');
    const title = rawTitle.trim().slice(0, 80);
    const content = rest.join('\n').trim();

    const blocks: Block[] = chunkText(content).map((chunk) => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: chunk },
          },
        ],
      },
    }));

    const page = await notion.pages.create({
      parent: {
        type: 'workspace',
        workspace: true,
      },
      properties: {
        title: {
          title: [{ text: { content: title } }],
        },
      },
      children: blocks,
    });

    const pageUrl = 'url' in page ? page.url : '';

    await prisma.aI_Response.create({
      data: {
        provider: 'notion',
        prompt,
        responseData: {
          id: page.id,
          url: pageUrl || '',
          title,
        },
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      page: {
        id: page.id,
        title,
        url: pageUrl,
      },
    });
  } catch (error) {
    console.error('Error creating Notion page:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
