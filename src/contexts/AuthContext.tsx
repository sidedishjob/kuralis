"use client";

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
	);
};
