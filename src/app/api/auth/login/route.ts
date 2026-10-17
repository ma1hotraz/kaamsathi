import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createSessionToken, isJuryConfigured, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    if (!isJuryConfigured()) {
      return NextResponse.json(
        {
          error: 'Jury credentials are not configured on the server. Please set JURY_USERNAME and JURY_PASSWORD in environment variables.',
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const isValid = validateCredentials(username, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const token = createSessionToken(username);
    const response = NextResponse.json({
      success: true,
      message: 'Jury authentication successful.',
      user: username,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication processing error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
