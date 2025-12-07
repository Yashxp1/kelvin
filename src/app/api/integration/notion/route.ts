import { NextResponse } from 'next/server';

export function GET() {
  const clientId = process.env.NOTION_CLIENT_ID!;
  const redirectUri = process.env.NOTION_REDIRECT_URI!;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    owner: 'user',
    redirect_uri: redirectUri,
  });

  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(notionAuthUrl);
}
