import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { authApi } from '../api/authApi';
import type { LoginPayload, RegisterPayload } from '../types/api';
import type { AuthSession, UserRole } from '../types/domain';
import { decodeJwtPayload, resolveRole } from '../utils/jwt';
import { clearSession, persistSession, readSession } from './storage';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (payload: LoginPayload) => Promise<UserRole>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => readSession());

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    const jwtPayload = decodeJwtPayload(response.accessToken);
    const authorities = jwtPayload?.authorities ?? [];
    const nextRole = resolveRole(authorities);
    let profilePicUrl: string | undefined;

    try {
      const me = await authApi.getCurrentUser(response.accessToken);
      profilePicUrl = me.profilePicUrl ?? undefined;
    } catch {
      profilePicUrl = undefined;
    }

    const nextSession: AuthSession = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      email: response.email,
      clientName: response.clientName,
      role: nextRole,
      authorities,
      profilePicUrl,
    };

    setSession(nextSession);
    persistSession(nextSession);

    return nextRole;
  }, []);

  const register = useCallback((payload: RegisterPayload) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    clearSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      role: session?.role ?? 'UNKNOWN',
      login,
      register,
      logout,
    }),
    [session, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
