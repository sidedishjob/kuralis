"use client";

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

// AuthContext の型定義
interface AuthContextType {
	user: User | null;
	loading: boolean;
	logout: () => Promise<void>;
}

// 初期値として空の AuthContext を作成
export const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	logout: async () => {},
});

// Provider に SSR で渡された初期ユーザーを受け取れるように修正
interface AuthProviderProps {
	children: React.ReactNode;
	initialUser?: User | null;
}

export const AuthProvider = ({ children, initialUser = null }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(initialUser);
	const [loading, setLoading] = useState(!initialUser);

	useEffect(() => {
		// 初期ユーザーがない場合はクライアントで取得する
		const getSession = async () => {
			const { data } = await supabase.auth.getSession();
			setUser(data.session?.user ?? null);
			setLoading(false);
		};

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		if (!initialUser) getSession();
		return () => listener.subscription.unsubscribe();
	}, [initialUser]);

	// ログアウト処理
	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
	);
};
