import { createContext } from "react";
import type { User, Credentials } from "../api/auth";

export interface AuthContextType {
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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
