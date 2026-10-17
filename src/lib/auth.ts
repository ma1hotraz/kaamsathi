import crypto from 'node:crypto';

const SESSION_COOKIE_NAME = 'kaamsaathi_jury_session';
const SECRET = process.env.SESSION_SECRET || 'kaamsaathi-jury-secret-salt-2026';

export interface AuthResult {
  authenticated: boolean;
  user?: string;
  error?: string;
  isConfigured: boolean;
}

/**
 * Checks whether jury credentials are configured on the server.
 */
export function isJuryConfigured(): boolean {
  return Boolean(process.env.JURY_USERNAME && process.env.JURY_PASSWORD);
}

/**
 * Validates provided credentials against server environment variables.
 */
export function validateCredentials(username?: string, password?: string): boolean {
  const envUser = process.env.JURY_USERNAME;
  const envPass = process.env.JURY_PASSWORD;

  if (!envUser || !envPass) {
    return false;
  }

  if (!username || !password) {
    return false;
  }

  // Use timingSafeEqual to prevent timing attacks
  const userBuf = Buffer.from(username);
  const envUserBuf = Buffer.from(envUser);
  const passBuf = Buffer.from(password);
  const envPassBuf = Buffer.from(envPass);

  const userMatch = userBuf.length === envUserBuf.length && crypto.timingSafeEqual(userBuf, envUserBuf);
  const passMatch = passBuf.length === envPassBuf.length && crypto.timingSafeEqual(passBuf, envPassBuf);

  return userMatch && passMatch;
}

/**
 * Creates an HMAC signed session token.
 */
export function createSessionToken(username: string): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${username}:${timestamp}`)
    .digest('hex');
  return `${username}:${timestamp}:${signature}`;
}

/**
 * Verifies the HMAC signed session token.
 */
export function verifySessionToken(token?: string): { valid: boolean; username?: string } {
  if (!token) return { valid: false };

  const parts = token.split(':');
  if (parts.length !== 3) return { valid: false };

  const [username, timestamp, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(`${username}:${timestamp}`)
    .digest('hex');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false };
  }

  // Token valid for 24 hours
  const tokenAge = Date.now() - Number(timestamp);
  if (isNaN(tokenAge) || tokenAge < 0 || tokenAge > 24 * 60 * 60 * 1000) {
    return { valid: false };
  }

  return { valid: true, username };
}

export { SESSION_COOKIE_NAME };
