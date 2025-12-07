import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

const clientId = process.env.NOTION_CLIENT_ID!;
const clientSecret = process.env.NOTION_CLIENT_SECRET!;
const redirectUri = process.env.NOTION_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Notion OAuth error:', error);
    return NextResponse.redirect(
      new URL('/integrations?error=notion', req.url)
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    );
  }

  try {
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64'
    );

    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encoded}`,
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error || !data.access_token) {
      console.error('Notion token exchange error:', data);
      return NextResponse.json(
        { error: data.error || 'OAuth token exchange failed' },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    await prisma.integration.create({
      data: {
        userId: userId,
        provider: 'notion',
        accessToken: data.access_token,
        refreshToken: null,
        rawData: data,
      },
    });

    return NextResponse.redirect(
      new URL('/integrations?connected=notion', req.url)
    );
  } catch (error) {
    console.error('Notion integration error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
