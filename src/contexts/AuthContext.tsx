import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

// AuthContext の型定義
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isGuestUser: boolean;
}

// 初期値として空の AuthContext を作成
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  isGuestUser: false,
});
