"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { AuthContext, AuthContextType } from "./AuthContext";

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getSession = async () => {
			const { data } = await supabase.auth.getSession();
			setUser(data.session?.user ?? null);
			setLoading(false);
		};

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		getSession();
		return () => listener.subscription.unsubscribe();
	}, []);

	// ログアウト処理
	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};

	// ゲストユーザー判定
	const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL;
	const isGuestUser = user?.email === guestEmail;

	const contextValue: AuthContextType = { user, loading, logout, isGuestUser };

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
