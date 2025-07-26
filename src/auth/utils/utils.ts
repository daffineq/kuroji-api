import crypto from 'crypto';

export function generateApiKey(): string {
  return crypto.randomBytes(16).toString('hex');
}
