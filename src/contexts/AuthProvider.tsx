"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { AuthContext, AuthContextType } from "./AuthContext";

// Provider に SSR で渡された初期ユーザーを受け取れるように修正
interface AuthProviderProps {
	children: React.ReactNode;
	initialUser?: User | null;
}

export const AuthProvider = ({ children, initialUser = null }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(initialUser);
	const [loading, setLoading] = useState(!initialUser);

	useEffect(() => {
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

	const contextValue: AuthContextType = { user, loading, logout };

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
