import { Client } from '@notionhq/client';
import prisma from './prisma';

export async function getNotionClient(userId: string) {
  const integration = await prisma.integration.findFirst({
    where: { userId, provider: 'notion' },
  });

  if (!integration) throw new Error('Notion not connected');

  return new Client({ auth: integration.accessToken as string });
}
