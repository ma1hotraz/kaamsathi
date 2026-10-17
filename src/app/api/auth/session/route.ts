import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, isJuryConfigured, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const configured = isJuryConfigured();
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const verification = verifySessionToken(token);

  return NextResponse.json({
    authenticated: verification.valid,
    isConfigured: configured,
    user: verification.username || null,
  });
}
