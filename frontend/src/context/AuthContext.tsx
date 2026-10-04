import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { signupRequest, signinRequest } from '../api/auth';
import type { User, Credentials } from '../api/auth';
import { deriveKey } from '../crypto/crypto';

interface AuthContextType {
  user: User | null;
  token: string | null;
  derivedKey: CryptoKey | null;
  isAuthenticated: boolean;
  isVaultLocked: boolean;
  signup: (data: Credentials) => Promise<void>;
  signin: (data: Credentials) => Promise<void>;
  signout: () => void;
  unlock: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'velum_token';
const USER_KEY = 'velum_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [derivedKey, setDerivedKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthSuccess = useCallback(async (authToken: string, authUser: User, password: string) => {
    const key = await deriveKey(password, authUser.salt);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
    setDerivedKey(key);
  }, []);

  const signup = async (data: Credentials) => {
    const result = await signupRequest(data);
    await handleAuthSuccess(result.token, result.user, data.password);
  };

  const signin = async (data: Credentials) => {
    const result = await signinRequest(data);
    await handleAuthSuccess(result.token, result.user, data.password);
  };

  const unlock = async (password: string) => {
    if (!user) throw new Error('No hay usuario');
    const key = await deriveKey(password, user.salt);
    setDerivedKey(key);
  };

  const signout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setDerivedKey(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        derivedKey,
        isAuthenticated: !!token,
        isVaultLocked: !!token && !derivedKey,
        signup,
        signin,
        signout,
        unlock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};