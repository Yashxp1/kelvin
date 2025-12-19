import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/api/prisma';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({
      connected: {
        github: false,
        notion: false,
      },
    });
  }

  const integrations = await prisma.integration.findMany({
    where: {
      userId: session.user.id,
      accessToken: { not: null },
    },
    select: {
      provider: true,
    },
  });

  const connected = {
    github: integrations.some((i) => i.provider === 'github'),
    notion: integrations.some((i) => i.provider === 'notion'),
  };

  return NextResponse.json({ connected });
}
