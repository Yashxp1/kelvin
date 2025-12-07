import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ connected: {} });
  }

  // Get ALL integrations for this user
  const integrations = await prisma.integration.findMany({
    where: {
      userId: session.user.id,
      accessToken: { not: null },
    },
    select: {
      provider: true,
    },
  });

  // Convert to object: { github: true, notion: false, linear: false }
  const connected = {
    github: integrations.some((i) => i.provider === 'github'),
    notion: integrations.some((i) => i.provider === 'notion'),
    linear: integrations.some((i) => i.provider === 'linear'),
  };

  return NextResponse.json({ connected });
}
