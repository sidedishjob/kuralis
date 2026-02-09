"use client";

import { useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * クライアント環境で使用する Supabase クライアントフック
 * createBrowserClient を useMemo でラップして再生成を防止
 */
export function useSupabaseClient() {
  return useMemo(() => {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }, []);
}
