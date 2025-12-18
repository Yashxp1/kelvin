import { withApiHandler } from '@/lib/api/apiHandler';
import prisma from '@/lib/api/prisma';
import { NextRequest } from 'next/server';

const getHistory = async (req: NextRequest, user: { id: string }) => {
  const history = await prisma.aI_Response.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return history;
};

export const GET = withApiHandler(getHistory);
