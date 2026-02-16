import type { UserRole } from '../types/domain';

interface JwtPayload {
  authorities?: string[];
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '==='.slice((normalized.length + 3) % 4);
  return atob(padded);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function resolveRole(authorities: string[]): UserRole {
  if (authorities.includes('ROLE_ADMIN')) return 'ADMIN';
  if (authorities.includes('ROLE_STAFF')) return 'STAFF';
  if (authorities.includes('ROLE_DOCTOR')) return 'DOCTOR';
  if (authorities.includes('ROLE_USER')) return 'USER';
  return 'UNKNOWN';
}
