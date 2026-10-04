import { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { signupRequest, signinRequest } from "../api/auth";
import type { User, Credentials } from "../api/auth";
import { deriveKey, decryptData } from "../crypto/crypto";
import { getVaultItems } from "../api/vault";
import { AuthContext } from "./authContextDefinition";

const TOKEN_KEY = "velum_token";
const USER_KEY = "velum_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [derivedKey, setDerivedKey] = useState<CryptoKey | null>(null);

  const handleAuthSuccess = useCallback(
    async (authToken: string, authUser: User, password: string) => {
      const key = await deriveKey(password, authUser.salt);
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      setToken(authToken);
      setUser(authUser);
      setDerivedKey(key);
    },
    [],
  );

  const signup = async (data: Credentials) => {
    const result = await signupRequest(data);
    await handleAuthSuccess(result.token, result.user, data.password);
  };

  const signin = async (data: Credentials) => {
    const result = await signinRequest(data);
    await handleAuthSuccess(result.token, result.user, data.password);
  };

  const unlock = async (password: string) => {
    if (!user || !token) throw new Error("No hay usuario");

    const key = await deriveKey(password, user.salt);

    try {
      const items = await getVaultItems(token);
      if (items.length > 0) {
        await decryptData(key, items[0].encryptedData, items[0].iv);
      }
      setDerivedKey(key);
    } catch {
      throw new Error("Contraseña maestra incorrecta");
    }
  };

  const signout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setDerivedKey(null);
  };

  useEffect(() => {
    if (!derivedKey) return;

    const INACTIVITY_MS = 5 * 60 * 1000;
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDerivedKey(null);
      }, INACTIVITY_MS);
    };

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [derivedKey]);

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
