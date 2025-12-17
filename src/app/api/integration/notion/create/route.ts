import { withApiHandler } from '@/app/api/apiHandler';
import { Gemini } from '@/lib/api/gemini';
import { getNotionClient } from '@/lib/api/notion';
import prisma from '@/lib/api/prisma';
import { NextRequest } from 'next/server';

const createPage = async (req: NextRequest, user: { id: string }) => {
  const { prompt } = await req.json();

  const notion = await getNotionClient(user.id);

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
    ?.map((p: any) => p.text)
    .join('')
    .trim();

  if (!aiText) {
    throw new Error('AI returned empty content');
  }

  const blocks = chunkText(aiText).map((chunk) => ({
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
        title: [{ text: { content: aiText.slice(0, 2000) } }],
      },
    },
    children: blocks as any,
  });

  const pageRes = await prisma.ai_response.create({
    data: {
      provider: 'notion',
      prompt,
      responseData: page as any,
      userId: user.id,
    },
  });

  return page;
};

export const POST = withApiHandler(createPage);
