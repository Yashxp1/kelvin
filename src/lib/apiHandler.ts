import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth/auth';

type ApiHandlerType<T, P = Record<string, string>> = (
  req: NextRequest,
  user: { id: string },
  ctx: { params: P }
) => Promise<T | NextResponse>;

export function withApiHandler<T, P = Record<string, string>>(
  ApiHandler: ApiHandlerType<T, P>
) {
  return async (req: NextRequest, ctx: { params: P }) => {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const response = await ApiHandler(req, { id: session.user.id }, ctx);

      return NextResponse.json(
        { success: true, data: response },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
