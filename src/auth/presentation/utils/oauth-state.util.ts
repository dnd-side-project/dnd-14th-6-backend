import { OAuthStatePayload } from '../types/auth.type';

export function encodeOAuthState(state: OAuthStatePayload): string {
  return Buffer.from(JSON.stringify(state), 'utf-8').toString('base64url');
}

export function decodeOAuthState(stateEncoded?: string): OAuthStatePayload | null {
  if (!stateEncoded) {
    return null;
  }

  const normalizedState = safeDecodeURIComponent(stateEncoded.trim());
  try {
    const stateStr = Buffer.from(normalizedState, 'base64url').toString('utf-8');

    return JSON.parse(stateStr) as OAuthStatePayload;
  } catch {
    return null;
  }
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
