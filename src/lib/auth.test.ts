import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateCredentials, createSessionToken, verifySessionToken } from './auth';

describe('Jury Authentication Suite', () => {
  test('validates correct credentials and rejects incorrect ones', () => {
    // Temporarily set env vars for testing
    process.env.JURY_USERNAME = 'jury_judge';
    process.env.JURY_PASSWORD = 'super_secret_pw_123';

    assert.equal(validateCredentials('jury_judge', 'super_secret_pw_123'), true);
    assert.equal(validateCredentials('jury_judge', 'wrong_password'), false);
    assert.equal(validateCredentials('wrong_user', 'super_secret_pw_123'), false);
    assert.equal(validateCredentials('', ''), false);
  });

  test('creates and verifies cryptographically signed session tokens', () => {
    const token = createSessionToken('jury_judge');
    const result = verifySessionToken(token);
    assert.equal(result.valid, true);
    assert.equal(result.username, 'jury_judge');

    // Tampered token must fail
    const tampered = token.replace('jury_judge', 'hacker');
    assert.equal(verifySessionToken(tampered).valid, false);

    // Empty or malformed token must fail
    assert.equal(verifySessionToken('').valid, false);
    assert.equal(verifySessionToken('invalid:format').valid, false);
  });
});
